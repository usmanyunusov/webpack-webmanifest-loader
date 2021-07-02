# webpack-webmanifest-plugin

## Install

```console
npm install https://github.com/usmanyunusov/webpack-webmanifest-plugin.git --save-dev
```

## Usage

```js
const { WebManifestPlugin } = require('webpack-webmanifest-plugin');

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

  plugins: [
    new WebManifestPlugin(),
  ],
};
```

With the default options, the example above will create a manifest.webmanifest file in the output directory for the build.

### Plugin Options

### `fileName`

Type: `String`<br>
Default: `manifest.webmanifest`

This option determines the name of output file. By default the plugin will emit `manifest.webmanifest`

### Loader Options

### `fileName`

Type: `String`<br>
Default: `<webpack-config>.output.publicPath`

Specifies a custom public path for the external  to values of the manifest.
