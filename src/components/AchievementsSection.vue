<template>
  <section id="achievements">
    <h2>Досягнення</h2>
    <div class="achievements-wrapper">
      <div 
        v-for="mission in missionsStore.missions" 
        :key="mission.id" 
        class="achievement"
      >
        <p>{{ mission.name }}</p>
        <div 
          class="progress-bar" 
          :style="{ width: mission.progress + '%' }"
        >
          <!-- Динамічне відображення статусу -->
          {{ mission.progress === 0 
              ? '0% (Не розпочато)' 
              : mission.progress < 100 
              ? mission.progress + '% (В процесі)' 
              : '100% (Виконано)' }}
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import { useMissionsStore } from '../stores/missionsStore';

export default {
  name: "AchievementsSection",
  setup() {
    const missionsStore = useMissionsStore();
    return { missionsStore };
  },
};
</script>

<style scoped>
.achievements-wrapper {
  grid-template-columns: repeat(3, 1fr); /* Фіксована кількість колонок: 3 */
  gap: 30px; /* Відстань між картками */
  justify-content: center; /* Центруємо весь контейнер */
  padding: 20px;
}

</style>