/**
 * @constructor
 */
Typing.Indicator = function(value) {
    this.value = value;
};
Typing.Indicator.prototype = {
    placeholder : null,
    value : function() {},
    display : function() {
        this.placeholder.html(this.value());
    }
};