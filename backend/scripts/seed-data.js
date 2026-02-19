const mongoose = require('mongoose');
const { User, Category, Shop, Product } = require('../models');

const DB_URI = 'mongodb://localhost:27017/mean';

const shopCategories = [
  { name: 'Mode & Vêtements', description: 'Magasins de vêtements et accessoires', type: 'boutique', icon: 'pi-shopping-bag' },
  { name: 'Électronique', description: 'Appareils électroniques et high-tech', type: 'boutique', icon: 'pi-desktop' },
  { name: 'Alimentation', description: 'Restaurants et épiceries', type: 'boutique', icon: 'pi-shopping-cart' },
  { name: 'Beauté & Santé', description: 'Cosmétiques et produits de santé', type: 'boutique', icon: 'pi-heart' },
  { name: 'Sport & Loisirs', description: 'Équipements sportifs et loisirs', type: 'boutique', icon: 'pi-star' },
  { name: 'Librairie & Papeterie', description: 'Livres et fournitures', type: 'boutique', icon: 'pi-book' }
];

const productCategories = [
  { name: 'Vêtements Homme', description: 'Mode masculine', type: 'produit', icon: 'pi-user' },
  { name: 'Vêtements Femme', description: 'Mode féminine', type: 'produit', icon: 'pi-user' },
  { name: 'Smartphones', description: 'Téléphones mobiles', type: 'produit', icon: 'pi-mobile' },
  { name: 'Ordinateurs', description: 'PC et accessoires', type: 'produit', icon: 'pi-desktop' },
  { name: 'Fast Food', description: 'Restauration rapide', type: 'produit', icon: 'pi-shopping-cart' },
  { name: 'Pâtisserie', description: 'Gâteaux et desserts', type: 'produit', icon: 'pi-heart' },
  { name: 'Cosmétiques', description: 'Produits de beauté', type: 'produit', icon: 'pi-star' },
  { name: 'Équipement Sport', description: 'Matériel sportif', type: 'produit', icon: 'pi-star' },
  { name: 'Livres', description: 'Romans et littérature', type: 'produit', icon: 'pi-book' },
  { name: 'Fournitures', description: 'Papeterie et bureautique', type: 'produit', icon: 'pi-pencil' }
];

const users = [
  { email: 'admin@mall.com', password: 'Admin123!', role: 'admin', firstName: 'Admin', lastName: 'Principal' },
  { email: 'boutique1@mall.com', password: 'Boutique123!', role: 'boutique', phone: '0612345678' },
  { email: 'boutique2@mall.com', password: 'Boutique123!', role: 'boutique', phone: '0612345679' },
  { email: 'boutique3@mall.com', password: 'Boutique123!', role: 'boutique', phone: '0612345680' },
  { email: 'boutique4@mall.com', password: 'Boutique123!', role: 'boutique', phone: '0612345681' },
  { email: 'boutique5@mall.com', password: 'Boutique123!', role: 'boutique', phone: '0612345682' },
  { email: 'boutique6@mall.com', password: 'Boutique123!', role: 'boutique', phone: '0612345683' },
  { email: 'boutique7@mall.com', password: 'Boutique123!', role: 'boutique', phone: '0612345684' },
  { email: 'boutique8@mall.com', password: 'Boutique123!', role: 'boutique', phone: '0612345685' },
  { email: 'boutique9@mall.com', password: 'Boutique123!', role: 'boutique', phone: '0612345686' },
  { email: 'boutique10@mall.com', password: 'Boutique123!', role: 'boutique', phone: '0612345687' },
  { email: 'client1@test.com', password: 'Client123!', role: 'client', firstName: 'Marie', lastName: 'Dupont', phone: '0623456789' },
  { email: 'client2@test.com', password: 'Client123!', role: 'client', firstName: 'Pierre', lastName: 'Martin', phone: '0623456790' },
  { email: 'client3@test.com', password: 'Client123!', role: 'client', firstName: 'Sophie', lastName: 'Bernard', phone: '0623456791' },
  { email: 'client4@test.com', password: 'Client123!', role: 'client', firstName: 'Lucas', lastName: 'Dubois', phone: '0623456792' },
  { email: 'client5@test.com', password: 'Client123!', role: 'client', firstName: 'Emma', lastName: 'Leroy', phone: '0623456793' }
];

