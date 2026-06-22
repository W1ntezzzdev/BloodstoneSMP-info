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

// Логика спойлеров ивентов
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

// Открытие окон предметов
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

// Логика интерактивных звезд
let selectedRating = 0;
const globalStars = document.querySelectorAll(".star");

globalStars.forEach(star => {
    star.addEventListener("click", () => {
        selectedRating = parseInt(star.getAttribute("data-value"));
        globalStars.forEach(s => {
            if(parseInt(s.getAttribute("data-value")) <= selectedRating) { s.classList.add("selected"); } 
            else { s.classList.remove("selected"); }
        });
    });
});

// ЛОГИКА ФОРМЫ (ПОЛНАЯ АВТО-ОТПРАВКА В ТЕЛЕГРАМ ЧЕРЕЗ РАЗРЕШЕННЫЙ ШЛЮЗ)
const feedbackForm = document.getElementById("feedback-form");
const successMsg = document.getElementById("fb-success");

const botToken = "8893667631:AAHi0I76a6mocDM8W4pOAKsYnvIoGW_ZEN8";
const chatId = "-5504751430";

if(feedbackForm) {
    feedbackForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Защита от перезагрузки страницы

        const nick = document.getElementById("fb-nick").value.trim();
        const message = document.getElementById("fb-message").value.trim();
        const starsString = "★".repeat(selectedRating) + "☆".repeat(5 - selectedRating);

        // Формируем красивый текст для админ-группы Telegram
        const textMessage = `📊 *Новый отзыв о сайте!*\n\n👤 *Игрок:* \`${nick}\`\n⭐️ *Оценка:* ${starsString} (${selectedRating}/5)\n💬 *Отзыв:* ${message}`;

        // Оригинальный URL Телеграма
        const telegramUrl = `https://telegram.org{botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(textMessage)}&parse_mode=Markdown`;

        // Оборачиваем запрос в прокси allorigins, который разрешен на GitHub Pages на 100%
        const proxyUrl = `https://allorigins.win{encodeURIComponent(telegramUrl)}`;

        fetch(proxyUrl)
        .then(response => {
            if (response.ok) {
                feedbackForm.reset();
                selectedRating = 0;
                globalStars.forEach(s => s.classList.remove("selected"));
                
                if(successMsg) {
                    successMsg.style.display = "block";
                    successMsg.innerText = "Отзыв успешно отправлен! Спасибо!";
                    setTimeout(() => { successMsg.style.display = "none"; }, 4000);
                }
            } else {
                alert("Ошибка сервера. Попробуйте отправить позже.");
            }
        })
        .catch(error => {
            console.error("Ошибка сети:", error);
            alert("Произошла ошибка CORS. Обновите страницу через Ctrl + F5.");
        });
    });
}

