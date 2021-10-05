import Vue              from 'vue';
import VueCodeHighlight from 'vue-code-highlight';
import App              from './App.vue';
import vuetify          from './plugins/vuetify';

Vue.config.productionTip = false;
Vue.use(VueCodeHighlight);
new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount('#app');