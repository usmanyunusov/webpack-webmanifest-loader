const webpack = require("webpack");
const { RawSource } = webpack.sources || require("webpack-sources");

const emitHook = function emit({ compiler, options }, compilation) {
  compilation.emitAsset(
    `${options.fileName}.webmanifest`,
    new RawSource(options.serialize(options.manifest))
  );
};

module.exports = {
  emitHook,
};
