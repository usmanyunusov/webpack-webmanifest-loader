const { getOptions } = require("loader-utils");
const path = require("path");
const { NAMESPACE } = require("./index");

function getImportCode(icons) {
  if (icons && Array.isArray(icons)) {
    const code = [];

    for (const index in icons) {
      const dep = `require("${icons[index].src}");`;

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
  const importCode = getImportCode(manifest.icons);

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
  this[NAMESPACE].options.manifestRequest = this.request;

  callback(null, `${importCode}`);
};
