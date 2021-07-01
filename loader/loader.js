const { getOptions, urlToRequest } = require("loader-utils");
const path = require("path");
const { NAMESPACE } = require("./plugin");

function generateManifest(content, loaderContext) {
  if (content && content.icons && Array.isArray(content.icons)) {
    for (const icon of content.icons) {
      const context = loaderContext.context;
      const request = urlToRequest(icon.src);

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
      const dep = `require("${icon.src}");`;

      if (!code.includes(dep)) {
        code.push(dep);
      }
    }

    return `${code.join("\n")}`;
  }

  return "";
}

function parseJSON(content, loaderContext) {
  try {
    return JSON.parse(content);
  } catch (error) {
    return loaderContext.callback(
      new Error(
        `Invalid JSON in Web App Manifest: ${loaderContext.resourcePath}`
      )
    );
  }
}

module.exports = function loader(content) {
  const options = getOptions(this) || {};
  const callback = this.callback;

  if (!this[NAMESPACE]) {
    callback(
      new Error(
        "You forgot to add 'webpack-webmanifest-plugin' plugin (i.e. `{ plugins: [new WebManifestPlugin()] }`)"
      )
    );

    return;
  }

  const manifest = parseJSON(content, this);
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

  this[NAMESPACE].options.manifest = manifest;

  callback(null, `${importCode}`);
  generateManifest(manifest, this);
};
