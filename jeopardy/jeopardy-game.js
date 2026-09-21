/* =========================================================
   DIONLYONEE JEORPARDY
   SHARED GAME CONFIGURATION
   File: jeopardy-game.js
========================================================= */

"use strict";

/* =========================================================
   GAME INFORMATION
========================================================= */

const DIONLYONEE_JEORPARDY_CHANNEL =
    "dionlyonee-jeorpardy-game";

const DIONLYONEE_JEORPARDY_NAME =
    "DIONLYONEE JEORPARDY";


/* =========================================================
   GAME CATEGORIES
========================================================= */

const DIONLYONEE_JEORPARDY_CATEGORIES = [

    "Countries",

    "Animals",

    "Jamaican Phrases",

    "Food",

    "Things You Do",

    "Music",

    "Sports"

];


/* =========================================================
   HELPER — CREATE BROADCAST CHANNEL
========================================================= */

function createJeopardyChannel() {

    if (
        typeof BroadcastChannel === "undefined"
    ) {

        console.warn(
            "BroadcastChannel is not supported by this browser."
        );

        return null;

    }

    return new BroadcastChannel(
        DIONLYONEE_JEORPARDY_CHANNEL
    );

}


/* =========================================================
   HELPER — SEND GAME STATE
========================================================= */

function broadcastJeopardyState(
    channel,
    state
) {

    if (!channel) {
        return;
    }

    channel.postMessage({

        type: "GAME_STATE",

        category:
            state.category || "",

        answer:
            state.answer || "",

        revealed:
            Array.isArray(state.revealed)
                ? state.revealed
                : [],

        seconds:
            Number.isFinite(state.seconds)
                ? state.seconds
                : 0,

        running:
            Boolean(state.running),

        paused:
            Boolean(state.paused),

        phase:
            state.phase || "waiting"

    });

}


/* =========================================================
   HELPER — CLEAN ANSWER FOR DISPLAY
========================================================= */

function formatJeopardyAnswer(
    answer,
    revealed
) {

    if (!answer) {
        return [];
    }

    const revealedLetters =
        Array.isArray(revealed)
            ? revealed
            : [];


    return answer
        .toUpperCase()
        .split("")
        .map(function (character) {

            /* SPACE */

            if (character === " ") {

                return {
                    character: " ",
                    revealed: true,
                    space: true
                };

            }


            /* LETTER */

            return {

                character:
                    revealedLetters.includes(
                        character
                    )
                        ? character
                        : "",

                revealed:
                    revealedLetters.includes(
                        character
                    ),

                space: false

            };

        });

}


/* =========================================================
   HELPER — CHECK COMPLETE
========================================================= */

function isJeopardyPuzzleComplete(
    answer,
    revealed
) {

    if (!answer) {
        return false;
    }

    const letters = [

        ...new Set(

            answer
                .replace(/\s/g, "")
                .toUpperCase()
                .split("")

        )

    ];


    const revealedLetters =
        Array.isArray(revealed)
            ? revealed
            : [];


    return letters.every(
        function (letter) {

            return revealedLetters.includes(
                letter
            );

        }
    );

}


/* =========================================================
   GLOBAL EXPORT
========================================================= */

window.DIONLYONEE_JEORPARDY = {

    CHANNEL:
        DIONLYONEE_JEORPARDY_CHANNEL,

    NAME:
        DIONLYONEE_JEORPARDY_NAME,

    CATEGORIES:
        DIONLYONEE_JEORPARDY_CATEGORIES,

    createChannel:
        createJeopardyChannel,

    broadcast:
        broadcastJeopardyState,

    formatAnswer:
        formatJeopardyAnswer,

    isComplete:
        isJeopardyPuzzleComplete

};


/* =========================================================
   CONSOLE
========================================================= */

console.log(
    DIONLYONEE_JEORPARDY_NAME +
    " shared game system loaded."
);