module.exports = (env) => {
  return {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          attributes: false
        }
      }
    ]
  };
};
