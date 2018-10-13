const lodash = require("lodash");
const { join, resolve } = require("path");
const fs = require("fs");
const less = require("less");
const sort = require("./DAG");

// 文件路径和内容的映射
const fileContents = {};

// 文件（路径）的依赖关系 [[A, B, C]] : A 文件依赖 B 和 C
const files = [];

function getAntdLessPath(filePath, container = []) {
  const stat = fs.statSync(filePath);

  if (stat.isDirectory()) {
    fs.readdirSync(filePath).forEach(child =>
      getAntdLessPath(join(filePath, child), container)
    );
  } else {
    if (filePath.endsWith(".less")) {
      const content = fs.readFileSync(filePath, "utf8");
      content.replace(/@import ['"](.*?)['"];/g, (lib, match) => {
        let next = join(filePath, "../", match);
        if (!next.endsWith(".less")) {
          next += ".less";
        }

        getAntdLessPath(next, container);
      });
      container.push(filePath);
    }
  }

  return container;
}

// 遍历所有 antd 组件的样式文件，将其依赖关系存储下来
function parseAntdComponent(componentPath) {
  try {
    // 判断文件是否存在
    fs.statSync(componentPath);

    const lessContent = fs.readFileSync(componentPath, "utf8");

    const curFileDepends = [componentPath];

    // 转换依赖变成绝对路径
    // 去除当行注释  //   @import '~antd/style/v2-compatible-reset.css';
    const resolvedContent = lessContent
      .replace("@import '~antd/style/v2-compatible-reset.css';", "")
      .replace(/@import ['"](.*?)['"];/g, (lib, match) => {
        let next = join(componentPath, "../", match);
        if (!next.endsWith(".less")) {
          next += ".less";
        }

        curFileDepends.push(next);

        return `@import "${next}";`;
      });

    fileContents[componentPath] = resolvedContent;
    files.push(curFileDepends);
  } catch (err) {
    // console.log(err);
  }
}

const componentPaths = getAntdLessPath(join(__dirname, "./es/button"));
// console.log(componentPaths);
// componentPaths.forEach(content =>
//   fs.appendFileSync(join(__dirname, "dist.less"), content + '\n')
// );

componentPaths.forEach(componentPath => parseAntdComponent(componentPath));

// 拓扑排序 有向无环图排序
const sortedFiles = sort(files).reverse();

console.log(sortedFiles);

sortedFiles.forEach(fileKey => {
  let content = fileContents[fileKey] || fs.readFileSync(fileKey, "utf8");

  // 去除 content 中的所有 @import 语句
  content = content.replace(/@import.*?;/g, "");

  fs.appendFileSync(join(__dirname, "./public/dist.less"), content);
});
