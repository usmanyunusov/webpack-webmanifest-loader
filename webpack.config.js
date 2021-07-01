const { WebManifestPlugin } = require("./loader/plugin");

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
            options: {
              publicPath: "icons",
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new WebManifestPlugin({
      fileName: "main",
    }),
  ],
};
