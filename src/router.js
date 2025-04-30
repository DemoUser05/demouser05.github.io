import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from "firebase/auth"; // Додано імпорт getAuth
import AboutUs from './components/AboutUs.vue';
import ShipControl from './components/ShipControl.vue';
import MissionsList from './components/MissionsList.vue';
import AchievementsSection from './components/AchievementsSection.vue';
import MissionComments from './components/MissionComments.vue';
import UserProfile from './components/UserProfile.vue';
import AuthStatus from './components/AuthStatus.vue';



const routes = [
  { path: '/', component: AboutUs },
  { path: '/ship', component: ShipControl },
  { path: '/missions', component: MissionsList },
  { path: '/achievements', component: AchievementsSection },
  { path: '/comments', component: MissionComments },
  { path: '/profile', component: UserProfile },
  { path: '/status', component: AuthStatus },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Перевірка авторизації перед переходом
router.beforeEach((to, from, next) => {
  const user = getAuth().currentUser; // Отримання поточного користувача
  if (to.meta.requiresAuth && !user) {
    next('/login'); // Перенаправлення на сторінку входу
  } else {
    next(); // Продовження навігації
  }
});

export default router;
