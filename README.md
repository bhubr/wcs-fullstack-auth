# Authentification - full-stack Node.js / React

Surtout, **lisez les notes de lecture** en gras dans cette doc !

## Mise en place de l'application

### Front

On a créé l'app front tout simplement avec `create-react-app front`.

### Back

On a créé un répertoire `back` vide, puis installé les modules :

    npm install express body-parser mysql dotenv bcrypt passport passport-local

Les modules utilisés, en plus des "classiques" `express`, `body-parser` et `mysql` :
* [dotenv](https://www.npmjs.com/package/dotenv) permet de stocker tous les paramètres dans un fichier `.env` qui **ne doit pas être commité** (éventuellement fournir un `.env.sample` pour suggérer les variables nécessaires)
* [bcrypt](https://www.npmjs.com/package/bcrypt) fournit entre autres deux fonctions (voir section [with promises](https://www.npmjs.com/package/bcrypt#with-promises)) :
    * `bcrypt.hash` pour créer un "hash" (mot de passe encrypté), avant de stocker ce dernier dans la BDD
    * `bcrypt.compare` permet de comparer un mot de passe en clair (envoyé lors du login) au hash stocké en BDD
* [passport](https://www.npmjs.com/package/passport) permet de gérer l'authentification en général. C'est une librairie "standard" dans l'écosystème Node.js, qui fournit, via des extensions, différents mécanismes d'authentification, appelés "stratégies"
* [passport-local](https://www.npmjs.com/package/passport-local) est une stratégie d'authentification par email et mot de passe.
* On utilisera plus tard [passport-jwt](https://www.npmjs.com/package/passport-jwt), stratégie d'authentification par JSON Web Token.

### Authentification

Pour mettre en place Passport côté back, il faut :
* L'importer dans `app.js` et ajouter `app.use(passport.initialize());` après la création de l'app Express
* Mettre en place la stratégie d'authentification locale avec `passport-local`.

**NOTE 1** : pendant le livecoding, la `LocalStrategy` a été initialisée dans `app.js`, mais cela pourrait être déplacé dans `routes/auth.js`.

**NOTE 2** : toujours pendant le livecoding, j'ai copié-collé un code depuis [StackOverflow](https://stackoverflow.com/q/19948816#answer-19949584), suite à l'erreur `Error: failed to serialize user into session`. **Ce n'était pas nécessaire** : c'est nécessaire pour l'authentification par session mais pas par JWT. Il faut rajouter le paramètre `{ session:  false }` lors de l'appel à `passport.authenticate()` dans la route `/api/auth/signin`.

## Guide des vidéos (à venir)

* 01 - Mise en place de l'application
* 02 - LiveCoding `bcrypt` et `passport-local`
