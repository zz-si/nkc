const path = require("path");
const webpack = require("webpack");
const globby = require("globby");
const { VueLoaderPlugin } = require('vue-loader');

const DIST_DIR = process.env.NODE_ENV === "production"? "dist-prod": "dist";
const LIB_DIR_PATTERN = "!pages/**/lib";
const SCRIPTS_PATTERNS = ["./pages/**/*.js", LIB_DIR_PATTERN];
// const SCRIPTS_PATTERNS = ["./pages/test/*.js", LIB_DIR_PATTERN];
const STYLES_PATTERNS = ["./pages/**/*.less", LIB_DIR_PATTERN];

const scriptFiles = globby.sync(SCRIPTS_PATTERNS);
const styleFiles = globby.sync(STYLES_PATTERNS);

/**
 * 生成bundle到entry的映射关系图
 */
function makeEntryMap(files) {
  const map = Object.create(null);
  files.forEach(file => {
    const ext = path.extname(file);
    const dir = path.dirname(file);
    const basename = path.basename(file, ext);
    map[dir + "/" + basename] = file
  });
  return map;
}

const baseConfig = {
  mode: process.env.NODE_ENV || "development",
  devtool: process.env.NODE_ENV === "production" ? false : "inline-source-map",
  target: "es5",
  cache: true
};

module.exports = [
  // javascript
  {
    ...baseConfig,
    entry: makeEntryMap(scriptFiles),
    output: {
      path: path.resolve(__dirname, DIST_DIR),
      libraryTarget: "umd",
      globalObject: "this",
      publicPath: "/"
    },
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.vue$/,
          loader: "eslint-loader",
          exclude: /node_modules/
        },
        {
          test: /\.vue?$/,
          loader: "vue-loader"
        },
        {
          test: /\.(le|c)ss?$/,
          use: [ "vue-style-loader", "css-loader", "less-loader" ]
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|ico)(\?\S*)?$/,
          loader: "file-loader",
          options: {
            name: "[name]-[contenthash].[ext]",
            outputPath: "pages",
            publicPath: "/"
          }
        },
        {
          test: /\.jsx?$/,
          use: [
            // 出现语法兼容性问题时启用这个loader，但是*不推荐*，因为它会破坏源码映射
            // {
            //   loader: "buble-loader"
            // },
            {
              loader: "babel-loader",
              options: {
                presets: [
                  ["@vue/babel-preset-jsx"],
                  ["@babel/preset-env", {
                    targets: {
                      ie: "8"
                    }
                  }]
                ],
                plugins: [
                  [require.resolve("babel-plugin-preval")],
                  [require.resolve("@babel/plugin-transform-object-assign")]
                ],
                compact: false
              }
            }
          ]
        },
        {
          test: /\.pug$/,
          use: ["pug-plain-loader"]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new webpack.ProgressPlugin()
    ],
    externals: {
      vue: "Vue"
    },
    resolve: {
      extensions: [".js", ".jsx", ".json"]
    }
  },

  // single less style
  {
    ...baseConfig,
    entry: styleFiles,
    output: {
      path: path.resolve(__dirname, DIST_DIR),
      filename: "_AllLessStyle.js"
    },
    module: {
      rules: [
        {
          test: /\.less$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[path][name].css"
              }
            },
            "less-loader"
          ]
        }
      ]
    },
    plugins: [
      new webpack.ProgressPlugin()
    ]
  }
];