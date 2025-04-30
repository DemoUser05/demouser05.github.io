import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "./firebaseConfig";

// Реєстрація
export const register = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Користувач зареєстрований: ", user);

    // Зберігаємо статус авторизації
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userId", user.uid);

    return user;
  } catch (error) {
    console.error("Помилка реєстрації: ", error.message);
    throw error;
  }
};

// Вхід
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Користувач увійшов: ", user);

    // Зберігаємо стан авторизації
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userId", user.uid);

    return user;
  } catch (error) {
    console.error("Помилка входу: ", error.message);
    throw error;
  }
};

// Відстеження стану авторизації
export const trackAuthState = (callback) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Користувач авторизований:", user);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userId", user.uid); // Зберігаємо ID користувача
      callback(user); // Передаємо дані користувача у callback
    } else {
      console.log("Користувач не авторизований.");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userId");
      callback(null); // Передаємо null у callback
    }
  });
};

// Вихід
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("Вихід успішний!");

    // Видаляємо стан авторизації
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userId");
  } catch (error) {
    console.error("Помилка виходу: ", error.message);
    throw error;
  }
};

// Перевірка поточного користувача з локального сховища
export const getCurrentUser = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userId = localStorage.getItem("userId");
  if (isAuthenticated && userId) {
    return { isAuthenticated, userId }; // Повертаємо статус авторизації та ID
  }
  return null; // Якщо користувач не авторизований
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};