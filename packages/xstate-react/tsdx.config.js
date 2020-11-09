module.exports = {
  rollup(config, options) {
    config.external = ['react', 'xstate'];
    return config;
  }
};
