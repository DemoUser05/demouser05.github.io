<template>
  <div class="app-container">
    <header>
      <h1>Симулятор космічної експедиції</h1>
      <nav class="navigation-bar">
        <router-link to="/" class="nav-item">Про симулятор</router-link>
        <router-link to="/ship" class="nav-item">Космічний корабель</router-link>
        <router-link to="/missions" class="nav-item">Експедиції</router-link>
        <router-link to="/achievements" class="nav-item">Досягнення</router-link>
        <router-link to="/comments" class="nav-item">Відгуки</router-link>
        <router-link to="/profile" class="profile-icon">
          <img src="@/assets/profile-icons.png" alt="Профіль" />
        </router-link>
        
      </nav>
    </header>
    <main class="main-content">
      <!--<section class="firestore-section">
        <h2>Тестування Firestore</h2>
        <button @click="addUserData" class="firestore-button">Додати дані користувача</button>
        <button @click="readUserData" class="firestore-button">Отримати дані користувачів</button>
      </section> -->
      <router-view />
    </main>
    <FooterPart /> <!-- Футер -->
  </div>
</template>

<script>
import FooterPart from './components/FooterPart.vue'; // Імпорт футера
import { saveUserData, fetchUserData } from "./firebase/firestore"; // Імпорт функцій Firestore

export default {
  name: 'App',
  components: {
    FooterPart, // Реєстрація футера
  },
  methods: {
    addUserData() {
      // Тестова функція для збереження даних
      saveUserData("John Doe", "johndoe@example.com", 25); 
    },
    readUserData() {
      // Тестова функція для читання даних
      fetchUserData(); 
    },
  },
};
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.navigation-bar {
  display: flex;
  justify-content: center; /* Посилання навігації будуть по центру */
  align-items: center; /* Вирівнювання по вертикалі */
  gap: 20px;
  background-color: #1c2541;
  padding: 10px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  position: relative; /* Позиціювання для іконки */
}

.nav-item {
  text-decoration: none;
  font-size: 16px;
  font-weight: bold;
  color: white;
  transition: color 0.3s, transform 0.3s ease-in-out, letter-spacing 0.3s ease;
}

.nav-item:hover {
  color: #ffcc00;
}

.firestore-section {
  margin: 20px 0;
  text-align: center;
}

.firestore-button {
  margin: 10px;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.firestore-button:hover {
  background-color: #218838;
}

/* Іконка профілю */
.profile-icon {
  position: absolute;
  right: 20px; /* Відступ від правого краю */
  bottom: 10px;

}

.profile-icon img {
  width: 36px;
  height: 36px;
  border-radius: 50%; /* Для круглої форми */
  cursor: pointer;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.profile-icon img:hover {
  transform: scale(1.1);
  opacity: 0.8;
}
</style>
