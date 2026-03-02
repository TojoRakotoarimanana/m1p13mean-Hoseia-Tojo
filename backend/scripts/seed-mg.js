const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
require('dotenv').config();
const { User, Category, Shop, Product } = require('../models');

const DB_URI = process.env.MONGO_URI;

const shopCategories = [
  { name: 'Artisanat & Souvenirs', description: 'Vannerie, broderie et objets en corne', type: 'boutique', icon: 'pi-star' },
  { name: 'Épices & Saveurs', description: 'Vanille, poivre sauvage et produits locaux', type: 'boutique', icon: 'pi-shopping-cart' },
  { name: 'Mode & Textile', description: 'Lamba oany, coton malagasy et prêt-à-porter', type: 'boutique', icon: 'pi-shopping-bag' },
  { name: 'Bien-être & Huiles', description: 'Ravintsara, huiles essentielles de Madagascar', type: 'boutique', icon: 'pi-heart' },
  { name: 'Gastronomie & Restaurants', description: 'Cuisine traditionnelle malagasy et fusion', type: 'boutique', icon: 'pi-home' },
  { name: 'Informatique & Tech', description: 'Matériel informatique et accessoires', type: 'boutique', icon: 'pi-desktop' },
  { name: 'Librairie & Culture', description: 'Littérature malagasy et fournitures', type: 'boutique', icon: 'pi-book' },
  { name: 'Bijouterie de Luxe', description: 'Pierres précieuses et bijoux en argent', type: 'boutique', icon: 'pi-box' },
  { name: 'Sport & Aventure', description: 'Équipements de sport et plein air', type: 'boutique', icon: 'pi-directions' },
  { name: 'Maison & Déco', description: 'Meubles en bois précieux et déco artisanale', type: 'boutique', icon: 'pi-palette' }
];

const productCategories = [
  { name: 'art', description: 'Vannerie, sculptures et objets d\'art', type: 'produit', icon: 'pi-star' },
  { name: 'epices', description: 'Vanille, poivres et produits locaux', type: 'produit', icon: 'pi-sun' },
  { name: 'textile', description: 'Lamba oany et confections malagasy', type: 'produit', icon: 'pi-user' },
  { name: 'soins', description: 'Huiles essentielles et bien-être', type: 'produit', icon: 'pi-filter' },
  { name: 'cuisine', description: 'Plats préparés et gastronomie locale', type: 'produit', icon: 'pi-coffee' },
  { name: 'tech et accessoir', description: 'Materiels tech et accessoires', type: 'produit', icon: 'pi-desktop' },
  { name: 'livres', description: 'Littérature et ouvrages de culture', type: 'produit', icon: 'pi-book' },
  { name: 'bijout', description: 'Bijoux et pierres précieuses', type: 'produit', icon: 'pi-heart' },
  { name: 'sport', description: 'Articles et accessoires de sport', type: 'produit', icon: 'pi-bolt' },
  { name: 'deco', description: 'Articles de décoration intérieure', type: 'produit', icon: 'pi-info-circle' }
];

const users = [
  { email: 'rakoto.jean@gmail.com', password: 'Client123!', role: 'client', firstName: 'Jean', lastName: 'Rakoto', phone: '0341234567' },
  { email: 'mialy.ravaka@gmail.com', password: 'Client123!', role: 'client', firstName: 'Mialy', lastName: 'Ravaka', phone: '0329876543' },
  { email: 'lisy@gmail.com', password: 'Boutique123!', role: 'boutique', phone: '0340000001' },
  { email: 'codal@gmail.com', password: 'Boutique123!', role: 'boutique', phone: '0340000002' },
  { email: 'homeopharma@gmail.com', password: 'Boutique123!', role: 'boutique', phone: '0340000003' },
  { email: 'massin@gmail.com', password: 'Boutique123!', role: 'boutique', phone: '0340000004' },
  { email: 'habibo@gmail.com', password: 'Boutique123!', role: 'boutique', phone: '0340000005' },
  { email: 'maki@gmail.com', password: 'Pending123!', role: 'boutique', phone: '0320000001', isActive: false },
  { email: 'kalidas@gmail.com', password: 'Pending123!', role: 'boutique', phone: '0320000002', isActive: false },
  { email: 'librairie@gmail.com', password: 'Pending123!', role: 'boutique', phone: '0320000003', isActive: false },
  { email: 'courts@gmail.com', password: 'Pending123!', role: 'boutique', phone: '0320000004', isActive: false },
  { email: 'ocean5@gmail.com', password: 'Pending123!', role: 'boutique', phone: '0320000005', isActive: false }
];

