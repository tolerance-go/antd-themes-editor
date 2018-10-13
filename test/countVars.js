const less = require("less");
const fs = require("fs");
const less2 = require("less-vars-to-js");
const path = require("path");

const content = fs.readFileSync(
  "./node_modules/antd/lib/style/themes/default.less",
  {
    encoding: "utf8"
  }
);

const vars = less2(content);

const keys = Object.keys(vars);

const maincss = `\n.main { 
${keys.map((item, index) => `  width${index}: ${item};`).join("\n")} 
}`;

const resolver = {
  install: function(_less, pluginManager) {
    var fm = new less.FileManager();
    fm.loadFile = function(filename, dir, options, env, cb) {
      return new Promise(function(resolve, reject) {
        filename = path.join(dir, filename);
        if (!filename.endsWith(".less")) {
          filename += ".less";
        }
        console.log(filename);
        const contents = fs.readFileSync(filename, "utf8");
        // FIXME adding prefix while I shouldn't have to
        resolve({ contents, filename });
        // or
        // reject("could not find " + filename);
      });
    };
    fm.supportsSync = false;
    pluginManager.addFileManager(fm);
  }
};

less
  .render(content + maincss, {
    plugins: [resolver],
    javascriptEnabled: true,
    filename: path.join(
      __dirname,
      "./node_modules/antd/lib/style/themes/default.less"
    )
  })
  .then((res, imports) => {
    const vals = res.css.match(/width(.*?);/gi).map(item => {
      return item.replace(/width\d+:\s?(.*?);/, (lib, match) => {
        return match;
      });
    });

    keys.reduce((obj, key, index) => {
      obj[key] = vals[index];
      return obj;
    }, {});

    return keys.reduce((obj, key, index) => {
      obj[key] = vals[index];
      return obj;
    }, {});
  })
  .then(vars => {
    let lesses = "";
    Object.keys(vars).forEach(varName => {
      const value = vars[varName];
      lesses += `${varName} : ${value};\n`;
    });
    fs.writeFileSync(path.join(__dirname, "./countVars.less"), lesses, "utf8");
    fs.writeFileSync(
      path.join(__dirname, "./vars.json"),
      JSON.stringify(vars),
      "utf8"
    );
  })
  .catch(err => console.log(err));
