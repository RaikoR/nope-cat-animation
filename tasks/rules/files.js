module.exports = (env) => {
  return [
    {
      test: /\.(png|jpg|gif)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]',
            publicPath: './dist',
            outputPath: 'images'
          }
        }
      ]
    },
    {
      test: /svg\/+?\.svg$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            emitFile: false
          }
        }
      ]
    },
    {
      test: /\.(woff(2)?|ttf|eot|svg)$/,
      exclude: /svg\//,
      use: [
        {
          loader: 'file-loader',
          options: {
            outputPath: 'fonts'
          }
        }
      ]
    }
  ];
};