const shops = [
  {
    name: 'Lisy Art Gallery',
    description: 'La référence de l\'artisanat haut de gamme à Antananarivo.',
    categoryName: 'Artisanat & Souvenirs',
    location: { floor: '1', zone: 'A', shopNumber: 'A101' },
    contact: { phone: '0341122334', email: 'lisy@gmail.com' },
    hours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '09:00', close: '17:00' },
      sunday: { open: '09:00', close: '12:00' }
    },
    status: 'active',
    isActive: true
  },
  {
    name: 'Codal Madagascar',
    description: 'Conserves et produits du terroir malagasy depuis 1950.',
    categoryName: 'Épices & Saveurs',
    location: { floor: '1', zone: 'A', shopNumber: 'A102' },
    contact: { phone: '0341122335', email: 'contact.codal@gmail.com' },
    hours: {
      monday: { open: '08:30', close: '17:30' },
      tuesday: { open: '08:30', close: '17:30' },
      wednesday: { open: '08:30', close: '17:30' },
      thursday: { open: '08:30', close: '17:30' },
      friday: { open: '08:30', close: '17:30' },
      saturday: { open: '08:30', close: '12:30' },
      sunday: { open: 'closed', close: 'closed' }
    },
    status: 'active',
    isActive: true
  },
  {
    name: 'Homeopharma',
    description: 'Laboratoire leader en produits naturels et huiles essentielles.',
    categoryName: 'Bien-être & Huiles',
    location: { floor: '1', zone: 'A', shopNumber: 'A103' },
    contact: { phone: '0341122336', email: 'info.homeopharma@gmail.com' },
    hours: {
      monday: { open: '08:00', close: '18:00' },
      tuesday: { open: '08:00', close: '18:00' },
      wednesday: { open: '08:00', close: '18:00' },
      thursday: { open: '08:00', close: '18:00' },
      friday: { open: '08:00', close: '18:00' },
      saturday: { open: '08:00', close: '17:00' },
      sunday: { open: '09:00', close: '12:00' }
    },
    status: 'active',
    isActive: true
  },
  {
    name: 'Mass\'In',
    description: 'Le spécialiste de la technologie et du multimédia à Madagascar.',
    categoryName: 'Informatique & Tech',
    location: { floor: '1', zone: 'A', shopNumber: 'A104' },
    contact: { phone: '0341122337', email: 'vente.massin@gmail.com' },
    hours: {
      monday: { open: '09:00', close: '19:00' },
      tuesday: { open: '09:00', close: '19:00' },
      wednesday: { open: '09:00', close: '19:00' },
      thursday: { open: '09:00', close: '19:00' },
      friday: { open: '09:00', close: '19:00' },
      saturday: { open: '09:00', close: '19:00' },
      sunday: { open: '10:00', close: '18:00' }
    },
    status: 'active',
    isActive: true
  },
  {
    name: 'Habibo Group Shop',
    description: 'Distribution de produits de grande consommation et textile.',
    categoryName: 'Mode & Textile',
    location: { floor: '1', zone: 'A', shopNumber: 'A105' },
    contact: { phone: '0341122338', email: 'shop.habibo@gmail.com' },
    hours: {
      monday: { open: '08:30', close: '18:00' },
      tuesday: { open: '08:30', close: '18:00' },
      wednesday: { open: '08:30', close: '18:00' },
      thursday: { open: '08:30', close: '18:00' },
      friday: { open: '08:30', close: '18:00' },
      saturday: { open: '08:30', close: '17:00' },
      sunday: { open: 'closed', close: 'closed' }
    },
    status: 'active',
    isActive: true
  },
  {
    name: 'Maki Company Tana',
    description: 'Demande d\'ouverture pour Maki Company Tana.',
    categoryName: 'Mode & Textile',
    location: { floor: '0', zone: 'C', shopNumber: 'P001' },
    contact: { phone: '0320000001', email: 'maki.company@gmail.com' },
    hours: {
      monday: { open: '09:00', close: '18:30' },
      tuesday: { open: '09:00', close: '18:30' },
      wednesday: { open: '09:00', close: '18:30' },
      thursday: { open: '09:00', close: '18:30' },
      friday: { open: '09:00', close: '18:30' },
      saturday: { open: '09:00', close: '18:30' },
      sunday: { open: '10:00', close: '17:00' }
    },
    status: 'pending',
    isActive: false
  },
  {
    name: 'Bijouterie Kalidas',
    description: 'Demande d\'ouverture pour Bijouterie Kalidas.',
    categoryName: 'Bijouterie de Luxe',
    location: { floor: '0', zone: 'C', shopNumber: 'P002' },
    contact: { phone: '0320000002', email: 'kalidas.bijoux@gmail.com' },
    hours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '09:00', close: '17:00' },
      sunday: { open: 'closed', close: 'closed' }
    },
    status: 'pending',
    isActive: false
  },
  {
    name: 'Librairie Mixte',
    description: 'Demande d\'ouverture pour Librairie Mixte.',
    categoryName: 'Librairie & Culture',
    location: { floor: '0', zone: 'C', shopNumber: 'P003' },
    contact: { phone: '0320000003', email: 'librairie.mixte@gmail.com' },
    hours: {
      monday: { open: '08:00', close: '17:30' },
      tuesday: { open: '08:00', close: '17:30' },
      wednesday: { open: '08:00', close: '17:30' },
      thursday: { open: '08:00', close: '17:30' },
      friday: { open: '08:00', close: '17:30' },
      saturday: { open: '08:00', close: '12:00' },
      sunday: { open: 'closed', close: 'closed' }
    },
    status: 'pending',
    isActive: false
  },
  {
    name: 'Courts Madagascar',
    description: 'Demande d\'ouverture pour Courts Madagascar.',
    categoryName: 'Décoration d\'Intérieur',
    location: { floor: '0', zone: 'C', shopNumber: 'P004' },
    contact: { phone: '0320000004', email: 'courts.mada@gmail.com' },
    hours: {
      monday: { open: '09:00', close: '19:00' },
      tuesday: { open: '09:00', close: '19:00' },
      wednesday: { open: '09:00', close: '19:00' },
      thursday: { open: '09:00', close: '19:00' },
      friday: { open: '09:00', close: '19:00' },
      saturday: { open: '09:00', close: '19:00' },
      sunday: { open: '10:00', close: '18:00' }
    },
    status: 'pending',
    isActive: false
  },
  {
    name: 'Ocean 5 Sport',
    description: 'Demande d\'ouverture pour Ocean 5 Sport.',
    categoryName: 'Sport & Aventure',
    location: { floor: '0', zone: 'C', shopNumber: 'P005' },
    contact: { phone: '0320000005', email: 'ocean5.sport@gmail.com' },
    hours: {
      monday: { open: '09:00', close: '19:00' },
      tuesday: { open: '09:00', close: '19:00' },
      wednesday: { open: '09:00', close: '19:00' },
      thursday: { open: '09:00', close: '19:00' },
      friday: { open: '09:00', close: '19:00' },
      saturday: { open: '09:00', close: '19:00' },
      sunday: { open: '10:00', close: '18:00' }
    },
    status: 'pending',
    isActive: false
  }
];

