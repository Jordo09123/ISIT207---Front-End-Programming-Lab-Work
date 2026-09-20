$(function () {
  const themes = ["City", "Star Wars", "Friends", "Technic",
                  "Creator", "Ninjago", "Harry Potter", "Architecture"];

    // auto complete widget
    $("#theme").autocomplete({ source: themes });
    // date picker widget
    $("#delivery").datepicker({ dateFormat: "dd/mm/yy", minDate: 0 });

    // custom widget
    $("#tower").bricktower({
        maxHeight: 6,
        change: function (event, data) {
            $("#tower-message").text("Tower height: " + data.height + " / " + $("#tower").bricktower("option", "maxHeight"));
        },
        full: function () {
            $("#tower-message").text("Tower complete! Great building!");
        }
    });

    $("#add-brick").on("click", function () { $("#tower").bricktower("addBrick"); });
    $("#remove-brick").on("click", function () { $("#tower").bricktower("removeBrick"); });
    $("#clear-tower").on("click", function () { $("#tower").bricktower("clear"); });

    // task 4
    // action 1, build the set which takes 2 seconds
    // when it finishes it will call the function it was given (the callback)
    function buildSet(theme, callback) {
        console.log("[Callback] Action 1 started: building the set");
        $("#order-status").text("Building your " + theme + " set...");

        var sound = new Audio("sounds/lego-building-sound.mp3");
        sound.play();

        setTimeout(function () {
            sound.pause();
            console.log("[Callback] Action 1 finished");
            callback("Your " + theme + " set is built!");
        }, 2000)
    }

    // action 2, notify the customer which takes 1.5 seconds
    function notifyCustomer(message) {
        console.log("Action 2 started: notifying the customer");
        $("#order-status").text("Sending you a notification...");

        setTimeout(function () {
            $("#order-status").text(message);
            console.log("Action 2 finished");
        }, 1500);
    }

    $("#order-btn").on("click", function () {
        var theme = $("#theme").val() || "Mystery";
        buildSet(theme, notifyCustomer)
    });
// --------------------------------------------------------------------------
    // task 5 - promises
    // action 1 as a Promise
    function buildSetPromise(theme) {
        return new Promise(function (resolve, reject) {
            console.log("[Promise] Action 1 started: building the set");
            $("#order-status").text("Building your " + theme + " set...");

            var sound = new Audio("sounds/lego-building-sound.mp3");
            sound.play();

            setTimeout(function () {
                sound.pause();
                console.log("[Promise] Action 1 finished");
                resolve("Your " + theme + " set is built!"); 
            }, 2000);
        });
    }

    $("#order-promise-btn").on("click", function () {
        var theme = $("#theme").val() || "Mystery";

        // action 2 runs when the Promise is resolved
        buildSetPromise(theme).then(notifyCustomer);
    });

// ------------------------------------------------------------

    // task 6 promise rejection 
    function buildSetChecked(theme) {
        return new Promise(function (resolve, reject) {
            console.log("[Reject demo] Action 1 started");
            $("#order-status").text("Building your " + theme + " set...");

            var sound = new Audio("sounds/lego-building-sound.mp3");
            sound.play();

            setTimeout(function () {
                sound.pause();

                // check if the theme is in the list of themes
                var inStock = themes.some(function (t) {
                    return t.toLowerCase() == theme.toLowerCase();
                });

                if (inStock) {
                    console.log("[Reject demo] Action 1 Finished");
                    resolve("Your " + theme + " set is built!");
                } else {
                    console.log("[Reject demo] Action 1 FAILED");
                    reject("Sorry, we do not stock that theme, please try again")
                }
            }, 2000);
        });
    }

    $("#order-reject-btn").on("click", function () {
        var theme = $("#theme").val() || "Mystery";

        buildSetChecked(theme).then(notifyCustomer).catch(notifyCustomer)       
    })
});

