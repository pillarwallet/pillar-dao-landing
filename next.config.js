const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');

module.exports = withPlugins([withImages], {
  reactStrictMode: true,
  images: {
    disableStaticImages: true,
  },
});

module.exports = {
  swcMinify: true,
}
