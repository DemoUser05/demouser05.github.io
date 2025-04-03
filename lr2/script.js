document.addEventListener("DOMContentLoaded", function () {
    // ==================== 🔹 Генерація експедицій через цикл for 🔹 ====================
    const expeditions = [
        { name: "Місія 1: Дослідження планети", destination: "Нова планета", duration: 100 },
        { name: "Місія 2: Рятувальна операція", destination: "Загублений корабель", duration: 80 },
        { name: "Місія 3: Видобуток ресурсів", destination: "Астероїдний пояс", duration: 50 }
    ];

    const expeditionList = document.querySelector(".missions-list");
    const journal = document.getElementById("journey-details");
    const timerDisplay = document.getElementById("timer");
    initializeUpgradeSystem(); // Виклик функції модернізації

       // 🔹 Генерація карток місій
    for (let i = 0; i < expeditions.length; i++) {
        const expedition = expeditions[i];
        const missionCard = document.createElement("div");
        missionCard.classList.add("mission-card");
        missionCard.innerHTML = `
            <h3>${expedition.name}</h3>
            <p>Призначення: ${expedition.destination}</p>
            <p>Тривалість: ${expedition.duration} днів</p>
            <button onclick="startMission(${i})">Почати місію</button>
        `;

        // Додавання ефекту наведення
    missionCard.addEventListener("mouseover", function () {
        missionCard.style.backgroundColor = "rgba(40, 16, 219, 0.1)";
        missionCard.style.transform = "scale(1.05)";
        missionCard.style.transition = "all 0.3s ease";
    });

    missionCard.addEventListener("mouseout", function () {
        missionCard.style.backgroundColor = "";
        missionCard.style.transform = "scale(1)";
    });
        expeditionList.appendChild(missionCard);
    }

    // ==================== 🔹 Таймер місії 🔹 ====================
    let timeLeft = 0;
    let timerInterval;

    window.startMission = function (index) {
        const mission = expeditions[index];
        const button = document.querySelectorAll(".mission-card button")[index];
    
        button.textContent = "🚀 Запуск...";
        button.classList.add("launch-animation");
    
        setTimeout(() => {
            button.textContent = "В процесі...";
            button.disabled = true;
    
            // Додаємо запис у журнал
            const logEntry = document.createElement("p");
            logEntry.textContent = `🚀 ${mission.name} розпочата! Призначення: ${mission.destination}`;
            journal.appendChild(logEntry);
    
            // Рух корабля до місії
            const missionMarkers = document.querySelectorAll(".journey-marker");
            const target = missionMarkers[index];
            const targetX = parseFloat(target.style.left);
            const targetY = parseFloat(target.style.top);
    
            moveShipTo(targetX, targetY, mission.duration);
    
            // Запуск таймера з переданим ID місії
            startTimer(mission.duration, index + 1);
        }, 1500);
    };
    

    function startTimer(duration, missionId) {
        timeLeft = duration; // Загальний час місії
        let elapsedTime = 0; // Час, що минув
        updateTimerDisplay();
    
        if (timerInterval) clearInterval(timerInterval);
    
        timerInterval = setInterval(() => {
            elapsedTime++; // Збільшуємо час, що минув
            timeLeft--; // Зменшуємо залишковий час
    
            // Обчислюємо прогрес як відношення часу, що минув, до загального часу
            const progress = Math.floor((elapsedTime / duration) * 100);
    
            updateMissionProgress(missionId, progress); // Оновлення прогрес-бару
            updateTimerDisplay();
    
            // Випадкові події (з шансом 10%)
            if (Math.random() < 0.1) {
                triggerRandomEvent();
            }
    
            // Коли таймер досягає 0, завершуємо місію
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                journal.innerHTML += `<p>🛬 Місія ${missionId} завершена! Вітаємо екіпаж!</p>`;
                updateMissionProgress(missionId, 100); // Прогрес стає 100% лише після завершення
                updateShipStatus(20, 25, 1);
            }
        }, 1000); // Оновлення кожної секунди
    }

    // Функція випадкових подій під час польоту
    function triggerRandomEvent() {
        const events = [
            "🌌 Відкрито невідому зоряну систему! Отримано +5 енергії.",
            "🛸 Виявлено прибульців! Вони передали вам 10 одиниць пального.",
            "🚨 Аварія на кораблі! Витрачено 10 енергії.",
            "☄️ Удар астероїда! Втрата 5% екіпажу."
        ];
    
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        journal.innerHTML += `<p>${randomEvent}</p>`;
    
        // Оновлення ресурсів
        if (randomEvent.includes("енергії")) updateShipStatus(0, 5, 0);
        if (randomEvent.includes("пального")) updateShipStatus(10, 0, 0);
        if (randomEvent.includes("аварія")) updateShipStatus(0, -10, 0);
        if (randomEvent.includes("астероїда")) updateShipStatus(0, 0, -5);
    }


    function updateTimerDisplay() {
        timerDisplay.textContent = `⏳ Час до прибуття: ${timeLeft} днів`;
    }

    // ==================== 🔹 Динамічне оновлення стану корабля 🔹 ====================
    function updateShipStatus(fuelChange, energyChange, crewChange) {
        updateBar("fuel-bar", fuelChange);
        updateBar("energy-bar", energyChange);
        updateBar("crew-bar", crewChange);
    }

    function updateBar(barId, change) {
        const bar = document.getElementById(barId);
        let currentWidth = parseInt(bar.style.width) || 0;
        let newWidth = Math.max(0, Math.min(100, currentWidth + change));
        bar.style.width = newWidth + "%";
        bar.textContent = newWidth + "%";
    }

    // ==================== 🔹 Форма коментарів + збереження у localStorage 🔹 ====================
    const commentForm = document.getElementById("comment-form");
    const commentSection = document.getElementById("comment-section");

    // Функція для завантаження коментарів з localStorage
    function loadComments() {
        const savedComments = JSON.parse(localStorage.getItem("comments")) || [];
        commentSection.innerHTML = ""; // Очистити блок перед завантаженням

        savedComments.forEach(commentObj => {
            addCommentToDOM(commentObj.name, commentObj.text);
        });
    }

    // Функція для додавання коментаря у DOM та localStorage
    function addCommentToDOM(name, text) {
        const newComment = document.createElement("p");
        newComment.innerHTML = `<strong>${name}:</strong> ${text}`;
        commentSection.appendChild(newComment);
    }

    commentForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = document.getElementById("username").value.trim();
        const comment = document.getElementById("comment").value.trim();

        if (name === "" || comment === "") {
            alert("Будь ласка, заповніть всі поля!");
            return;
        }

        // Додаємо коментар у DOM
        addCommentToDOM(name, comment);

        // Збереження в localStorage
        const savedComments = JSON.parse(localStorage.getItem("comments")) || [];
        savedComments.push({ name, text: comment });
        localStorage.setItem("comments", JSON.stringify(savedComments));

        // Очищаємо форму
        commentForm.reset();
    });

    // Завантажуємо коментарі при завантаженні сторінки
    loadComments();

    // Додаємо кнопку очищення коментарів
    document.getElementById("clear-comments").addEventListener("click", function () {
        localStorage.removeItem("comments");
        commentSection.innerHTML = "";
    });

    function moveShipTo(targetX, targetY, duration) {
        const ship = document.getElementById("ship-marker");
        let posX = parseFloat(ship.style.left) || 10;
        let posY = parseFloat(ship.style.top) || 10;
    
        const totalSteps = duration; // Кількість оновлень (одне оновлення = 1 секунда)
        let step = 0;
    
        const interval = setInterval(() => {
            step++;
    
            posX += (targetX - posX) / (totalSteps - step + 1);
            posY += (targetY - posY) / (totalSteps - step + 1);
    
            ship.style.left = posX + "%";
            ship.style.top = posY + "%";
    
            if (step >= totalSteps) {
                clearInterval(interval);
            }
        }, 1000); // Оновлення координат раз на секунду
    }

    function updateMissionProgress(missionId, progress) {
        const progressBar = document.getElementById(`mission${missionId}-progress`);
        
        // Оновлюємо ширину прогрес-бару
        progressBar.style.width = `${progress}%`;
        
        // Оновлюємо текст всередині прогрес-бару
        if (progress === 0) {
            progressBar.textContent = "0% (Не розпочато)";
        } else if (progress < 100) {
            progressBar.textContent = `${progress}% (В процесі)`;
        } else if (progress >= 100) {
            progressBar.textContent = "100% (Виконано)";
            progressBar.style.backgroundColor = "#28a745"; // Зелений фон для завершення місії
        }
    }

    // Заправка пального
