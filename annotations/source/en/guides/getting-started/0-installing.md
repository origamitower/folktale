@guide: Installing Folktale
category: 0. Getting started
authors:
  - "@robotlolita"
---

Folktale is preferrably installed by `npm`, but this guide will walk you through installing Folktale in platforms other than Node.js.

* * * 

The recommended way of getting Folktale is through [npm][]. If you don't have Node installed yet, you should [download a binary from the official website](https://nodejs.org/en/) or use an installer like [nvm](https://github.com/creationix/nvm).

> **NOTE**  
> Folktale requires Node 6.x+ for its development tools, but you can use a prebuilt version of Folktale in Node 4.x+.

To install Folktale using npm, run the following in your command line:

    $ npm install folktale


## Table of Contents

  - [Folktale in Node.js](#folktale-in-nodejs)
  - [Folktale in Electron / nw.js](#folktale-in-electron-nwjs)
  - [Folktale in the Browser](#folktale-in-the-browser)
      - [Using Browserify](#using-browserify)
      - [Using WebPack](#using-webpack)
      - [Using Folktale without a module system](#using-folktale-without-a-module-system)


## Folktale in Node.js

Node.js has native support for the CommonJS module system, which Folktale uses, thus in order to use Folktale you just `require` it:

```js
const folktale = require('folktale');

folktale.core.lambda.identity(1); // ==> 1
```


## Folktale in Electron / nw.js

Like Node.js, [Electron](https://electron.atom.io/) and [nw.js](https://nwjs.io/) have native support for the CommonJS module system, so you load Folktale using `require`:

```js
const folktale = require('folktale');

folktale.core.lambda.identity(1); // ==> 1
```

## Folktale in the Browser

Browsers don't have native support for CommonJS modules. We still recommend using a module system (like [Browserify][] or [WebPack][]) and bundling your modules to distribute your application. This allows you to only load the parts of Folktale that you use, reducing the amount of data you have to send to your users.


### Using Browserify

First install Browserify from npm (you should have a package.json describing your application's dependencies):

    $ npm install browserify --save-dev

Then install Folktale through npm as well:

    $ npm install folktale --save

Ideally, require only the Folktale modules you'll be using. This helps keeping the overall size smaller. For example, if you're using only the `Maybe` and `compose` functions, don't load the library's entry-point, just those modules:

```js
const Maybe = require('folktale/data/maybe');
const compose = require('folktale/core/lambda/compose');

const inc = (x) => x + 1;
const double = (x) => x * 2;

Maybe.Just(1).map(compose(inc, double));
// ==> Maybe.Just(4)
```

To compile your application, run `browserify` on your entry-point module (you run this from the root of your project, where your `package.json` is located at):

    $ ./node_modules/.bin/browserify index.js > my-app.js

Finally, load `my-app.js` in your webpage. This file will contain all of the modules you've `require`d in your `index.js` file:

```html
<!DOCTYPE html>
<html>
  <head>(...)</head>
  <body>
    (...)
    <script src="/path/to/my-app.js"></script>
  </body>
</html>
```

For more information about Browserify, [check Browserify's website](http://browserify.org/).


## Using WebPack

First install WebPack from npm (you should have a package.json describing your application's dependencies):

    $ npm install webpack --save-dev

Then install Folktale through npm as well:

    $ npm install folktale --save

Ideally, require only the Folktale modules you'll be using. This helps keeping the overall size smaller. For example, if you're using only the `Maybe` and `compose` functions, don't load the library's entry-point, just those modules:

```js
const Maybe = require('folktale/data/maybe');
const compose = require('folktale/core/lambda/compose');

const inc = (x) => x + 1;
const double = (x) => x * 2;

Maybe.Just(1).map(compose(inc, double));
// ==> Maybe.Just(4)
```

Create a `webpack.config.js` in your project's root directory, containing instructions for how WebPack should build your application:

```js
module.exports = {
  entry: './index.js',
  output: {
    filename: 'my-app.js'
  }
};
```

Finally, load `my-app.js` in your webpage. This file will contain all of the modules you've `require`d in your `index.js` file:

```html
<!DOCTYPE html>
<html>
  <head>(...)</head>
  <body>
    (...)
    <script src="/path/to/my-app.js"></script>
  </body>
</html>
```

For more information about WebPack, [check WebPack's website](https://webpack.js.org/).


## Using Folktale without a module system

While the recommended way of using Folktale is with a module system, it's possible to use it without one as well. The drawback of not using a module system is that your website will have to ship the entire Folktale library to your users, even if you don't use all of its features.

To use a prebuilt version, first, download one of the [prebuilt releases](https://github.com/origamitower/folktale/releases) on GitHub. Unpack the distribution file and add the `dist/folktale.min.js` or `dist/folktale.js` file to your website. Reference this file in your HTML like any other JavaScript file:

```html
<!DOCTYPE html>
<html>
  <head>(...)</head>
  <body>
    (...)
    <script src="/path/to/folktale.min.js"></script>
  </body>
</html>
```

In your JavaScript code, the Folktale library will be available through the global variable `folktale`, **unless you're using a CommonJS or AMD module system in your webpage**:

```js
folktale.core.lambda.identity(1);
// ==> 1
```

> **NOTE**:
> If you're using a module system in your webpage (for example, AMD in Dojo or Require.js), then Folktale will be available through that module system under `folktale`.


[npm]: https://www.npmjs.com
[Browserify]: http://browserify.org/
[WebPack]: https://webpack.github.io/