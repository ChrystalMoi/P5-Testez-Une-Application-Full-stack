# P5 - Testez une Application Full-stack

## Prérequis

Avant de commencer à travailler sur ce projet, assurez-vous d'avoir les outils suivants installés sur votre ordinateur :

- Java 11
- NodeJS 16
- MySQL
- Angular CLI 14

## Installation

1. Clonez le dépôt avec la commande suivante :

```
git clone git@github.com:ChrystalMoi/P5-Testez-Une-Application-Full-stack.git
```

2. Naviguez dans le répertoire du projet :

```
cd P5-Testez-Une-Application-Full-stack
```

3. Installez les dépendances :

```
npm install
```

### Installation base de données

Ouvrez l'application MySQL en tant qu'administrateur.

Créer une nouvelle table.

Copier le contenu de `/ressources/sql/script.sql`

Ouvrez `/back/src/main/resources/application.properties` et modifiez avec les paramètres appropriés pour votre base de données :

```
Exemple de configuration pour MySQL

spring.datasource.url=jdbc:mysql://localhost:3306/nom_de_votre_base
spring.datasource.username=votre_utilisateur
spring.datasource.password=votre_mot_de_passe
```

Vous pouvez aussi créer des variables d'environnements puis configurer comme ceci :

```
Exemple de configuration pour MySQL avec variable d'environnement

spring.datasource.url=jdbc:mysql://${APP_DB_HOST}:${APP_DB_PORT}/${APP_DB_NAME}
spring.datasource.username=${APP_DB_USER}
spring.datasource.password=${APP_DB_PASS}
```

### Installation front

Pour installer les dépendances du frontend, exécutez la commande suivante depuis le dossier `/front` :

```
npm install
```

Pour lancer le serveur frontend, exécutez la commande suivante depuis le dossier `/front` :

```
ng serve
```

Une fois le serveur lancé, vous pouvez accéder à votre application en ouvrant votre navigateur et en visitant http://localhost:4200/.

### Installation back

Pour installer les dépendances du backend, exécutez la commande suivante depuis le dossier `/back` :

```
mvn clean install
```

## Tests _(avec rapport de couverture)_

### Tests Back

Pour exécuter les tests backend :

1. Dans IntelliJ, clic droit sur le dossier racine du projet.
2. Sélectionnez "Run All Test with Coverage".
3. Attendez que le processus se termine.
4. Une mini-fenêtre s'ouvre à droite ("Coverage").
5. Ouvrez un fichier et examinez les gouttières : vert -> couvert, orange -> partiellement couvert, rouge -> non couvert.
6. Générez le rapport de couverture en cliquant sur "generate coverage report" en haut de la mini-fenêtre de droite et enregistrez-le.
7. Ajoutez le rapport de couverture au fichier .gitignore.
8. Ouvrez le rapport de couverture dans un navigateur pour l'examiner.

### Test Front

#### Tests unitaires

Pour exécuter les tests unitaires et générer un rapport de couverture :

1. Dans votre terminal, accédez au dossier `/front` de votre projet.
2. Exécutez la commande suivante :

```
ng test --silent --coverage
```

3. Attendez que le processus se termine.
4. Un dossier `coverage` sera créé dans le dossier `/front`, contenant le rapport de couverture au format HTML (index.html).

#### Tests end-to-end

Pour exécuter les tests end-to-end (e2e) :

- `npm run e2e`: Cette commande lance les tests e2e.
- `npm run e2e:ci`: Cette commande lance les tests e2e en mode CI (Continuous Integration).
- `npm run e2e:coverage`: Cette commande lance les tests e2e et génère un rapport de couverture.

Les tests end-to-end permettent de simuler le comportement réel de l'application, en testant son interaction avec le navigateur et en vérifiant si les différentes fonctionnalités se comportent comme prévu dans un environnement similaire à celui de l'utilisateur final.

Assurez-vous d'avoir le serveur frontend lancé (`ng serve`) avant d'exécuter les tests end-to-end.
