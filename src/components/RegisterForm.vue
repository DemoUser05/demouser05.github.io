<template>
  <form @submit.prevent="handleRegister">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit">Реєстрація</button>
    <button type="button" @click="handleGoogleRegister">Реєстрація через Google</button>
  </form>
</template>

<script>
import { ref } from "vue";
import { register, loginWithGoogle } from "../firebase/auth";
import { fetchUserData, saveUserProfileData } from "../firebase/firestore";

export default {
  setup() {
    const email = ref("");
    const password = ref("");

    const handleRegister = async () => {
      try {
        const user = await register(email.value, password.value);
        await saveUserProfileData(user.uid, "", "");
        alert("Реєстрація успішна!");
      } catch (error) {
        alert("Помилка реєстрації: " + error.message);
      }
    };

    const handleGoogleRegister = async () => {
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

        alert("Успішна реєстрація через Google!");
      } catch (error) {
        alert("Помилка реєстрації через Google: " + error.message);
      }
    };

    return { email, password, handleRegister, handleGoogleRegister };
  },
};
</script>
