const less = require("less");
const fs = require("fs");
const { join } = require("path");
const lessToJs = require("less-vars-to-js");

const resolver = {
  install(_less, pluginManager) {
    const fm = new less.FileManager();
    fm.loadFile = (filename, dir) => {
      return new Promise((resolve, reject) => {
        try {
          filename = join(dir, filename);
          if (!filename.endsWith(".less")) {
            filename += ".less";
          }
          const contents = fs.readFileSync(filename, "utf8");
          // FIXME adding prefix while I shouldn't have to
          resolve({ contents, filename });
        } catch (error) {
          reject(error);
        }
      });
    };
    fm.supportsSync = false;
    pluginManager.addFileManager(fm);
  }
};

function generateVars(themePath, themeVars) {
  const content = fs.readFileSync(themePath, {
    encoding: "utf8"
  });

  const keys = Object.keys(themeVars);

  const maincss = `\n.main {
  ${keys.map((item, index) => `  width${index}: ${item};`).join("\n")}
  }`;

  return less
    .render(content + maincss, {
      plugins: [resolver],
      javascriptEnabled: true,
      filename: themePath
    })
    .then(res => {
      const vals = res.css.match(/width(.*?);/gi).map(item => {
        return item.replace(/width\d+:\s?(.*?);/, (lib, match) => {
          return match;
        });
      });

      keys.reduce((obj, key, index) => {
        obj[key] = vals[index];
        return obj;
      }, {});

      const themeCountVars = keys.reduce((obj, key, index) => {
        obj[key] = vals[index];
        return obj;
      }, {});

      return themeCountVars;
    })
    .catch(err => console.log(err));
}

const antdThemePath = join(
  __dirname,
  "../public/hotTheme/antd/lib/style/themes/default.less"
);

const componentsThemePath = join(
  __dirname,
  "../public/hotTheme/components/style/themes.less"
);

const antdThemeVars = lessToJs(fs.readFileSync(antdThemePath, "utf8"));

const componentsThemeVars = lessToJs(
  fs.readFileSync(componentsThemePath, "utf8")
);

// 自定义主题变量
const customAntdThemeVars = require(join(
  __dirname,
  "../src/defaultSettings.js"
)).themeVars;

Promise.all([
  generateVars(antdThemePath, antdThemeVars),
  generateVars(componentsThemePath, componentsThemeVars)
])
  .then(([antdThemeCountedVars, componentsThemeCountedVars]) => {
    console.log('generate src/models/theme.json success!')
    fs.writeFileSync(
      join(__dirname, "../src/models/theme.json"),
      JSON.stringify(
        Object.assign(
          antdThemeCountedVars,
          customAntdThemeVars,
          componentsThemeCountedVars
        )
      )
    );
  })
  .catch(err => console.log(err));
