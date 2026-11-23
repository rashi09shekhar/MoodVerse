/* =====================================================
                  POP THE STRESS GAME
===================================================== */


document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =============================================
                    GET ELEMENTS
        ============================================= */

        const gameArea =
            document.getElementById("gameArea");


        const startButton =
            document.getElementById("startButton");


        const startMessage =
            document.getElementById("startMessage");


        const scoreElement =
            document.getElementById("score");


        const timerElement =
            document.getElementById("timer");


        const gameResult =
            document.getElementById("gameResult");


        const resultMessage =
            document.getElementById("resultMessage");


        const restartButton =
            document.getElementById("restartButton");


        /* =============================================
                    GAME VARIABLES
        ============================================= */

        let score = 0;

        let timeLeft = 20;

        let gameRunning = false;

        let timerInterval = null;

        let bubbleInterval = null;


        /* =============================================
                    BUBBLE EMOJIS
        ============================================= */

        const bubbleEmojis = [
            "💢",
            "😤",
            "☁️",
            "💭",
            "😵",
            "🔥",
            "💥",
            "🌪️"
        ];


        /* =============================================
                    BUBBLE COLORS
        ============================================= */

        const bubbleColors = [
            "#ff9ec4",
            "#a98cff",
            "#7ed6df",
            "#ffd166",
            "#ff8fab",
            "#9be7c4"
        ];


        /* =============================================
                    START GAME
        ============================================= */

        startButton.addEventListener(
            "click",
            startGame
        );


        restartButton.addEventListener(
            "click",
            startGame
        );


        function startGame() {

            /* -----------------------------------------
                    CLEAR OLD GAME
            ----------------------------------------- */

            clearInterval(timerInterval);

            clearInterval(bubbleInterval);


            const oldBubbles =
                document.querySelectorAll(
                    ".stress-bubble"
                );


            oldBubbles.forEach(
                function (bubble) {
                    bubble.remove();
                }
            );


            /* -----------------------------------------
                    RESET VARIABLES
            ----------------------------------------- */

            score = 0;

            timeLeft = 20;

            gameRunning = true;


            scoreElement.textContent =
                score;


            timerElement.textContent =
                timeLeft;


            /* -----------------------------------------
                    SHOW GAME
            ----------------------------------------- */

            startMessage.style.display =
                "none";


            gameResult.style.display =
                "none";


            /* -----------------------------------------
                    CREATE FIRST BUBBLES
            ----------------------------------------- */

            createBubble();

            createBubble();

            createBubble();


            /* -----------------------------------------
                    KEEP CREATING BUBBLES
            ----------------------------------------- */

            bubbleInterval =
                setInterval(
                    function () {

                        if (gameRunning) {
                            createBubble();
                        }

                    },
                    700
                );


            /* -----------------------------------------
                    START TIMER
            ----------------------------------------- */

            timerInterval =
                setInterval(
                    function () {

                        timeLeft--;

                        timerElement.textContent =
                            timeLeft;


                        if (timeLeft <= 0) {

                            endGame();

                        }

                    },
                    1000
                );

        }


        /* =============================================
                    CREATE BUBBLE
        ============================================= */

        function createBubble() {

            if (!gameRunning) {
                return;
            }


            const bubble =
                document.createElement("div");


            bubble.className =
                "stress-bubble";


            /* -----------------------------------------
                    RANDOM SIZE
            ----------------------------------------- */

            const size =
                Math.floor(
                    Math.random() * 45
                ) + 45;


            bubble.style.width =
                size + "px";


            bubble.style.height =
                size + "px";


            /* -----------------------------------------
                    RANDOM POSITION
            ----------------------------------------- */

            const maxX =
                gameArea.clientWidth - size;


            const maxY =
                gameArea.clientHeight - size;


            const x =
                Math.random() * maxX;


            const y =
                Math.random() * maxY;


            bubble.style.left =
                x + "px";


            bubble.style.top =
                y + "px";


            /* -----------------------------------------
                    RANDOM COLOR
            ----------------------------------------- */

            const color =
                bubbleColors[
                    Math.floor(
                        Math.random() *
                        bubbleColors.length
                    )
                ];


            bubble.style.background =
                color;


            /* -----------------------------------------
                    RANDOM EMOJI
            ----------------------------------------- */

            bubble.textContent =
                bubbleEmojis[
                    Math.floor(
                        Math.random() *
                        bubbleEmojis.length
                    )
                ];


            /* -----------------------------------------
                    POP BUBBLE
            ----------------------------------------- */

            bubble.addEventListener(
                "click",
                function () {

                    popBubble(bubble);

                }
            );


            /* -----------------------------------------
                    ADD TO GAME
            ----------------------------------------- */

            gameArea.appendChild(
                bubble
            );


            /* -----------------------------------------
                    REMOVE OLD BUBBLE
            ----------------------------------------- */

            setTimeout(
                function () {

                    if (
                        bubble &&
                        bubble.parentElement
                    ) {

                        bubble.remove();

                    }

                },
                3000
            );

        }


        /* =============================================
                    POP BUBBLE
        ============================================= */

        function popBubble(bubble) {

            if (!gameRunning) {
                return;
            }


            /* -----------------------------------------
                    ADD SCORE
            ----------------------------------------- */

            score++;

            scoreElement.textContent =
                score;


            /* -----------------------------------------
                    ANIMATION
            ----------------------------------------- */

            bubble.classList.add(
                "popped"
            );


            /* -----------------------------------------
                    REMOVE BUBBLE
            ----------------------------------------- */

            setTimeout(
                function () {

                    if (
                        bubble &&
                        bubble.parentElement
                    ) {

                        bubble.remove();

                    }

                },
                150
            );

        }


        /* =============================================
                    END GAME
        ============================================= */

        function endGame() {

            gameRunning = false;


            clearInterval(
                timerInterval
            );


            clearInterval(
                bubbleInterval
            );


            /* -----------------------------------------
                    REMOVE BUBBLES
            ----------------------------------------- */

            const bubbles =
                document.querySelectorAll(
                    ".stress-bubble"
                );


            bubbles.forEach(
                function (bubble) {
                    bubble.remove();
                }
            );


            /* -----------------------------------------
                    RESULT MESSAGE
            ----------------------------------------- */

            let message;


            if (score >= 25) {

                message =
                    `Amazing! You popped ${score} stress bubbles! 🎉 You really let that stress out.`;

            }

            else if (score >= 15) {

                message =
                    `Great job! You popped ${score} stress bubbles. 🌸 Take a slow breath and enjoy this moment.`;

            }

            else if (score >= 5) {

                message =
                    `You popped ${score} bubbles. 💗 Even a tiny break can help. Be gentle with yourself.`;

            }

            else {

                message =
                    `You popped ${score} bubbles. 🌱 That's okay! You don't need to rush. Take a quiet breath.`;

            }


            resultMessage.textContent =
                message;


            /* -----------------------------------------
                    SHOW RESULT
            ----------------------------------------- */

            gameResult.style.display =
                "block";


            gameResult.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

    }
);
