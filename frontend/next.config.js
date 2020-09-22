require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}`});

module.exports = {
  devIndicators: {
    autoPrerender: false,
  },
  env: {
    ENDPOINT: process.env.API_ENDPOINT
  }
}