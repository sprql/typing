/**
 * @constructor
 */
Typing.Keyboard = function() {
    this.layout = {};
    this.shiftLayout = {};
};
Typing.Keyboard.prototype = {

    placeholder : null,

    title : null,
    name : null,
    layout : null,
    html : "",

    cssClass : {
        hightlight : 'highlight',
        active : 'active'
    },

    set : function(layoutSet) {
        var layout = layoutSet.layout;
        var keyObject;
        var keyBox;

        this.placeholder.html('');

        this.name = layoutSet.name;
        this.title = layoutSet.title;
        this.layout = {};

        for (var i in layout) {
            var row = layout[i];
            var rowHtml = $('<span class="row"></span>');
            this.placeholder.append(rowHtml);
            for (var i in row) {
                var key = row[i];

                var keyBox = new Typing.Key(key);
                rowHtml.append(keyBox.placeholder);

                switch (keyBox.modes.length) {
                    case 2:
                        this.layout[key[0]] = keyBox.modes[0];
                        this.shiftLayout[key[1]] = keyBox.modes[1];
                        break;
                }

            }
        }
    },

    shiftMode : function(on) {
        if (on) {
            this.placeholder.addClass('shift-mode');
        } else {
            this.placeholder.removeClass('shift-mode');
        }
    },

    active : function(letters) {
        this.placeholder.find('.' + this.cssClass.active).removeClass(this.cssClass.active);
        for(var i in letters) {
            var sym = letters[i];
            var key = this.layout[sym] || this.shiftLayout[sym];
            if (key) {
                key.placeholder.addClass(this.cssClass.active);
            }
        }
    },

    highlight : function(letter) {
        this.placeholder.find('.' + this.cssClass.hightlight).removeClass(this.cssClass.hightlight);
        var key = this.layout[letter] || this.shiftLayout[letter];
        if (key) {
            key.placeholder.addClass(this.cssClass.hightlight);
        }
    }
};