# TDD en JavaScript #2 - Tests de routes Express

Après l'introduction générale au TDD, et l'application à des tests unitaires, nous allons voir comment mettre en place des tests sur les routes d'un backend écrit avec Node.js et Express.

On peut parler de tests d'intégration, car le code testé interagit avec des ressources, en l'occurence une base de données.

## Objectifs

* Concevoir l'application
* Préparer l'application et les outils
* Ecrire les tests d'intégration
* Implémenter Create et Read
* Séparer l'environnement de test

## Etapes

### Conception de l'application

On va concevoir, tester et implémenter le backend d'une app de gestion de _bookmarks_ (marque-pages / favoris). Pour simplifier, on va implémenter trois fonctionnalités :
* Création d'un bookmark
* Récupération de tous les bookmarks
* Récupération d'un bookmark particulier

On se concentrera donc uniquement sur les aspects _Create_ et _Read_ de l'acronyme CRUD, appliqué à un seule modèle de données (BDD avec une seule table `bookmark`).

Travailler en TDD nous oblige à réfléchir à plusieurs aspects, avant de nous lancer :
* Comment sont structurées les données ?
* Que renvoient les routes ? En particulier, y a-t-il des cas d'erreur ?

On va répondre à ces questions dans cette section, puis nous verrons :
* Comment traduire cela en tests
* Comment implémenter le backend

On abordera au passage deux points importants :
* la *répétabilité* des tests
* la séparation des environnements de test et de développement

#### Modèle de données

Un bookmark contient les champs suivants :
* `id`
* `url` (lien à mettre en favori)
* `label` (un titre à donner au favori)

#### Route `/api/bookmarks` (`POST`)

Cette route permettra de créer un bookmark.

Pour créer un bookmark, il faudra fournir :
* le champ `url` (obligatoire)
* le champ `label` (optionnel)

On rencontrera donc les cas suivants :
* Création réussie :
  * Code statut HTTP : `201 Created`
  * Données renvoyées : un objet contenant tous les champs du bookmark (`url` et `label`, et l'`id` attribué par la BDD)
* Echec pour cause de champ manquant (`url` non fournie) :
  * Code statut HTTP : `400 Bad Request`
  * Données renvoyées : un objet avec une string `error` contenant `Required field "url" is missing`
* Echec pour cause de champ mal formaté (`url` non fournie) :
  * Code statut HTTP : `400 Bad Request`
  * Données renvoyées : un objet avec une string `error` contenant `Required field "url" is not a valid URL`

#### Route `/api/bookmarks`

Cette route permettra de récupérer tous les bookmarks.

A priori, la seule cause d'échec sur cette route serait une défaillance de la base de données, provoquant une erreur `500 Internal Error`, difficile à tester. On va donc considérer qu'elle répondra toujours avec un code statut `200 OK`.

Elle renverra un **tableau** d'objets représentant des bookmarks.

#### Route `/api/bookmarks/:id`

Cette route permettra de récupérer un bookmark.

On devra distinguer les deux cas suivants :
* Réussite : le bookmark existe
    * Code statut HTTP : `200 OK`
    * Données renvoyées : **un** objet représentant un bookmark.
* Echec : le bookmark n'existe pas (passage d'un `id` ne correspondant à rien dans la BDD)
    * Code statut HTTP : `404 OK`
    * Données renvoyées : un objet avec une string `error` contenant `Bookmark not found`

#### Résumé des routes à implémenter

| Route                  | Cas                 | Code HTTP       | Corps de la réponse                                                      |
|------------------------|---------------------|-----------------|--------------------------------------------------------------------------|
| POST /api/bookmarks    | Succès              | 201 Created     | Objet `bookmark`                                                         |
| POST /api/bookmarks    | Champ url manquant  | 400 Bad Request | Objet avec clé `error` contenant `Required field "url" is missing`       |
| POST /api/bookmarks    | Champ url invalide  | 400 Bad Request | Objet avec clé error contenant `Required field "url" is not a valid URL` |
| GET /api/bookmarks     | Succès              | 200 OK          | Tableau d'objets `bookmark`                                              |
| GET /api/bookmarks/:id | Succès              | 200 OK          | Objet `bookmark`                                                         |
| GET /api/bookmarks/:id | Bookmark non trouvé | 404 Not Found   | Objet avec clé error contenant `Bookmark not found`                      |
#### Ressources

* []()

### Création de l'application

#### Structure

L'application elle-même est composée des fichiers `app.js` et `routes/bookmarks.js`

Le répertoire `test` reflète le découpage de l'application. C'est une bonne pratique à adopter, car dans une application plus conséquente, on pourrait avoir d'autres répertoires que `routes` (`models`, `helpers`, etc.), contenant chacun de nombreux fichiers. Organiser les tests de la même façon que l'application aide à s'y retrouver.

Voici la structure de l'application simplifiée (sans les fichiers de configuration, le README, etc.) :

    routes/
      bookmarks.js
    test/
      routes/
        bookmarks.test.js
    app.js
    db.js

#### Installation d'Express et écriture d'une app "vide"

On initialise le `package.json` et installe les dépendances de l'application comme ceci :

    npm init --yes
    npm install express body-parser mysql

Puis on crée le fichier principal, `app.js`, contenant le strict minimum pour mettre en place l'application Express. Le fait qu'on l'écrive avant les tests n'est pas contradictoire avec la philosophie TDD, car on ne va pour l'instant écrire aucune route.

```javascript
// app.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.listen(5000);

module.exports = app;

```

Note l'ajout de l'export à la fin, du fait que les fichiers contenant les tests auront besoin d'importer l'app.

#### Installation des outils

