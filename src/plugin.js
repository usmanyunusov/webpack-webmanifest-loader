const NAMESPACE = "WebManifestPlugin";
const path = require("path");

const defaults = {
  fileName: "manifest",
  serialize(manifest) {
    return JSON.stringify(manifest, null, 2);
  },
  manifest: {},
  manifestRequest: null,
};

class WebManifestPlugin {
  constructor(opts) {
    this.options = Object.assign({}, defaults, opts);
    this.originalSource = new Map();
  }

  async apply(compiler) {
    compiler.hooks.compilation.tap(NAMESPACE, (compilation) => {
      const NormalModule = require("webpack/lib/NormalModule");
      NormalModule.getCompilationHooks(compilation).loader.tap(
        NAMESPACE,
        (loaderContext) => {
          loaderContext[NAMESPACE] = this;
        }
      );

      compilation.hooks.afterProcessAssets.tap(NAMESPACE, () => {
        const assetMap = {};
        const stats = compilation.getStats().toJson({
          all: false,
          modules: true,
          cachedModules: true,
        });

        const { modules } = stats;

        for (const module of modules) {
          if (
            this.options.manifestRequest &&
            module.issuer === this.options.manifestRequest
          ) {
            const { rawRequest, buildInfo } = compilation.findModule(
              module.identifier
            );
            assetMap[rawRequest] = buildInfo.filename;
          }
        }

        this.options.manifest.icons = this.options.manifest.icons.map(
          (icon) => ({ ...icon, src: assetMap[icon.src] || icon.src })
        );

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
