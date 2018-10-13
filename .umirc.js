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
  base: "antd-themes-editor/",
  outputPath: "docs",
  exportStatic: true,
  disableCSSModules: true,
  cssModulesWithAffix: true
};
