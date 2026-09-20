// script for brick tower widget 

$.widget("custom.bricktower", {
// default options
    options: {
        maxHeight: 6,
        colors: ["red", "blue", "yellow", "green"],
        height: 0,

        change: null,
        full: null
    },

    // constructor
    _create: function () {
        this.element.addClass("bricktower");
        this.stack = $("<div class='bricktower-stack'></div>").appendTo(this.element);

        this.options.height = this._constrain(this.options.height); 

        // clicking the tower adds a brick
        this._on({ click: "addBrick"});
        this.refresh();
    },

    // keeping the height between 0 and maxHeight 
    _constrain: function (value) {
        if (value > this.options.maxHeight) {
            value = this.options.maxHeight;
        }

        if (value < 0) {
            value = 0;
        }
        return value;
    },

    // runs whenever an option is set, e.g. this.option("height", 3)
    _setOption: function (key, value) {
        if (key === "height") {
            value = this._constrain(value);
        }
        this._super(key, value);

        if (key === "maxHeight") {
            this.options.height = this._constrain(this.options.height);
        }

        this.refresh();

        if (key === "height") {
            this._trigger("change", null, { height: this.options.height });
        }
    },

    // redraws the tower with current height and colours
    refresh: function () {
        this.stack.empty();
        for (var i = 0; i < this.options.height; i++) {
            var color = this.options.colors[i % this.options.colors.length];
            $("<div class='brick'></div>").css("background-color", color).appendTo(this.stack);
        }
    },

    // public method
    addBrick: function () {
        if (this.options.height >= this.options.maxHeight) {
            return;
        }

        this.option("height", this.options.height + 1);

        if (this.options.height === this.options.maxHeight) {
            this._trigger("full", null, { height: this.options.height });
        }
    },

    removeBrick: function () {
        this.option("height", this.options.height - 1);
    },

    _destroy: function () {
        this.stack.remove();
        this.element.removeClass("bricktower");
    }
});

$.custom.bricktower.prototype.clear = function () {
    this.option("height", 0);
};