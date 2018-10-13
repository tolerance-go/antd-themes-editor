import { message } from "antd";

const LOCAL_THEME = "LOCAL_THEME";
const themeVars = require("./theme.json");

const modifiedThemeVars = JSON.parse(localStorage.getItem(LOCAL_THEME)) || {};

function updateTheme(themes) {
  if (!window.less) return;
  const hideMessage = message.loading("正在编译主题！", 0);
  setTimeout(() => {
    window.less
    .modifyVars(themes)
    .then(() => hideMessage())
    .catch(() => {
      hideMessage();
      message.error("编译失败!");
    });
  }, 200);
}

export default {
  namespace: "setting",
  state: {
    themeVars: Object.keys(themeVars)
      .filter(item => {
        return (
          themeVars[item].endsWith("px") ||
          themeVars[item].startsWith("#") ||
          themeVars[item].startsWith("rgb")
        );
      })
      .reduce((obj, next) => {
        obj[next] = themeVars[next];
        return obj;
      }, {}),
    modifiedThemeVars
  },
  reducers: {
    changeTheme(state, action = {}) {
      const { payload } = action;
      const next = {
        ...state,
        modifiedThemeVars: {
          ...state.modifiedThemeVars,
          ...payload
        }
      };
      updateTheme(next.modifiedThemeVars);
      return next;
    }
  },

  effects: {
    *saveThemeVars(_, { select }) {
      const modifiedThemeVars = yield select(
        state => state.setting.modifiedThemeVars
      );

      try {
        localStorage.setItem(LOCAL_THEME, JSON.stringify(modifiedThemeVars));
      } catch {
        return false;
      }

      return true;
    }
  }
};
