const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {

    console.log("setupProxy")
    const options = {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {
            '^/proxy/': '/',
        }
    }
    app.use(
      '/proxy/',
      createProxyMiddleware(options)
    )
}
