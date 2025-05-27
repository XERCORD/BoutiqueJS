# **Blazing Fail - Plateforme E-commerce de Cartes à Collectionner**

Découvrez Blazing Fail, votre boutique en ligne spécialisée dans l'univers des cartes à collectionner Pokémon et Yu-Gi-Oh ! Notre plateforme offre une expérience d'achat complète dédiée aux collectionneurs et passionnés de TCG (Trading Card Games).

## **À Propos du Projet**

Cette application web e-commerce a été développée dans le cadre du module Challenge JS du Bachelor 1 Informatique à Ynov. L'objectif était de concevoir une solution complète combinant les technologies frontend (HTML, CSS, JavaScript) et backend (Express.js, MySQL) pour créer une boutique en ligne fonctionnelle et moderne.

## **Caractéristiques Principales**

### **Catalogue Enrichi**
Notre inventaire comprend plus de 50 références soigneusement sélectionnées. Chaque produit dispose d'informations détaillées incluant nom, description complète, tarification, galerie d'images et spécifications techniques (langue, condition, édition, licence).

### **Interface Utilisateur Interactive**
- Présentation visuelle des articles avec nom, prix et aperçu photo
- Animation au survol révélant une image secondaire
- Mise en évidence spéciale des articles en promotion
- Navigation intuitive et responsive

### **Système de Recherche Avancé**
Les utilisateurs peuvent affiner leur recherche grâce à :
- Filtres multicritères selon les caractéristiques produits
- Tri personnalisable par ordre de prix (ascendant/descendant)
- Navigation par catégories

### **Pages Produit Détaillées**
- Descriptions complètes avec système de troncature à 150 caractères
- Bouton d'expansion pour affichage intégral
- Carrousel d'images haute définition
- Spécifications techniques complètes

### **Panier d'Achat Intelligent**
- Ajout/modification des quantités en temps réel
- Suppression d'articles simplifiée
- Processus de commande streamliné
- Mise à jour automatique des stocks après achat

### **Liste de Souhaits**
Fonctionnalité permettant de sauvegarder, consulter et gérer ses produits favoris pour un achat ultérieur.

### **Géolocalisation d'Adresses**
Système intégré de recherche et validation d'adresses de livraison sur le territoire français.

## **Guide d'Installation**

### **Prérequis Système**
- Node.js (version recommandée : LTS)
- npm (gestionnaire de paquets)
- MySQL Server
- WampServer ou équivalent

### **Procédure de Déploiement**

1. **Récupération du Code Source**
   ```bash
   git clone https://github.com/XERCORD/BoutiqueJS.git
   ```

2. **Configuration Base de Données**
   - Démarrer WampServer et accéder à phpMyAdmin
   - Paramètres de connexion :
     - **Utilisateur :** root
     - **Mot de passe :** (laisser vide)
     - **Serveur :** MySQL

3. **Initialisation de la Base**
   - Importer les fichiers SQL situés dans `frontend/assets/`
   - Commencer par exécuter `database.sql`

4. **Lancement du Serveur Backend**
   ```bash
   cd ./backend/
   npm start
   ```

5. **Accès à l'Application**
   - Ouvrir les fichiers HTML directement depuis le navigateur
   - Ou utiliser l'extension Live Server pour un serveur de développement

Votre plateforme Blazing Fail est maintenant opérationnelle !

## **Équipe de Développement**

- **Développeur Principal :** [XERCORD](https://github.com/XERCORD)
- **Développeur Principal :** [Kottah02](https://github.com/Kottah02)

---

*Projet réalisé dans le cadre de la formation Bachelor 1 Informatique - Ynov Campus*