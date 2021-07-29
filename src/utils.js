const path = require("path");

function getImportIcons(icons, loaderContext) {
  if (icons && Array.isArray(icons)) {
    const code = [];

    for (const icon of icons) {
      const dep = `require('${path.resolve(loaderContext.context, icon.src)}')`;

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

module.exports = {
  getImportIcons,
  parseJSON,
};
