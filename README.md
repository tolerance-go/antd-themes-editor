<div align=center>
<image src='./src/assets/WechatIMG44.png'>
</div>


# Use less in browser to dynamic modify antd components style

https://tolerance-go.github.io/antd-themes-editor/index.html

PS: 浏览器环境同步编译 less 文件，所以加载会有些慢

# Some key operations

- 关闭 umirc.js 中 `umi-plugin-react` antd 选项

- 注释掉 global.less 中对自定义组件样式的依赖

- public 添加 antd 包, 和自定义组件文件（如果有对antd组件样式的依赖记得删除，eg: `@import '~antd/lib/style/themes/default.less';`)

- 有效颜色样式变量类型为 rgb 或者 hex

- src/pages/document.ejs 添加如下代码，在浏览器环境使用 `less.js`

```html
  <link rel="stylesheet/less" type="text/css" href="/index.less" />
  <script>
      window.less = {
          async: false,
          env: 'production',
          javascriptEnabled: true,
      };
  </script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/less.js/3.0.4/less.min.js"></script>
```

- 运行脚本 `npm run convertThemeVars` 会对 public 下的组件样式变量进行计算输出到 `src/models/theme.json`

NOTE: 对自定义组件的文件格式做了如下约定，具体参考项目内容

- .less 使用相对路径对其他模块引用
- 禁用 css-module 改为动态命名空间的限制形式，参考 antd
