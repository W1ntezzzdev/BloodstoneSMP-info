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
        desc: "Главный залог выживания in PVP. При срабатывании спасает от смерти. Существует 3 типа тотемов: 'Тотем стойкости', 'Тотем скорости', 'Обычный тотем'.",
        methods: ["Ивент 'Завод'.", "Ивент 'Нефтяная платформа'.", "Ивент 'Зона раскопок'."]
    },
    crossbow: {
        title: "Пламенный арбалет",
        desc: "Эпическое оружие, которое обладает зачарованием 'Воспламенение', что позволяет x-bow картить, 4 раза.",
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

// Настройка кликов по спойлерам ивентов
document.querySelectorAll(".event-block").forEach(block => {
    const img = block.querySelector(".event-preview");
    const hint = block.querySelector(".event-hint");
    const toggle = () => {
        block.classList.toggle("active");
        const eventName = block.getAttribute("data-event");
        const ruNames = { zavod: "Завод", neft: "Нефтяная платформа", raskopki: "Зона раскопок" };
        if (block.classList.contains("active")) { hint.innerText = `▼ Скрыть описание ивента '${ruNames[eventName]}'`; } 
        else { hint.innerText = `▶ Показать описание ивента '${ruNames[eventName]}'`; }
    };
    if(img) img.addEventListener("click", toggle);
    if(hint) hint.addEventListener("click", toggle);
});

// Открытие окон
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
            document.querySelectorAll(".event-block").forEach(block => {
                block.classList.remove("active");
                const eventName = block.getAttribute("data-event");
                const hint = block.querySelector(".event-hint");
                if(hint) hint.innerText = `▶ Показать описание ивента '${{zavod:"Завод",neft:"Нефтяная платформа",raskopki:"Зона раскопок"}[eventName]}'`;
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
            if (itemName.includes(value)) { card.classList.remove("hidden"); } else { card.classList.add("hidden"); }
        });
    });
}

// ИСПРАВЛЕНО: Уникальное имя переменной для элементов звезд, чтобы не было конфликтов
let selectedRating = 0;
const feedbackStars = document.querySelectorAll(".star");

feedbackStars.forEach(star => {
    star.addEventListener("click", () => {
        selectedRating = parseInt(star.getAttribute("data-value"));
        feedbackStars.forEach(s => {
            if(parseInt(s.getAttribute("data-value")) <= selectedRating) { s.classList.add("selected"); } 
            else { s.classList.remove("selected"); }
        });
    });
});

// Авто-отправка вебхука в Discord
const feedbackForm = document.getElementById("feedback-form");
const successMsg = document.getElementById("fb-success");
const discordWebhookUrl = "https://discord.com/api/webhooks/1518578676164329623/hhwgUwEG3vNEsw-QocSf6-Ep1ikw0iGOErkSxJCciTCBbPXNmaGfaeC-MyBJY2dhxQVfм";

if(feedbackForm) {
    feedbackForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const nick = document.getElementById("fb-nick").value.trim();
        const message = document.getElementById("fb-message").value.trim();
        
        // Если игрок забыл нажать на звезды, ставим по умолчанию 5
        const finalRating = selectedRating === 0 ? 5 : selectedRating;
        const starsString = "★".repeat(finalRating) + "☆".repeat(5 - finalRating);

        const embedPayload = {
            embeds: [{
                title: "📩 Новый отзыв о сайте-гайде!",
                color: 15087366,
                fields: [
                    { name: "Ник игрока:", value: nick, inline: true },
                    { name: "Оценка сайта:", value: `${starsString} (${finalRating}/5)`, inline: true },
                    { name: "Отзыв:", value: message }
                ],
                timestamp: new Date().toISOString()
            }]
        };

        const formData = new FormData();
        formData.append("payload_json", JSON.stringify(embedPayload));

        fetch(discordWebhookUrl.trim(), {
            method: "POST",
            mode: "no-cors", 
            body: formData
        })
        .then(() => {
            feedbackForm.reset();
            selectedRating = 0;
            feedbackStars.forEach(s => s.classList.remove("selected"));
            if(successMsg) {
                successMsg.style.display = "block";
                successMsg.innerText = "Отзыв успешно отправлен в Discord!";
                setTimeout(() => { successMsg.style.display = "none"; }, 4000);
            }
        })
        .catch(error => {
            console.error("Ошибка сети:", error);
        });
    });
}
