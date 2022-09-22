/**
 * ! !!!!!!! ATTENTION !!!!!!!!
 *
 * TODO: Adjust the configuration below
 *
 * ! !!!!!!!!!!!!!!!!!!!!!!!!!!
 */

/**
 * @docs    https://nextjs.org/docs/api-reference/next.config.js/rewrites
 */
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8085/:path*',
      },
    ];
  },
};
