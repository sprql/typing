Typing.Key = function(key) {
    this.placeholder = $('<span class="' + this.cssClass.box + '"></span>');
    this.modes = [];

    if (!key) {
        this.blank = true;
        this.placeholder.addClass(this.cssClass.blank);
    } else if (key.length == 2) {
        var keyMode =  new Typing.KeyMode(key[0]);
        this.modes.push(keyMode);
        this.placeholder.append(keyMode.placeholder);

        keyMode =  new Typing.KeyMode(key[1], 'shift');
        this.modes.push(keyMode);
        this.placeholder.append(keyMode.placeholder);
    }
};
Typing.Key.prototype = {

    placeholder : null,
    modes : null,
    blank : false,

    cssClass : {
        box : 'key-box',
        blank : 'blank'
    }

}


Typing.KeyMode = function(label, mode) {
    this.label = label;
    this.mode = mode || null;

    var cssClass = '';
    switch(mode) {
        case 'shift':
            cssClass = 'shift';
            break;
    }
    this.placeholder = $('<span class="' + this.cssClass.key + ' ' + cssClass + '">' + label + '</span>');
}

Typing.KeyMode.prototype = {
    label : '',
    mode : '',
    placeholder : null,

    cssClass : {
        key : 'key',
        hightlight : 'highlight',
        active : 'current',
        blank : 'blank',
        shiftUp : 'shift up',
        shift : 'shift'
    },

    hightlight : function() {
        this.placeholder.addClass(this.cssClass.hightlight);
    }
};