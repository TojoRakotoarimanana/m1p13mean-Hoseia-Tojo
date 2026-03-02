const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
require('dotenv').config();
const { User, Category, Shop, Product, Order } = require('../models');

const DB_URI = process.env.MONGO_URI;

// ────────────────────────────────────────────────────────────
// CATEGORIES
// ────────────────────────────────────────────────────────────

const shopCategories = [
  { name: 'Artisanat & Souvenirs',     description: 'Vannerie, broderie et objets en corne',                    type: 'boutique', icon: 'pi-star' },
  { name: 'Epices & Saveurs',          description: 'Vanille, poivre sauvage et produits locaux',               type: 'boutique', icon: 'pi-shopping-cart' },
  { name: 'Mode & Textile',            description: 'Lamba oany, coton malagasy et pret-a-porter',              type: 'boutique', icon: 'pi-shopping-bag' },
  { name: 'Bien-etre & Huiles',        description: 'Ravintsara, huiles essentielles de Madagascar',            type: 'boutique', icon: 'pi-heart' },
  { name: 'Gastronomie & Restaurants', description: 'Cuisine traditionnelle malagasy et fusion',                type: 'boutique', icon: 'pi-home' },
  { name: 'Informatique & Tech',       description: 'Materiel informatique et accessoires',                     type: 'boutique', icon: 'pi-desktop' },
  { name: 'Librairie & Culture',       description: 'Litterature malagasy et fournitures',                      type: 'boutique', icon: 'pi-book' },
  { name: 'Bijouterie de Luxe',        description: 'Pierres precieuses et bijoux en argent',                   type: 'boutique', icon: 'pi-box' },
  { name: 'Sport & Aventure',          description: 'Equipements de sport et plein air',                        type: 'boutique', icon: 'pi-directions' },
  { name: 'Maison & Deco',             description: 'Meubles en bois precieux et deco artisanale',              type: 'boutique', icon: 'pi-palette' }
];

const productCategories = [
  { name: 'art',              description: "Vannerie, sculptures et objets d'art",     type: 'produit', icon: 'pi-star' },
  { name: 'epices',           description: 'Vanille, poivres et produits locaux',       type: 'produit', icon: 'pi-sun' },
  { name: 'textile',          description: 'Lamba oany et confections malagasy',        type: 'produit', icon: 'pi-user' },
  { name: 'soins',            description: 'Huiles essentielles et bien-etre',          type: 'produit', icon: 'pi-filter' },
  { name: 'cuisine',          description: 'Plats prepares et gastronomie locale',      type: 'produit', icon: 'pi-coffee' },
  { name: 'tech et accessoir',description: 'Materiels tech et accessoires',             type: 'produit', icon: 'pi-desktop' },
  { name: 'livres',           description: 'Litterature et ouvrages de culture',        type: 'produit', icon: 'pi-book' },
  { name: 'bijout',           description: 'Bijoux et pierres precieuses',              type: 'produit', icon: 'pi-heart' },
  { name: 'sport',            description: 'Articles et accessoires de sport',          type: 'produit', icon: 'pi-bolt' },
  { name: 'deco',             description: "Articles de decoration interieure",         type: 'produit', icon: 'pi-info-circle' }
];

// ────────────────────────────────────────────────────────────
// USERS
// Admin kept from seed-data.js; boutiques + clients from seed-mg.js;
// 3 extra Malagasy clients added.
// ────────────────────────────────────────────────────────────

