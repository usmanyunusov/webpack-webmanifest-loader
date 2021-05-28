const loaderUtils = require("loader-utils");
const path = require("path");
const { NAMESPACE } = require("./plugin");

function generateManifest(content, publicPath, loaderContext) {
  if (content && content.icons && Array.isArray(content.icons)) {
    for (const icon of content.icons) {
      const context = loaderContext.context;
      const request = loaderUtils.urlToRequest(icon.src);

      loaderContext.resolve(context, request, (err, filename) => {
        loaderContext.addDependency(filename);

        loaderContext.loadModule(filename, (error, source, map, module) => {
          icon.src = module.buildInfo.filename;
        });
      });
    }
  }
}

function getImportCode(content) {
  if (content && content.icons && Array.isArray(content.icons)) {
    const code = [];
    for (const icon of content.icons) {
      code.push(`require("${icon.src}");`);
    }

    return `${code.join("\n")}`;
  }

  return "";
}

function parseJSON(content) {
  try {
    return JSON.parse(content);
  } catch (error) {
    return this.callback(
      new Error(`Invalid JSON in Web App Manifest: ${this.resourcePath}`)
    );
  }
}

module.exports = function loader(content) {
  const options = loaderUtils.getOptions(this) || {};
  const callback = this.callback;
  const manifest = parseJSON.call(this, content);
  const importCode = getImportCode(manifest);

  const publicPath =
    typeof options.publicPath === "string"
      ? options.publicPath === "auto"
        ? ""
        : options.publicPath
      : this._compilation.outputOptions.publicPath === "auto"
      ? ""
      : this._compilation.outputOptions.publicPath;

  this._compilation.outputOptions.assetModuleFilename = path.join(
    publicPath,
    this._compilation.outputOptions.assetModuleFilename
  );

  this[NAMESPACE] && (this[NAMESPACE].options.manifest = manifest);

  callback(null, `${importCode}`);
  generateManifest(manifest, publicPath, this);
};
