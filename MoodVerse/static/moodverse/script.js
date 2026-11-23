
/* =====================================================
                        MOODVERSE
                 COMPLETE GLOBAL SYSTEM
===================================================== */


/* =====================================================
                    AVAILABLE MOODS
===================================================== */

const moodThemes = [
    "happy",
    "sad",
    "angry",
    "calm",
    "excited"
];


/* =====================================================
                    JOURNAL MOOD
===================================================== */

let selectedJournalMood = null;


/* =====================================================
                    CHANGE MOOD
===================================================== */

function changeMood(mood) {

    if (!moodThemes.includes(mood)) return;

    localStorage.setItem("moodverseMood", mood);

    const today = new Date().toISOString().split("T")[0];

    let moodHistory = JSON.parse(
        localStorage.getItem("moodverseMoodHistory")
    ) || {};

    moodHistory[today] = mood;

    localStorage.setItem(
        "moodverseMoodHistory",
        JSON.stringify(moodHistory)
    );

    document.body.classList.remove(
        "happy-theme",
        "sad-theme",
        "angry-theme",
        "calm-theme",
        "excited-theme"
    );

    document.body.classList.add(mood + "-theme");

    createCalendar();
    updateMoodStreak();
    checkAchievements();
}


/* =====================================================
                  APPLY SAVED MOOD
===================================================== */

function applySavedMood() {

    const savedMood = localStorage.getItem("moodverseMood");

    if (!savedMood) return;

    if (!moodThemes.includes(savedMood)) {
        localStorage.removeItem("moodverseMood");
        return;
    }

    document.body.classList.remove(
        "happy-theme",
        "sad-theme",
        "angry-theme",
        "calm-theme",
        "excited-theme"
    );

    document.body.classList.add(savedMood + "-theme");
}


/* =====================================================
                JOURNAL MOOD SELECTION
===================================================== */

function selectJournalMood(emoji, mood) {

    selectedJournalMood = {
        emoji: emoji,
        mood: mood
    };

    const moodButtons = document.querySelectorAll(
        ".mood-choice button"
    );

    moodButtons.forEach(function(button) {
        button.classList.remove("selected-mood");
    });

    moodButtons.forEach(function(button) {

        if (button.textContent.trim() === emoji) {
            button.classList.add("selected-mood");
        }

    });
}


/* =====================================================
                SAVE JOURNAL MEMORY
===================================================== */

function saveJournalMemory() {

    const journalTextElement = document.getElementById(
        "journal-text"
    );

    if (!journalTextElement) return;

    const text = journalTextElement.value.trim();

    if (!text) {
        showJournalMessage(
            "Please write something before saving. 💭",
            "error"
        );
        return;
    }

    if (!selectedJournalMood) {
        showJournalMessage(
            "Please choose your mood first. 💗",
            "error"
        );
        return;
    }

    const today = new Date().toISOString().split("T")[0];

    let journalHistory = JSON.parse(
        localStorage.getItem("moodverseJournalHistory")
    ) || {};

    if (!journalHistory[today]) {
        journalHistory[today] = [];
    }

    const memory = {
        mood: selectedJournalMood.mood,
        emoji: selectedJournalMood.emoji,
        text: text,
        time: new Date().toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        )
    };

    journalHistory[today].push(memory);

    localStorage.setItem(
        "moodverseJournalHistory",
        JSON.stringify(journalHistory)
    );

    localStorage.setItem(
        "moodverseMood",
        selectedJournalMood.mood
    );

    let moodHistory = JSON.parse(
        localStorage.getItem("moodverseMoodHistory")
    ) || {};

    moodHistory[today] = selectedJournalMood.mood;

    localStorage.setItem(
        "moodverseMoodHistory",
        JSON.stringify(moodHistory)
    );

    journalTextElement.value = "";
    selectedJournalMood = null;

    document.querySelectorAll(
        ".mood-choice button"
    ).forEach(function(button) {
        button.classList.remove("selected-mood");
    });

    showJournalMessage(
        "Memory saved successfully! 💗",
        "success"
    );

    createCalendar();
    updateMoodStreak();
    checkAchievements();
}


/* =====================================================
                JOURNAL MESSAGE
===================================================== */

function showJournalMessage(message, type) {

    const messageElement = document.getElementById(
        "journal-message"
    );

    if (!messageElement) return;

    messageElement.textContent = message;
    messageElement.className = "journal-message " + type;

    setTimeout(function() {
        messageElement.textContent = "";
    }, 3000);
}


