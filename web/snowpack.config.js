// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

// const httpProxy = require('http-proxy')
// const proxy = httpProxy.createServer({ target: 'http://localhost:8081' });

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: '/',
    src: '/dist'
  },
  plugins: [
    '@snowpack/plugin-typescript'
  ],
  routes: [
    {"match": "routes", "src": ".*", "dest": "/index.html"}
  ],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  }
};
