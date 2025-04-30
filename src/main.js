import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';
import './assets/styles.css';

// Створення одного екземпляра додатка
const app = createApp(App);

// Додавання Pinia та Router
const pinia = createPinia();
app.use(pinia);
app.use(router);

// Монтування додатка
app.mount('#app');

// Логування помилок навігації
router.onError((error) => {
  console.error('Routing error:', error);
});
