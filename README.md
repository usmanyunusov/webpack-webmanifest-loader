# Webpack WebManifest Plugin

## Getting Started

```console
npm install --save-dev webpack-webmanifest-plugin
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
    },
  ],
}
```

#### file.js
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
        use: [
          {
            loader: WebManifestPlugin.loader,
          },
        ],
      },
    ],
  },

  plugins: [new WebManifestPlugin()],
};
```

With the default options, the example above will create a `manifest.webmanifest` file in the output directory for the build.

```json
{
  "name": "HackerWeb",
  "icons": [
    {
      "src": "[hash].png",
      "sizes": "48x48",
      "type": "image/png"
    },
  ],
}
```

### Plugin Options

### `fileName`

Type: `String`<br>
Default: `manifest.webmanifest`

This option determines the name of output file. By default the plugin will emit `manifest.webmanifest`
