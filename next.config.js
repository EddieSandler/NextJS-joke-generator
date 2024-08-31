module.exports = {
  //...
  webpack: (config) => {
    config.module.rules.push({
      test: /onnxruntime_binding\.node$/,
      use: 'ignore-loader',
    });
    return config;
  },
};