# webpack-webmanifest-plugin

## Install

```console
npm install https://github.com/usmanyunusov/webpack-webmanifest-plugin.git --save-dev
```

## Usage

```json
// manifest.webmanifest
{
  "name": "HackerWeb",
  "icons": [
    {
      "src": "../images/touch/homescreen48.png", // relative path
      "sizes": "48x48",
      "type": "image/png"
    },
  ],
}
```

```js
// foo.js
require("./manifest.webmanifest");
```

```js
const { WebManifestPlugin } = require("webpack-webmanifest-plugin");

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

With the default options, the example above will create a manifest.webmanifest file in the output directory for the build.

```json
// manifest.webmanifest
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
