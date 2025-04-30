<template>
  <form @submit.prevent="handleLogin">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit">Вхід</button>
    <button type="button" @click="handleGoogleLogin">Увійти через Google</button>
  </form>
</template>

<script>
import { ref } from "vue";
import { login, loginWithGoogle } from "../firebase/auth";
import { fetchUserData, saveUserProfileData } from "../firebase/firestore";

export default {
  setup() {
    const email = ref("");
    const password = ref("");

    const handleLogin = async () => {
      try {
        await login(email.value, password.value);
        alert("Вхід успішний!");
      } catch (error) {
        alert("Помилка входу: " + error.message);
      }
    };

    const handleGoogleLogin = async () => {
      try {
        const user = await loginWithGoogle();
        const userData = await fetchUserData(user.uid);

        if (!userData) {
          await saveUserProfileData(
            user.uid,
            user.displayName || "Користувач",
            "" // аватар за замовчуванням
          );
        }

        alert("Успішний вхід через Google!");
      } catch (error) {
        alert("Помилка входу через Google: " + error.message);
      }
    };

    return { email, password, handleLogin, handleGoogleLogin };
  },
};
</script>