const users = [
  // Admin
  { email: 'admin@mall.com',          password: 'Admin123!',    role: 'admin',    firstName: 'Admin',    lastName: 'Principal' },

  // Boutique owners — active shops (first 5)
  { email: 'lisy@gmail.com',          password: 'Boutique123!', role: 'boutique', phone: '0340000001' },
  { email: 'codal@gmail.com',         password: 'Boutique123!', role: 'boutique', phone: '0340000002' },
  { email: 'homeopharma@gmail.com',   password: 'Boutique123!', role: 'boutique', phone: '0340000003' },
  { email: 'massin@gmail.com',        password: 'Boutique123!', role: 'boutique', phone: '0340000004' },
  { email: 'habibo@gmail.com',        password: 'Boutique123!', role: 'boutique', phone: '0340000005' },

  // Boutique owners — pending shops (last 5)
  { email: 'maki@gmail.com',          password: 'Boutique123!', role: 'boutique', phone: '0320000001' },
  { email: 'kalidas@gmail.com',       password: 'Boutique123!', role: 'boutique', phone: '0320000002' },
  { email: 'librairie@gmail.com',     password: 'Boutique123!', role: 'boutique', phone: '0320000003' },
  { email: 'courts@gmail.com',        password: 'Boutique123!', role: 'boutique', phone: '0320000004' },
  { email: 'ocean5@gmail.com',        password: 'Boutique123!', role: 'boutique', phone: '0320000005' },

  // Clients — from seed-mg.js
  { email: 'rakoto.jean@gmail.com',   password: 'Client123!',   role: 'client',   firstName: 'Jean',      lastName: 'Rakoto',      phone: '0341234567' },
  { email: 'mialy.ravaka@gmail.com',  password: 'Client123!',   role: 'client',   firstName: 'Mialy',     lastName: 'Ravaka',      phone: '0329876543' },

  // Clients — 3 additional Malagasy users
  { email: 'fara.nirina@gmail.com',   password: 'Client123!',   role: 'client',   firstName: 'Fara',      lastName: 'Nirina',      phone: '0338765432' },
  { email: 'hery.andry@gmail.com',    password: 'Client123!',   role: 'client',   firstName: 'Hery',      lastName: 'Andry',       phone: '0345556677' },
  { email: 'voahangy.solo@gmail.com', password: 'Client123!',   role: 'client',   firstName: 'Voahangy',  lastName: 'Solo',        phone: '0321112233' }
];

// ────────────────────────────────────────────────────────────
// SHOPS
// First 5: active (products + orders generated)
// Last 5:  pending (no products, no orders)
// ────────────────────────────────────────────────────────────

