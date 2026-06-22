const itemsData = {
    shards: {
        title: "Шардики (Осколки Кристаллов)",
        desc: "Ценная валюта, представленная в виде осколков аметиста. 1 шардик = 10 шардов. Шарды используются для прокачки скиллов,",
        methods: ["Ивент 'Завод'.", "Ивент 'Нефтяная платформа'.", "Ивент 'Зона раскопок'."]
    },
    shield: {
        title: "Незеритовый щит",
        desc: "Эпический предмет, который обладает зачарованиями 'Защита 4, Починка, Шипы 3'.",
        methods: ["Ивент 'Завод'.", "Ивент 'Нефтяная платформа'.", "Ивент 'Зона раскопок'."]
    },
    totems: {
        title: "Томемы",
        desc: "Главный залог выживания in PVP. При срабатывании от смерти. Существует 3 типа тотемов: 'Тотем стойкости', 'Тотем скорости', 'Обычный тотем'.",
        methods: ["Ивент 'Завод'.", "Ивент 'Нефтяная платформа'.", "Ивент 'Зона раскопок'."]
    },
    crossbow: {
        title: "Пламенный арбалет",
        desc: "Эпическое оружие, которое обладает зачарованием 'Воспламенение', что позволяет x-bow картинть, 4 раза.",
        methods: ["Ивент 'Завод'.", "Ивент 'Нефтяная платформа'.", "Ивент 'Зона раскопок'."]
    },
    spear: {
        title: "Незеритовое копьё",
        desc: "Редкое копье, котрое в отличии от остальных, оснащено зачарованием 'Рывок 3'. Это зачарование помогает быстро перемещаться.",
        methods: ["Ивент 'Завод'.", "Ивент 'Нефтяная платформа'.", "Ивент 'Зона раскопок'."]
    }
};

const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close-btn");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalMethods = document.getElementById("modal-methods");
const modalImagesContainer = document.getElementById("modal-images-container");

// Настройка кликов по спойлерам ивентов (Завод, Нефть, Раскопки)
document.querySelectorAll(".event-block").forEach(block => {
    const img = block.querySelector(".event-preview");
    const hint = block.querySelector(".event-hint");

    const toggle = () => {
        block.classList.toggle("active");
        const eventName = block.getAttribute("data-event");
        const ruNames = { zavod: "Завод", neft: "Нефтяная платформа", raskopki: "Зона раскопок" };
        
        if (block.classList.contains("active")) {
            hint.innerText = `▼ Скрыть описание ивента '${ruNames[eventName]}'`;
        } else {
            hint.innerText = `▶ Показать описание ивента '${ruNames[eventName]}'`;
        }
    };

    if(img) img.addEventListener("click", toggle);
    if(hint) hint.addEventListener("click", toggle);
});

// Открытие модального окна предмета
document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
        const itemKey = card.getAttribute("data-item");
        const item = itemsData[itemKey];

        if (item) {
            modalTitle.innerText = item.title;
            modalDesc.innerText = item.desc;
            
            modalMethods.innerHTML = "";
            item.methods.forEach(method => {
                const li = document.createElement("li");
                li.innerText = method;
                modalMethods.appendChild(li);
            });

            // Сбрасываем спойлеры в закрытое положение
            document.querySelectorAll(".event-block").forEach(block => {
                block.classList.remove("active");
                const eventName = block.getAttribute("data-event");
                const ruNames = { zavod: "Завод", neft: "Нефтяная платформа", raskopki: "Зона раскопок" };
                const hint = block.querySelector(".event-hint");
                if(hint) hint.innerText = `▶ Показать описание ивента '${ruNames[eventName]}'`;
            });

            modal.style.display = "flex";
        }
    });
});

if(closeBtn) closeBtn.addEventListener("click", () => { modal.style.display = "none"; });
window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

// Логика поиска
const searchInput = document.getElementById("search-input");
const cards = document.querySelectorAll(".card");

if(searchInput) {
    searchInput.addEventListener("input", (e) => {
        const value = e.target.value.toLowerCase().trim();
        cards.forEach(card => {
            const itemName = card.querySelector("h3").innerText.toLowerCase();
            if (itemName.includes(value)) { card.classList.remove("hidden"); } 
            else { card.classList.add("hidden"); }
        });
    });
}

// НАДЕЖНАЯ ОТПРАВКА БЕЗ СБОЕВ CORS НАПРЯМУЮ ЧЕРЕЗ BEACON API
const feedbackForm = document.getElementById("feedback-form");
const successMsg = document.getElementById("fb-success");
const discordWebhookUrl = "https://discord.com";

if(feedbackForm) {
    feedbackForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const nick = document.getElementById("fb-nick").value.trim();
        const message = document.getElementById("fb-message").value.trim();

        // EMBED КАРТОЧКА С КРАСНОЙ ПОЛОСОЙ BLOODSTONE
        const requestData = {
            embeds: [{
                title: "📩 Новый отзыв / предложение с сайта-гайда!",
                color: 15087366,
                fields: [
                    { name: "Ник игрока:", value: `\`${nick}\``, inline: true },
                    { name: "Сообщение:", value: message }
                ],
                timestamp: new Date().toISOString()
            }]
        };

        // Формируем безопасный бинарный Blob
        const blob = new Blob([JSON.stringify(requestData)], { type: 'application/json' });
        
        // Магия Beacon API: шлет данные напрямую на discord.com в обход защиты CORS Гитхаба
        const isSent = navigator.sendBeacon(discordWebhookUrl.trim(), blob);

        if (isSent) {
            feedbackForm.reset();
            if(successMsg) {
                successMsg.style.display = "block";
                successMsg.innerText = "Сообщение успешно отправлено в Discord!";
                setTimeout(() => { successMsg.style.display = "none"; }, 4000);
            }
        } else {
            alert("Не удалось отправить сообщение. Пожалуйста, обновите страницу.");
        }
    });
}
