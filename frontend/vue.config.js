const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  // 1. Enables source maps for your JavaScript/Vue components
  productionSourceMap: true,

  css: {
    // 2. Correct Vue CLI syntax to enable CSS source maps
    sourceMap: true
  },

  configureWebpack: {
    // 3. Forces Webpack to generate high-quality source maps for local debugging
    devtool: 'source-map'
  }
})