/* =====================================================
                    CALENDAR
===================================================== */

let calendarDate = new Date();


/* =====================================================
                  CREATE CALENDAR
===================================================== */

function createCalendar() {

    const calendarDays = document.getElementById(
        "calendar-days"
    );

    const calendarMonth = document.getElementById(
        "calendar-month"
    );

    if (!calendarDays || !calendarMonth) return;

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const monthName = calendarDate.toLocaleString(
        "default",
        { month: "long" }
    );

    calendarMonth.textContent = monthName + " " + year;
    calendarDays.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay();

    const daysInMonth = new Date(
        year,
        month + 1,
        0
    ).getDate();

    const moodHistory = JSON.parse(
        localStorage.getItem("moodverseMoodHistory")
    ) || {};

    const journalHistory = JSON.parse(
        localStorage.getItem("moodverseJournalHistory")
    ) || {};

    for (let i = 0; i < firstDay; i++) {

        const emptyDay = document.createElement("div");

        emptyDay.classList.add(
            "calendar-day",
            "empty"
        );

        calendarDays.appendChild(emptyDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {

        const dayElement = document.createElement("div");

        dayElement.classList.add("calendar-day");

        const dateKey =
            year + "-" +
            String(month + 1).padStart(2, "0") + "-" +
            String(day).padStart(2, "0");

        const mood = moodHistory[dateKey];

        const memories = journalHistory[dateKey] || [];

        dayElement.innerHTML = `<span>${day}</span>`;

        if (mood) {
            dayElement.classList.add(mood + "-day");
        }

        if (memories.length > 0) {

            dayElement.classList.add("has-memory");

            const memoryIndicator = document.createElement("span");

            memoryIndicator.classList.add("memory-indicator");
            memoryIndicator.textContent = "💗";

            dayElement.appendChild(memoryIndicator);
        }

        dayElement.addEventListener("click", function() {
            showDateMemories(dateKey);
        });

        calendarDays.appendChild(dayElement);
    }
}


/* =====================================================
                SHOW DATE MEMORIES
===================================================== */

function showDateMemories(dateKey) {

    const journalHistory = JSON.parse(
        localStorage.getItem("moodverseJournalHistory")
    ) || {};

    const memories = journalHistory[dateKey] || [];

    const moodHistory = JSON.parse(
        localStorage.getItem("moodverseMoodHistory")
    ) || {};

    const mood = moodHistory[dateKey];

    const date = new Date(dateKey + "T00:00:00");

    const formattedDate = date.toLocaleDateString(
        "default",
        {
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );

    const popup = document.getElementById("memory-popup");

    const popupContent = document.getElementById(
        "memory-popup-content"
    );

    if (!popup || !popupContent) return;

    if (memories.length === 0 && !mood) {

        popupContent.innerHTML = `

            <div class="memory-date">
                📅 ${formattedDate}
            </div>

            <div class="no-memory">

                <div class="no-memory-icon">
                    💭
                </div>

                <h3>No memories yet</h3>

                <p>
                    You didn't save a mood or journal
                    entry on this day.
                </p>

            </div>

        `;
    }

    else {

        let memoriesHTML = "";

        if (memories.length === 0 && mood) {

            memoriesHTML += `

                <div class="memory-mood">

                    <span class="memory-mood-emoji">
                        ${getMoodEmoji(mood)}
                    </span>

                    <div>

                        <small>Mood</small>

                        <strong>
                            ${capitalizeMood(mood)}
                        </strong>

                    </div>

                </div>

            `;
        }

        memories.forEach(function(memory, index) {

            memoriesHTML += `

                <div class="memory-entry">

                    <div class="memory-entry-header">

                        <span>${memory.emoji}</span>

                        <strong>
                            Memory ${index + 1}
                        </strong>

                        <small>
                            ${memory.time}
                        </small>

                    </div>

                    <p>
                        ${escapeHTML(memory.text)}
                    </p>

                </div>

            `;
        });

        popupContent.innerHTML = `

            <div class="memory-date">
                📅 ${formattedDate}
            </div>

            ${memoriesHTML}

        `;
    }

    popup.classList.add("show");
}


/* =====================================================
                    MOOD EMOJI
===================================================== */

function getMoodEmoji(mood) {

    const emojis = {
        happy: "😊",
        calm: "😌",
        sad: "😢",
        angry: "😡",
        excited: "🤩"
    };

    return emojis[mood] || "💭";
}


/* =====================================================
                CAPITALIZE MOOD
===================================================== */

function capitalizeMood(mood) {

    if (!mood) return "";

    return mood.charAt(0).toUpperCase() + mood.slice(1);
}


/* =====================================================
                ESCAPE HTML
===================================================== */

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* =====================================================
                    CLOSE POPUP
===================================================== */

function closeMemoryPopup() {

    const popup = document.getElementById("memory-popup");

    if (!popup) return;

    popup.classList.remove("show");
}


/* =====================================================
                  PREVIOUS MONTH
===================================================== */

function previousMonth() {

    calendarDate.setMonth(
        calendarDate.getMonth() - 1
    );

    createCalendar();
}


/* =====================================================
                    NEXT MONTH
===================================================== */

function nextMonth() {

    calendarDate.setMonth(
        calendarDate.getMonth() + 1
    );

    createCalendar();
}


/* =====================================================
              MOOD CHECK-IN SYSTEM
===================================================== */

document.addEventListener("DOMContentLoaded", function() {

    const moodCheckForm = document.getElementById(
        "moodCheckForm"
    );

    const moodResult = document.getElementById(
        "moodResult"
    );

    if (!moodCheckForm || !moodResult) return;

    moodCheckForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const scores = {
            happy: 0,
            sad: 0,
            angry: 0,
            calm: 0,
            excited: 0
        };

        for (let i = 1; i <= 7; i++) {

            const answer = document.querySelector(
                `input[name="q${i}"]:checked`
            );

            if (answer && scores.hasOwnProperty(answer.value)) {
                scores[answer.value]++;
            }
        }

        let detectedMood = "calm";
        let highestScore = -1;

        Object.keys(scores).forEach(function(mood) {

            if (scores[mood] > highestScore) {

                highestScore = scores[mood];
                detectedMood = mood;
            }
        });

        /* SAVE MOOD */

        localStorage.setItem(
            "moodverseMood",
            detectedMood
        );

        const today = new Date().toISOString().split("T")[0];

        let moodHistory = JSON.parse(
            localStorage.getItem("moodverseMoodHistory")
        ) || {};

        moodHistory[today] = detectedMood;

        localStorage.setItem(
            "moodverseMoodHistory",
            JSON.stringify(moodHistory)
        );

        /* APPLY THEME */

        document.body.classList.remove(
            "happy-theme",
            "sad-theme",
            "angry-theme",
            "calm-theme",
            "excited-theme"
        );

        document.body.classList.add(
            detectedMood + "-theme"
        );

        /* MOOD INFORMATION */

        const moodInformation = {

            happy: {
                emoji: "😊",
                title: "You seem to be feeling Happy!",
                message: "Your answers show positive energy and joyful feelings today. Enjoy the little moments that are making you smile. 💛",
                task: "Try something fun or share your happiness with someone."
            },

            calm: {
                emoji: "😌",
                title: "You seem to be feeling Calm.",
                message: "Your answers suggest that your mind and emotions are relatively peaceful right now. Take a moment to enjoy that calm feeling. 💜",
                task: "This could be a nice time to journal, create something, or simply relax."
            },

            sad: {
                emoji: "😢",
                title: "You seem to be feeling a little Low.",
                message: "Some of your answers suggest that things may feel heavy right now. You don't have to fix everything at once. Be gentle with yourself. 💙",
                task: "Let's take one tiny step together. You could drink some water, get some fresh air, or write down what you're feeling."
            },

            angry: {
                emoji: "😡",
                title: "You seem to be feeling Frustrated.",
                message: "Your answers suggest that something may be bothering or frustrating you. Taking a short pause before reacting may help. ❤️",
                task: "Try five slow breaths or take a short walk to give yourself some space."
            },

            excited: {
                emoji: "🤩",
                title: "You seem to be feeling Excited!",
                message: "You seem to have plenty of positive energy right now. This could be a great time to create, explore, or do something you enjoy! 🩷",
                task: "Use that energy for something creative or start one tiny goal."
            }

        };

        const result = moodInformation[detectedMood];

        /* DISPLAY RESULT */

        moodResult.innerHTML = `
    <div class="result-emoji">
        ${result.emoji}
    </div>

    <h2>${result.title}</h2>
    <p>${result.message}</p>

    <div class="result-suggestion">
        <strong>🌱 A tiny suggestion</strong>
        <p>${result.task}</p>
    </div>

    <div class="result-actions">
        <a href="/mood-boost/">
            <button type="button">🌱 Give Me a Tiny Task</button>
        </a>

        <a href="/journal/">
            <button type="button">📖 Write in Journal</button>
        </a>

        <a href="/breathing/">
            <button type="button">🧘 Take a Breather</button>
        </a>

        <a href="/dashboard/">
            <button type="button">🌈 Go to Dashboard</button>
        </a>
    </div>
`;

        moodCheckForm.style.display = "none";
        moodResult.style.display = "block";

        createCalendar();
        updateMoodStreak();
        checkAchievements();

        setTimeout(function() {

            moodResult.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 100);

    });

});


/* =====================================================
                MOODVERSE TINY STEPS
===================================================== */

document.addEventListener("DOMContentLoaded", function() {

    const tinyStepsGrid = document.getElementById(
        "tinyStepsGrid"
    );

    if (!tinyStepsGrid) return;

    const savedMood = localStorage.getItem(
        "moodverseMood"
    ) || "sad";

    const moodTasks = {

        sad: [
            {
                icon: "💧",
                title: "Drink Some Water",
                text: "Take a small pause and drink a glass of water."
            },
            {
                icon: "🌤️",
                title: "Get Some Fresh Air",
                text: "Stand near a window or step outside for a few minutes."
            },
            {
                icon: "🌬️",
                title: "Take 5 Slow Breaths",
                text: "Slow down and take five gentle breaths."
            },
            {
                icon: "✍️",
                title: "Let It Out",
                text: "Write down whatever is on your mind."
            },
            {
                icon: "🎵",
                title: "Play a Comfort Song",
                text: "Listen to one song that makes you feel safe or happy."
            },
            {
                icon: "🧸",
                title: "Take a Cozy Break",
                text: "Get comfortable and give yourself five quiet minutes."
            }
        ],

        angry: [
            {
                icon: "🌬️",
                title: "Slow Your Breathing",
                text: "Take five slow breaths before doing anything else."
            },
            {
                icon: "🚶",
                title: "Take a Tiny Walk",
                text: "Walk around for five minutes and let your body move."
            },
            {
                icon: "✍️",
                title: "Write It Down",
                text: "Write what made you angry without judging yourself."
            },
            {
                icon: "💧",
                title: "Drink Some Water",
                text: "Pause and give yourself a moment to reset."
            },
            {
                icon: "🧘",
                title: "Take a Calm Minute",
                text: "Sit somewhere quiet and focus on your surroundings."
            },
            {
                icon: "🎵",
                title: "Listen to Something Calm",
                text: "Put on a relaxing song and give yourself some space."
            }
        ],

        calm: [
            {
                icon: "📖",
                title: "Write a Memory",
                text: "Write about one peaceful moment from today."
            },
            {
                icon: "🌸",
                title: "Notice Something Beautiful",
                text: "Look around and find one small thing you appreciate."
            },
            {
                icon: "💜",
                title: "Practice Gratitude",
                text: "Write down three things you are grateful for."
            },
            {
                icon: "🎨",
                title: "Create Something",
                text: "Draw, doodle, write or make something for fun."
            },
            {
                icon: "📚",
                title: "Read for 5 Minutes",
                text: "Spend a few peaceful minutes with something you enjoy."
            },
            {
                icon: "🌱",
                title: "Set One Tiny Goal",
                text: "Choose one small thing you would like to accomplish."
            }
        ],

        happy: [
            {
                icon: "💌",
                title: "Share the Happiness",
                text: "Send someone a kind message today."
            },
            {
                icon: "📸",
                title: "Save the Moment",
                text: "Write down what made today feel good."
            },
            {
                icon: "🎵",
                title: "Play Your Happy Song",
                text: "Enjoy one song that matches your energy."
            },
            {
                icon: "✨",
                title: "Three Good Things",
                text: "Write three things that made you smile."
            },
            {
                icon: "🌸",
                title: "Do Something You Love",
                text: "Give yourself a few minutes for something enjoyable."
            },
            {
                icon: "💗",
                title: "Make Someone Smile",
                text: "Do one small kind thing for someone else."
            }
        ],

        excited: [
            {
                icon: "🎯",
                title: "Set a Tiny Goal",
                text: "Turn your excitement into one small achievable goal."
            },
            {
                icon: "🎨",
                title: "Create Something",
                text: "Use your energy to make something creative."
            },
            {
                icon: "📝",
                title: "Write Down Your Idea",
                text: "Capture that exciting thought before you forget it."
            },
            {
                icon: "🎵",
                title: "Make a Playlist",
                text: "Create a playlist that matches your energy."
            },
            {
                icon: "🚀",
                title: "Start Something",
                text: "Take one small step toward something you've wanted to do."
            },
            {
                icon: "💗",
                title: "Share Your Excitement",
                text: "Tell someone about what you're excited about."
            }
        ]

    };

    const tasks = moodTasks[savedMood] || moodTasks.sad;

    tinyStepsGrid.innerHTML = "";

    tasks.forEach(function(task, index) {

        const card = document.createElement("div");

        card.className = "tiny-step-card";

        card.innerHTML = `

            <div class="step-icon">
                ${task.icon}
            </div>

            <h3>
                ${task.title}
            </h3>

            <p>
                ${task.text}
            </p>

            <button
                type="button"
                onclick="completeTinyStep(${index}, this)">

                Start

            </button>

        `;

        tinyStepsGrid.appendChild(card);

    });

    const totalCount = document.getElementById("totalCount");

    if (totalCount) {
        totalCount.textContent = tasks.length;
    }

    updateTinyStepProgress();

});


/* =====================================================
                COMPLETE TINY STEP
===================================================== */

function completeTinyStep(index, button) {

    const card = button.closest(".tiny-step-card");

    if (!card || card.classList.contains("completed")) {
        return;
    }

    card.classList.add("completed");

    button.textContent = "✓ Done";
    button.disabled = true;

    updateTinyStepProgress();

    button.style.transform = "scale(1.08)";

    setTimeout(function() {
        button.style.transform = "scale(1)";
    }, 200);
}


/* =====================================================
                UPDATE TINY STEP PROGRESS
===================================================== */

function updateTinyStepProgress() {

    const completed = document.querySelectorAll(
        ".tiny-step-card.completed"
    ).length;

    const total = document.querySelectorAll(
        ".tiny-step-card"
    ).length;

    const completedCount = document.getElementById(
        "completedCount"
    );

    const progressFill = document.getElementById(
        "progressFill"
    );

    if (!completedCount || !progressFill) return;

    completedCount.textContent = completed;

    const percentage = total > 0
        ? (completed / total) * 100
        : 0;

    progressFill.style.width = percentage + "%";
}


/* =====================================================
                FEELING AFTER TASK
===================================================== */

function feelingNow(feeling) {

    const message = document.getElementById(
        "feelingMessage"
    );

    if (!message) return;

    if (feeling === "better") {

        message.textContent =
            "🌸 I'm glad you feel a little better. Even a tiny step counts.";

    }

    else if (feeling === "same") {

        message.textContent =
            "💗 That's okay. You don't have to feel better immediately. Be gentle with yourself.";

    }

    else if (feeling === "low") {

        message.textContent =
            "💙 I'm sorry you're still having a hard moment. Try another tiny step, or write about how you're feeling in your journal.";

    }
}


/* =====================================================
                    MOOD STREAK
===================================================== */

function updateMoodStreak() {

    const streakCount = document.getElementById(
        "streakCount"
    );

    const streakMessage = document.getElementById(
        "streakMessage"
    );

    if (!streakCount || !streakMessage) return;

    const moodHistory = JSON.parse(
        localStorage.getItem("moodverseMoodHistory")
    ) || {};

    let streak = calculateCurrentStreak();

    streakCount.textContent = streak;

    if (streak === 0) {

        streakMessage.textContent =
            "Start your journey today! 🌱";

    }

    else if (streak === 1) {

        streakMessage.textContent =
            "Great start! Come back tomorrow. 🌱";

    }

    else if (streak < 7) {

        streakMessage.textContent =
            "You're building a healthy habit! 💗";

    }

    else if (streak === 7) {

        streakMessage.textContent =
            "Amazing! You reached 7 days! 🎉";

    }

    else if (streak < 14) {

        streakMessage.textContent =
            "You're on a roll! Keep going! 🔥";

    }

    else if (streak < 30) {

        streakMessage.textContent =
            "Incredible consistency! 🌈";

    }

    else {

        streakMessage.textContent =
            "30+ days! You're doing amazing! 🏆";

    }
}


/* =====================================================
                ACHIEVEMENT SYSTEM
===================================================== */

const moodverseAchievements = {

    firstCheckIn: {
        title: "First Check-In",
        icon: "🌱",
        description: "You checked in with your mood for the first time."
    },

    journalStarter: {
        title: "Journal Starter",
        icon: "📖",
        description: "You saved your first journal memory."
    },

    calmMind: {
        title: "Calm Mind",
        icon: "🧘",
        description: "You completed your first breathing session."
    },

    moodExplorer: {
        title: "Mood Explorer",
        icon: "🌈",
        description: "You checked in with all 5 moods."
    },

    sevenDayStreak: {
        title: "7 Day Streak",
        icon: "🔥",
        description: "You checked in for 7 days in a row."
    },

    thirtyDayChampion: {
        title: "30 Day Champion",
        icon: "🏆",
        description: "You maintained a 30 day mood streak."
    }

};


/* =====================================================
                GET ACHIEVEMENTS
===================================================== */

function getUnlockedAchievements() {

    return JSON.parse(
        localStorage.getItem("moodverseAchievements")
    ) || {};
}


/* =====================================================
                SAVE ACHIEVEMENTS
===================================================== */

function saveUnlockedAchievements(achievements) {

    localStorage.setItem(
        "moodverseAchievements",
        JSON.stringify(achievements)
    );
}


/* =====================================================
                UNLOCK ACHIEVEMENT
===================================================== */

function unlockAchievement(achievementId) {

    const achievements = getUnlockedAchievements();

    if (achievements[achievementId]) return;

    achievements[achievementId] = true;

    saveUnlockedAchievements(achievements);

    showAchievementPopup(achievementId);
}


/* =====================================================
              CHECK ALL ACHIEVEMENTS
===================================================== */

function checkAchievements() {

    const moodHistory = JSON.parse(
        localStorage.getItem("moodverseMoodHistory")
    ) || {};

    const journalHistory = JSON.parse(
        localStorage.getItem("moodverseJournalHistory")
    ) || {};

    /* FIRST CHECK-IN */

    if (Object.keys(moodHistory).length >= 1) {
        unlockAchievement("firstCheckIn");
    }

    /* JOURNAL STARTER */

    let journalCount = 0;

    Object.keys(journalHistory).forEach(function(date) {
        journalCount += journalHistory[date].length;
    });

    if (journalCount >= 1) {
        unlockAchievement("journalStarter");
    }

    /* MOOD EXPLORER */

    const uniqueMoods = new Set(
        Object.values(moodHistory)
    );

    if (moodThemes.every(function(mood) {
        return uniqueMoods.has(mood);
    })) {
        unlockAchievement("moodExplorer");
    }

    /* STREAK */

    const streak = calculateCurrentStreak();

    if (streak >= 7) {
        unlockAchievement("sevenDayStreak");
    }

    if (streak >= 30) {
        unlockAchievement("thirtyDayChampion");
    }

    /* BREATHING */

    if (
        localStorage.getItem("moodverseBreathingCompleted") === "true"
    ) {
        unlockAchievement("calmMind");
    }

    displayAchievements();
}


/* =====================================================
              CALCULATE CURRENT STREAK
===================================================== */

function calculateCurrentStreak() {

    const moodHistory = JSON.parse(
        localStorage.getItem("moodverseMoodHistory")
    ) || {};

    let streak = 0;

    let currentDate = new Date();

    while (true) {

        const dateKey = currentDate.toISOString().split("T")[0];

        if (moodHistory[dateKey]) {
            streak++;
        }

        else {
            break;
        }

        currentDate.setDate(
            currentDate.getDate() - 1
        );
    }

    return streak;
}


/* =====================================================
              DISPLAY ACHIEVEMENTS
===================================================== */

function displayAchievements() {

    const achievementCards = document.querySelectorAll(
        "[data-achievement]"
    );

    if (achievementCards.length === 0) return;

    const unlocked = getUnlockedAchievements();

    achievementCards.forEach(function(card) {

        const id = card.dataset.achievement;

        const badge = card.querySelector(
            ".achievement-badge"
        );

        if (unlocked[id]) {

            card.classList.remove("locked");
            card.classList.add("unlocked");

            if (badge) {
                badge.textContent = "Unlocked ✓";
            }

        }

        else {

            card.classList.remove("unlocked");
            card.classList.add("locked");

            if (badge) {
                badge.textContent = "Locked 🔒";
            }

        }

    });
}


/* =====================================================
              ACHIEVEMENT POPUP
===================================================== */

function showAchievementPopup(achievementId) {

    const achievement = moodverseAchievements[
        achievementId
    ];

    if (!achievement) return;

    const oldPopup = document.getElementById(
        "achievement-popup"
    );

    if (oldPopup) {
        oldPopup.remove();
    }

    const popup = document.createElement("div");

    popup.id = "achievement-popup";

    popup.innerHTML = `

        <div class="achievement-popup-box">

            <div class="achievement-popup-sparkle">
                ✨
            </div>

            <div class="achievement-popup-icon">
                ${achievement.icon}
            </div>

            <div class="achievement-popup-label">
                ACHIEVEMENT UNLOCKED!
            </div>

            <h2>
                ${achievement.title}
            </h2>

            <p>
                ${achievement.description}
            </p>

            <button
                type="button"
                onclick="closeAchievementPopup()">

                Awesome! 💗

            </button>

        </div>

    `;

    document.body.appendChild(popup);

    setTimeout(function() {
        popup.classList.add("show");
    }, 50);

    setTimeout(function() {
        closeAchievementPopup();
    }, 5000);
}


/* =====================================================
              CLOSE ACHIEVEMENT POPUP
===================================================== */

function closeAchievementPopup() {

    const popup = document.getElementById(
        "achievement-popup"
    );

    if (!popup) return;

    popup.classList.remove("show");

    setTimeout(function() {

        if (popup && popup.parentNode) {
            popup.remove();
        }

    }, 300);
}


/* =====================================================
              BREATHING SESSION SYSTEM
===================================================== */

let breathingTimer = null;
let breathingSeconds = 60;
let breathingRunning = false;


function startBreathingSession() {

    const button = document.querySelector(
        ".breathing-card button"
    );

    const circle = document.querySelector(
        ".breathing-circle"
    );

    if (!button || !circle || breathingRunning) return;

    breathingRunning = true;
    breathingSeconds = 60;

    button.disabled = true;
    button.textContent = "Session Running... 🧘";

    breathingTimer = setInterval(function() {

        breathingSeconds--;

        updateBreathingDisplay(
            circle,
            breathingSeconds
        );

        if (breathingSeconds <= 0) {

            clearInterval(breathingTimer);

            breathingTimer = null;
            breathingRunning = false;

            button.disabled = false;
            button.textContent = "Start Session 💗";

            circle.textContent = "✨ Complete!";

            localStorage.setItem(
                "moodverseBreathingCompleted",
                "true"
            );

            unlockAchievement("calmMind");

            setTimeout(function() {
                circle.textContent = "Breathe";
            }, 3000);

        }

    }, 1000);

    updateBreathingDisplay(
        circle,
        breathingSeconds
    );
}


/* =====================================================
              UPDATE BREATHING DISPLAY
===================================================== */

function updateBreathingDisplay(circle, seconds) {

    if (!circle) return;

    circle.textContent = seconds + "s";

    if (seconds > 45) {

        circle.style.transform = "scale(1.12)";

        circle.style.background =
            "linear-gradient(135deg,#dff7ff,#e8ddff)";

    }

    else if (seconds > 30) {

        circle.style.transform = "scale(1.05)";

        circle.style.background =
            "linear-gradient(135deg,#e8ddff,#ffdff0)";

    }

    else if (seconds > 15) {

        circle.style.transform = "scale(0.98)";

        circle.style.background =
            "linear-gradient(135deg,#dff8ed,#e5e0ff)";

    }

    else {

        circle.style.transform = "scale(0.92)";

        circle.style.background =
            "linear-gradient(135deg,#ffe1e8,#e5ddff)";

    }
}


/* =====================================================
              CONNECT BREATHING BUTTON
===================================================== */

document.addEventListener("DOMContentLoaded", function() {

    const breathingButton = document.querySelector(
        ".breathing-card button"
    );

    if (breathingButton) {

        breathingButton.addEventListener(
            "click",
            startBreathingSession
        );

    }

});


/* =====================================================
              INITIALIZE EVERYTHING
===================================================== */

document.addEventListener("DOMContentLoaded", function() {

    applySavedMood();

    createCalendar();

    updateMoodStreak();

    checkAchievements();

    displayAchievements();

});
