/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
      config.module.rules.push({
        test: /object-size-custom\.svg$/,
        type: 'asset/resource', // Tell webpack to treat it as a file
      });
  
      return config;
    },
  };
  
  module.exports = nextConfig;
  