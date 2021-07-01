const NAMESPACE = "WebManifestPlugin";
const defaults = {
  fileName: "manifest",
  serialize(manifest) {
    return JSON.stringify(manifest, null, 2);
  },
  manifest: {},
};

class WebManifestPlugin {
  constructor(opts) {
    this.options = Object.assign({}, defaults, opts);
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(NAMESPACE, (compilation) => {
      const NormalModule = require("webpack/lib/NormalModule");
      NormalModule.getCompilationHooks(compilation).loader.tap(
        NAMESPACE,
        (loaderContext) => {
          loaderContext[NAMESPACE] = this;
        }
      );

      compilation.hooks.afterProcessAssets.tap(NAMESPACE, () => {
        const manifestJson = this.options.serialize(this.options.manifest);

        compilation.assets[`${this.options.fileName}.webmanifest`] = {
          source: () => manifestJson,
          size: () => manifestJson.length,
        };
      });
    });
  }
}

WebManifestPlugin.loader = require.resolve("./loader");

module.exports = {
  WebManifestPlugin,
  NAMESPACE,
};