const shops = [
  {
    name: 'Fashion Store',
    description: 'Boutique de mode tendance pour homme et femme. Découvrez nos dernières collections.',
    categoryName: 'Mode & Vêtements',
    location: { floor: '1', zone: 'A', shopNumber: '101' },
    contact: { phone: '0145678901', email: 'contact@fashionstore.com' },
    hours: {
      monday: { open: '10:00', close: '20:00' },
      tuesday: { open: '10:00', close: '20:00' },
      wednesday: { open: '10:00', close: '20:00' },
      thursday: { open: '10:00', close: '20:00' },
      friday: { open: '10:00', close: '21:00' },
      saturday: { open: '09:00', close: '21:00' },
      sunday: { open: '10:00', close: '19:00' }
    }
  },
  {
    name: 'Tech World',
    description: 'Le paradis de la high-tech. Smartphones, tablettes, ordinateurs et accessoires.',
    categoryName: 'Électronique',
    location: { floor: '2', zone: 'B', shopNumber: '205' },
    contact: { phone: '0145678902', email: 'info@techworld.com' },
    hours: {
      monday: { open: '10:00', close: '20:00' },
      tuesday: { open: '10:00', close: '20:00' },
      wednesday: { open: '10:00', close: '20:00' },
      thursday: { open: '10:00', close: '20:00' },
      friday: { open: '10:00', close: '21:00' },
      saturday: { open: '09:00', close: '21:00' },
      sunday: { open: '10:00', close: '19:00' }
    }
  },
  {
    name: 'Burger King Express',
    description: 'Fast-food de qualité. Burgers, frites et boissons à emporter ou sur place.',
    categoryName: 'Alimentation',
    location: { floor: '0', zone: 'C', shopNumber: '012' },
    contact: { phone: '0145678903', email: 'contact@burgerexpress.com' },
    hours: {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '22:00' },
      friday: { open: '11:00', close: '23:00' },
      saturday: { open: '11:00', close: '23:00' },
      sunday: { open: '11:00', close: '22:00' }
    }
  },
  {
    name: 'Beauty Palace',
    description: 'Votre boutique beauté. Cosmétiques, parfums et soins du corps.',
    categoryName: 'Beauté & Santé',
    location: { floor: '1', zone: 'B', shopNumber: '115' },
    contact: { phone: '0145678904', email: 'contact@beautypalace.com' },
    hours: {
      monday: { open: '10:00', close: '20:00' },
      tuesday: { open: '10:00', close: '20:00' },
      wednesday: { open: '10:00', close: '20:00' },
      thursday: { open: '10:00', close: '20:00' },
      friday: { open: '10:00', close: '21:00' },
      saturday: { open: '09:00', close: '21:00' },
      sunday: { open: '10:00', close: '19:00' }
    }
  },
  {
    name: 'Sport Plus',
    description: 'Équipements sportifs pour tous. Running, fitness, sports collectifs.',
    categoryName: 'Sport & Loisirs',
    location: { floor: '2', zone: 'A', shopNumber: '202' },
    contact: { phone: '0145678905', email: 'info@sportplus.com' },
    hours: {
      monday: { open: '09:00', close: '20:00' },
      tuesday: { open: '09:00', close: '20:00' },
      wednesday: { open: '09:00', close: '20:00' },
      thursday: { open: '09:00', close: '20:00' },
      friday: { open: '09:00', close: '21:00' },
      saturday: { open: '09:00', close: '21:00' },
      sunday: { open: '10:00', close: '19:00' }
    }
  },
  {
    name: 'Book Corner',
    description: 'Librairie généraliste. Romans, BD, mangas et papeterie.',
    categoryName: 'Librairie & Papeterie',
    location: { floor: '1', zone: 'C', shopNumber: '120' },
    contact: { phone: '0145678906', email: 'contact@bookcorner.com' },
    hours: {
      monday: { open: '10:00', close: '19:00' },
      tuesday: { open: '10:00', close: '19:00' },
      wednesday: { open: '10:00', close: '19:00' },
      thursday: { open: '10:00', close: '19:00' },
      friday: { open: '10:00', close: '20:00' },
      saturday: { open: '09:00', close: '20:00' },
      sunday: { open: '10:00', close: '18:00' }
    }
  },
  {
    name: 'Style & Chic',
    description: 'Mode féminine exclusive. Collections élégantes et raffinées.',
    categoryName: 'Mode & Vêtements',
    location: { floor: '1', zone: 'A', shopNumber: '105' },
    contact: { phone: '0145678907', email: 'info@stylechic.com' },
    hours: {
      monday: { open: '10:00', close: '20:00' },
      tuesday: { open: '10:00', close: '20:00' },
      wednesday: { open: '10:00', close: '20:00' },
      thursday: { open: '10:00', close: '20:00' },
      friday: { open: '10:00', close: '21:00' },
      saturday: { open: '09:00', close: '21:00' },
      sunday: { open: '10:00', close: '19:00' }
    }
  },
  {
    name: 'Gaming Zone',
    description: 'Tout pour les gamers. Consoles, jeux vidéo et accessoires.',
    categoryName: 'Électronique',
    location: { floor: '2', zone: 'B', shopNumber: '210' },
    contact: { phone: '0145678908', email: 'contact@gamingzone.com' },
    hours: {
      monday: { open: '10:00', close: '20:00' },
      tuesday: { open: '10:00', close: '20:00' },
      wednesday: { open: '10:00', close: '20:00' },
      thursday: { open: '10:00', close: '20:00' },
      friday: { open: '10:00', close: '22:00' },
      saturday: { open: '09:00', close: '22:00' },
      sunday: { open: '10:00', close: '20:00' }
    }
  },
  {
    name: 'Sweet Bakery',
    description: 'Pâtisserie artisanale. Gâteaux, viennoiseries et douceurs.',
    categoryName: 'Alimentation',
    location: { floor: '0', zone: 'A', shopNumber: '008' },
    contact: { phone: '0145678909', email: 'contact@sweetbakery.com' },
    hours: {
      monday: { open: '07:00', close: '20:00' },
      tuesday: { open: '07:00', close: '20:00' },
      wednesday: { open: '07:00', close: '20:00' },
      thursday: { open: '07:00', close: '20:00' },
      friday: { open: '07:00', close: '20:00' },
      saturday: { open: '07:00', close: '20:00' },
      sunday: { open: '08:00', close: '18:00' }
    }
  },
  {
    name: 'Fitness Avenue',
    description: 'Nutrition sportive et équipements fitness pour votre bien-être.',
    categoryName: 'Sport & Loisirs',
    location: { floor: '2', zone: 'C', shopNumber: '225' },
    contact: { phone: '0145678910', email: 'info@fitnessavenue.com' },
    hours: {
      monday: { open: '09:00', close: '20:00' },
      tuesday: { open: '09:00', close: '20:00' },
      wednesday: { open: '09:00', close: '20:00' },
      thursday: { open: '09:00', close: '20:00' },
      friday: { open: '09:00', close: '21:00' },
      saturday: { open: '09:00', close: '21:00' },
      sunday: { open: '10:00', close: '19:00' }
    }
  }
];

