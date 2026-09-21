/* =========================================================
   DIONLYONEE — MOST LIKELY GAME ENGINE
   ========================================================= */

"use strict";


/* =========================================================
   SHARED CHANNEL
   ========================================================= */

const MOST_LIKELY_CHANNEL_NAME =
    "dionlyonee-most-likely-game-v2";


const mostLikelyChannel =
    new BroadcastChannel(
        MOST_LIKELY_CHANNEL_NAME
    );


/* =========================================================
   QUESTIONS
   ========================================================= */

const MOST_LIKELY_QUESTIONS = [

    "Who is most likely to become famous?",

    "Who is most likely to survive a zombie apocalypse?",

    "Who is most likely to accidentally become a millionaire?",

    "Who is most likely to forget why they walked into a room?",

    "Who is most likely to laugh at the worst possible moment?",

    "Who is most likely to start an argument over something tiny?",

    "Who is most likely to fall asleep during a movie?",

    "Who is most likely to become a celebrity?",

    "Who is most likely to move to another country?",

    "Who is most likely to own the biggest house?",

    "Who is most likely to spend all their money in one day?",

    "Who is most likely to become a millionaire first?",

    "Who is most likely to get lost even with GPS?",

    "Who is most likely to go viral online?",

    "Who is most likely to win a reality TV show?",

    "Who is most likely to become president?",

    "Who is most likely to start their own business?",

    "Who is most likely to accidentally text the wrong person?",

    "Who is most likely to eat dessert before dinner?",

    "Who is most likely to stay up all night?",

    "Who is most likely to sleep through an alarm?",

    "Who is most likely to become a famous streamer?",

    "Who is most likely to have the most pets?",

    "Who is most likely to get married first?",

    "Who is most likely to travel the world?",

    "Who is most likely to become a famous singer?",

    "Who is most likely to become a famous actor?",

    "Who is most likely to win a dance competition?",

    "Who is most likely to break a world record?",

    "Who is most likely to become a superhero?",

    "Who is most likely to survive being stranded on an island?",

    "Who is most likely to become a detective?",

    "Who is most likely to become a comedian?",

    "Who is most likely to own a private island?",

    "Who is most likely to become an influencer?",

    "Who is most likely to accidentally start a trend?",

    "Who is most likely to be late to their own wedding?",

    "Who is most likely to win a game show?",

    "Who is most likely to become a millionaire from a random idea?",

    "Who is most likely to become famous for something completely random?"

];


/* =========================================================
   STATE
   ========================================================= */

let mostLikelyState = {

    started: false,

    currentQuestion: "",

    cardNumber: 0,

    deck: [],

    used: []

};


/* =========================================================
   CREATE NEW DECK
   ========================================================= */

function createMostLikelyDeck() {

    const deck =
        MOST_LIKELY_QUESTIONS.map(
            function (question, index) {

                return {
                    id: index,
                    question: question
                };

            }
        );


    /* Fisher-Yates shuffle */

    for (
        let i = deck.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );


        [
            deck[i],
            deck[j]
        ] =
        [
            deck[j],
            deck[i]
        ];

    }


    return deck;

}


/* =========================================================
   INITIALIZE GAME
   ========================================================= */

function initializeMostLikelyGame() {

    mostLikelyState = {

        started: false,

        currentQuestion: "",

        cardNumber: 0,

        deck:
            createMostLikelyDeck(),

        used: []

    };


    saveMostLikelyState();

}


/* =========================================================
   SAVE
   ========================================================= */

function saveMostLikelyState() {

    try {

        sessionStorage.setItem(
            "dionlyonee-most-likely-state",
            JSON.stringify(
                mostLikelyState
            )
        );

    } catch (error) {

        console.warn(
            "Could not save Most Likely state.",
            error
        );

    }

}


/* =========================================================
   LOAD
   ========================================================= */

function loadMostLikelyState() {

    try {

        const saved =
            sessionStorage.getItem(
                "dionlyonee-most-likely-state"
            );


        if (saved) {

            const parsed =
                JSON.parse(saved);


            if (
                parsed &&
                Array.isArray(parsed.deck) &&
                Array.isArray(parsed.used)
            ) {

                mostLikelyState =
                    parsed;

                return;

            }

        }

    } catch (error) {

        console.warn(
            "Could not load Most Likely state.",
            error
        );

    }


    initializeMostLikelyGame();

}


/* =========================================================
   GET PUBLIC STATE
   ========================================================= */

function getMostLikelyPublicState() {

    return {

        started:
            Boolean(
                mostLikelyState.started
            ),

        currentQuestion:
            mostLikelyState.currentQuestion || "",

        cardNumber:
            Number(
                mostLikelyState.cardNumber || 0
            ),

        remaining:
            Array.isArray(
                mostLikelyState.deck
            )
                ? mostLikelyState.deck.length
                : 0,

        used:
            Array.isArray(
                mostLikelyState.used
            )
                ? mostLikelyState.used.length
                : 0,

        total:
            MOST_LIKELY_QUESTIONS.length

    };

}


/* =========================================================
   BROADCAST STATE
   ========================================================= */

function broadcastMostLikelyState() {

    const state =
        getMostLikelyPublicState();


    mostLikelyChannel.postMessage({

        type:
            "STATE",

        state:
            state

    });

}


/* =========================================================
   DRAW CARD
   ========================================================= */

function drawMostLikelyCard() {

    if (
        !Array.isArray(
            mostLikelyState.deck
        )
    ) {

        initializeMostLikelyGame();

    }


    if (
        mostLikelyState.deck.length === 0
    ) {

        mostLikelyState.started =
            false;

        mostLikelyState.currentQuestion =
            "";

        saveMostLikelyState();

        broadcastMostLikelyState();

        return;

    }


    const card =
        mostLikelyState.deck.shift();


    mostLikelyState.used.push(
        card
    );


    mostLikelyState.cardNumber =
        mostLikelyState.used.length;


    mostLikelyState.currentQuestion =
        card.question;


    mostLikelyState.started =
        true;


    saveMostLikelyState();

    broadcastMostLikelyState();

}


/* =========================================================
   START GAME
   ========================================================= */

function startMostLikelyGame() {

    /*
     * If a game is already running,
     * don't accidentally start another one.
     */

    if (
        mostLikelyState.started &&
        mostLikelyState.currentQuestion
    ) {

        broadcastMostLikelyState();

        return;

    }


    /*
     * If the deck is empty,
     * create a fresh deck.
     */

    if (
        !Array.isArray(
            mostLikelyState.deck
        ) ||
        mostLikelyState.deck.length === 0
    ) {

        initializeMostLikelyGame();

    }


    drawMostLikelyCard();

}


/* =========================================================
   NEXT CARD
   ========================================================= */

function nextMostLikelyCard() {

    if (
        !mostLikelyState.started
    ) {

        startMostLikelyGame();

        return;

    }


    if (
        mostLikelyState.deck.length === 0
    ) {

        broadcastMostLikelyState();

        return;

    }


    drawMostLikelyCard();

}


/* =========================================================
   RESET GAME
   ========================================================= */

function resetMostLikelyGame() {

    initializeMostLikelyGame();

    broadcastMostLikelyState();

}


/* =========================================================
   LIVE REQUESTS CURRENT STATE
   ========================================================= */

mostLikelyChannel.addEventListener(
    "message",
    function (event) {

        if (!event.data) {
            return;
        }


        if (
            event.data.type ===
            "REQUEST_STATE"
        ) {

            broadcastMostLikelyState();

        }

    }
);


/* =========================================================
   LOAD STATE
   ========================================================= */

loadMostLikelyState();