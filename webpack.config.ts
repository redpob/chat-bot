import webpack from 'webpack';
import dotenv from 'dotenv-webpack';

const config: webpack.Configuration = {
  // Other configuration options for Webpack

  plugins: [
    new dotenv(),
    new webpack.DefinePlugin({
      'process.env.OPENAI_API_KEY': JSON.stringify(process.env.OPENAI_API_KEY),
    }),
  ],
};

export default config;