document.getElementById("refuel-btn").addEventListener("click", function () {
    const currentFuel = parseInt(document.getElementById("fuel-bar").style.width) || 0;

    if (currentFuel >= 100) {
        journal.innerHTML += "<p>⚠️ Паливо вже на максимумі! Додавання неможливе.</p>";
        return; // Зупиняємо виконання, якщо ліміт досягнуто
    }

    const addedFuel = Math.min(100 - currentFuel, 20); // Додаємо тільки до 100%
    updateShipStatus(addedFuel, 0, 0);
    journal.innerHTML += `<p>🔋 Заправка пального завершена! +${addedFuel}% пального.</p>`;
});

// Перезарядка енергії
document.getElementById("recharge-btn").addEventListener("click", function () {
    const currentEnergy = parseInt(document.getElementById("energy-bar").style.width) || 0;

    if (currentEnergy >= 100) {
        journal.innerHTML += "<p>⚠️ Енергія вже на максимумі! Перезарядка неможлива.</p>";
        return;
    }

    const addedEnergy = Math.min(100 - currentEnergy, 15); // Додаємо тільки до 100%
    updateShipStatus(0, addedEnergy, 0);
    journal.innerHTML += `<p>⚡ Енергія перезаряджена! +${addedEnergy}% енергії.</p>`;
});

