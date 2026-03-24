module.exports = {
  style: {
    postcss: {
      plugins: [
        require("tailwindcss"),
        require("autoprefixer")
      ]
    }
  },
  // Do not add babel.presets here — react-scripts already uses babel-preset-react-app.
  // Extra preset-env + preset-react merge on top and can make dev compiles extremely slow.
  webpack: {
    configure: (webpackConfig) => {
      // Add any custom webpack configuration here
      return webpackConfig;
    },
  },
}
