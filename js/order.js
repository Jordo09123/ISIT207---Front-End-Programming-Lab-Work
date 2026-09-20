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
});