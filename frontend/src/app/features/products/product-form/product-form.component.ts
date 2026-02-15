import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { NotificationService } from '../../../core/services/notification.service';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { AuthService } from '../../../core/services/auth.service';
import { ShopService } from '../../../core/services/shop.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  isEdit = false;
  loading = false;
  shopId: string | null = null;

  categories: any[] = [];

  productForm: any = this.getEmptyProduct();

  selectedFiles: File[] = [];
  previewUrls: string[] = [];

  promotionOptions = [
    { label: 'Non', value: false },
    { label: 'Oui', value: true }
  ];

  activeOptions = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
  ];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private shopService: ShopService,
    private messageService: MessageService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadShop();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loadProduct(id);
    }
  }

  loadCategories() {
    this.categoryService.list('produit').subscribe({
      next: (categories: any[]) => {
        this.categories = (categories || []).map((category) => ({
          ...category,
          displayName: category.name
        }));
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificationService.error('Impossible de charger les catégories.', 'Erreur');
      }
    });
  }

  loadShop() {
    const user = this.authService.getUser();
    if (!user?.id) return;

    this.shopService.getByUser(user.id).subscribe({
      next: (shop) => {
        this.shopId = shop._id;
      },
      error: () => {
        this.notificationService.warn('Aucune boutique active trouvée.', 'Info');
      }
    });
  }

  loadProduct(id: string) {
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.productForm = {
          ...this.getEmptyProduct(),
          _id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          discount: product.discount,
          category: product.category?._id || product.category,
          stockQuantity: product.stock?.quantity,
          lowStockAlert: product.stock?.lowStockAlert,
          isPromotion: product.isPromotion,
          isActive: product.isActive
        };
        this.previewUrls = product.images || [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificationService.error('Produit introuvable.', 'Erreur');
      }
    });
  }

  onFilesSelected(event: any) {
    const files = Array.from(event.target.files || []) as File[];
    this.selectedFiles = files;
    this.previewUrls = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.previewUrls.push(reader.result.toString());
          this.cdr.detectChanges();
        }
      };
      reader.readAsDataURL(file);
    });
  }

  saveProduct() {
    if (!this.productForm.name || this.productForm.price === '' || this.productForm.price === null) {
      this.notificationService.warn('Nom et prix sont obligatoires.', 'Champs requis');
      return;
    }

    if (!this.shopId && !this.isEdit) {
      this.notificationService.warn('Boutique introuvable.', 'Boutique');
      return;
    }

    this.loading = true;

    const formData = new FormData();
    formData.append('shopId', this.shopId || this.productForm.shopId || '');
    formData.append('name', this.productForm.name);
    formData.append('description', this.productForm.description || '');
    formData.append('price', this.productForm.price);
    formData.append('originalPrice', this.productForm.originalPrice || '');
    formData.append('discount', this.productForm.discount || 0);
    formData.append('category', this.productForm.category || '');
    formData.append('stockQuantity', this.productForm.stockQuantity || 0);
    formData.append('lowStockAlert', this.productForm.lowStockAlert || 5);
    formData.append('isPromotion', this.productForm.isPromotion ? 'true' : 'false');
    formData.append('isActive', this.productForm.isActive ? 'true' : 'false');

    this.selectedFiles.forEach((file) => formData.append('images', file));

    const request = this.isEdit
      ? this.productService.update(this.productForm._id, formData)
      : this.productService.create(formData);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.success(this.isEdit ? 'Produit mis à jour.' : 'Produit créé.', 'Succès');
        this.router.navigate(['/my-products']);
      },
      error: (error) => {
        this.loading = false;
        this.notificationService.error(error.error?.message || 'Erreur lors de la sauvegarde', 'Erreur');
      }
    });
  }

  cancel() {
    this.router.navigate(['/my-products']);
  }

  private getEmptyProduct() {
    return {
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      discount: 0,
      category: '',
      stockQuantity: 0,
      lowStockAlert: 5,
      isPromotion: false,
      isActive: true
    };
  }
}
