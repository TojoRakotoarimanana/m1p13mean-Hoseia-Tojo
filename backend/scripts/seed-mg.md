# 🇲🇬 Mall Madagascar - Données de Test (Seed)

Ce document récapitule les données insérées en base de données par le script `seed-mg.js`.

---

## � CATÉGORIES

### 🏪 Catégories de Boutiques
| Nom | Description | Icône |
| :--- | :--- | :--- |
| **Artisanat & Souvenirs** | Vannerie, broderie et objets en corne | `pi-star` |
| **Épices & Saveurs** | Vanille, poivre sauvage et produits locaux | `pi-shopping-cart` |
| **Mode & Textile** | Lamba oany, coton malagasy et prêt-à-porter | `pi-shopping-bag` |
| **Bien-être & Huiles** | Ravintsara, huiles essentielles de Madagascar | `pi-heart` |
| **Gastronomie & Restaurants** | Cuisine traditionnelle malagasy et fusion | `pi-home` |
| **Informatique & Tech** | Matériel informatique et accessoires | `pi-desktop` |
| **Librairie & Culture** | Littérature malagasy et fournitures | `pi-book` |
| **Bijouterie de Luxe** | Pierres précieuses et bijoux en argent | `pi-box` |
| **Sport & Aventure** | Équipements de sport et plein air | `pi-directions` |
| **Maison & Déco** | Meubles en bois précieux et déco artisanale | `pi-palette` |

### 📦 Catégories de Produits
| Nom (ID) | Description |
| :--- | :--- |
| **art** | Vannerie, sculptures et objets d'art |
| **epices** | Vanille, poivres et produits locaux |
| **textile** | Lamba oany et confections malagasy |
| **soins** | Huiles essentielles et bien-être |
| **cuisine** | Plats préparés et gastronomie locale |
| **tech et accessoir** | Informatique et périphériques |
| **livres** | Littérature et ouvrages de culture |
| **bijout** | Bijoux et pierres précieuses |
| **sport** | Articles et accessoires de sport |
| **deco** | Articles de décoration intérieure |

---

## �👤 COMPTES UTILISATEURS

### 🔑 Administrateur (Existant)
*   **Email**: `admin@mall.mg` (ou celui défini initialement)
*   **Mot de passe**: `Admin123!` (inchangé par le script)

### 🛍️ Boutiques Actives (Gérants)
*   **Mot de passe commun**: `Boutique123!`

| Enseigne | Email | Téléphone |
| :--- | :--- | :--- |
| **Lisy Art Gallery** | `lisy@gmail.com` | `0340000001` |
| **Codal Madagascar** | `codal@gmail.com` | `0340000002` |
| **Homeopharma** | `homeopharma@gmail.com` | `0340000003` |
| **Mass'In** | `massin@gmail.com` | `0340000004` |
| **Habibo Group Shop** | `habibo@gmail.com` | `0340000005` |

### ⏳ Boutiques en Attente (Candidats)
*   **Mot de passe commun**: `Boutique123!`
*   **Note**: Ces comptes sont créés avec `isActive: false`.

| Enseigne | Email | Téléphone |
| :--- | :--- | :--- |
| **Maki Company Tana** | `maki.company@gmail.com` | `0320000001` |
| **Bijouterie Kalidas** | `kalidas.bijoux@gmail.com` | `0320000002` |
| **Librairie Mixte** | `librairie.mixte@gmail.com` | `0320000003` |
| **Courts Madagascar** | `courts.mada@gmail.com` | `0320000004` |
| **Ocean 5 Sport** | `ocean5.sport@gmail.com` | `0320000005` |

### 👥 Clients (Testeurs)
*   **Mot de passe commun**: `Client123!`

| Nom | Email | Téléphone |
| :--- | :--- | :--- |
| **Jean Rakoto** | `rakoto.jean@gmail.com` | `0341234567` |
| **Mialy Ravaka** | `mialy.ravaka@gmail.com` | `0329876543` |

---

## 🏪 BOUTIQUES ET EMPLACEMENTS

| Nom | Catégorie | Étage | Zone | N° | Statut |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Lisy Art Gallery** | Artisanat & Souvenirs | 0 | A | A001 | Active |
| **Codal Madagascar** | Épices & Saveurs | 1 | B | B102 | Active |
| **Homeopharma** | Bien-être & Huiles | 2 | C | C203 | Active |
| **Mass'In** | Informatique & Tech | 1 | A | A104 | Active |
| **Habibo Group Shop** | Mode & Textile | 0 | B | B005 | Active |
| **Maki Company Tana** | Mode & Textile | - | - | - | En attente |
| **Bijouterie Kalidas** | Bijouterie de Luxe | - | - | - | En attente |
| **Librairie Mixte** | Librairie & Culture | - | - | - | En attente |
| **Courts Madagascar** | Décoration d'Intérieur | - | - | - | En attente |
| **Ocean 5 Sport** | Sport & Aventure | - | - | - | En attente |

---

## 📦 LISTE COMPLÈTE DES PRODUITS

