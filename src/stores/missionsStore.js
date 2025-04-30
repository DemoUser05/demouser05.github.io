import { defineStore } from 'pinia';

export const useMissionsStore = defineStore('missions', {
  state: () => ({
    missions: [
      { 
        id: 1, 
        name: "Марсіанські дослідження", 
        destination: "Марс", 
        duration: 30, 
        started: false, 
        completed: false, 
        progress: 0,
        type: "дослідницькі", 
        difficulty: "легка" 
      },
      { 
        id: 2, 
        name: "Рятувальна операція 'Орбіта'", 
        destination: "Орбіта Землі", 
        duration: 10, 
        started: false, 
        completed: false, 
        progress: 0,
        type: "рятувальні", 
        difficulty: "середня" 
      },
      { 
        id: 3, 
        name: "Колонізація Титана", 
        destination: "Титан", 
        duration: 60, 
        started: false, 
        completed: false, 
        progress: 0,
        type: "колонізація", 
        difficulty: "складна" 
      },
      { 
        id: 4, 
        name: "Дослідження астероїдів", 
        destination: "Пояс астероїдів", 
        duration: 15, 
        started: false, 
        completed: false, 
        progress: 0,
        type: "дослідницькі", 
        difficulty: "середня" 
      },
      { 
        id: 5, 
        name: "Евакуація місяця Ганімед", 
        destination: "Ганімед", 
        duration: 25, 
        started: false, 
        completed: false, 
        progress: 0,
        type: "рятувальні", 
        difficulty: "складна" 
      },
      { 
        id: 6, 
        name: "Кільце сатурна", 
        destination: "Сатурн", 
        duration: 45, 
        started: false, 
        completed: false, 
        progress: 0,
        type: "дослідницькі", 
        difficulty: "складна" 
      },
    ],    
    markers: [
      { id: 1, top: "15%", left: "36%", tooltip: "Місія 1: Марс" },
      { id: 2, top: "37%", left: "76%", tooltip: "Місія 2: Орбіта Землі" },
      { id: 3, top: "63%", left: "38%", tooltip: "Місія 3: Титан" },
      { id: 4, top: "31%", left: "22%", tooltip: "Місія 4: Пояс астероїдів" },
      { id: 5, top: "45%", left: "81%", tooltip: "Місія 5: Ганімед" },
      { id: 6, top: "4%", left: "66%", tooltip: "Місія 6: Сатурн" },
    ],
    shipPosition: { x: 50, y: 50 },
    timerDisplay: "⏳ Час до прибуття:",
    journeyDetails: "Натисніть на маркер, щоб переглянути деталі.",
    shipStatus: {
      fuel: 50,
      energy: 70,
      crew: 65,
    },
  }),
  actions: {
    // Запуск місії
    startMission(missionId) {
      const mission = this.missions.find(m => m.id === missionId);
      if (mission) {
        mission.started = true;
        this.updateMissionProgress(missionId, 0);
        this.journeyDetails = `🚀 ${mission.name} розпочата! Призначення: ${mission.destination}`;

        let timeLeft = mission.duration;
        let elapsedTime = 0;

        const interval = setInterval(() => {
          elapsedTime++;
          timeLeft--;

          this.updateTimerDisplay(timeLeft);
          const progress = Math.floor((elapsedTime / mission.duration) * 100);
          this.updateMissionProgress(missionId, progress);

          // Випадкові події з шансом 10%
          if (Math.random() < 0.1) {
            this.triggerRandomEvent();
          }

          // Завершення місії
          if (timeLeft <= 0) {
            clearInterval(interval);
            mission.started = false;
            mission.completed = true;
            this.updateMissionProgress(missionId, 100);
            this.journeyDetails += `<p>🛬 ${mission.name} завершена! Вітаємо екіпаж!</p>`;
          }
        }, 1000);

        // Рух корабля
        const marker = this.markers.find(m => m.id === missionId);
        this.moveShipTo(marker.left.replace('%', ''), marker.top.replace('%', ''), mission.duration);
      }
    },
    // Випадкові події
    triggerRandomEvent() {
      const events = [
        { message: "🌌 Відкрито невідому зоряну систему! Отримано +5 енергії.", fuel: 0, energy: 5, crew: 0 },
        { message: "🛸 Виявлено прибульців! Вони передали вам 10 одиниць пального.", fuel: 10, energy: 0, crew: 0 },
        { message: "🚨 Аварія на кораблі! Витрачено 10 енергії.", fuel: 0, energy: -10, crew: 0 },
        { message: "☄️ Удар астероїда! Втрата 5% екіпажу.", fuel: 0, energy: 0, crew: -5 },
      ];

      const randomEvent = events[Math.floor(Math.random() * events.length)];
      this.journeyDetails += `<p>${randomEvent.message}</p>`;
      this.updateShipStatus(randomEvent.fuel, randomEvent.energy, randomEvent.crew);
    },
    // Оновлення стану корабля
    updateShipStatus(fuelChange, energyChange, crewChange) {
      this.shipStatus.fuel = Math.max(0, Math.min(100, this.shipStatus.fuel + fuelChange));
      this.shipStatus.energy = Math.max(0, Math.min(100, this.shipStatus.energy + energyChange));
      this.shipStatus.crew = Math.max(0, Math.min(100, this.shipStatus.crew + crewChange));
    },
    // Рух корабля до маркера
    moveShipTo(targetX, targetY, duration) {
      const totalSteps = duration;
      let step = 0;

      const interval = setInterval(() => {
        step++;
        this.shipPosition.x += (targetX - this.shipPosition.x) / (totalSteps - step + 1);
        this.shipPosition.y += (targetY - this.shipPosition.y) / (totalSteps - step + 1);

        if (step >= totalSteps) clearInterval(interval);
      }, 1000);
    },
    // Оновлення таймера
    updateTimerDisplay(time) {
      this.timerDisplay = `⏳ Час до прибуття: ${time} днів`;
    },
    // Оновлення прогресу місії
    updateMissionProgress(missionId, progress) {
      const mission = this.missions.find(m => m.id === missionId);
      if (mission) {
        mission.progress = progress;
    
        if (progress === 0) {
          mission.started = false;
          mission.completed = false;
        } else if (progress > 0 && progress < 100) {
          mission.started = true;
          mission.completed = false;
        } else if (progress >= 100) {
          mission.started = false;
          mission.completed = true;
        }
      }
    },    
  },
});
