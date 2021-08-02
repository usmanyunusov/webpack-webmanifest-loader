const { getImportIcons, parseJSON } = require("./utils");

module.exports = function (source) {
  const manifest = parseJSON(source, this);
  const importIcons = getImportIcons(manifest.icons, this);

  return `${importIcons}`;
};
