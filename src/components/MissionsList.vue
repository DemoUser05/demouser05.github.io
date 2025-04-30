<template>
  <div>
    <!-- Якщо користувач не автентифікований -->
    <div v-if="!isAuthenticated" class="not-authenticated">
      <h2>Доступ заборонено</h2>
      <p>Будь ласка, увійдіть в акаунт, щоб переглянути свої експедиції.</p>
      <button @click="redirectToLogin" class="login-button">Увійти</button>
    </div>

    <!-- Якщо користувач автентифікований -->
    <div v-else>
      <!-- Секція Експедиції -->
      <section id="missions">
        <h2>Експедиції</h2>
        <ul>
          <li v-for="mission in missions" :key="mission.id">
            Призначення: {{ mission.destination }} — Корабель: {{ mission.ship }} — Екіпаж: {{ mission.crew }} — Дата: {{ mission.date }}
          </li>
        </ul>

        <!-- Нові фільтри -->
        <div class="filters">
          <select v-model="selectedType" @change="filterMissions">
            <option value="">Всі типи</option>
            <option value="дослідницькі">Дослідницькі</option>
            <option value="рятувальні">Рятувальні</option>
            <option value="колонізація">Колонізація</option>
          </select>
          <select v-model="selectedDifficulty" @change="filterMissions">
            <option value="">Всі рівні складності</option>
            <option value="легка">Легка</option>
            <option value="середня">Середня</option>
            <option value="складна">Складна</option>
          </select>
        </div>

        <!-- Список місій з урахуванням фільтрації -->
        <div class="missions-list">
          <div 
            class="mission-card" 
            v-for="mission in filteredMissions" 
            :key="mission.id"
          >
            <h3>{{ mission.name }}</h3>
            <p>Призначення: {{ mission.destination }}</p>
            <p>Тип: {{ mission.type }}</p>
            <p>Складність: {{ mission.difficulty }}</p>
            <p>Тривалість: {{ mission.duration }} днів</p>
            <button 
              @click="missionsStore.startMission(mission.id)" 
              :disabled="mission.started || mission.completed"
            >
              {{ mission.completed ? "✅ Завершено" : mission.started ? "🚀 В процесі..." : "Почати місію" }}
            </button>
          </div>
        </div>
      </section>

      <!-- Секція Мої подорожі -->
      <section id="journeys">
        <h2>Мої подорожі</h2>
        <h2 id="timer">{{ missionsStore.timerDisplay }}</h2>

        <!-- Карта подорожей -->
        <div class="journey-map">
          <!-- Маркер корабля -->
          <div 
            id="ship-marker" 
            v-if="missionsStore.shipPosition && missionsStore.shipPosition.y !== undefined" 
            :style="{ top: missionsStore.shipPosition.y + '%', left: missionsStore.shipPosition.x + '%' }"
          ></div>

          <!-- Маркери місій -->
          <div 
            v-for="(marker, index) in missionsStore.markers" 
            :key="index" 
            class="journey-marker"
            :style="{ top: marker.top, left: marker.left }"
            :data-tooltip="marker.tooltip"
          ></div>
        </div>
        <div id="journey-details" class="details">
          <p v-html="missionsStore.journeyDetails"></p>
        </div>
      </section>
    </div>
  </div>
</template>


<script>
import { ref, computed, onMounted } from "vue"; // Імпортуємо ref, computed та onMounted
import { useMissionsStore } from "../stores/missionsStore";
//import { getExpeditions } from "../firebase/firestore"; 
import { getAuth } from "firebase/auth";
import { getUserExpeditions } from "../firebase/firestore";
import { addExpedition } from "../firebase/firestore";


export default {
  name: "MissionList",
  setup() {
    const missionsStore = useMissionsStore();
    const selectedType = ref(""); // Вибраний тип місії
    const selectedDifficulty = ref(""); // Вибраний рівень складності
    const missions = ref([]); // Місії для завантаження
    const isAuthenticated = ref(false); // Перевірка автентифікації
    //new
    const auth = getAuth();

  const loadExpeditions = async () => {
  const user = auth.currentUser;
  if (user) {
    isAuthenticated.value = true;
    missions.value = await getUserExpeditions(user.uid); // Завантажуємо тільки експедиції для поточного користувача
    console.log("Експедиції завантажені:", missions.value);
  } else {
    isAuthenticated.value = false; // Користувач не авторизований
  }
 };

 const addNewExpedition = async () => {
  const user = auth.currentUser;
  if (user) {
    const newMission = {
      name: "Нова експедиція",
      destination: "Марс",
      type: "дослідницькі",
      difficulty: "середня",
      duration: 15,
      userId: user.uid, // гарантія
    };
    await addExpedition(newMission, user.uid);
    await loadExpeditions(); // замість ручного додавання
  }
};


    const redirectToLogin = () => {
      window.location.href = "/profile"; // Перенаправлення на сторінку входу
    };

    //loadExpeditions(); // Викликаємо функцію при завантаженні сторінки

    const filteredMissions = computed(() => {
      return missionsStore.missions.filter((mission) => {
        return (
          (!selectedType.value || mission.type === selectedType.value) &&
          (!selectedDifficulty.value || mission.difficulty === selectedDifficulty.value)
        );
      });
    });

    const filterMissions = () => {
      // Місії оновлюються автоматично через computed
    };

    // Використання onMounted
    onMounted(() => {
      loadExpeditions();
    });

    return {
      missionsStore,
      selectedType,
      selectedDifficulty,
      filteredMissions,
      filterMissions,
      missions,
      isAuthenticated,
      addNewExpedition,
      redirectToLogin,
    };
  },
};
</script>




<style scoped>
.filters {
  display: flex;
  justify-content: left;
  margin-bottom: 20px;
  gap: 20px;
}

select {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  max-width: 200px;
}

.missions-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Фіксована кількість колонок: 3 */
  gap: 30px; /* Відстань між картками */
  justify-content: center; /* Центруємо весь контейнер */
  padding: 20px;
}

.mission-card {
  background-color: #16203a;
  padding: 15px;
  border-radius: 10px; /* Закруглені кути */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Тінь */
  text-align: center;
}
.missions-container {
  padding: 20px;
  background-color: #1c2541;
  border-radius: 10px;
  color: white;
  max-width: 1200px; /* Збільшена ширина */
  margin: 0 auto; /* Центрування контейнера */
}

.missions-title {
  text-align: center;
  font-size: 32px;
  margin-bottom: 20px;
  color: #ffcc00;
}


.mission-card h3 {
  font-size: 20px;
  color: #ffcc00;
}

.mission-card p {
  font-size: 16px;
  margin: 10px 0; /* Відступи між рядками */
}

</style>
