// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

const httpProxy = require('http-proxy')
const proxy = httpProxy.createServer({ target: 'http://localhost:8080' });

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: '/',
    src: '/dist'
  },
  plugins: [
    '@snowpack/plugin-typescript',
    '@snowpack/plugin-postcss'
  ],
  routes: [
    {
      match: 'all',
      src: '/api/.*',
      dest: (req, res) => {
        req.url = req.url.replace(/^\/api/, '')
        return proxy.web(req, res)
      }
    },
    { match: 'routes', src: '.*', dest: '/index.html' }
  ],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    port: 3000
  },
  buildOptions: {
    /* ... */
  }
}
