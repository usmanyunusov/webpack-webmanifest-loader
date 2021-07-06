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
  const callback = this.callback;

  if (!this["WebManifestPlugin"]) {
    callback(
      new Error(
        "You forgot to add 'webpack-webmanifest-plugin' plugin (i.e. `{ plugins: [new WebManifestPlugin()] }`)"
      )
    );

    return;
  }

  const manifest = parseJSON(content, this);
  const importCode = getImportCode(manifest.icons);

  this["WebManifestPlugin"].manifest = manifest;
  this["WebManifestPlugin"].manifestRequest = this.request;

  callback(null, `${importCode}`);
};
