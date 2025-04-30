<template>
  <div class="ship-control-container">
    <!-- Секція Космічний корабель -->
    <section class="ship-section">
      <h2>Космічний корабель</h2>
      <ul>
        <li v-for="ship in ships" :key="ship.id">
          Назва: {{ ship.name }} — Тип: {{ ship.type }} — Місткість: {{ ship.capacity }}
        </li>
      </ul>
      <p>Керуйте станом судна: рівень пального, енергії, екіпаж.</p>
      <div class="button-group">
        <button @click="refuel">🔋 Заправити паливо</button>
        <button @click="rechargeEnergy">⚡ Перезарядити енергію</button>
        <button @click="restoreCrew">👨‍🚀 Відновити екіпаж</button>
      </div>
    </section>

   <!-- Секція Показників -->
    <section id="indicators" class="container">
      <h2>Показники стану корабля</h2>
      <div class="progress">
        <span>Паливо</span>
        <div class="progress-bar" :style="{ width: missionsStore.shipStatus.fuel + '%' }">
          {{ missionsStore.shipStatus.fuel }}%
        </div>
      </div>
      <div class="progress">
        <span>Енергія</span>
        <div class="progress-bar" :style="{ width: missionsStore.shipStatus.energy + '%' }">
          {{ missionsStore.shipStatus.energy }}%
        </div>
      </div>
      <div class="progress">
        <span>Екіпаж</span>
        <div class="progress-bar" :style="{ width: missionsStore.shipStatus.crew + '%' }">
          {{ missionsStore.shipStatus.crew }}%
        </div>
      </div>
    </section>


    <!-- Секція Модернізація -->
    <section class="ship-section">
      <h2>Модернізація корабля</h2>
      <p>Покращуйте свій космічний корабель, щоб бути готовими до найскладніших викликів галактики!<br>
         Двигуни забезпечать більшу швидкість, щити – захист від небезпек, а сенсори – точніше сканування космосу.</p>
      <button @click="openUpgradeModal">🛠️ Модернізація</button>
    </section>

    <!-- Модальне вікно -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>Оберіть модернізацію:</h3>
        <button @click="upgrade('Двигуни', 20, 10, 5)">
          🚀 Двигуни (+Швидкість) [Ціна: 20 пального, 10 енергії, 5 екіпажу]
        </button>
        <button @click="upgrade('Щити', 10, 15, 5)">
          🛡️ Щити (+Захист) [Ціна: 10 пального, 15 енергії, 5 екіпажу]
        </button>
        <button @click="upgrade('Сенсори', 5, 20, 3)">
          📡 Сенсори (+Сканери) [Ціна: 5 пального, 20 енергії, 3 екіпажу]
        </button>
        <button @click="closeUpgradeModal">Закрити</button>
      </div>
    </div>

    <!-- Секція Каруселі -->
    <section class="carousel-container">
    <h2 class="carousel-title">Оберіть свій космічний корабель</h2>
    <div class="carousel">
      <input type="radio" name="radio-btn" id="slide1" checked>
      <input type="radio" name="radio-btn" id="slide2">
      <input type="radio" name="radio-btn" id="slide3">
      <input type="radio" name="radio-btn" id="slide4">

      <div class="slides">
        <div class="slide">
          <img src="@/assets/ship1.webp" alt="Космічний корабель 1">
          <div class="desc">
            Корабель «Альтаїр-9» <br>
            Тип: Розвідувальний корабель<br>
            Двигуни: Іонні з блакитними світловими хвостами<br>
            Максимальна швидкість: 0.6 швидкості світла<br>
            Особливості: Легкий бронекорпус, розширена система сенсорів для глибокого космосу<br>
            Призначення: Дослідження далеких зоряних систем.
          </div>
        </div>
        <div class="slide">
          <img src="@/assets/ship2.webp" alt="Космічний корабель 2">
          <div class="desc">
            Корабель «Тінь-22» <br>
            Тип: Стелс-корабель для спецоперацій<br>
            Двигуни: Безшумні плазмові генератори<br>
            Максимальна швидкість: 0.9 швидкості світла<br>
            Особливості: Система маскування, невидимість для радарів<br>
            Призначення: Таємні місії та шпигунство.
          </div>
        </div>
        <div class="slide">
          <img src="@/assets/ship3.webp" alt="Космічний корабель 3">
          <div class="desc">
            Корабель «Геліос-3» <br>
            Тип: Важкий крейсер<br>
            Двигуни: Антиматерійні<br>
            Максимальна швидкість: 0.8 швидкості світла<br>
            Особливості: Потужний щитовий захист<br>
          </div>
        </div>
        <div class="slide">
          <img src="@/assets/ship4.webp" alt="Космічний корабель 4">
          <div class="desc">
            Корабель «Аурора-Ω» <br>
            Тип: Біомеханічний дослідницький корабель<br>
            Двигуни: Органічні плазмові реактори<br>
            Максимальна швидкість: 0.95 швидкості світла<br>
            Особливості: Самовідновлюваний корпус<br>
          </div>
        </div>
      </div>

      <!-- Єдина навігація -->
      <div class="navigation">
        <label for="slide1"></label>
        <label for="slide2"></label>
        <label for="slide3"></label>
        <label for="slide4"></label>
      </div>
    </div>
  </section>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useMissionsStore } from "../stores/missionsStore";
