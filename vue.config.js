module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  publicPath:            '/Labirinto/',
  configureWebpack:      {
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use:  { loader: 'worker-loader' },
        },
      ],
    },
  },
};
