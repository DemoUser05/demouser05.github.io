import { collection, addDoc, getDocs, doc, setDoc,  getDoc, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "./firebaseConfig";

// Функція для запису даних профілю
export const saveUserProfileData = async (userId, username, avatarUrl) => {
  try {
    await setDoc(
      doc(db, "users", userId), // Документ користувача на основі userId
      {
        userId: userId, // Додаємо userId
        username: username,
        avatar: avatarUrl,
      },
      { merge: true } // Злиття з існуючим документом
    );
    console.log("Дані профілю успішно збережені!");
  } catch (error) {
    console.error("Помилка збереження даних профілю:", error.message);
  }
};



// Функція для читання даних користувача
export const fetchUserData = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const userId = user.uid;
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Дані користувача:", docSnap.data());
        return docSnap.data(); // Повертаємо дані користувача
      } else {
        console.log("Документ не знайдено!");
        return null;
      }
    } catch (error) {
      console.error("Помилка читання даних:", error.message);
      throw error;
    }
  } else {
    console.error("Користувач не авторизований");
    return null;
  }
};

// Додавання корабля
export const addShip = async (name, type, capacity) => {
  try {
    const docRef = await addDoc(collection(db, "ships"), {
      name: name,
      type: type,
      capacity: capacity,
    });
    console.log("Корабель додано з ID:", docRef.id);
  } catch (error) {
    console.error("Помилка додавання корабля:", error.message);
  }
};

export const saveShipStatus = async (userId, shipData) => {
  try {
    const shipRef = doc(db, "ships", userId);
    await setDoc(shipRef, shipData, { merge: true }); // Оновлення документа
    console.log("Стан корабля успішно збережено!");
  } catch (error) {
    console.error("Помилка збереження стану корабля:", error.message);
  }
};

/* Додавання експедиції
export const addExpedition = async (destination, ship, crew, date) => {
  try {
    const docRef = await addDoc(collection(db, "expeditions"), {
      destination: destination,
      ship: ship,
      crew: crew,
      date: date,
    });
    console.log("Експедицію додано з ID:", docRef.id);
  } catch (error) {
    console.error("Помилка додавання експедиції:", error.message);
  }
};*/

// Завантаження кораблів
export const getShips = async () => {
  const ships = [];
  try {
    const querySnapshot = await getDocs(collection(db, "ships"));
    querySnapshot.forEach((doc) => {
      ships.push({ id: doc.id, ...doc.data() });
    });
    console.log("Кораблі:", ships);
    return ships;
  } catch (error) {
    console.error("Помилка завантаження кораблів:", error.message);
  }
};

// Завантаження експедицій
export const getExpeditions = async () => {
  const expeditions = [];
  try {
    const querySnapshot = await getDocs(collection(db, "expeditions"));
    querySnapshot.forEach((doc) => {
      expeditions.push({ id: doc.id, ...doc.data() });
    });
    console.log("Експедиції:", expeditions);
    return expeditions;
  } catch (error) {
    console.error("Помилка завантаження експедицій:", error.message);
  }
};

/*const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9); // Генерує унікальний рядок
};*/


/* Додавання експедиції
export const addExpedition = async (destination, ship, crew, date, userId) => {
  try {
    await setDoc(doc(db, "expeditions", generateUniqueId()), {
      destination: destination,
      ship: ship,
      crew: crew,
      date: date,
      status: "Завершена",
      userId: userId,
    });
    console.log("Експедицію успішно збережено!");
  } catch (error) {
    console.error("Помилка додавання експедиції:", error.message);
  }
};*/
// Додавання нової експедиції


export const addExpedition = async (mission, userId) => {
  try {
    mission.userId = userId; // Прив'язуємо експедицію до користувача
    const docRef = await addDoc(collection(db, "expeditions"), mission);
    console.log("Експедиція додана з ID:", docRef.id);
  } catch (error) {
    console.error("Помилка додавання експедиції:", error.message);
  }
};





/* Отримання експедицій користувача
export const getUserExpeditions = async (userId) => {
  try {
    const tripsQuery = query(
      collection(db, "expeditions"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(tripsQuery);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Помилка завантаження експедицій:", error.message);
  }
}*/
// Завантаження експедицій для користувача
export const getUserExpeditions = async (userId) => {
  try {
    const expeditionsQuery = query(
      collection(db, "expeditions"),
      where("userId", "==", userId) // Фільтруємо за userId
    );
    const querySnapshot = await getDocs(expeditionsQuery);
    const expeditions = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    console.log("Експедиції для користувача:", userId, expeditions);
    return expeditions;
  } catch (error) {
    console.error("Помилка завантаження експедицій:", error.message);
    return [];
  }
};


// Оновлення існуючої експедиції
export const updateExpeditionStatus = async (expeditionId, updates) => {
  try {
    const expeditionRef = doc(db, "expeditions", expeditionId);
    await setDoc(expeditionRef, updates, { merge: true });
    console.log("Експедиція оновлена:", updates);
  } catch (error) {
    console.error("Помилка оновлення експедиції:", error.message);
  }
};

export const getShipStatus = async (userId) => {
  try {
    const shipRef = doc(db, "ships", userId); // Використовуємо userId як ключ
    const shipSnap = await getDoc(shipRef);

    if (shipSnap.exists()) {
      console.log("Стан корабля завантажено:", shipSnap.data());
      return shipSnap.data(); // Повертаємо стан корабля
    } else {
      console.log("Документ корабля не знайдено для користувача:", userId);
      return { fuel: 100, energy: 100, crew: 100 }; // Початковий стан корабля
    }
  } catch (error) {
    console.error("Помилка завантаження стану корабля:", error.message);
    return { fuel: 100, energy: 100, crew: 100 };
  }
};

export const addCommentToFirestore = async (comment) => {
  try {
    await addDoc(collection(db, "comments"), comment);
    console.log("Коментар успішно збережено!");
  } catch (error) {
    console.error("Помилка додавання коментаря:", error.message);
  }
};

export const fetchComments = async () => {
  const comments = [];
  try {
    const querySnapshot = await getDocs(collection(db, "comments"));
    querySnapshot.forEach((doc) => {
      comments.push({ id: doc.id, ...doc.data() });
    });
    // Сортування за часом
    comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    console.log("Коментарі завантажено:", comments);
    return comments;
  } catch (error) {
    console.error("Помилка завантаження коментарів:", error.message);
    return [];
  }
};