import { saveShipStatus, getShipStatus } from "../firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  name: "ShipControl",
  setup() {
    const missionsStore = useMissionsStore();
    const showModal = ref(false);
    const ships = ref([]);
    const auth = getAuth();

    // Завантаження стану корабля
    const loadShipStatus = async () => {
      const user = auth.currentUser; // Отримуємо поточного користувача
      if (user) {
        const shipStatus = await getShipStatus(user.uid); // Завантажуємо стан корабля
        missionsStore.shipStatus = shipStatus; // Оновлюємо локальний стан
      }
    };

    // Збереження стану корабля
    const saveCurrentShipStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        await saveShipStatus(user.uid, missionsStore.shipStatus); // Зберігаємо стан у Firebase
      }
    };

    // Оновлення пального
    const refuel = async () => {
      if (missionsStore.shipStatus.fuel >= 100) {
        alert("Паливо вже на максимумі!");
      } else {
        missionsStore.updateShipStatus(20, 0, 0);
        await saveCurrentShipStatus(); // Зберігаємо оновлений стан
      }
    };

    // Оновлення енергії
    const rechargeEnergy = async () => {
      if (missionsStore.shipStatus.energy >= 100) {
        alert("Енергія вже на максимумі!");
      } else {
        missionsStore.updateShipStatus(0, 15, 0);
        await saveCurrentShipStatus(); // Зберігаємо оновлений стан
      }
    };

    // Оновлення екіпажу
    const restoreCrew = async () => {
      if (missionsStore.shipStatus.crew >= 100) {
        alert("Екіпаж вже на максимумі!");
      } else {
        missionsStore.updateShipStatus(0, 0, 10);
        await saveCurrentShipStatus(); // Зберігаємо оновлений стан
      }
    };

    const openUpgradeModal = () => {
      showModal.value = true;
    };

    const closeUpgradeModal = () => {
      showModal.value = false;
    };

    const upgrade = (type, fuelCost, energyCost, crewCost) => {
      if (
        missionsStore.shipStatus.fuel < fuelCost ||
        missionsStore.shipStatus.energy < energyCost ||
        missionsStore.shipStatus.crew < crewCost
      ) {
        alert(`Недостатньо ресурсів для модернізації: ${type}`);
        return;
      }

      missionsStore.updateShipStatus(-fuelCost, -energyCost, -crewCost);
      alert(`Модернізація "${type}" успішно завершена!`);
      closeUpgradeModal();
    };

    // Виклик функції завантаження стану корабля
    onMounted(() => {
      loadShipStatus();
    });

    return {
      missionsStore,
      showModal,
      refuel,
      rechargeEnergy,
      restoreCrew,
      openUpgradeModal,
      closeUpgradeModal,
      upgrade,
      ships,
    };
  },
};
</script>

<style scoped>
/* Заголовок */
.carousel-title {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  color: #ffcc00;
  margin-bottom: 20px; /* Відступ від каруселі */
}

/* Контейнер каруселі */
.carousel-container {
  display: flex;
  flex-direction: column; /* Вирівнювання заголовка над каруселлю */
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 10px;
}

/* Карусель */
.carousel {
  width: 600px;
  height: 480px;
  overflow: hidden;
  position: relative;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
  margin: auto;
}


</style>

