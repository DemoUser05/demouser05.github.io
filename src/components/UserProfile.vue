<template>
  <section id="user-profile" class="profile-container">
    <!-- Форма входу -->
    <div v-if="!isAuthenticated && !showRegister">
      <h2>Вхід</h2>
      <form @submit.prevent="handleLogin">
  <input v-model="email" type="email" placeholder="Email" required />
  <input v-model="password" type="password" placeholder="Пароль" required />
  <button type="submit">Увійти</button>
</form>
<div class="google-login-container">
  <button @click="handleGoogleLogin" class="google-button">Увійти через Google</button>
</div>

      <p>Немає облікового запису? <button @click="toggleRegister">Зареєструватися</button></p>
    </div>

    <!-- Форма реєстрації -->
    <div v-if="!isAuthenticated && showRegister">
      <h2>Реєстрація</h2>
      <form @submit.prevent="handleRegister">
  <input v-model="email" type="email" placeholder="Email" required />
  <input v-model="password" type="password" placeholder="Пароль" required />
  <button type="submit">Зареєструватися</button>
</form>
<div class="google-login-container">
  <button @click="handleGoogleLogin" class="google-button">Реєстрація через Google</button>
</div>

      <p>Вже маєте обліковий запис? <button @click="toggleRegister">Увійти</button></p>
    </div>

    <!-- Профіль користувача -->
    <div v-if="isAuthenticated">
      <h2>Ваш профіль</h2>
      <!-- Вибір аватарки -->
      <div class="avatar-section">
        <h3>Оберіть аватар</h3>
        <div v-if="isAvatarSelected" class="selected-avatar">
          <img :src="selectedAvatar" alt="Обраний аватар" />
          <button @click="resetAvatarSelection" class="change-avatar-button">Змінити аватар</button>
        </div>
        <div v-else class="avatars">
          <img
            v-for="(avatar, index) in avatarOptions"
            :key="index"
            :src="avatar"
            :alt="'Аватар ' + (index + 1)"
            @click="selectAvatar(avatar)"
            :class="{ selected: selectedAvatar === avatar }"
          />
        </div>
      </div>

      <!-- Введення імені -->
      <div class="profile-details">
        <label for="username">Ваше ім'я:</label>
        <input
          type="text"
          id="username"
          v-model="username"
          placeholder="Введіть ваше ім'я"
          @input="updateUserData"
        />
      </div>

      <!-- Поля, пов'язані із симулятором -->
      <div class="simulation-fields">
        <h3>Інформація симулятора</h3>
        <p>Рівень космонавта: {{ astronautLevel }}</p>
      </div>

      <button @click="handleLogout" class="logout-button">Вийти</button>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from "vue";
