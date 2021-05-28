const generateExport = function (content, esModule = false) {
  return esModule ? `export default ${content}` : `module.exports = ${content}`;
};

module.exports = {
  generateExport,
};