const products = {
  'Fashion Store': [
    { name: 'T-Shirt Coton Bio Homme', description: 'T-shirt 100% coton biologique, coupe regular, disponible en plusieurs coloris', price: 29.99, stock: 50, categoryName: 'Vêtements Homme', isPromotion: false },
    { name: 'Jean Slim Femme', description: 'Jean slim taille haute, coupe moderne et confortable', price: 59.99, stock: 35, categoryName: 'Vêtements Femme', isPromotion: true, discount: 20 },
    { name: 'Robe d\'été', description: 'Robe légère et élégante pour l\'été, tissu fluide', price: 49.99, stock: 28, categoryName: 'Vêtements Femme', isPromotion: false },
    { name: 'Chemise Homme', description: 'Chemise élégante en coton, parfaite pour le bureau', price: 45.00, stock: 42, categoryName: 'Vêtements Homme', isPromotion: false },
    { name: 'Veste en Cuir', description: 'Veste en cuir véritable, style motard', price: 199.99, stock: 15, categoryName: 'Vêtements Homme', isPromotion: true, discount: 15 }
  ],
  'Tech World': [
    { name: 'iPhone 15 Pro', description: 'Dernier modèle Apple, 256GB, puce A17 Pro', price: 1299.00, stock: 20, categoryName: 'Smartphones', isPromotion: false },
    { name: 'Samsung Galaxy S24', description: 'Smartphone Android premium, écran AMOLED 6.2"', price: 999.00, stock: 25, categoryName: 'Smartphones', isPromotion: true, discount: 10 },
    { name: 'MacBook Air M3', description: 'Ultraportable Apple, puce M3, 8GB RAM, 512GB SSD', price: 1499.00, stock: 12, categoryName: 'Ordinateurs', isPromotion: false },
    { name: 'Dell XPS 13', description: 'PC portable premium, Intel i7, 16GB RAM, écran tactile', price: 1399.00, stock: 15, categoryName: 'Ordinateurs', isPromotion: false },
    { name: 'AirPods Pro', description: 'Écouteurs sans fil avec réduction de bruit active', price: 279.00, stock: 45, categoryName: 'Smartphones', isPromotion: true, discount: 15 }
  ],
  'Burger King Express': [
    { name: 'Burger Classic', description: 'Notre burger signature avec steak haché, salade, tomate, oignon', price: 8.50, stock: 100, categoryName: 'Fast Food', isPromotion: false },
    { name: 'Burger XXL', description: 'Double steak, double fromage, bacon croustillant', price: 12.99, stock: 80, categoryName: 'Fast Food', isPromotion: true, discount: 10 },
    { name: 'Menu Poulet', description: 'Filet de poulet croustillant, frites, boisson', price: 10.50, stock: 90, categoryName: 'Fast Food', isPromotion: false },
    { name: 'Frites Maison', description: 'Frites fraîches coupées maison, portion généreuse', price: 3.50, stock: 150, categoryName: 'Fast Food', isPromotion: false },
    { name: 'Menu Enfant', description: 'Burger junior, petites frites, jus de fruits, jouet', price: 6.90, stock: 70, categoryName: 'Fast Food', isPromotion: false }
  ],
  'Beauty Palace': [
    { name: 'Rouge à Lèvres Mat', description: 'Rouge à lèvres longue tenue, fini mat, 12 teintes', price: 24.99, stock: 60, categoryName: 'Cosmétiques', isPromotion: false },
    { name: 'Palette Fards à Paupières', description: '20 couleurs tendances, finitions variées', price: 39.99, stock: 35, categoryName: 'Cosmétiques', isPromotion: true, discount: 25 },
    { name: 'Sérum Anti-Âge', description: 'Sérum visage à l\'acide hyaluronique, 30ml', price: 49.99, stock: 28, categoryName: 'Cosmétiques', isPromotion: false },
    { name: 'Crème Hydratante', description: 'Crème de jour hydratante pour tous types de peaux', price: 29.99, stock: 45, categoryName: 'Cosmétiques', isPromotion: false },
    { name: 'Parfum Femme 50ml', description: 'Eau de parfum florale et fruitée, tenue longue durée', price: 79.99, stock: 25, categoryName: 'Cosmétiques', isPromotion: true, discount: 20 }
  ],
  'Sport Plus': [
    { name: 'Chaussures Running', description: 'Chaussures de course légères, amorti optimal', price: 89.99, stock: 40, categoryName: 'Équipement Sport', isPromotion: false },
    { name: 'Tapis de Yoga', description: 'Tapis antidérapant, épaisseur 6mm, avec sac de transport', price: 34.99, stock: 55, categoryName: 'Équipement Sport', isPromotion: true, discount: 15 },
    { name: 'Haltères 10kg', description: 'Paire d\'haltères réglables de 2 à 10kg', price: 79.99, stock: 25, categoryName: 'Équipement Sport', isPromotion: false },
    { name: 'Tenue de Sport Femme', description: 'Ensemble legging et brassière respirant', price: 49.99, stock: 38, categoryName: 'Équipement Sport', isPromotion: false },
    { name: 'Montre GPS Running', description: 'Montre connectée avec GPS, cardio, étanche', price: 199.99, stock: 18, categoryName: 'Équipement Sport', isPromotion: true, discount: 20 }
  ],
  'Book Corner': [
    { name: 'Harry Potter - Collection', description: 'Coffret complet des 7 tomes, édition illustrée', price: 89.99, stock: 22, categoryName: 'Livres', isPromotion: false },
    { name: 'Manga One Piece Tome 1', description: 'Début de la saga du pirate Luffy', price: 6.90, stock: 85, categoryName: 'Livres', isPromotion: false },
    { name: 'Cahier A4 200 pages', description: 'Cahier grands carreaux, couverture rigide', price: 4.99, stock: 120, categoryName: 'Fournitures', isPromotion: false },
    { name: 'Set de Stylos', description: 'Coffret 12 stylos gel couleurs assorties', price: 12.99, stock: 75, categoryName: 'Fournitures', isPromotion: true, discount: 10 },
    { name: 'Roman Thriller Best-Seller', description: 'Le dernier thriller palpitant de l\'année', price: 19.99, stock: 42, categoryName: 'Livres', isPromotion: false }
  ],
  'Style & Chic': [
    { name: 'Robe de Soirée', description: 'Robe longue élégante, parfaite pour les événements', price: 129.99, stock: 15, categoryName: 'Vêtements Femme', isPromotion: true, discount: 30 },
    { name: 'Sac à Main Cuir', description: 'Sac en cuir véritable, design chic et intemporel', price: 159.99, stock: 18, categoryName: 'Vêtements Femme', isPromotion: false },
    { name: 'Escarpins Élégants', description: 'Chaussures à talons 7cm, confort optimal', price: 89.99, stock: 25, categoryName: 'Vêtements Femme', isPromotion: false },
    { name: 'Foulard Soie', description: 'Foulard 100% soie naturelle, motifs exclusifs', price: 39.99, stock: 35, categoryName: 'Vêtements Femme', isPromotion: false },
    { name: 'Manteau Long', description: 'Manteau laine mélangée, coupe cintrée', price: 179.99, stock: 12, categoryName: 'Vêtements Femme', isPromotion: true, discount: 25 }
  ],
  'Gaming Zone': [
    { name: 'PlayStation 5', description: 'Console nouvelle génération, 825GB SSD', price: 549.99, stock: 15, categoryName: 'Ordinateurs', isPromotion: false },
    { name: 'Xbox Series X', description: 'Console Microsoft 4K, 1TB stockage', price: 499.99, stock: 18, categoryName: 'Ordinateurs', isPromotion: false },
    { name: 'The Last of Us Part II', description: 'Jeu d\'action-aventure PS5, graphismes époustouflants', price: 69.99, stock: 45, categoryName: 'Ordinateurs', isPromotion: true, discount: 20 },
    { name: 'Casque Gaming RGB', description: 'Casque avec micro, son surround 7.1, LEDs RGB', price: 89.99, stock: 32, categoryName: 'Ordinateurs', isPromotion: false },
    { name: 'Manette Pro Controller', description: 'Manette sans fil premium, batterie longue durée', price: 69.99, stock: 40, categoryName: 'Ordinateurs', isPromotion: true, discount: 15 }
  ],
  'Sweet Bakery': [
    { name: 'Croissant Beurre', description: 'Croissant pur beurre, croustillant et fondant', price: 1.50, stock: 200, categoryName: 'Pâtisserie', isPromotion: false },
    { name: 'Éclair au Chocolat', description: 'Éclair fourré crème pâtissière, glaçage chocolat', price: 3.50, stock: 85, categoryName: 'Pâtisserie', isPromotion: false },
    { name: 'Tarte aux Fraises', description: 'Tarte fraîche du jour, 6-8 parts', price: 22.00, stock: 15, categoryName: 'Pâtisserie', isPromotion: false },
    { name: 'Macarons Assortis', description: 'Boîte de 12 macarons, saveurs variées', price: 18.00, stock: 35, categoryName: 'Pâtisserie', isPromotion: true, discount: 10 },
    { name: 'Gâteau Anniversaire', description: 'Gâteau personnalisé, 8-10 personnes', price: 35.00, stock: 8, categoryName: 'Pâtisserie', isPromotion: false }
  ],
  'Fitness Avenue': [
    { name: 'Protéine Whey 1kg', description: 'Poudre protéinée saveur vanille, 25g de protéines/dose', price: 29.99, stock: 65, categoryName: 'Équipement Sport', isPromotion: true, discount: 20 },
    { name: 'Barre Énergétique x12', description: 'Pack de 12 barres énergétiques, goût chocolat', price: 19.99, stock: 80, categoryName: 'Équipement Sport', isPromotion: false },
    { name: 'Kettlebell 12kg', description: 'Kettlebell en fonte, idéal crossfit et home gym', price: 44.99, stock: 28, categoryName: 'Équipement Sport', isPromotion: false },
    { name: 'Élastiques Fitness Set', description: 'Set de 5 bandes élastiques résistances variées', price: 24.99, stock: 55, categoryName: 'Équipement Sport', isPromotion: false },
    { name: 'Shaker Premium', description: 'Shaker 700ml avec compartiment poudre intégré', price: 12.99, stock: 95, categoryName: 'Équipement Sport', isPromotion: true, discount: 15 }
  ]
};