// Відновлення екіпажу
document.getElementById("restore-crew-btn").addEventListener("click", function () {
    const currentCrew = parseInt(document.getElementById("crew-bar").style.width) || 0;

    if (currentCrew >= 100) {
        journal.innerHTML += "<p>⚠️ Чисельність екіпажу вже на максимумі! Поповнення неможливе.</p>";
        return;
    }

    const addedCrew = Math.min(100 - currentCrew, 10); // Додаємо тільки до 100%
    updateShipStatus(0, 0, addedCrew);
    journal.innerHTML += `<p>👨‍🚀 Екіпаж поповнений! +${addedCrew}% екіпажу.</p>`;
});

function initializeUpgradeSystem() {
    const upgradeBtn = document.getElementById("upgrade-btn");
    const upgradeModal = document.getElementById("upgrade-modal");
    const closeModalBtn = document.getElementById("close-modal");
    const upgradeOptions = document.querySelectorAll(".upgrade-option");

    // Відкриття модального вікна
    upgradeBtn.addEventListener("click", function () {
        upgradeModal.classList.remove("hidden");
    });

    // Закриття модального вікна
    closeModalBtn.addEventListener("click", function () {
        upgradeModal.classList.add("hidden");
    });

    // Обробка вибору модернізації
    upgradeOptions.forEach(option => {
        option.addEventListener("click", function () {
            const type = option.getAttribute("data-type");
            const fuelCost = parseInt(option.getAttribute("data-fuel"));
            const energyCost = parseInt(option.getAttribute("data-energy"));
            const crewCost = parseInt(option.getAttribute("data-crew"));

            // Перевірка наявності ресурсів
            const currentFuel = parseInt(document.getElementById("fuel-bar").style.width) || 0;
            const currentEnergy = parseInt(document.getElementById("energy-bar").style.width) || 0;
            const currentCrew = parseInt(document.getElementById("crew-bar").style.width) || 0;

            if (currentFuel < fuelCost || currentEnergy < energyCost || currentCrew < crewCost) {
                journal.innerHTML += `<p>❌ Недостатньо ресурсів для модернізації: ${type}!</p>`;
                return;
            }

            // Зменшення ресурсів
            updateShipStatus(-fuelCost, -energyCost, -crewCost);

            // Додавання модернізації
            journal.innerHTML += `<p>✅ Модернізація "${type}" успішно завершена!</p>`;

            // Закриття модального вікна
            upgradeModal.classList.add("hidden");
        });
    });

    
}
});
