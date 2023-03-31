const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { resolve } = require("path");
module.exports = {
  //入口文件
  entry: {
    main: "./src/index.tsx",
  },
  //输出文件
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  //配置loader
  module: {
    rules: [
      {
        test: /\.j|tsx$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },

  //加载html
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  mode: "development",
};
