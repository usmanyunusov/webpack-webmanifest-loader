const defaults = {
  fileName: "manifest",
};

class WebManifestPlugin {
  constructor(opts) {
    this.serialize = (manifest) => {
      return JSON.stringify(manifest, null, null);
    };
    this.options = Object.assign({}, defaults, opts);
    this.originalSource = new Map();
    this.manifest = null;
    this.manifestRequest = null;
  }

  async apply(compiler) {
    const pluginName = this.constructor.name;

    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      const NormalModule = require("webpack/lib/NormalModule");
      NormalModule.getCompilationHooks(compilation).loader.tap(
        pluginName,
        (loaderContext) => {
          loaderContext[pluginName] = this;
        }
      );

      const stats = compilation.getStats().toJson({
        all: false,
        modules: true,
        cachedModules: true,
      });

      compilation.hooks.processAssets.tapAsync({
        name: pluginName,
        stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
      }, (_, callback) => {
        const assetMap = {};
        const stats = compilation.getStats().toJson({
          all: false,
          modules: true,
          cachedModules: true,
        });

        const { modules } = stats;

        for (const module of modules) {
          if (
            this.manifestRequest &&
            module.issuer === this.manifestRequest
          ) {
            const { rawRequest, buildInfo } = compilation.findModule(
              module.identifier
            );

            assetMap[rawRequest] = buildInfo.filename;
          }
        }

        if (this.manifest) {
          if (Object.keys(assetMap).length) {
            this.manifest.icons = this.manifest.icons.map(
              (icon) => ({ ...icon, src: assetMap[icon.src] || icon.src })
            );
          }

          const manifestJson = this.serialize(this.manifest);

          compilation.assets[`${this.options.fileName}.webmanifest`] = {
            source: () => manifestJson,
            size: () => manifestJson.length,
          };
        }

        callback();
      });
    });
  }
}

WebManifestPlugin.loader = require.resolve("./loader");
module.exports = WebManifestPlugin