const productImages = {
  sac: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800'],
  vanille: ['https://images.unsplash.com/photo-1596435017947-8a604212903e?w=800'],
  vetement: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
  huile: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800'],
  plat: ['https://images.unsplash.com/photo-1562059390-a761a084768e?w=800'],
  tech: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'],
  livre: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800'],
  bijou: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
  sport: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
  deco: ['https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800']
};

const products = {
  'Lisy Art Gallery': [
    { name: 'Panier Raphia Brodé', description: 'Panier traditionnel malagasy en raphia, brodé à la main avec des motifs floraux uniques.', price: 45000, stock: 50, categoryName: 'art', images: productImages.sac },
    { name: 'Statue Bois de Rose', description: 'Sculpture artisanale en bois de rose précieux représentant la vie quotidienne malagasy.', price: 120000, stock: 50, categoryName: 'art', images: productImages.deco },
    { name: 'Pochette en Corne', description: 'Pochette élégante façonnée en corne de zébu poli, accessoire de mode authentique.', price: 35000, stock: 50, categoryName: 'art', images: productImages.deco },
    { name: 'Nappe Brodée Main', description: 'Grande nappe de table avec broderies ajourées traditionnelles d\'Antsirabe.', price: 85000, stock: 50, categoryName: 'art', images: productImages.deco },
    { name: 'Chapeau de Soleil', description: 'Chapeau à large bord en fibres naturelles tressées, idéal pour le climat tropical.', price: 25000, stock: 50, categoryName: 'art', images: productImages.sac },
    { name: 'Vide-poches en Bois', description: 'Petit récipient décoratif en bois sculpté pour ranger vos petits objets avec style.', price: 15000, stock: 50, categoryName: 'art', images: productImages.deco }
  ],
  'Codal Madagascar': [
    { name: 'Confiture de Goyave de Chine', description: 'Confiture artisanale préparée avec des goyaves de chine fraîches des hauts plateaux.', price: 12000, stock: 50, categoryName: 'cuisine', images: productImages.plat },
    { name: 'Poivre Sauvage Voatsiperifery', description: 'Poivre rare récolté en forêt, aux arômes boisés et agrumes, emblème de Madagascar.', price: 18000, stock: 50, categoryName: 'epices', images: productImages.vanille },
    { name: 'Pâte de Piment Rouge', description: 'Condiment pimenté traditionnel, indispensable pour relever tous vos plats malagasy.', price: 8000, stock: 50, categoryName: 'cuisine', images: productImages.plat },
    { name: 'Miel de Foret 500g', description: 'Miel pur et naturel récolté dans les forêts primaires, goût intense et boisé.', price: 22000, stock: 50, categoryName: 'cuisine', images: productImages.plat },
    { name: 'Curcuma Bio', description: 'Poudre de curcuma biologique cultivé localement, riche en saveurs et bienfaits.', price: 10000, stock: 50, categoryName: 'epices', images: productImages.plat },
    { name: 'Achards de Légumes', description: 'Légumes croquants marinés au vinaigre et épices, accompagnement parfait pour le riz.', price: 9000, stock: 50, categoryName: 'cuisine', images: productImages.plat }
  ],
  'Homeopharma': [
    { name: 'Huile de Ravintsara Pure', description: 'Huile essentielle 100% pure de Ravintsara, reconnue pour ses propriétés antivirales exceptionnelles.', price: 25000, stock: 50, categoryName: 'soins', images: productImages.huile },
    { name: 'Baume Froid Soulageant', description: 'Baume apaisant aux extraits de plantes médicinales pour soulager les douleurs musculaires.', price: 15000, stock: 50, categoryName: 'soins', images: productImages.huile },
    { name: 'Tisane Détox Mada', description: 'Mélange de plantes endémiques pour purifier l\'organisme et faciliter la digestion.', price: 12000, stock: 50, categoryName: 'soins', images: productImages.huile },
    { name: 'Huile de Massage Ylang-Ylang', description: 'Huile relaxante parfumée à l\'Ylang-Ylang de Nosy Be pour un moment de bien-être total.', price: 30000, stock: 50, categoryName: 'soins', images: productImages.huile },
    { name: 'Savon Artisanal Coco', description: 'Savon doux surgras à l\'huile de coco naturelle pour une peau hydratée et nourrie.', price: 5000, stock: 50, categoryName: 'soins', images: productImages.huile },
    { name: 'Shampooing aux Plantes', description: 'Soin capillaire naturel formulé avec des extraits végétaux pour fortifier les cheveux.', price: 18000, stock: 50, categoryName: 'soins', images: productImages.huile }
  ],
  'Mass\'In': [
    { name: 'Casque Bluetooth JBL', description: 'Casque sans fil haute performance avec réduction de bruit pour une expérience sonore immersive.', price: 250000, stock: 50, categoryName: 'tech et accessoir', images: productImages.tech },
    { name: 'Souris Gamer RGB', description: 'Souris optique haute précision avec éclairage LED personnalisable pour les passionnés de jeux.', price: 85000, stock: 50, categoryName: 'tech et accessoir', images: productImages.tech },
    { name: 'Clavier AZERTY Sans Fil', description: 'Clavier ergonomique sans fil pour une frappe confortable et une liberté de mouvement totale.', price: 120000, stock: 50, categoryName: 'tech et accessoir', images: productImages.tech },
    { name: 'Enceinte Portable Sony', description: 'Enceinte Bluetooth compacte et étanche avec un son puissant pour vos déplacements.', price: 350000, stock: 50, categoryName: 'tech et accessoir', images: productImages.tech },
    { name: 'Powerbank 20000mAh', description: 'Batterie externe haute capacité pour recharger vos appareils plusieurs fois en toute autonomie.', price: 95000, stock: 50, categoryName: 'tech et accessoir', images: productImages.tech },
    { name: 'Adaptateur USB-C Multi', description: 'Hub multifonction pour connecter tous vos périphériques sur un seul port USB-C.', price: 45000, stock: 50, categoryName: 'tech et accessoir', images: productImages.tech }
  ],
  'Habibo Group Shop': [
    { name: 'Lamba Oany Floral', description: 'Lamba oany traditionnel en coton avec des motifs floraux colorés, pièce emblématique malagasy.', price: 15000, stock: 50, categoryName: 'textile', images: productImages.vetement },
    { name: 'T-shirt Mada Proud', description: 'T-shirt en coton de qualité arborant des graphismes célébrant la culture de Madagascar.', price: 35000, stock: 50, categoryName: 'textile', images: productImages.vetement },
    { name: 'Pagne Traditionnel', description: 'Tissu polyvalent aux couleurs vives, utilisé comme vêtement ou accessoire décoratif.', price: 20000, stock: 50, categoryName: 'textile', images: productImages.vetement },
    { name: 'Sac de Plage Tissé', description: 'Grand sac résistant et léger en fibres tressées, parfait pour vos sorties à la mer.', price: 30000, stock: 50, categoryName: 'art', images: productImages.sac },
    { name: 'Sandales en Cuir', description: 'Sandales artisanales robustes et confortables faites avec du cuir local de qualité.', price: 45000, stock: 50, categoryName: 'textile', images: productImages.vetement },
    { name: 'Casquette Madagascar', description: 'Accessoire tendance brodé avec les couleurs et symboles de la Grande Île.', price: 25000, stock: 50, categoryName: 'textile', images: productImages.vetement }
  ]
};

async function seedData() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(DB_URI);
    console.log('✅ Connecté à MongoDB\n');

    console.log('🗑️  Suppression des données existantes (sauf admin)...');
    await Promise.all([
      User.deleteMany({ role: { $ne: 'admin' } }),
      Category.deleteMany({}),
      Shop.deleteMany({}),
      Product.deleteMany({})
    ]);
    console.log('✅ Données supprimées\n');

    console.log('👥 Création des utilisateurs...');
    const createdUsers = [];
    for (const u of users) {
      const newUser = await User.create(u);
      createdUsers.push(newUser);
    }
    console.log(`✅ ${createdUsers.length} utilisateurs créés\n`);

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
        status: shopData.status,
        isActive: shopData.isActive,
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
          await Product.create({
            shopId: shop._id,
            name: productData.name,
            description: productData.description,
            price: productData.price,
            category: category ? category._id : null,
            images: productData.images || [],
            stock: {
              quantity: productData.stock,
              lowStockAlert: 5
            },
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

    console.log('✅ Génération terminée avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
  }
}

seedData();


