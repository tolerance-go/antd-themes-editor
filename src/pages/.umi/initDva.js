import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});
app.use(require('/Users/yangbin/pro/experiment/lesstojs/node_modules/dva-immer/lib/index.js').default());
app.model({ namespace: 'setting', ...(require('/Users/yangbin/pro/experiment/lesstojs/src/models/setting.js').default) });
