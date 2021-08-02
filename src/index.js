const path = require("path");
const { parseJSON } = require("./utils");

module.exports = function (source) {
  source = parseJSON(source, this);

  if (source.icons && Array.isArray(source.icons)) {
    for (const icon of source.icons) {
      icon.src = this.data.assets[path.normalize(icon.src)];
    }
  }

  return JSON.stringify(source);
};

module.exports.pitch = function (request) {
  const { webpack } = this._compiler;
  const { EntryPlugin, Compilation } = webpack;
  const callback = this.async();

  const webmanifestContext = {};
  webmanifestContext.options = {
    filename: "*",
  };

  webmanifestContext.compiler = this._compilation.createChildCompiler(
    `webmanifest-loader ${request}`,
    webmanifestContext.options
  );

  new EntryPlugin(
    this.context,
    `${this.resourcePath}.webpack[javascript/auto]!=!${path.resolve(
      __dirname,
      "./import-icons.js"
    )}!${request}`,
    path.parse(this.resourcePath).name
  ).apply(webmanifestContext.compiler);

  const hookOptions = {
    name: `webmanifest-loader ${request}`,
    stage: Infinity,
  };

  webmanifestContext.compiler.hooks.thisCompilation.tap(
    hookOptions,
    (compilation) => {
      compilation.hooks.chunkAsset.tap(hookOptions, (chunk) => {
        chunk.files.forEach((file) => {
          compilation.deleteAsset(file);
        });
      });
    }
  );

  webmanifestContext.compiler.runAsChild((error, entries, compilation) => {
    if (error) {
      callback(new Error(error));
    }

    const { assets } = compilation.getStats().toJson();
    this.data.assets = {};

    for (const asset of assets) {
      this.data.assets[path.relative(this.context, asset.info.sourceFilename)] =
        asset.name;
    }

    callback();
  });
};