import { fetchUserData, saveUserProfileData } from "../firebase/firestore";
import { login, register, logout, getCurrentUser } from "../firebase/auth";
import { loginWithGoogle } from "../firebase/auth";

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const isAuthenticated = ref(false);
    const showRegister = ref(false);
    const username = ref("");
    const selectedAvatar = ref("");
    const userId = ref(null);
    const isAvatarSelected = ref(false);
    const avatarOptions = ref([
      require('@/assets/avatar1.png'),
      require('@/assets/avatar2.png'),
      require('@/assets/avatar3.png'),
      require('@/assets/avatar4.png'),
    ]);
    const astronautLevel = ref("Початківець");
    const expeditionStatus = ref("Жодних активних експедицій");

    // Логіка вибору аватара
    const selectAvatar = async (avatar) => {
      selectedAvatar.value = avatar;
      isAvatarSelected.value = true;
      await updateUserData();
    };

    const resetAvatarSelection = () => {
      isAvatarSelected.value = false;
    };

    // Логіка входу
    const handleLogin = async () => {
      try {
        const user = await login(email.value, password.value);
        isAuthenticated.value = true;
        userId.value = user.uid;
        const userData = await fetchUserData(user.uid);
        if (userData) {
          username.value = userData.username || "";
          selectedAvatar.value = userData.avatar || avatarOptions.value[0];
        }
      } catch (error) {
        alert("Помилка входу: " + error.message);
      }
    };

    // Логіка реєстрації
    const handleRegister = async () => {
      try {
        const user = await register(email.value, password.value);
        isAuthenticated.value = true;
        userId.value = user.uid;
        await saveUserProfileData(user.uid, username.value, selectedAvatar.value);
        showRegister.value = false; // Повертаємо до профілю
      } catch (error) {
        alert("Помилка реєстрації: " + error.message);
      }
    };

    const handleGoogleLogin = async () => {
     try {
        const user = await loginWithGoogle();
        isAuthenticated.value = true;
        userId.value = user.uid;

        const userData = await fetchUserData(user.uid);
        if (userData) {
      username.value = userData.username || user.displayName || "";
      selectedAvatar.value = userData.avatar || avatarOptions.value[0];
      isAvatarSelected.value = !!userData.avatar;
    } else {
      await saveUserProfileData(user.uid, user.displayName || "", "");
    }
  } catch (error) {
    alert("Помилка входу через Google: " + error.message);
  }
};

    // Логіка виходу
    const handleLogout = async () => {
      try {
        await logout();
        isAuthenticated.value = false;
        userId.value = null;
      } catch (error) {
        alert("Помилка виходу: " + error.message);
      }
    };

    // Завантаження профілю
    const loadUserProfile = async () => {
      try {
        const user = getCurrentUser();
        if (user) {
          isAuthenticated.value = true;
          userId.value = user.userId;
          const userData = await fetchUserData(user.userId);
          if (userData) {
            username.value = userData.username || "";
            selectedAvatar.value = userData.avatar || avatarOptions.value[0];
            isAvatarSelected.value = !!userData.avatar;
          }
        }
      } catch (error) {
        console.error("Помилка завантаження даних профілю:", error.message);
      }
    };

    // Оновлення даних
    const updateUserData = async () => {
      if (userId.value) {
        await saveUserProfileData(userId.value, username.value, selectedAvatar.value);
      }
    };

    const toggleRegister = () => {
      showRegister.value = !showRegister.value;
    };

    onMounted(loadUserProfile);

    return {
      email,
      password,
      isAuthenticated,
      showRegister,
      username,
      selectedAvatar,
      avatarOptions,
      astronautLevel,
      expeditionStatus,
      isAvatarSelected,
      handleLogin,
      handleRegister,
      handleLogout,
      updateUserData,
      selectAvatar,
      resetAvatarSelection,
      toggleRegister,
      handleGoogleLogin,
    };
  },
};
</script>



<style scoped>
.profile-container {
  padding: 20px;
  background-color: #1c2541;
  border-radius: 10px;
  color: white;
  max-width: 800px;
  margin: 0 auto;
}

h2, h3 {
  text-align: center;
  color: #ffcc00;
}

.avatar-section {
  text-align: center;
  margin-bottom: 20px;
}

.avatars {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.avatars img {
  width: 80px;
  height: 80px;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 50%;
  transition: transform 0.3s, border 0.3s;
}

.avatars img:hover {
  transform: scale(1.1);
  border-color: #ffcc00;
}

.selected-avatar img {
  width: 150px;
  height: 150px;
  margin: 0 auto;
  display: block;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.selected-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.change-avatar-button {
  background-color: #ffcc00;
  color: black;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.change-avatar-button:hover {
  background-color: #ff9900;
}

/* Контейнер для кнопок Google Login */
.google-login-container {
  text-align: center; /* Центрування кнопок */
  margin-top: 5px; /* Відступ зверху */
}

/* Кнопки Google */
.google-button {
  padding: 10px 20px;
  background-color:  #ffcc00; /* Google синій */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.google-button:hover {
  background-color: #ff9900; /* Темніший відтінок синього для наведення */
}

</style>