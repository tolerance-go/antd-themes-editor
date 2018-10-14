export default {
  plugins: [
    [
      "umi-plugin-react",
      {
        antd: false,
        dva: {
          hmr: true,
          immer: true
        }
      }
    ]
  ],
  // https://github.com/umijs/umi/issues/1240 
  // use `.umirc.build.js` to fix it for now
  // base: "/antd-themes-editor/",
  outputPath: "docs",
  publicPath: "./",
  exportStatic: true,
  disableCSSModules: true,
  cssModulesWithAffix: true
};
