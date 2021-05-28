const NAMESPACE = "WebManifestPlugin";
const { emitHook } = require("./hooks");

const defaults = {
  fileName: "manifest",
  serialize(manifest) {
    return JSON.stringify(manifest, null, 2);
  },
  manifest: null,
};

class WebManifestPlugin {
  constructor(opts) {
    this.options = Object.assign({}, defaults, opts);
  }

  apply(compiler) {
    let moduleAssets = {};

    const emit = emitHook.bind(this, {
      compiler,
      options: this.options,
      moduleAssets,
    });

    const hookOptions = {
      name: NAMESPACE,
      stage: Infinity,
    };

    compiler.hooks.compilation.tap(hookOptions, (compilation) => {
      const NormalModule = require("webpack/lib/NormalModule");
      NormalModule.getCompilationHooks(compilation).loader.tap(
        hookOptions,
        (loaderContext) => {
          loaderContext[hookOptions.name] = this;
        }
      );

      compilation.hooks.processAssets.tap(hookOptions, () => {
        emit(compilation);
      });
    });
  }
}

WebManifestPlugin.loader = require.resolve("./loader");

module.exports = {
  WebManifestPlugin,
  NAMESPACE,
};
