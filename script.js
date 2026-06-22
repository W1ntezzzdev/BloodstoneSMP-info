const itemsData = {
    shards: {
        title: "Шардики (Осколки Кристаллов)",
        desc: "Ценная валюта, представленная в виде осколков аметиста. 1 шардик = 10 шардов. Шарды используются для прокачки скиллов,",
        methods: [
            "Ивент 'Завод'.",
            "Ивент 'Нефтяная платформа'.",
            "Ивент 'Зона раскопок'."
        ],
        imgs: ["img/zavod.png", "img/neft.png", "img/zonaraskopok.png"]
    },
    shield: {
        title: "Незеритовый щит",
        desc: "Эпический предмет, который обладает зачарованиями 'Защита 4, Починка, Шипы 3'.",
        methods: [
            "Ивент 'Завод'.",
            "Ивент 'Нефтяная платформа'.",
            "Ивент 'Зона раскопок'."
        ],
        imgs: ["img/zavod.png", "img/neft.png", "img/zonaraskopok.png"]
    },
    totems: {
        title: "Томемы",
        desc: "Главный залог выживания в ПВП. При срабатывании спасает от смерти. Существует 3 типа тотемов: 'Тотем стойкости', 'Тотем скорости', 'Обычный тотем'.",
        methods: [
            "Ивент 'Завод'.",
            "Ивент 'Нефтяная платформа'.",
            "Ивент 'Зона раскопок'."
        ],
        imgs: ["img/zavod.png", "img/neft.png", "img/zonaraskopok.png"]
    },
    crossbow: {
        title: "Пламенный арбалет",
        desc: "Эпическое оружие, которое обладает зачарованием 'Воспламенение', что позволяет x-bow картить, 4 раза.",
        methods: [
            "Ивент 'Завод'.",
            "Ивент 'Нефтяная платформа'.",
            "Ивент 'Зона раскопок'."
        ],
        imgs: ["img/zavod.png", "img/neft.png", "img/zonaraskopok.png"]
    },
    spear: {
        title: "Незеритовое копьё",
        desc: "Редкое копье, котрое в отличии от остальных, оснащено зачарованием 'Рывок 3'. Это зачарование помогает быстро перемещаться.",
        methods: [
            "Ивент 'Завод'.",
            "Ивент 'Нефтяная платформа'.",
            "Ивент 'Зона раскопок'."
        ],
        imgs: ["img/zavod.png", "img/neft.png", "img/zonaraskopok.png"]
    }
};

const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close-btn");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalMethods = document.getElementById("modal-methods");
const modalImagesContainer = document.getElementById("modal-images-container");

// Открытие окна
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

            modalImagesContainer.innerHTML = "";
            item.imgs.forEach(imgUrl => {
                const img = document.createElement("img");
                img.src = imgUrl;
                img.className = "event-preview";
                img.alt = "Локация ивента";
                modalImagesContainer.appendChild(img);
            });

            modal.style.display = "flex";
        }
    });
});

// Закрытие окна
closeBtn.addEventListener("click", () => { modal.style.display = "none"; });
window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

// Логика поиска
const searchInput = document.getElementById("search-input");
const cards = document.querySelectorAll(".card");

searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase().trim();
    cards.forEach(card => {
        const itemName = card.querySelector("h3").innerText.toLowerCase();
        if (itemName.includes(value)) {
            card.classList.remove("hidden");
        } else {
            card.classList.add("hidden");
        }
    });
});

// Логика формы обратной связи с отправкой в Discord
const feedbackForm = document.getElementById("feedback-form");
const successMsg = document.getElementById("fb-success");
const discordWebhookUrl = "https://discord.com/api/webhooks/1518529672453947558/l7JCEcWL0PN8SN-2LqhH0UIoh3cjxBT1aK70-BSI5DqpamK25HR7hMoWULcYYjsAz9jP";

feedbackForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nick = document.getElementById("fb-nick").value;
    const message = document.getElementById("fb-message").value;

    const requestData = {
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

    fetch(discordWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (response.ok) {
            feedbackForm.reset();
            successMsg.style.display = "block";
            successMsg.innerText = "Сообщение успешно отправлено в Discord!";
            setTimeout(() => { successMsg.style.display = "none"; }, 4000);
        } else {
            alert("Ошибка при отправке. Проверьте настройки вебхука.");
        }
    })
    .catch(error => {
        console.error("Ошибка:", error);
        alert("Не удалось связаться с Discord. Попробуйте позже.");
    });
});
