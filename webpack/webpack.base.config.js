const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const WebpackReplaceX = require("@dwd/webpack-replace-x");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const filename = process.env.npm_lifecycle_event.split(":")[1];

let entry = {};
let port = 7000;

switch (filename) {
  case "portal":
    entry = {
      "zh-CN": path.join(__dirname, `../packages/${filename}/src/zh-CN.ts`),
      main: path.join(__dirname, `../packages/${filename}/src/index.tsx`)
    };
    port = 7000;
    break;
  case "task":
    entry = {
      taskEntry: path.join(__dirname, `../packages/${filename}/src/entry.tsx`)
    };
    port = 7001;
    break;
  case "workorder":
    entry = {
      workorderEntry: path.join(
        __dirname,
        `../packages/${filename}/src/entry.tsx`
      )
    };
    port = 7002;
    break;
  default:
    port = 7000;
    break;
}

module.exports = {
  mode: "development",
  entry: entry,
  output: {
    path: path.resolve(__dirname, `../packages/${filename}/dist`),
    filename: "[name].js",
    chunkFilename: "[name].bundle.js",
    library: filename,
    publicPath: "/",
    libraryTarget: "umd",
    jsonpFunction: `webpackJsonp_${filename}`,
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: "all"
  //   }
  // },
  module: {
    rules: [
      {
        test: /\.(js|tsx)/,
        include: [
          path.resolve(__dirname, `../node_modules/antd/`),
          path.resolve(__dirname, `../packages/${filename}/node_modules/antd/`),
          path.resolve(__dirname, `../packages/shared/components/node_modules/antd/`)
        ],
        use: [
          {
            loader: "@dwd/webpack-replace-x",
            options: {
              params: {
                "ant-": "dwd-"
              },
              filter: ["@ant-design"]
            }
          }
        ]
      },
      { test: /\.tsx?$/, use: ["babel-loader", "awesome-typescript-loader"] },
      { test: /\.css$/, use: [{loader: MiniCssExtractPlugin.loader, options: {hmr: true },}, "css-loader"] },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {hmr: true},
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "less-loader", // compiles Less to CSS
            options: {
              modifyVars: {
                "ant-prefix": "dwd",
                "primary-color": "#0083ff",
                "font-size-base": "14px",
                "border-radius-base": "2px"
              },
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /.(png|woff|woff2|eot|ttf|svg)$/,
        loader: "url-loader?limit=8192"
      },
      { test: /\.pdf(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
    alias: {
      components: path.resolve(__dirname, `../packages/shared/components`),
      utils: path.resolve(__dirname, "../packages/shared/utils")
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(
        __dirname,
        `../packages/shared/utils/${
          filename === "portal" ? "indexForPortal" : "index"
        }.html`
      ),
      inject: filename === "portal" ? "body" : false
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development")
      }
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.LoaderOptionsPlugin({ debug: true }),
    new webpack.IgnorePlugin(/webpack-stats\.json$/)
  ],
  node: {
    fs: "empty"
  },
  devtool: "eval-source-map",
  devServer: {
    contentBase: `../packages/${filename}/dist`,
    historyApiFallback: true,
    host: "127.0.0.1",
    hotOnly: true,
    publicPath: "/",
    port: port,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization"
    }
  }
};
