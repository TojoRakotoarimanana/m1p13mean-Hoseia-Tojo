const mongoose = require('mongoose');
const { User, Category, Shop, Product } = require('../models');

const DB_URI = 'mongodb://localhost:27017/m1p13mean';

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

// Images par défaut pour chaque type de produit
const productImages = {
  tshirt: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800'],
  jean: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800'],
  robe: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800'],
  chemise: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800'],
  veste: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800'],
  iphone: ['https://images.unsplash.com/photo-1592286927505-2fd7ff2c3f10?w=800', 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800'],
  samsung: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800'],
  macbook: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800'],
  laptop: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'],
  airpods: ['https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800', 'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=800'],
  burger: ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800'],
  poulet: ['https://images.unsplash.com/photo-1562059390-a761a084768e?w=800', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800'],
  frites: ['https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800', 'https://images.unsplash.com/photo-1630384082525-2b99be35bbd3?w=800'],
  lipstick: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800', 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=800'],
  palette: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800'],
  serum: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800', 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800'],
  creme: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800'],
  parfum: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800'],
  running: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800'],
  yoga: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800', 'https://images.unsplash.com/photo-1592432678016-e910b452ab71?w=800'],
  halteres: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800'],
  sportswear: ['https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800', 'https://images.unsplash.com/photo-1579364046732-c21c2b973b34?w=800'],
  montre: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
  livre: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800'],
  manga: ['https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=800', 'https://images.unsplash.com/photo-1626618012641-bfbca5a31239?w=800'],
  cahier: ['https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800', 'https://images.unsplash.com/photo-1553431788-a8e42a3c31f4?w=800'],
  stylos: ['https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800', 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=800'],
  sac: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800'],
  chaussures: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800', 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=800'],
  foulard: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800', 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800'],
  manteau: ['https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800', 'https://images.unsplash.com/photo-1544441892-794166f1e3be?w=800'],
  ps5: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800', 'https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=800'],
  xbox: ['https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=800', 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800'],
  jeu: ['https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800'],
  casque: ['https://images.unsplash.com/photo-1599669454699-248893623440?w=800', 'https://images.unsplash.com/photo-1577174881658-0f30157a005b?w=800'],
  manette: ['https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=800', 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800'],
  croissant: ['https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800', 'https://images.unsplash.com/photo-1623334044303-241021148842?w=800'],
  eclair: ['https://images.unsplash.com/photo-1612203985729-70726954388c?w=800', 'https://images.unsplash.com/photo-1612200684577-eed0b0827d9f?w=800'],
  tarte: ['https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800'],
  macarons: ['https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=800', 'https://images.unsplash.com/photo-1558312657-e4c6bd5c6e6c?w=800'],
  gateau: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800', 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800'],
  proteine: ['https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800', 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=800'],
  barre: ['https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800', 'https://images.unsplash.com/photo-1623428187425-5d7a5d4345d1?w=800'],
  kettlebell: ['https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800'],
  elastiques: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800', 'https://images.unsplash.com/photo-1598971639619-0fac0c30edb4?w=800'],
  shaker: ['https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=800', 'https://images.unsplash.com/photo-1620188467120-5042ed1eb5da?w=800']
};

const products = {
  'Fashion Store': [
    { name: 'T-Shirt Coton Bio Homme', description: 'T-shirt 100% coton biologique, coupe regular, disponible en plusieurs coloris', price: 29.99, stock: 50, categoryName: 'Vêtements Homme', isPromotion: false, images: productImages.tshirt },
    { name: 'Jean Slim Femme', description: 'Jean slim taille haute, coupe moderne et confortable', price: 59.99, stock: 35, categoryName: 'Vêtements Femme', isPromotion: true, discount: 20, images: productImages.jean },
    { name: 'Robe d\'été', description: 'Robe légère et élégante pour l\'été, tissu fluide', price: 49.99, stock: 28, categoryName: 'Vêtements Femme', isPromotion: false, images: productImages.robe },
    { name: 'Chemise Homme', description: 'Chemise élégante en coton, parfaite pour le bureau', price: 45.00, stock: 42, categoryName: 'Vêtements Homme', isPromotion: false, images: productImages.chemise },
    { name: 'Veste en Cuir', description: 'Veste en cuir véritable, style motard', price: 199.99, stock: 15, categoryName: 'Vêtements Homme', isPromotion: true, discount: 15, images: productImages.veste }
  ],
  'Tech World': [
    { name: 'iPhone 15 Pro', description: 'Dernier modèle Apple, 256GB, puce A17 Pro', price: 1299.00, stock: 20, categoryName: 'Smartphones', isPromotion: false, images: productImages.iphone },
    { name: 'Samsung Galaxy S24', description: 'Smartphone Android premium, écran AMOLED 6.2"', price: 999.00, stock: 25, categoryName: 'Smartphones', isPromotion: true, discount: 10, images: productImages.samsung },
    { name: 'MacBook Air M3', description: 'Ultraportable Apple, puce M3, 8GB RAM, 512GB SSD', price: 1499.00, stock: 12, categoryName: 'Ordinateurs', isPromotion: false, images: productImages.macbook },
    { name: 'Dell XPS 13', description: 'PC portable premium, Intel i7, 16GB RAM, écran tactile', price: 1399.00, stock: 15, categoryName: 'Ordinateurs', isPromotion: false, images: productImages.laptop },
    { name: 'AirPods Pro', description: 'Écouteurs sans fil avec réduction de bruit active', price: 279.00, stock: 45, categoryName: 'Smartphones', isPromotion: true, discount: 15, images: productImages.airpods }
  ],
  'Burger King Express': [
    { name: 'Burger Classic', description: 'Notre burger signature avec steak haché, salade, tomate, oignon', price: 8.50, stock: 100, categoryName: 'Fast Food', isPromotion: false, images: productImages.burger },
    { name: 'Burger XXL', description: 'Double steak, double fromage, bacon croustillant', price: 12.99, stock: 80, categoryName: 'Fast Food', isPromotion: true, discount: 10, images: productImages.burger },
    { name: 'Menu Poulet', description: 'Filet de poulet croustillant, frites, boisson', price: 10.50, stock: 90, categoryName: 'Fast Food', isPromotion: false, images: productImages.poulet },
    { name: 'Frites Maison', description: 'Frites fraîches coupées maison, portion généreuse', price: 3.50, stock: 150, categoryName: 'Fast Food', isPromotion: false, images: productImages.frites },
    { name: 'Menu Enfant', description: 'Burger junior, petites frites, jus de fruits, jouet', price: 6.90, stock: 70, categoryName: 'Fast Food', isPromotion: false, images: productImages.burger }
  ],
  'Beauty Palace': [
    { name: 'Rouge à Lèvres Mat', description: 'Rouge à lèvres longue tenue, fini mat, 12 teintes', price: 24.99, stock: 60, categoryName: 'Cosmétiques', isPromotion: false, images: productImages.lipstick },
    { name: 'Palette Fards à Paupières', description: '20 couleurs tendances, finitions variées', price: 39.99, stock: 35, categoryName: 'Cosmétiques', isPromotion: true, discount: 25, images: productImages.palette },
    { name: 'Sérum Anti-Âge', description: 'Sérum visage à l\'acide hyaluronique, 30ml', price: 49.99, stock: 28, categoryName: 'Cosmétiques', isPromotion: false, images: productImages.serum },
    { name: 'Crème Hydratante', description: 'Crème de jour hydratante pour tous types de peaux', price: 29.99, stock: 45, categoryName: 'Cosmétiques', isPromotion: false, images: productImages.creme },
    { name: 'Parfum Femme 50ml', description: 'Eau de parfum florale et fruitée, tenue longue durée', price: 79.99, stock: 25, categoryName: 'Cosmétiques', isPromotion: true, discount: 20, images: productImages.parfum }
  ],
  'Sport Plus': [
    { name: 'Chaussures Running', description: 'Chaussures de course légères, amorti optimal', price: 89.99, stock: 40, categoryName: 'Équipement Sport', isPromotion: false, images: productImages.running },
    { name: 'Tapis de Yoga', description: 'Tapis antidérapant, épaisseur 6mm, avec sac de transport', price: 34.99, stock: 55, categoryName: 'Équipement Sport', isPromotion: true, discount: 15, images: productImages.yoga },
    { name: 'Haltères 10kg', description: 'Paire d\'haltères réglables de 2 à 10kg', price: 79.99, stock: 25, categoryName: 'Équipement Sport', isPromotion: false, images: productImages.halteres },
    { name: 'Tenue de Sport Femme', description: 'Ensemble legging et brassière respirant', price: 49.99, stock: 38, categoryName: 'Équipement Sport', isPromotion: false, images: productImages.sportswear },
    { name: 'Montre GPS Running', description: 'Montre connectée avec GPS, cardio, étanche', price: 199.99, stock: 18, categoryName: 'Équipement Sport', isPromotion: true, discount: 20, images: productImages.montre }
  ],
  'Book Corner': [
    { name: 'Harry Potter - Collection', description: 'Coffret complet des 7 tomes, édition illustrée', price: 89.99, stock: 22, categoryName: 'Livres', isPromotion: false, images: productImages.livre },
    { name: 'Manga One Piece Tome 1', description: 'Début de la saga du pirate Luffy', price: 6.90, stock: 85, categoryName: 'Livres', isPromotion: false, images: productImages.manga },
    { name: 'Cahier A4 200 pages', description: 'Cahier grands carreaux, couverture rigide', price: 4.99, stock: 120, categoryName: 'Fournitures', isPromotion: false, images: productImages.cahier },
    { name: 'Set de Stylos', description: 'Coffret 12 stylos gel couleurs assorties', price: 12.99, stock: 75, categoryName: 'Fournitures', isPromotion: true, discount: 10, images: productImages.stylos },
    { name: 'Roman Thriller Best-Seller', description: 'Le dernier thriller palpitant de l\'année', price: 19.99, stock: 42, categoryName: 'Livres', isPromotion: false, images: productImages.livre }
  ],
  'Style & Chic': [
    { name: 'Robe de Soirée', description: 'Robe longue élégante, parfaite pour les événements', price: 129.99, stock: 15, categoryName: 'Vêtements Femme', isPromotion: true, discount: 30, images: productImages.robe },
    { name: 'Sac à Main Cuir', description: 'Sac en cuir véritable, design chic et intemporel', price: 159.99, stock: 18, categoryName: 'Vêtements Femme', isPromotion: false, images: productImages.sac },
    { name: 'Escarpins Élégants', description: 'Chaussures à talons 7cm, confort optimal', price: 89.99, stock: 25, categoryName: 'Vêtements Femme', isPromotion: false, images: productImages.chaussures },
    { name: 'Foulard Soie', description: 'Foulard 100% soie naturelle, motifs exclusifs', price: 39.99, stock: 35, categoryName: 'Vêtements Femme', isPromotion: false, images: productImages.foulard },
    { name: 'Manteau Long', description: 'Manteau laine mélangée, coupe cintrée', price: 179.99, stock: 12, categoryName: 'Vêtements Femme', isPromotion: true, discount: 25, images: productImages.manteau }
  ],
  'Gaming Zone': [
    { name: 'PlayStation 5', description: 'Console nouvelle génération, 825GB SSD', price: 549.99, stock: 15, categoryName: 'Ordinateurs', isPromotion: false, images: productImages.ps5 },
    { name: 'Xbox Series X', description: 'Console Microsoft 4K, 1TB stockage', price: 499.99, stock: 18, categoryName: 'Ordinateurs', isPromotion: false, images: productImages.xbox },
    { name: 'The Last of Us Part II', description: 'Jeu d\'action-aventure PS5, graphismes époustouflants', price: 69.99, stock: 45, categoryName: 'Ordinateurs', isPromotion: true, discount: 20, images: productImages.jeu },
    { name: 'Casque Gaming RGB', description: 'Casque avec micro, son surround 7.1, LEDs RGB', price: 89.99, stock: 32, categoryName: 'Ordinateurs', isPromotion: false, images: productImages.casque },
    { name: 'Manette Pro Controller', description: 'Manette sans fil premium, batterie longue durée', price: 69.99, stock: 40, categoryName: 'Ordinateurs', isPromotion: true, discount: 15, images: productImages.manette }
  ],
  'Sweet Bakery': [
    { name: 'Croissant Beurre', description: 'Croissant pur beurre, croustillant et fondant', price: 1.50, stock: 200, categoryName: 'Pâtisserie', isPromotion: false, images: productImages.croissant },
    { name: 'Éclair au Chocolat', description: 'Éclair fourré crème pâtissière, glaçage chocolat', price: 3.50, stock: 85, categoryName: 'Pâtisserie', isPromotion: false, images: productImages.eclair },
    { name: 'Tarte aux Fraises', description: 'Tarte fraîche du jour, 6-8 parts', price: 22.00, stock: 15, categoryName: 'Pâtisserie', isPromotion: false, images: productImages.tarte },
    { name: 'Macarons Assortis', description: 'Boîte de 12 macarons, saveurs variées', price: 18.00, stock: 35, categoryName: 'Pâtisserie', isPromotion: true, discount: 10, images: productImages.macarons },
    { name: 'Gâteau Anniversaire', description: 'Gâteau personnalisé, 8-10 personnes', price: 35.00, stock: 8, categoryName: 'Pâtisserie', isPromotion: false, images: productImages.gateau }
  ],
  'Fitness Avenue': [
    { name: 'Protéine Whey 1kg', description: 'Poudre protéinée saveur vanille, 25g de protéines/dose', price: 29.99, stock: 65, categoryName: 'Équipement Sport', isPromotion: true, discount: 20, images: productImages.proteine },
    { name: 'Barre Énergétique x12', description: 'Pack de 12 barres énergétiques, goût chocolat', price: 19.99, stock: 80, categoryName: 'Équipement Sport', isPromotion: false, images: productImages.barre },
    { name: 'Kettlebell 12kg', description: 'Kettlebell en fonte, idéal crossfit et home gym', price: 44.99, stock: 28, categoryName: 'Équipement Sport', isPromotion: false, images: productImages.kettlebell },
    { name: 'Élastiques Fitness Set', description: 'Set de 5 bandes élastiques résistances variées', price: 24.99, stock: 55, categoryName: 'Équipement Sport', isPromotion: false, images: productImages.elastiques },
    { name: 'Shaker Premium', description: 'Shaker 700ml avec compartiment poudre intégré', price: 12.99, stock: 95, categoryName: 'Équipement Sport', isPromotion: true, discount: 15, images: productImages.shaker }
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
          const promoStartDate = productData.isPromotion ? new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) : undefined;
          const promoEndDate = productData.isPromotion ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined;

          await Product.create({
            shopId: shop._id,
            name: productData.name,
            description: productData.description,
            price: productData.price,
            originalPrice: productData.isPromotion ? productData.price : undefined,
            discount: productData.discount || 0,
            promoStartDate,
            promoEndDate,
            category: category._id,
            images: productData.images || [],
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
