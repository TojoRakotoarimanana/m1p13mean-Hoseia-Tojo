import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Product } from './catalog.service';

export interface CartItem {
    itemId?: string; // Mongo _id of the cart line (backend expects this for update/remove)
    product: Product;
    quantity: number;
    shop: any; // the shop object from product.shopId
}

export interface CartState {
    items: CartItem[];
    totalAmount: number;
    totalItems: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private apiUrl = 'http://localhost:3000/api/cart';
    private cartState = new BehaviorSubject<CartState>({ items: [], totalAmount: 0, totalItems: 0 });

    cart$ = this.cartState.asObservable();

    constructor(private http: HttpClient) {
        this.loadFromLocal();
    }

    private loadFromLocal() {
        const saved = localStorage.getItem('user_cart');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                this.cartState.next(state);
            } catch (e) {
                console.error('Failed to parse cart from local storage', e);
            }
        }
    }

    private saveToLocal(state: CartState) {
        localStorage.setItem('user_cart', JSON.stringify(state));
        this.cartState.next(state);
    }

    // Obtenir l'état du panier
    getCart(): CartState {
        return this.cartState.value;
    }

    // Ajouter un produit au panier
    addToCart(product: Product, quantity: number = 1): Observable<any> {
        return this.http.post(`${this.apiUrl}/add`, { productId: product._id, quantity }).pipe(
            switchMap((res: any) =>
                this.refreshFromServer().pipe(
                    switchMap(() => of(res))
                )
            )
        );
    }

    // Mettre à jour la quantité
    updateQuantity(productId: string, quantity: number): Observable<any> {
        return this.ensureItemId(productId).pipe(
            switchMap(itemId => this.http.put(`${this.apiUrl}/update/${itemId}`, { quantity })),
            switchMap((res: any) =>
                this.refreshFromServer().pipe(
                    switchMap(() => of(res))
                )
            )
        );
    }

    // Supprimer un article
    removeItem(productId: string): Observable<any> {
        return this.ensureItemId(productId).pipe(
            switchMap(itemId => this.http.delete(`${this.apiUrl}/remove/${itemId}`)),
            switchMap((res: any) =>
                this.refreshFromServer().pipe(
                    switchMap(() => of(res))
                )
            )
        );
    }

    // Vider le panier complet
    clearCart(): Observable<any> {
        return this.http.delete(`${this.apiUrl}/clear`).pipe(
            switchMap((res: any) =>
                this.refreshFromServer().pipe(
                    switchMap(() => of(res))
                )
            )
        );
    }

    // Rafraîchir le panier depuis le serveur (prix à jour, promotions incluses)
    refresh(): Observable<any> {
        return this.refreshFromServer();
    }

    private refreshFromServer(): Observable<any> {
        return this.http.get(`${this.apiUrl}/`).pipe(
            tap((cart: any) => {
                if (cart) {
                    this.applyServerCart(cart);
                }
            })
        );
    }

    private ensureItemId(productId: string): Observable<string> {
        const state = this.getCart();
        const existing = state.items.find(i => i.product._id === productId);
        if (existing?.itemId) {
            return of(existing.itemId);
        }

        return this.http.get(`${this.apiUrl}/`).pipe(
            tap((cart: any) => {
                if (cart) {
                    this.applyServerCart(cart);
                }
            }),
            switchMap(() => {
                const refreshed = this.getCart().items.find(i => i.product._id === productId);
                if (refreshed?.itemId) {
                    return of(refreshed.itemId);
                }
                return throwError(() => new Error('Impossible de retrouver itemId pour cet article du panier.'));
            })
        );
    }

    // Retourne le prix de vente effectif en tenant compte de la promotion
    private effectivePrice(product: any): number {
        if (product?.isPromotion && product.discount > 0 && product.originalPrice > 0) {
            return Number((product.originalPrice * (1 - product.discount / 100)).toFixed(2));
        }
        return product?.price || 0;
    }

    private applyServerCart(cart: any) {
        const items: CartItem[] = (cart?.items || []).map((i: any) => {
            const raw = i.productId;
            // Normaliser le prix : si en promotion, recalculer depuis originalPrice × (1 - discount%)
            const product = {
                ...raw,
                price: this.effectivePrice(raw)
            };
            const shop = i.shopId || raw?.shopId;
            return {
                itemId: i._id,
                product,
                quantity: i.quantity,
                shop
            };
        });

        const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const totalItems = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
        this.saveToLocal({ items, totalAmount, totalItems });
    }

    // Vider le panier locallement (après une commande)
    clearCartLocal() {
        this.updateStateAndSave([]);
    }

    // Helper pour recalculer le total
    private updateStateAndSave(items: CartItem[]) {
        const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

        this.saveToLocal({ items, totalAmount, totalItems });
    }

    private getDiscountedPrice(product: Product): number {
        return this.effectivePrice(product);
    }

    // Obtenir le panier groupé par boutique
    getCartGroupedByShop(): { shop: any, items: CartItem[], total: number }[] {
        const state = this.getCart();
        const grouped = new Map<string, { shop: any, items: CartItem[], total: number }>();

        state.items.forEach(item => {
            const shopId = (
                (item.shop && (item.shop._id || item.shop.id)) ||
                (item.product as any)?.shopId?._id ||
                (item.product as any)?.shopId?.id ||
                (item.product as any)?.shopId
            ) as string;

            if (!shopId) {
                return;
            }
            if (!grouped.has(shopId)) {
                grouped.set(shopId, { shop: item.shop || (item.product as any).shopId, items: [], total: 0 });
            }
            const group = grouped.get(shopId)!;
            group.items.push(item);
            group.total += this.getDiscountedPrice(item.product) * item.quantity;
        });

        return Array.from(grouped.values());
    }
}