### 🏺 Lisy Art Gallery
| Produit | Description | Prix | Catégorie |
| :--- | :--- | :--- | :--- |
| **Panier Raphia Brodé** | Panier traditionnel malagasy en raphia, brodé à la main avec des motifs floraux uniques. | 45 000 Ar | art |
| **Statue Bois de Rose** | Sculpture artisanale en bois de rose précieux représentant la vie quotidienne malagasy. | 120 000 Ar | art |
| **Pochette en Corne** | Pochette élégante façonnée en corne de zébu poli, accessoire de mode authentique. | 35 000 Ar | art |
| **Nappe Brodée Main** | Grande nappe de table avec broderies ajourées traditionnelles d'Antsirabe. | 85 000 Ar | art |
| **Chapeau de Soleil** | Chapeau à large bord en fibres naturelles tressées, idéal pour le climat tropical. | 25 000 Ar | art |
| **Vide-poches en Bois** | Petit récipient décoratif en bois sculpté pour ranger vos petits objets avec style. | 15 000 Ar | art |

### 🌶️ Codal Madagascar
| Produit | Description | Prix | Catégorie |
| :--- | :--- | :--- | :--- |
| **Confiture de Goyave de Chine** | Confiture artisanale préparée avec des goyaves de chine fraîches des hauts plateaux. | 12 000 Ar | cuisine |
| **Poivre Sauvage Voatsiperifery** | Poivre rare récolté en forêt, aux arômes boisés et agrumes, emblème de Madagascar. | 18 000 Ar | epices |
| **Pâte de Piment Rouge** | Condiment pimenté traditionnel, indispensable pour relever tous vos plats malagasy. | 8 000 Ar | cuisine |
| **Miel de Foret 500g** | Miel pur et naturel récolté dans les forêts primaires, goût intense et boisé. | 22 000 Ar | cuisine |
| **Curcuma Bio** | Poudre de curcuma biologique cultivé localement, riche en saveurs et bienfaits. | 10 000 Ar | epices |
| **Achards de Légumes** | Légumes croquants marinés au vinaigre et épices, accompagnement parfait pour le riz. | 9 000 Ar | cuisine |

### 🌿 Homeopharma
| Produit | Description | Prix | Catégorie |
| :--- | :--- | :--- | :--- |
| **Huile de Ravintsara Pure** | Huile essentielle 100% pure de Ravintsara, reconnue pour ses propriétés antivirales exceptionnelles. | 25 000 Ar | soins |
| **Baume Froid Soulageant** | Baume apaisant aux extraits de plantes médicinales pour soulager les douleurs musculaires. | 15 000 Ar | soins |
| **Tisane Détox Mada** | Mélange de plantes endémiques pour purifier l'organisme et faciliter la digestion. | 12 000 Ar | soins |
| **Huile de Massage Ylang-Ylang** | Huile relaxante parfumée à l'Ylang-Ylang de Nosy Be pour un moment de bien-être total. | 30 000 Ar | soins |
| **Savon Artisanal Coco** | Savon doux surgras à l'huile de coco naturelle pour une peau hydratée et nourrie. | 5 000 Ar | soins |
| **Shampooing aux Plantes** | Soin capillaire naturel formulé avec des extraits végétaux pour fortifier les cheveux. | 18 000 Ar | soins |

### 💻 Mass'In
| Produit | Description | Prix | Catégorie |
| :--- | :--- | :--- | :--- |
| **Casque Bluetooth JBL** | Casque sans fil haute performance avec réduction de bruit pour une expérience sonore immersive. | 250 000 Ar | tech et accessoir |
| **Souris Gamer RGB** | Souris optique haute précision avec éclairage LED personnalisable pour les passionnés de jeux. | 85 000 Ar | tech et accessoir |
| **Clavier AZERTY Sans Fil** | Clavier ergonomique sans fil pour une frappe confortable et une liberté de mouvement totale. | 120 000 Ar | tech et accessoir |
| **Enceinte Portable Sony** | Enceinte Bluetooth compacte et étanche avec un son puissant pour vos déplacements. | 350 000 Ar | tech et accessoir |
| **Powerbank 20000mAh** | Batterie externe haute capacité pour recharger vos appareils plusieurs fois en toute autonomie. | 95 000 Ar | tech et accessoir |
| **Adaptateur USB-C Multi** | Hub multifonction pour connecter tous vos périphériques sur un seul port USB-C. | 45 000 Ar | tech et accessoir |

### 👕 Habibo Group Shop
| Produit | Description | Prix | Catégorie |
| :--- | :--- | :--- | :--- |
| **Lamba Oany Floral** | Lamba oany traditionnel en coton avec des motifs floraux colorés, pièce emblématique malagasy. | 15 000 Ar | textile |
| **T-shirt Mada Proud** | T-shirt en coton de qualité arborant des graphismes célébrant la culture de Madagascar. | 35 000 Ar | textile |
| **Pagne Traditionnel** | Tissu polyvalent aux couleurs vives, utilisé comme vêtement ou accessoire décoratif. | 20 000 Ar | textile |
| **Sac de Plage Tissé** | Grand sac résistant et léger en fibres tressées, parfait pour vos sorties à la mer. | 30 000 Ar | art |
| **Sandales en Cuir** | Sandales artisanales robustes et confortables faites avec du cuir local de qualité. | 45 000 Ar | textile |
| **Casquette Madagascar** | Accessoire tendance brodé avec les couleurs et symboles de la Grande Île. | 25 000 Ar | textile |

---

## 📊 RÉSUMÉ GLOBAL
*   **Total Utilisateurs**: 13 (1 Admin + 2 Clients + 5 Gérants Actifs + 5 Candidats)
*   **Total Catégories**: 20 (10 pour boutiques / 10 pour produits)
*   **Total Boutiques**: 10
*   **Total Produits**: 30 (6 par boutique active)
*   **Domaine Emails**: 100% `@gmail.com`