const shops = [
  // ── ACTIVE ──────────────────────────────────────────────
  {
    name: 'Lisy Art Gallery',
    description: "La reference de l'artisanat haut de gamme a Antananarivo.",
    categoryName: 'Artisanat & Souvenirs',
    location: { floor: '0', zone: 'A', shopNumber: 'A001' },
    contact: { phone: '0341122334', email: 'lisy@gmail.com' },
    hours: {
      monday:    { open: '09:00', close: '18:00' },
      tuesday:   { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday:  { open: '09:00', close: '18:00' },
      friday:    { open: '09:00', close: '18:00' },
      saturday:  { open: '09:00', close: '17:00' },
      sunday:    { open: '09:00', close: '12:00' }
    },
    status: 'active',
    isActive: true
  },
  {
    name: 'Codal Madagascar',
    description: 'Conserves et produits du terroir malagasy depuis 1950.',
    categoryName: 'Epices & Saveurs',
    location: { floor: '1', zone: 'B', shopNumber: 'B102' },
    contact: { phone: '0341122335', email: 'contact.codal@gmail.com' },
    hours: {
      monday:    { open: '08:30', close: '17:30' },
      tuesday:   { open: '08:30', close: '17:30' },
      wednesday: { open: '08:30', close: '17:30' },
      thursday:  { open: '08:30', close: '17:30' },
      friday:    { open: '08:30', close: '17:30' },
      saturday:  { open: '08:30', close: '12:30' },
      sunday:    { open: 'closed', close: 'closed' }
    },
    status: 'active',
    isActive: true
  },
  {
    name: 'Homeopharma',
    description: 'Laboratoire leader en produits naturels et huiles essentielles.',
    categoryName: 'Bien-etre & Huiles',
    location: { floor: '2', zone: 'C', shopNumber: 'C203' },
    contact: { phone: '0341122336', email: 'info.homeopharma@gmail.com' },
    hours: {
      monday:    { open: '08:00', close: '18:00' },
      tuesday:   { open: '08:00', close: '18:00' },
      wednesday: { open: '08:00', close: '18:00' },
      thursday:  { open: '08:00', close: '18:00' },
      friday:    { open: '08:00', close: '18:00' },
      saturday:  { open: '08:00', close: '17:00' },
      sunday:    { open: '09:00', close: '12:00' }
    },
    status: 'active',
    isActive: true
  },
  {
    name: "Mass'In",
    description: 'Le specialiste de la technologie et du multimedia a Madagascar.',
    categoryName: 'Informatique & Tech',
    location: { floor: '1', zone: 'A', shopNumber: 'A104' },
    contact: { phone: '0341122337', email: 'vente.massin@gmail.com' },
    hours: {
      monday:    { open: '09:00', close: '19:00' },
      tuesday:   { open: '09:00', close: '19:00' },
      wednesday: { open: '09:00', close: '19:00' },
      thursday:  { open: '09:00', close: '19:00' },
      friday:    { open: '09:00', close: '19:00' },
      saturday:  { open: '09:00', close: '19:00' },
      sunday:    { open: '10:00', close: '18:00' }
    },
    status: 'active',
    isActive: true
  },
  {
    name: 'Habibo Group Shop',
    description: 'Distribution de produits de grande consommation et textile.',
    categoryName: 'Mode & Textile',
    location: { floor: '0', zone: 'B', shopNumber: 'B005' },
    contact: { phone: '0341122338', email: 'shop.habibo@gmail.com' },
    hours: {
      monday:    { open: '08:30', close: '18:00' },
      tuesday:   { open: '08:30', close: '18:00' },
      wednesday: { open: '08:30', close: '18:00' },
      thursday:  { open: '08:30', close: '18:00' },
      friday:    { open: '08:30', close: '18:00' },
      saturday:  { open: '08:30', close: '17:00' },
      sunday:    { open: 'closed', close: 'closed' }
    },
    status: 'active',
    isActive: true
  },

  // ── PENDING ─────────────────────────────────────────────
  {
    name: 'Maki Company Tana',
    description: "Pret-a-porter malagasy celebre pour ses collections colorees et ses motifs inspires de la faune et la flore de Madagascar.",
    categoryName: 'Mode & Textile',
    location: { floor: '', zone: '', shopNumber: '' },
    contact: { phone: '0320000001', email: 'maki.company@gmail.com' },
    hours: {
      monday:    { open: '09:00', close: '18:30' },
      tuesday:   { open: '09:00', close: '18:30' },
      wednesday: { open: '09:00', close: '18:30' },
      thursday:  { open: '09:00', close: '18:30' },
      friday:    { open: '09:00', close: '18:30' },
      saturday:  { open: '09:00', close: '18:30' },
      sunday:    { open: '10:00', close: '17:00' }
    },
    status: 'pending',
    isActive: false
  },
  {
    name: 'Bijouterie Kalidas',
    description: "Joaillier de reference specialise dans le travail de l'or, de l'argent et des pierres precieuses de Madagascar depuis des generations.",
    categoryName: 'Bijouterie de Luxe',
    location: { floor: '', zone: '', shopNumber: '' },
    contact: { phone: '0320000002', email: 'kalidas.bijoux@gmail.com' },
    hours: {
      monday:    { open: '09:00', close: '18:00' },
      tuesday:   { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday:  { open: '09:00', close: '18:00' },
      friday:    { open: '09:00', close: '18:00' },
      saturday:  { open: '09:00', close: '17:00' },
      sunday:    { open: 'closed', close: 'closed' }
    },
    status: 'pending',
    isActive: false
  },
  {
    name: 'Librairie Mixte',
    description: "Institution culturelle historique proposant un large choix de litterature malagasy, d'ouvrages scolaires et de presse internationale.",
    categoryName: 'Librairie & Culture',
    location: { floor: '', zone: '', shopNumber: '' },
    contact: { phone: '0320000003', email: 'librairie.mixte@gmail.com' },
    hours: {
      monday:    { open: '08:00', close: '17:30' },
      tuesday:   { open: '08:00', close: '17:30' },
      wednesday: { open: '08:00', close: '17:30' },
      thursday:  { open: '08:00', close: '17:30' },
      friday:    { open: '08:00', close: '17:30' },
      saturday:  { open: '08:00', close: '12:00' },
      sunday:    { open: 'closed', close: 'closed' }
    },
    status: 'pending',
    isActive: false
  },
  {
    name: 'Courts Madagascar',
    description: "Expert en ameublement, electromenager et decoration d'interieur, offrant des solutions modernes pour toute la maison.",
    categoryName: 'Maison & Deco',
    location: { floor: '', zone: '', shopNumber: '' },
    contact: { phone: '0320000004', email: 'courts.mada@gmail.com' },
    hours: {
      monday:    { open: '09:00', close: '19:00' },
      tuesday:   { open: '09:00', close: '19:00' },
      wednesday: { open: '09:00', close: '19:00' },
      thursday:  { open: '09:00', close: '19:00' },
      friday:    { open: '09:00', close: '19:00' },
      saturday:  { open: '09:00', close: '19:00' },
      sunday:    { open: '10:00', close: '18:00' }
    },
    status: 'pending',
    isActive: false
  },
  {
    name: 'Ocean 5 Sport',
    description: "Boutique specialisee dans les equipements de sports nautiques, plongee et plein air pour les passionnes d'aventure a Madagascar.",
    categoryName: 'Sport & Aventure',
    location: { floor: '', zone: '', shopNumber: '' },
    contact: { phone: '0320000005', email: 'ocean5.sport@gmail.com' },
    hours: {
      monday:    { open: '09:00', close: '19:00' },
      tuesday:   { open: '09:00', close: '19:00' },
      wednesday: { open: '09:00', close: '19:00' },
      thursday:  { open: '09:00', close: '19:00' },
      friday:    { open: '09:00', close: '19:00' },
      saturday:  { open: '09:00', close: '19:00' },
      sunday:    { open: '10:00', close: '18:00' }
    },
    status: 'pending',
    isActive: false
  }
];

// ────────────────────────────────────────────────────────────
// PRODUCT IMAGES
// ────────────────────────────────────────────────────────────

const productImages = {
  sac:      ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800'],
  vanille:  ['https://images.unsplash.com/photo-1596435017947-8a604212903e?w=800', 'https://images.unsplash.com/photo-1622205313162-be1d5712a43f?w=800'],
  vetement: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800'],
  huile:    ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800', 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800'],
  plat:     ['https://images.unsplash.com/photo-1562059390-a761a084768e?w=800', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800'],
  tech:     ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'],
  livre:    ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800'],
  bijou:    ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800'],
  sport:    ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800'],
  deco:     ['https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800'],
  casque:   ['https://images.unsplash.com/photo-1599669454699-248893623440?w=800', 'https://images.unsplash.com/photo-1577174881658-0f30157a005b?w=800'],
  savon:    ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800'],
  pagne:    ['https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800', 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800'],
  miel:     ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800', 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800']
};

// ────────────────────────────────────────────────────────────
// PRODUCTS (active shops only)
// isPromotion / discount added on selected items (seed-data.js style)
// Prices in ariary (integers)
// ────────────────────────────────────────────────────────────

const products = {
  'Lisy Art Gallery': [
    {
      name: 'Panier Raphia Brode',
      description: 'Panier traditionnel malagasy en raphia, brode a la main avec des motifs floraux uniques.',
      price: 45000, stock: 50, categoryName: 'art',
      isPromotion: false,
      images: productImages.sac
    },
    {
      name: 'Statue Bois de Rose',
      description: 'Sculpture artisanale en bois de rose precieux representant la vie quotidienne malagasy.',
      price: 120000, stock: 30, categoryName: 'art',
      isPromotion: true, discount: 15,
      images: productImages.deco
    },
    {
      name: 'Pochette en Corne',
      description: 'Pochette elegante faconnee en corne de zebu poli, accessoire de mode authentique.',
      price: 35000, stock: 45, categoryName: 'art',
      isPromotion: false,
      images: productImages.deco
    },
    {
      name: 'Nappe Brodee Main',
      description: "Grande nappe de table avec broderies ajourees traditionnelles d'Antsirabe.",
      price: 85000, stock: 20, categoryName: 'art',
      isPromotion: true, discount: 20,
      images: productImages.deco
    },
    {
      name: 'Chapeau de Soleil',
      description: 'Chapeau a large bord en fibres naturelles tressees, ideal pour le climat tropical.',
      price: 25000, stock: 60, categoryName: 'art',
      isPromotion: false,
      images: productImages.sac
    },
    {
      name: 'Vide-poches en Bois',
      description: 'Petit recipient decoratif en bois sculpte pour ranger vos petits objets avec style.',
      price: 15000, stock: 80, categoryName: 'art',
      isPromotion: false,
      images: productImages.deco
    }
  ],

  'Codal Madagascar': [
    {
      name: 'Confiture de Goyave de Chine',
      description: 'Confiture artisanale preparee avec des goyaves de chine fraiches des hauts plateaux.',
      price: 12000, stock: 100, categoryName: 'cuisine',
      isPromotion: false,
      images: productImages.plat
    },
    {
      name: 'Poivre Sauvage Voatsiperifery',
      description: "Poivre rare recolte en foret, aux aromes boises et agrumes, embleme de Madagascar.",
      price: 18000, stock: 70, categoryName: 'epices',
      isPromotion: true, discount: 10,
      images: productImages.vanille
    },
    {
      name: 'Pate de Piment Rouge',
      description: 'Condiment pimente traditionnel, indispensable pour relever tous vos plats malagasy.',
      price: 8000, stock: 120, categoryName: 'cuisine',
      isPromotion: false,
      images: productImages.plat
    },
    {
      name: 'Miel de Foret 500g',
      description: 'Miel pur et naturel recolte dans les forets primaires, gout intense et boise.',
      price: 22000, stock: 60, categoryName: 'cuisine',
      isPromotion: false,
      images: productImages.miel
    },
    {
      name: 'Curcuma Bio',
      description: 'Poudre de curcuma biologique cultive localement, riche en saveurs et bienfaits.',
      price: 10000, stock: 90, categoryName: 'epices',
      isPromotion: true, discount: 25,
      images: productImages.plat
    },
    {
      name: 'Achards de Legumes',
      description: 'Legumes croquants marines au vinaigre et epices, accompagnement parfait pour le riz.',
      price: 9000, stock: 110, categoryName: 'cuisine',
      isPromotion: false,
      images: productImages.plat
    }
  ],

  'Homeopharma': [
    {
      name: 'Huile de Ravintsara Pure',
      description: 'Huile essentielle 100% pure de Ravintsara, reconnue pour ses proprietes antivirales exceptionnelles.',
      price: 25000, stock: 80, categoryName: 'soins',
      isPromotion: false,
      images: productImages.huile
    },
    {
      name: 'Baume Froid Soulageant',
      description: 'Baume apaisant aux extraits de plantes medicinales pour soulager les douleurs musculaires.',
      price: 15000, stock: 60, categoryName: 'soins',
      isPromotion: true, discount: 20,
      images: productImages.huile
    },
    {
      name: 'Tisane Detox Mada',
      description: "Melange de plantes endemiques pour purifier l'organisme et faciliter la digestion.",
      price: 12000, stock: 100, categoryName: 'soins',
      isPromotion: false,
      images: productImages.huile
    },
    {
      name: 'Huile de Massage Ylang-Ylang',
      description: "Huile relaxante parfumee a l'Ylang-Ylang de Nosy Be pour un moment de bien-etre total.",
      price: 30000, stock: 50, categoryName: 'soins',
      isPromotion: false,
      images: productImages.huile
    },
    {
      name: 'Savon Artisanal Coco',
      description: "Savon doux surgras a l'huile de coco naturelle pour une peau hydratee et nourrie.",
      price: 5000, stock: 150, categoryName: 'soins',
      isPromotion: true, discount: 15,
      images: productImages.savon
    },
    {
      name: 'Shampooing aux Plantes',
      description: 'Soin capillaire naturel formule avec des extraits vegetaux pour fortifier les cheveux.',
      price: 18000, stock: 70, categoryName: 'soins',
      isPromotion: false,
      images: productImages.huile
    }
  ],

  "Mass'In": [
    {
      name: 'Casque Bluetooth JBL',
      description: 'Casque sans fil haute performance avec reduction de bruit pour une experience sonore immersive.',
      price: 250000, stock: 25, categoryName: 'tech et accessoir',
      isPromotion: false,
      images: productImages.casque
    },
    {
      name: 'Souris Gamer RGB',
      description: 'Souris optique haute precision avec eclairage LED personnalisable pour les passionnes de jeux.',
      price: 85000, stock: 40, categoryName: 'tech et accessoir',
      isPromotion: true, discount: 10,
      images: productImages.tech
    },
    {
      name: 'Clavier AZERTY Sans Fil',
      description: 'Clavier ergonomique sans fil pour une frappe confortable et une liberte de mouvement totale.',
      price: 120000, stock: 30, categoryName: 'tech et accessoir',
      isPromotion: false,
      images: productImages.tech
    },
    {
      name: 'Enceinte Portable Sony',
      description: 'Enceinte Bluetooth compacte et etanche avec un son puissant pour vos deplacements.',
      price: 350000, stock: 15, categoryName: 'tech et accessoir',
      isPromotion: true, discount: 12,
      images: productImages.tech
    },
    {
      name: 'Powerbank 20000mAh',
      description: 'Batterie externe haute capacite pour recharger vos appareils plusieurs fois en toute autonomie.',
      price: 95000, stock: 50, categoryName: 'tech et accessoir',
      isPromotion: false,
      images: productImages.tech
    },
    {
      name: 'Adaptateur USB-C Multi',
      description: 'Hub multifonction pour connecter tous vos peripheriques sur un seul port USB-C.',
      price: 45000, stock: 60, categoryName: 'tech et accessoir',
      isPromotion: false,
      images: productImages.tech
    }
  ],

  'Habibo Group Shop': [
    {
      name: 'Lamba Oany Floral',
      description: 'Lamba oany traditionnel en coton avec des motifs floraux colores, piece emblematique malagasy.',
      price: 15000, stock: 80, categoryName: 'textile',
      isPromotion: false,
      images: productImages.pagne
    },
    {
      name: 'T-shirt Mada Proud',
      description: 'T-shirt en coton de qualite arborant des graphismes celebrant la culture de Madagascar.',
      price: 35000, stock: 60, categoryName: 'textile',
      isPromotion: true, discount: 20,
      images: productImages.vetement
    },
    {
      name: 'Pagne Traditionnel',
      description: 'Tissu polyvalent aux couleurs vives, utilise comme vetement ou accessoire decoratif.',
      price: 20000, stock: 90, categoryName: 'textile',
      isPromotion: false,
      images: productImages.pagne
    },
    {
      name: 'Sac de Plage Tisse',
      description: 'Grand sac resistant et leger en fibres tressees, parfait pour vos sorties a la mer.',
      price: 30000, stock: 50, categoryName: 'art',
      isPromotion: false,
      images: productImages.sac
    },
    {
      name: 'Sandales en Cuir',
      description: 'Sandales artisanales robustes et confortables faites avec du cuir local de qualite.',
      price: 45000, stock: 40, categoryName: 'textile',
      isPromotion: true, discount: 15,
      images: productImages.vetement
    },
    {
      name: 'Casquette Madagascar',
      description: 'Accessoire tendance brode avec les couleurs et symboles de la Grande Ile.',
      price: 25000, stock: 70, categoryName: 'textile',
      isPromotion: false,
      images: productImages.vetement
    }
  ]
};

// ────────────────────────────────────────────────────────────
// DELIVERY ADDRESSES (Malagasy cities)
// ────────────────────────────────────────────────────────────

const clientAddresses = [
  { street: '12 Rue Andrianampoinimerina', city: 'Antananarivo', zipCode: '101', country: 'Madagascar' },
  { street: '45 Avenue de l\'Independance', city: 'Antananarivo',  zipCode: '101', country: 'Madagascar' },
  { street: '8 Rue du Commerce',            city: 'Fianarantsoa',  zipCode: '301', country: 'Madagascar' },
  { street: '23 Bd Philibert Tsiranana',    city: 'Toamasina',     zipCode: '501', country: 'Madagascar' },
  { street: '5 Rue Pasteur',               city: 'Mahajanga',     zipCode: '401', country: 'Madagascar' }
];

const paymentMethods  = ['cash', 'card', 'mobile_money'];
const deliveryMethods = ['pickup', 'delivery'];

// ────────────────────────────────────────────────────────────
// SEED FUNCTION
// ────────────────────────────────────────────────────────────

async function seedData() {
  try {
    console.log('Connexion a MongoDB...');
    await mongoose.connect(DB_URI);
    console.log('Connecte a MongoDB\n');

    // ── Deletion — preserve existing admin account ────────
    console.log('Suppression des donnees existantes (sauf admin)...');
    await Promise.all([
      User.deleteMany({ role: { $ne: 'admin' } }),
      Category.deleteMany({}),
      Shop.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({})
    ]);
    console.log('Donnees supprimees\n');

    // ── Users ─────────────────────────────────────────────
    console.log('Creation des utilisateurs...');
    const createdUsers = [];
    for (const userData of users) {
      const newUser = await User.create(userData);
      createdUsers.push(newUser);
    }
    console.log(`${createdUsers.length} utilisateurs crees\n`);

    const adminUser     = createdUsers.find(u => u.role === 'admin');
    const boutiqueUsers = createdUsers.filter(u => u.role === 'boutique');
    const clientUsers   = createdUsers.filter(u => u.role === 'client');

    // ── Categories ────────────────────────────────────────
    console.log('Creation des categories...');
    const allCategories   = [...shopCategories, ...productCategories];
    const createdCategories = await Category.insertMany(allCategories);
    console.log(`${createdCategories.length} categories creees\n`);

    // ── Shops ─────────────────────────────────────────────
    console.log('Creation des boutiques...');
    const createdShops = [];
    for (let i = 0; i < shops.length; i++) {
      const shopData = shops[i];
      const category = createdCategories.find(
        c => c.name === shopData.categoryName && c.type === 'boutique'
      );
      if (!category) {
        throw new Error(`Categorie boutique introuvable: "${shopData.categoryName}" pour la boutique "${shopData.name}"`);
      }
      const shop = await Shop.create({
        userId:      boutiqueUsers[i]._id,
        name:        shopData.name,
        description: shopData.description,
        category:    category._id,
        location:    shopData.location,
        contact:     shopData.contact,
        hours:       shopData.hours,
        status:      shopData.status,
        isActive:    shopData.isActive,
        statistics: {
          totalOrders:   Math.floor(Math.random() * 100),
          totalRevenue:  Math.floor(Math.random() * 50000000),
          totalProducts: 0
        }
      });
      createdShops.push(shop);
    }
    console.log(`${createdShops.length} boutiques creees\n`);

    // Active shops only (first 5) — products and orders
    const activeShops = createdShops.filter(s => s.isActive);

    // ── Products (active shops only) ──────────────────────
    console.log('Creation des produits...');
    let totalProducts = 0;
    for (const shop of activeShops) {
      const shopProducts = products[shop.name];
      if (!shopProducts) continue;

      for (const productData of shopProducts) {
        const category = createdCategories.find(
          c => c.name === productData.categoryName && c.type === 'produit'
        );
        const promoStartDate = productData.isPromotion
          ? new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
          : undefined;
        const promoEndDate = productData.isPromotion
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          : undefined;

        await Product.create({
          shopId:        shop._id,
          name:          productData.name,
          description:   productData.description,
          price:         productData.price,
          originalPrice: productData.isPromotion ? productData.price : undefined,
          discount:      productData.discount || 0,
          promoStartDate,
          promoEndDate,
          category:      category ? category._id : null,
          images:        productData.images || [],
          stock: {
            quantity:     productData.stock,
            lowStockAlert: 5
          },
          isPromotion: productData.isPromotion || false,
          isActive:    true,
          statistics: {
            views: Math.floor(Math.random() * 500),
            sold:  Math.floor(Math.random() * 50)
          }
        });
        totalProducts++;
      }

      shop.statistics.totalProducts = shopProducts.length;
      await shop.save();
    }
    console.log(`${totalProducts} produits crees\n`);

    // ── Orders — daily distribution (last 30 days) ────────
    console.log('Creation des commandes...');

    // Build shop -> products map (active shops only)
    const shopProductMap = [];
    for (const shop of activeShops) {
      const prods = await Product.find({ shopId: shop._id, isActive: true });
      if (prods.length > 0) shopProductMap.push({ shop, products: prods });
    }

    const ordersToCreate = [];
    let orderSeq = 1;

    // Status distribution helpers
    // Each day we pick 3-8 orders; roughly 60% completed, rest distributed
    for (let daysAgo = 29; daysAgo >= 0; daysAgo--) {
      const ordersThisDay = Math.floor(Math.random() * 6) + 3; // 3..8

      for (let i = 0; i < ordersThisDay; i++) {
        const client    = clientUsers[i % clientUsers.length];
        const shopEntry = shopProductMap[Math.floor(Math.random() * shopProductMap.length)];

        // Build the order date: N days ago, random hour 08:00-20:59
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() - daysAgo);
        orderDate.setHours(
          Math.floor(Math.random() * 13) + 8,
          Math.floor(Math.random() * 60),
          Math.floor(Math.random() * 60),
          0
        );

        // 1-3 products from same shop
        const shuffled      = [...shopEntry.products].sort(() => Math.random() - 0.5);
        const selectedProds = shuffled.slice(0, Math.min(Math.floor(Math.random() * 3) + 1, shuffled.length));

        const items = selectedProds.map(p => {
          const qty = Math.floor(Math.random() * 2) + 1;
          return {
            productId: p._id,
            shopId:    shopEntry.shop._id,
            name:      p.name,
            price:     p.price,
            quantity:  qty,
            subtotal:  p.price * qty,
            image:     p.images?.[0]
          };
        });
        const totalAmount = items.reduce((s, it) => s + it.subtotal, 0);

        // Status: ~60% completed, the rest distributed across other states.
        // Older days skew more toward completed; recent days have more in-progress.
        let status;
        const rand = Math.random();
        if (daysAgo >= 7) {
          // Older orders — mostly resolved
          if      (rand < 0.65) status = 'completed';
          else if (rand < 0.75) status = 'cancelled';
          else if (rand < 0.85) status = 'pending';
          else if (rand < 0.92) status = 'confirmed';
          else if (rand < 0.97) status = 'preparing';
          else                  status = 'ready';
        } else {
          // Recent orders — more in-progress
          if      (rand < 0.40) status = 'completed';
          else if (rand < 0.55) status = 'pending';
          else if (rand < 0.68) status = 'confirmed';
          else if (rand < 0.80) status = 'preparing';
          else if (rand < 0.90) status = 'ready';
          else                  status = 'cancelled';
        }

        const isCompleted    = status === 'completed';
        const paymentMethod  = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        const deliveryMethod = deliveryMethods[Math.floor(Math.random() * deliveryMethods.length)];
        const clientAddrIdx  = clientUsers.indexOf(client) % clientAddresses.length;
        const clientAddr     = clientAddresses[clientAddrIdx];
        const paidAt         = isCompleted ? new Date(orderDate.getTime() + 3_600_000) : undefined;

        ordersToCreate.push({
          orderNumber: `ORD-${Date.now() + orderSeq}-${String(orderSeq++).padStart(4, '0')}`,
          customerId:  client._id,
          items,
          totalAmount,
          status,
          deliveryInfo: {
            method:  deliveryMethod,
            address: deliveryMethod === 'delivery' ? clientAddr : {},
            phone:   client.phone || '034 00 000 00'
          },
          paymentInfo: {
            method: paymentMethod,
            status: isCompleted ? 'paid' : (status === 'cancelled' ? 'failed' : 'pending'),
            paidAt
          },
          shopOrders: [{
            shopId:   shopEntry.shop._id,
            status,
            items:    selectedProds.map(p => p._id),
            subtotal: totalAmount,
            statusHistory: [
              { status: 'pending', changedAt: orderDate },
              ...(status !== 'pending'
                ? [{ status, changedAt: new Date(orderDate.getTime() + 1_800_000) }]
                : [])
            ]
          }],
          createdAt: orderDate,
          updatedAt: orderDate
        });
      }
    }

    // Use native driver insertMany to preserve past timestamps (bypasses Mongoose auto-timestamps)
    await Order.collection.insertMany(ordersToCreate);

    const totalOrdersCreated     = ordersToCreate.length;
    const completedOrdersCreated = ordersToCreate.filter(o => o.status === 'completed').length;
    const totalRevenueSeeded     = ordersToCreate
      .filter(o => o.status === 'completed')
      .reduce((s, o) => s + o.totalAmount, 0);

    console.log(`${totalOrdersCreated} commandes creees`);
    console.log(`   - Completees (revenus) : ${completedOrdersCreated}`);
    console.log(`   - Revenu total seede   : ${Math.round(totalRevenueSeeded).toLocaleString('fr-MG')} Ar\n`);

    // ── Summary ───────────────────────────────────────────
    console.log('RESUME DE LA GENERATION:');
    console.log('=======================================');
    console.log(`Utilisateurs: ${createdUsers.length}`);
    console.log(`   - Admin   : 1 (${adminUser.email})`);
    console.log(`   - Boutiques: ${boutiqueUsers.length} (5 actives, 5 en attente)`);
    console.log(`   - Clients : ${clientUsers.length}`);
    console.log(`\nCategories: ${createdCategories.length}`);
    console.log(`   - Boutiques: ${shopCategories.length}`);
    console.log(`   - Produits : ${productCategories.length}`);
    console.log(`\nBoutiques: ${createdShops.length} (${activeShops.length} actives, ${createdShops.length - activeShops.length} en attente)`);
    console.log(`Produits : ${totalProducts} (repartis dans les ${activeShops.length} boutiques actives)`);
    console.log(`Commandes: ${totalOrdersCreated} sur 30 jours (${completedOrdersCreated} completees / revenus visibles)`);
    console.log('=======================================\n');

    console.log('COMPTES DE TEST:');
    console.log('=======================================');
    console.log('Admin:');
    console.log('  Email       : admin@mall.com');
    console.log('  Mot de passe: Admin123!');
    console.log('\nBoutiques actives:');
    console.log('  lisy@gmail.com        / Boutique123!  -> Lisy Art Gallery');
    console.log('  codal@gmail.com       / Boutique123!  -> Codal Madagascar');
    console.log('  homeopharma@gmail.com / Boutique123!  -> Homeopharma');
    console.log('  massin@gmail.com      / Boutique123!  -> Mass\'In');
    console.log('  habibo@gmail.com      / Boutique123!  -> Habibo Group Shop');
    console.log('\nBoutiques en attente:');
    console.log('  maki@gmail.com / kalidas@gmail.com / librairie@gmail.com / courts@gmail.com / ocean5@gmail.com');
    console.log('\nClients:');
    console.log('  rakoto.jean@gmail.com   / Client123!');
    console.log('  mialy.ravaka@gmail.com  / Client123!');
    console.log('  fara.nirina@gmail.com   / Client123!');
    console.log('  hery.andry@gmail.com    / Client123!');
    console.log('  voahangy.solo@gmail.com / Client123!');
    console.log('=======================================\n');

    console.log('Generation terminee avec succes!');

  } catch (error) {
    console.error('Erreur lors de la generation:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connexion fermee');
  }
}

seedData();
