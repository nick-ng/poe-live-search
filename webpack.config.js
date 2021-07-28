const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

let siteTitle = "PoE Live Search";

if (process.env.NODE_ENV !== "production") {
  siteTitle = `${siteTitle} - ${process.env.NODE_ENV || "dev"}`;
}

module.exports = {
  watch: process.env.NODE_ENV !== "production",
  mode: process.env.NODE_ENV || "production",
  devtool: process.env.NODE_ENV === "development" && "source-map",
  entry: {
    index: "./client/entry.jsx",
  },
  output: {
    path: `${__dirname}/dist`,
    filename: "[name].bundle.js",
    publicPath: "/",
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  resolve: {
    extensions: [".js", ".jsx"],
    fallback: { path: false },
  },
  module: {
    rules: [
      { test: /\.css$/, use: "style-loader" },
      {
        test: /\.css$/,
        use: {
          loader: "css-loader",
          options: {
            modules: {
              mode: "local",
              localIdentName: "[path][name]_[local]-[hash:base64:7]",
            },
          },
        },
      },
      {
        test: /\.m?js(x?)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"],
            plugins: [
              "@babel/plugin-syntax-dynamic-import",
              "@babel/plugin-proposal-class-properties",
              "@babel/transform-runtime",
              "@babel/plugin-proposal-optional-chaining",
            ],
          },
        },
      },
      {
        test: /node_modules(\/|\\)vfile(\/|\\)core\.js/,
        use: [
          {
            loader: "imports-loader",
            options: {
              type: "commonjs",
              imports: ["single process/browser process"],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: siteTitle,
      favicon: `${__dirname}/favicon.ico`,
      template: "./index.html",
      inject: true,
    }),
  ],
};
