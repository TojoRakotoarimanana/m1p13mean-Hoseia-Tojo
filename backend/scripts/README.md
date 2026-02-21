# Script de Génération de Données de Test

Ce script génère automatiquement un jeu complet de données de test pour l'application MEAN Stack.

## 📊 Données Générées

### Utilisateurs (16 total)
- **1 Admin** : Accès complet à l'administration
- **10 Comptes Boutique** : Pour gérer les boutiques
- **5 Clients** : Pour tester l'interface client

### Catégories (16 total)
- **6 Catégories Boutique** :
  - Mode & Vêtements
  - Électronique
  - Alimentation
  - Beauté & Santé
  - Sport & Loisirs
  - Librairie & Papeterie

- **10 Catégories Produit** :
  - Vêtements Homme/Femme
  - Smartphones
  - Ordinateurs
  - Fast Food
  - Pâtisserie
  - Cosmétiques
  - Équipement Sport
  - Livres
  - Fournitures

### Boutiques (10 total)
Chaque boutique contient :
- Nom et description
- Catégorie associée
- Localisation (étage, zone, numéro)
- Informations de contact (téléphone, email)
- Horaires d'ouverture (7 jours)
- Statut actif

**Liste des boutiques** :
1. Fashion Store - Mode & Vêtements
2. Tech World - Électronique
3. Burger King Express - Alimentation
4. Beauty Palace - Beauté & Santé
5. Sport Plus - Sport & Loisirs
6. Book Corner - Librairie & Papeterie
7. Style & Chic - Mode & Vêtements
8. Gaming Zone - Électronique
9. Sweet Bakery - Alimentation
10. Fitness Avenue - Sport & Loisirs

### Produits (50 total)
- 5 produits par boutique
- Prix variés (de 1,50€ à 1499€)
- Stock réaliste (de 8 à 200 unités)
- **40%** des produits en promotion (discount 10-30%)
- Descriptions détaillées
- Catégories assignées

## 🚀 Utilisation

### Méthode 1 : Via npm (Recommandé)

```bash
cd backend
npm run seed
```

### Méthode 2 : Directement avec Node.js

```bash
cd backend
node scripts/seed-data.js
```

## ⚠️ ATTENTION

**Ce script va SUPPRIMER toutes les données existantes** dans les collections suivantes :
- Users
- Categories
- Shops
- Products

Assurez-vous de sauvegarder vos données importantes avant d'exécuter ce script !

## 🔐 Comptes de Test

### Admin
- **Email** : `admin@mall.com`
- **Mot de passe** : `Admin123!`

### Boutiques
- **Emails** : `boutique1@mall.com` à `boutique10@mall.com`
- **Mot de passe** : `Boutique123!`

### Clients
- **Email** : `client1@test.com` à `client5@test.com`
- **Mot de passe** : `Client123!`

**Exemple de connexion** :
```
Email: admin@mall.com
Password: Admin123!
```

## 📋 Prérequis

- MongoDB en cours d'exécution sur `localhost:27017`
- Base de données : `m1p13mean`
- Toutes les dépendances npm installées

## 🔧 Configuration

Pour modifier la connexion MongoDB, éditez la constante `DB_URI` dans le fichier `scripts/seed-data.js` :

```javascript
const DB_URI = 'mongodb://localhost:27017/m1p13mean';
```

## 📝 Résultat Attendu

Après l'exécution réussie, vous verrez :

```
🔌 Connexion à MongoDB...
✅ Connecté à MongoDB

🗑️  Suppression des données existantes...
✅ Données supprimées

👥 Création des utilisateurs...
✅ 16 utilisateurs créés

📁 Création des catégories...
✅ 16 catégories créées

🏪 Création des boutiques...
✅ 10 boutiques créées

📦 Création des produits...
✅ 50 produits créés

📊 RÉSUMÉ DE LA GÉNÉRATION:
═══════════════════════════════════════
👤 Utilisateurs: 16
   - Admin: 1
   - Boutiques: 10
   - Clients: 5

📁 Catégories: 16
   - Boutiques: 6
   - Produits: 10

🏪 Boutiques: 10 (toutes actives)
📦 Produits: 50 (répartis dans les boutiques)
═══════════════════════════════════════

✅ Génération terminée avec succès!
```

## 🎯 Cas d'Usage

Ce script est parfait pour :
- ✅ Développement et tests locaux
- ✅ Démonstrations client
- ✅ Tests de performance
- ✅ Réinitialisation rapide de l'environnement
- ✅ Onboarding de nouveaux développeurs

## 🛠️ Personnalisation

Pour ajouter vos propres données, modifiez les tableaux suivants dans `seed-data.js` :
- `shopCategories` - Catégories de boutiques
- `productCategories` - Catégories de produits
- `users` - Utilisateurs
- `shops` - Boutiques
- `products` - Produits par boutique

## 🔄 Réexécution

Vous pouvez exécuter ce script autant de fois que nécessaire. À chaque exécution, il :
1. Supprime les données existantes
2. Génère de nouvelles données fraîches
3. Maintient la cohérence des relations

## 📞 Support

En cas de problème :
- Vérifiez que MongoDB est bien démarré
- Vérifiez la connexion réseau
- Consultez les logs d'erreur affichés dans le terminal
