/**
 * @constructor
 */
Typing.Input = function() {
    this.input = $(document);
    this.reset();
};
Typing.Input.prototype = {
    placeholder : null,
    input : null,

    value : "",
    index : 0,
    total : 0,
    errors : 0,

    reset : function() {
        this.index = 0;
        this.total = 0;
        this.errors = 0;
        this.value = "";
        this.start();
    },

    start : function() {
        this.input.unbind();
        this.input.keydown(this.keydown);
        this.input.keypress(this.keypress);
        this.input.focus(this.focus);
        this.input.blur(this.blur);
    },

    stop : function() {
        this.input.unbind();
    },

    keydown  : function(event) {},
    keypress : function(event) {},
    focus : function() {},
    blur : function() {}

};