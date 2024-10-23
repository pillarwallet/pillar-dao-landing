/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  styledComponents: true,
}

module.exports = nextConfig

const withImages = require('next-images');

module.exports = withImages({
  images: {
    disableStaticImages: true,
  },
});