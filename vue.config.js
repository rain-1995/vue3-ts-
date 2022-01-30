const path = require('path')
function resolve(dir) {
  return path.join(__dirname, '/', dir)
}
module.exports = {
  publicPath: './',
  chainWebpack: config => {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/components/svg/icons'))
      .end()

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/components/svg/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
  }
}
