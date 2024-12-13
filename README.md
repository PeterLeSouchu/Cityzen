# 🌟 [Projet Cityzen](https://cityzen.up.railway.app)

**Cityzen est une application web réalisée en groupe dans le cadre du projet de fin de formation à l'école O'clock. Cette dernière a été conçue pour informer sur les activités locales. Son fonctionnement est simple : l’utilisateur saisit le nom d’une ville, et l’application lui propose une liste des activités disponibles dans cette localité, accompagnée d’une carte interactive pour une navigation facile.**

L'application est accessible à l'adresse suivante: https://cityzen.up.railway.app/

![Screenshot de l'application](/assets/screenshot-home.png)


## ⭐ Fonctionnalitées de l'application :

- Créer un compte utilisateur
- Se connecter
- Rechercher une ville pour afficher ses activités
- Accéder à la page détail d'une activité
- Ajouter / Supprimer / modifier une activité
- Ajouter ou supprimer une activité de ses favoris
- Mofifier son pseudo
- Modifier son mot de passe
- Supprimer son compte

**Ce repo contient le code back-end de Cityzen et est dédié à la partie technique de ses fonctionnalités, si vous souhaitez voir la partie technique du front-end [cliquez-ici](https://github.com/PeterLeSouchu/Cityzen-front)**

## 🛠️ Fonctionnement du back-end :

### ⚙️ 1. Architecture

- Mise en place d'un serveur statefull Node.js en Express avec une API REST CRUD.
- Les routes API utilisent des middlewares pour effectuer les vérifications, puis s'appuient sur des controllers qui gèrent la logique métier, interagissent avec des data mappers pour accéder à la base de données et renvoient une réponse au format JSON.

### 🔒 2. Sécurité

- Utilisation d'Express-session pour gérer la session utilisateur et protéger  les routes privées.
- Mise en place d'un middleware express-session qui vérifie si une session est ouverte pour un utilisateur en regardant le cookie (qui contient l'id de la session) associé à la session.
- Utilisation d'un CSRF token pour les actions les plus sensibles.
- Mise en place d'un middleware CSRF qui regarde la présence du token dans les headers.
- Requêtes SQL préparées pour se prémunir des injections SQL.
- Schéma de validation de formulaire avec JOI.
- Hashage du mot de passe avec Bcrypt.
- Inscription par 2FA avec envoi d'un code OTP par mail.
- Vérification intra-controller de l'utilisateur pour certaines actions sensibles ( _Par exemple quand un utilisateur supprime une activité, on va utiliser l'id utilisateur de la session pour voir si l'utilisateur qui souhaite supprimer l'activité en est l'auteur_ ).

### ❌ 3. Gestion d'erreurs

- Utilisation d'une classe personnalisée "ApiError" qui étend de la class "Error" pour une meilleur personnalisation de l'erreur.
- Mise en place d'un middleware TryCatch qui englobe tous les controllers afin de capturer l'erreur.
- Mise en place d'un middleware de gestion d'erreurs qui réceptionne l'erreur du middleware TryCatch ou des autres middleware afin d'avoir la main sur l'erreur et de la traiter avant de renvoyer un message d'erreur.
- Mise en place d'un fichier "error" (un objet) comportant tous les messages d'erreur avec leur type et leur code status. Ce sont ces propriétés que l'on utilise en argument de notre classe ApiError. 


### 🖼️ 4. Gestion d'images

- Utilisation de multer pour lire les données au format multipart/form-data et vérifie la validité de l'image selon une taille maximale et certains types de fichier.
- Stockage des images sur le serveur avec génération unique d'url. 

### 🗺️ 5. API Géocoding Google
- Utilisation de cette API pour avoir la latitude et longitude en fonction d'un adresse et d'une ville données par l'utilisateur.
- Renvoie de la longitude + latitude pour l'API Leaflet du front.

### 📖 6. Documentation de l'API

- Mise en place d'une documentation de l'API avec Swagger, accessible depuis /api/docs.

### 🗄️ 7. Base de données

- Utilisation d'une base de données relationnelle Postgres.
- Script de seeding pour stocker toutes les villes de France avec leur code postal avec l'API Géo, + ajout d'activités provenant de l'API Yelp pour "fournir" l'application car c'est un projet portfolio.

### 🧪 8. Tests unitaires
- Mise en place de tests unitaires avec JEST sur les fonctions de seeding d'activités avec l'API Yelp (si les tests ne fonctionnent pas, il est fort possible que la clé de l'API Yelp n'est plus valide, il faut alors se créer un compte Yelp et générer une clé que vous insérerez dans les headers de la requête, plus précisement dans 'Authorization', précédé par 'Bearer').

### 💻 9. Technologies utilisées

- Node.js (Express)
- [Axios](https://www.npmjs.com/package/axios) pour le seeding (requête API Yelp + requête API Géo)
- [JOI](https://www.npmjs.com/package/joi) pour la validation des champs
- [Bcrypt](https://www.npmjs.com/package/bcrypt) pour le hashage du mot de passe en base de données
- [Postgres](https://www.npmjs.com/package/pg) pour la base de données
- [Express-session](https://www.npmjs.com/package/express-session) pour l'authentification et la session
- [Multer](https://www.npmjs.com/package/multer) pour lire et gérer les fichiers images
- [CSRF-sync](https://www.npmjs.com/package/csrf-sync), le package utilsé pour se prémunir des attaques CSRF
- [Nodemailer](https://www.npmjs.com/package/nodemailer) pour l'envoie de mail
- [OTP-generator](https://www.npmjs.com/package/otp-generator) pour générer un code OTP
- [API Yelp](https://docs.developer.yelp.com/docs/fusion-intro) pour le seeding des activités
- [API Géo](https://geo.api.gouv.fr/) pour le seeding des villes + code postal
- [API Géocoding Google](https://geo.api.gouv.fr/) pour avoir la longitude et latitude
- [Jest](https://jestjs.io/fr/) pour les tests unitaires


### ⬇️ 10. Points à ajouter ou améliorer :

- Se prémunir des attaques par force brute avec un captcha pour la connnexion.
- Mettre en place une pagination sur la page recherche pour gagner en rapidité et ainsi améliorer l'expérience utilisateur.
- Migrer en TypeScript.
- Améliorer la gestion d'erreur de validation de schéma qui ne sont pas personnalisées.
- Améliorer la gestion d'erreurs provenant de l'upload d'image.
- Améliorer la gestion d'erreur des sessions expirées.
- Mettre en place le stockage des images sur Cloudinary et non sur le serveur lui-même (car en production le service peut effacer les images du serveur)
- Terminer la documentation Swagger.
- Ré-organiser et nettoyer le code pour une meilleure lisibilité.


🚨: Cityzen est un projet réalisé en groupe ( mais aussi mon tout premier (gros) projet fullstack) durant mon bootcamp chez O'Clock. Le projet n'est pas encore totalement complet, je pense notamment à la gestion d'erreurs, à l'upload d'image ou encore l'utilisation de express-session au lieu du JWT. Cependant ce dernier m'a permis de découvrir beaucoup de technologies et de notions, et ce en grande partie grâce à l'équipe du projet.

Collaborateurs : 

- [Ryad](https://github.com/RyadC)
- [Emmanuel](https://github.com/CHARLESEmmanuel-25)
- [Ziad](https://github.com/ziadelidrissi)
- [Wilson](https://github.com/SemedoWilson)



