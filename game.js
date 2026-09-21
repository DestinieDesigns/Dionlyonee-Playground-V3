```javascript
alert("DIONLYONEE GAME.JS IS LOADED");

console.log("GAME.JS LOADED SUCCESSFULLY");


document.getElementById("start").addEventListener("click", function() {

    alert("START BUTTON WORKS!");

});


document.querySelectorAll(".time-button").forEach(function(button) {

    button.addEventListener("click", function() {

        alert(
            "TIME BUTTON WORKS: " +
            button.dataset.time +
            " seconds"
        );

    });

});


document.querySelectorAll(".cooldown-button").forEach(function(button) {

    button.addEventListener("click", function() {

        alert(
            "COOLDOWN BUTTON WORKS: " +
            button.dataset.time +
            " seconds"
        );

    });

});
```
