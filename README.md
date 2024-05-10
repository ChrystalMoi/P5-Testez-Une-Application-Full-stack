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

## Tests

### Tests Back

### Test Front

### Test E2E
