import Vue              from 'vue';
import VueCodeHighlight from 'vue-code-highlight';
import App              from './App.vue';
import vuetify          from './plugins/vuetify';
import VueChatScroll    from 'vue-chat-scroll';

Vue.config.productionTip = false;
Vue.use(VueCodeHighlight);
Vue.use(VueChatScroll);
new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
