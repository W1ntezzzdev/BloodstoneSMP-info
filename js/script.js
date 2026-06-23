const itemsData = {
    shards: {
        title: "Шардики (Осколки Кристаллов)",
        desc: "Ценная валюта, представленная в виде осколков аметиста. 1 шардик = 10 шардов. Шарды используются для прокачки скиллов.",
        methods: [
            "Ивент 'Завод'.",
            "Ивент 'Нефтяная платформа'.",
            "Ивент 'Зона раскопок'.",
            "Ивент 'Аирдроп'."
        ],
        allowedEvents: ["zavod", "neft", "raskopki", "airdrop"]
    },
    shield: {
        title: "Незеритовый щит",
        desc: "Эпический предмет, который обладает зачарованиями 'Защита 4, Починка, Шипы 3'.",
        methods: [
            "Ивент 'Завод'.",
            "Ивент 'Нефтяная платформа'.",
            "Ивент 'Зона раскопок'."
        ],
        allowedEvents: ["zavod", "neft", "raskopki"]
    },
    speedtotem: {
        title: "Тотем скорости",
        desc: "Главный залог выживания в PVP. При срабатывании спасает от смерти. Тотем скорости дает +20% к скорости игрока.",
        methods: [
            "Ивент 'Завод'.",
            "Ивент 'Нефтяная платформа'.",
            "Ивент 'Зона раскопок'.",
            "Ивент 'Аирдроп'."
        ],
        allowedEvents: ["zavod", "neft", "raskopki", "airdrop"]
    },
    stoykatotem: {
        title: "Тотем стойкости",
        desc: "Главный залог выживания в PVP. При срабатывании спасает от смерти. Тотем стойкости дает +1 к Броне и +4 к максимальному здоровью игрока.",
        methods: [
            "Ивент 'Завод'.",
            "Ивент 'Нефтяная платформа'.",
            "Ивент 'Зона раскопок'.",
            "Ивент 'Аирдроп'."
        ],
        allowedEvents: ["zavod", "neft", "raskopki", "airdrop"]
    },
    totem: {
        title: "Обычный тотем",
        desc: "Главный залог выживания в PVP. При срабатывании спасает от смерти.",
        methods: [
            "Ивент 'Завод'.",
            "Ивент 'Нефтяная платформа'.",
            "Ивент 'Зона раскопок'.",
            "Ивент 'Аирдроп'."
        ],
        allowedEvents: ["zavod", "neft", "raskopki", "airdrop"]
    },
    crossbow: {
        title: "Пламенный арбалет",
        desc: "Эпическое оружие, которое обладает зачарованием 'Воспламенение', что позволяет x-bow картить, имеет 4 прочности.",
        methods: [
            "Ивент 'Завод'.",
            "Ивент 'Нефтяная платформа'.",
            "Ивент 'Зона раскопок'."
        ],
        allowedEvents: ["zavod", "neft", "raskopki"]
    },
    spear: {
        title: "Незеритовое копьё",
        desc: "Редкое копье, которое, в отличии от остальных, оснащено зачарованием 'Рывок 3'. Это зачарование помогает быстро перемещаться.",
        methods: [
            "Ивент 'Нефтяная платформа'."
        ],
        allowedEvents: ["neft"]
    },
    ballista: {
        title: "Баллиста",
        desc: "Эпическое стрелковое оружие, позволяющие стрелять с огромной скоростью, и большим уроном. Стрелы, будто бы шипы прошивают цель, даже сквозь щит.",
        methods: [
            "Способы добычи отсутствуют."
        ],
        allowedEvents: []
    }
};

const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close-btn");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalMethods = document.getElementById("modal-methods");

document.querySelectorAll(".event-block").forEach(block => {
    const img = block.querySelector(".event-preview");
    const hint = block.querySelector(".event-hint");

    if (img && hint) {
        const toggle = () => {
            block.classList.toggle("active");
            const eventName = block.getAttribute("data-event");
            const ruNames = { zavod: "Завод", neft: "Нефтяная платформа", raskopki: "Зона раскопок", airdrop: "Аирдроп" };
            
            if (block.classList.contains("active")) {
                hint.innerText = `▼ Скрыть описание ивента '${ruNames[eventName]}'`;
            } else {
                hint.innerText = `▶ Показать описание ивента '${ruNames[eventName]}'`;
            }
        };

        img.addEventListener("click", toggle);
        hint.addEventListener("click", toggle);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");
    
    cards.forEach(card => {
        card.addEventListener("click", () => {
            const itemKey = card.getAttribute("data-item");
            const item = itemsData[itemKey];

            if (item) {
                if (modalTitle) modalTitle.innerText = item.title;
                if (modalDesc) modalDesc.innerText = item.desc;
                
                if (modalMethods) {
                    modalMethods.innerHTML = "";
                    item.methods.forEach(method => {
                        const li = document.createElement("li");
                        li.innerText = method;
                        modalMethods.appendChild(li);
                    });
                }

                document.querySelectorAll(".event-block").forEach(block => {
                    const eventName = block.getAttribute("data-event");
                    
                    block.classList.remove("active");
                    const ruNames = { zavod: "Завод", neft: "Нефтяная платформа", raskopki: "Зона раскопок", airdrop: "Аирдроп" };
                    const hint = block.querySelector(".event-hint");
                    if (hint) hint.innerText = `▶ Показать описание ивента '${ruNames[eventName]}'`;

                    if (item.allowedEvents.includes(eventName)) {
                        block.style.display = "block";
                    } else {
                        block.style.display = "none";
                    }
                });

                if (modal) modal.style.display = "flex";
            }
        });
    });

    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const value = e.target.value.toLowerCase().trim();
            cards.forEach(card => {
                const h3 = card.querySelector("h3");
                if (h3) {
                    const itemName = h3.innerText.toLowerCase();
                    if (itemName.includes(value)) { card.classList.remove("hidden"); } 
                    else { card.classList.add("hidden"); }
                }
            });
        });
    }
});

if (closeBtn) closeBtn.addEventListener("click", () => { if (modal) modal.style.display = "none"; });
window.addEventListener("click", (e) => { if (e.target === modal) { if (modal) modal.style.display = "none"; } });

const feedbackForm = document.getElementById("feedback-form");
const successMsg = document.getElementById("fb-success");
const discordWebhookUrl = "https://discord.com/api/webhooks/1518578676164329623/hhwgUwEG3vNEsw-QocSf6-Ep1ikw0iGOErkSxJCciTCBbPXNmaGfaeC-MyBJY2dhxQVf";

if (feedbackForm) {
    feedbackForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const nick = document.getElementById("fb-nick").value.trim();
        const message = document.getElementById("fb-message").value.trim();

        const embedPayload = {
            embeds: [{
                title: "📩 Новый отзыв / предложение с сайта-гайда!",
                color: 15087366,
                fields: [
                    { name: "Ник игрока:", value: nick, inline: true },
                    { name: "Сообщение:", value: message }
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
            if (successMsg) {
                successMsg.style.display = "block";
                setTimeout(() => { successMsg.style.display = "none"; }, 4000);
            }
        })
        .catch(error => {
            console.error("Ошибка сети:", error);
        });
    });
}
