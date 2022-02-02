const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');

module.exports = withPlugins([withImages], {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    disableStaticImages: true,
  },
});