On installe les modules suivants en tant que _dépendances de développement_ (`devDependencies` dans le `package.json`) : ce sont en effet des outils annexes, utilisés pendant le processus de développement, mais pas par l'application elle-même.

    npm install --save-dev mocha chai chai-http nodemon

Mis à part `nodemon` (pour redémarrer le backend à chaque changement du code), les outils installés concernent les tests :
  * [Mocha](https://mochajs.org/) : test runner, déjà utilisé dans la quête précédente,
  * [Chai](https://www.chaijs.com/) : bibliothèque d'assertions, aux fonctionnalités plus riches que le module `assert` de Node.js,
  * [Chai HTTP](https://www.chaijs.com/plugins/chai-http/) : extension de Chai permettant de tester des applications HTTP en envoyant des requêtes, et d'effectuer des assertions sur les réponses. La bibliothèque [Supertest](https://github.com/visionmedia/supertest) est souvent utilisée pour jouer ce rôle, mais l'intégration de Chai HTTP avec Chai permet d'écrire des assertions dans un style cohérent.

#### Chai

Chai offre trois styles d'écriture d'assertions : Assert, Should et Expect. Nous allons utiliser le style Expect, mais tu peux consulter la documentation si tu souhaites découvrir les autres.

Le style Expect permet d'écrire les assertions d'une façon plus proche du langage naturel. En voici un exemple :

```javascript
const chai = require('chai');
const expect = chai.expect;

const person = { name: 'Joe' };
person.age = 67;

expect(person.age).to.equal(67);
expect(person).to.deep.equal({
  name: 'Joe', age: 67
});
```

Le premier `expect` est une traduction presque littérale de "Je m'attends à ce que l'âge de la personne soit égal à 67" !

Le second `expect` vérifie, via `deep.equal`, l'égalité de deux objets.

Ce style d'assertions est indiqué dans la doc comme étant de "style BDD" (le BDD ou _Behaviour-Driven Development_ étant une évolution du TDD, où on cherche à se rapprocher du point de vue d'un utilisateur final).

#### Chai HTTP

Chai HTTP permet d'effectuer une requête HTTP, et d'exécuter des assertions sur le résultat. Son intégration avec Chai permet d'écrire des assertions dans le même style, proche du langage naturel.

L'exemple ci-dessous montre une requête sur une fausse application Express (`app`), visant à mettre à jour le mot de passe d'un utilisateur (ce qui va bien au-delà de cette quête !).

```javascript
const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');

// Setup fake Express app
const app = express();
app.put('/users/me', (req, res) => res.sendStatus(204));

// Use Expect style and use Chai HTTP
const expect = chai.expect;
chai.use(chaiHttp);

chai.request(app)
  .put('/users/me')
  .send({ password: '123', confirmPassword: '123' })
  .then(res => {
     expect(res).to.have.status(204);
  });
```

La méthode `request`, entre autres, est ajoutée à `chai` grâce à `chai.use(chaiHttp)`.

Elle renvoie un objet "requête", sur lequel on peut chaîner des appels de méthodes :
* `put` (ou un autre verbe HTTP comme `get`, `post`, `delete`) qui prend en paramètre un chemin (URL relative).
* `send` qui prend en paramètre des données (objet qui sera converti en JSON). Elle ne s'applique pas aux requêtes `GET` et `DELETE`.
* `then` que tu as déjà vu derrière `fetch` ou `axios`, où on indique une fonction à exécuter lorsqu'on reçoit la réponse du serveur. La fonction récupère l'objet `res` en paramètre, ce qui doit te rappeler `axios` ou `fetch`. On peut exécuter des assertions sur la réponse : vérifier son code de statut (ici 204), ses en-têtes, son contenu. L'écriture `expect(...).to.have.status(...)` est possible grâce à l'intégration de Chai HTTP dans Chai.

Note que cet exemple crée l'app Express, ce qui ne sera pas le cas dans les vrais tests, où elle sera importée.

#### Scripts du `package.json`

On va modifier le contenu de la clé `scripts` du `package.json`, pour pouvoir lancer `nodemon` via `npm start`, et les tests via `npm test` :

```json
...
"scripts": {
  "start": "npx nodemon app",
  "test": "npx mocha --exit test/**"
},
...
```

On passe à `mocha` :
* Le "flag" `--exit` lui indiquant de quitter à la fin des tests (sinon il ne rend pas la main au shell)
* L'argument qui suit indique à Mocha où chercher les fichiers `.test.js`. Par défaut, il les cherche directement sous `test`, mais pas dans ses sous-répertoires. On y remédie en indiquant `test/**` (`**` est un "wildcard" correspondant à tous les sous-répertoires).

#### Ressources

* []()

### Ecriture des tests d'intégration

#### Tests de POST sur `/api/bookmarks`

Voici à quoi va ressembler `test/routes/bookmarks.test.js`, après l'écriture du premier test :

```javascript
const chai = require('chai');
const chaiHttp = require('chai-http');
// Import Express app
const app = require('../../index');

// Use Expect style and use Chai HTTP
const expect = chai.expect;
chai.use(chaiHttp);

describe('User routes', () => {
  describe('GET /users', () => {
    chai.request(app)
      .get('/users')
      .then(res => {
        // Expect status 200 and JSON content
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        // Expect an array of users
        expect(res.body).to.be.a('array');
      });
  });
});
```

#### Ressources

* []()

### Implémentation des routes

Description de la deuxième étape

#### Ressources

* []()

## Challenge

### Titre du challenge

Description du challenge incluant le type d'URL attendu en réponse

### Critères de validation

* Liste des critères de validation 1
* Liste des critères de validation 2