async function seedData() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(DB_URI);
    console.log('✅ Connecté à MongoDB\n');

    console.log('🗑️  Suppression des données existantes...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Shop.deleteMany({}),
      Product.deleteMany({})
    ]);
    console.log('✅ Données supprimées\n');

    console.log('👥 Création des utilisateurs...');
    const createdUsers = await User.insertMany(users);
    console.log(`✅ ${createdUsers.length} utilisateurs créés\n`);

    const adminUser = createdUsers.find(u => u.role === 'admin');
    const boutiqueUsers = createdUsers.filter(u => u.role === 'boutique');

    console.log('📁 Création des catégories...');
    const allCategories = [...shopCategories, ...productCategories];
    const createdCategories = await Category.insertMany(allCategories);
    console.log(`✅ ${createdCategories.length} catégories créées\n`);

    console.log('🏪 Création des boutiques...');
    const createdShops = [];
    for (let i = 0; i < shops.length; i++) {
      const shopData = shops[i];
      const category = createdCategories.find(c => c.name === shopData.categoryName && c.type === 'boutique');
      const shop = await Shop.create({
        userId: boutiqueUsers[i]._id,
        name: shopData.name,
        description: shopData.description,
        category: category._id,
        location: shopData.location,
        contact: shopData.contact,
        hours: shopData.hours,
        status: 'active',
        isActive: true,
        statistics: {
          totalOrders: Math.floor(Math.random() * 100),
          totalRevenue: Math.floor(Math.random() * 10000),
          totalProducts: 0
        }
      });
      createdShops.push(shop);
    }
    console.log(`✅ ${createdShops.length} boutiques créées\n`);

    console.log('📦 Création des produits...');
    let totalProducts = 0;
    for (const shop of createdShops) {
      const shopProducts = products[shop.name];
      if (shopProducts) {
        for (const productData of shopProducts) {
          const category = createdCategories.find(c => c.name === productData.categoryName && c.type === 'produit');
          const promoEndDate = productData.isPromotion ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined;
          
          await Product.create({
            shopId: shop._id,
            name: productData.name,
            description: productData.description,
            price: productData.price,
            originalPrice: productData.isPromotion ? productData.price : undefined,
            discount: productData.discount || 0,
            promoEndDate,
            category: category._id,
            images: [],
            stock: {
              quantity: productData.stock,
              lowStockAlert: 5
            },
            isPromotion: productData.isPromotion,
            isActive: true,
            statistics: {
              views: Math.floor(Math.random() * 500),
              sold: Math.floor(Math.random() * 50)
            }
          });
          totalProducts++;
        }
        
        shop.statistics.totalProducts = shopProducts.length;
        await shop.save();
      }
    }
    console.log(`✅ ${totalProducts} produits créés\n`);

    console.log('📊 RÉSUMÉ DE LA GÉNÉRATION:');
    console.log('═══════════════════════════════════════');
    console.log(`👤 Utilisateurs: ${createdUsers.length}`);
    console.log(`   - Admin: 1 (${adminUser.email})`);
    console.log(`   - Boutiques: ${boutiqueUsers.length}`);
    console.log(`   - Clients: ${createdUsers.filter(u => u.role === 'client').length}`);
    console.log(`\n📁 Catégories: ${createdCategories.length}`);
    console.log(`   - Boutiques: ${shopCategories.length}`);
    console.log(`   - Produits: ${productCategories.length}`);
    console.log(`\n🏪 Boutiques: ${createdShops.length} (toutes actives)`);
    console.log(`📦 Produits: ${totalProducts} (répartis dans les boutiques)`);
    console.log('═══════════════════════════════════════\n');

    console.log('🔐 COMPTES DE TEST:');
    console.log('═══════════════════════════════════════');
    console.log('Admin:');
    console.log('  Email: admin@mall.com');
    console.log('  Mot de passe: Admin123!');
    console.log('\nBoutique (exemples):');
    console.log('  Email: boutique1@mall.com');
    console.log('  Mot de passe: Boutique123!');
    console.log('\nClient (exemples):');
    console.log('  Email: client1@test.com');
    console.log('  Mot de passe: Client123!');
    console.log('═══════════════════════════════════════\n');

    console.log('✅ Génération terminée avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
}

seedData();
