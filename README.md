# Webpack WebManifest Plugin

Minimalistic webpack plugin to generate webmanifest file (and process icons URLs).

- Compatible with webpack 5 only (5.1+ required).
- Zero dependency
- Support cache busting

## Getting Started

```console
npm install -D webpack-webmanifest-plugin
```

#### manifest.webmanifest
```json
{
  "name": "HackerWeb",
  "icons": [
    {
      "src": "../images/touch/homescreen48.png",
      "sizes": "48x48",
      "type": "image/png"
    }
  ]
}
```

#### index.html
```html
<head>
  <title>Example</title>
  <link rel="manifest" href="<%= require('../layout/base/manifest.webmanifest') %>" />
</head>
```

Then add the plugin to your webpack config. For example:

#### webpack.config.js
```js
const WebManifestPlugin = require("webpack-webmanifest-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|svg|webp|jpg|jpeg)$/i,
        type: "asset/resource",
      },
      {
        test: /\.webmanifest$/i,
        use: WebManifestPlugin.loader,
        type: "asset/resource",
      },
    ],
  },
};
```

With the default options, the example above will create a `[contenthash].webmanifest` file in the output directory for the build.

```json
{
  "name": "HackerWeb",
  "icons": [
    {
      "src": "[contenthash].[ext]",
      "sizes": "48x48",
      "type": "image/png"
    },
  ],
}
```