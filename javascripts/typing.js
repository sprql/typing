/**
 * @constructor
 */
function Typing() {
    this.timer = new Timer();
    this.input = new Typing.Input();
    this.lesson = new Typing.Lesson();
    this.keyboard = new Typing.Keyboard();

    var self = this;
    var indicator = this.indicator;

    indicator.timer = new Typing.Indicator(function() {
        var interval = self.timer.interval();
        var sec = Math.round(interval % 60);
        var min = Math.round(interval / 60);
        return min + ':' + (sec < 10 ? '0' + sec : sec);
    });
    this.timer.add(function() { indicator.timer.display(); });

    indicator.speedometer = new Typing.Indicator(function() {
        var interval = self.timer.interval();
        if (interval == 0) {
            interval = 1;
        }
        return Math.round(self.input.total * 60 / interval);
    });
    this.timer.add(function() { indicator.speedometer.display(); });

    indicator.progress = new Typing.Indicator(function() {
        return Math.round(100*self.lesson.progress / self.lesson.text.length);
    });

    indicator.errors = new Typing.Indicator(function() {
        return Math.floor(self.input.errors*100/self.lesson.text.length);
    });
};
Typing.prototype = {
    placeholder : {
        selectLesson : null,
        selectLayout : null,
        selectMapping : null
    },

    button : {
        reload : null
    },

    indicator : {
        progress : null,
        errors : null,
        timer : null,
        speedometer : null
    },

    // Components
    input : null,
    lesson : null,
    timer : null,
    keyboard : null,
    mapping : null,
    exercises : null,

    errorLength : 0,
    started : false,

    finishSlogan : function() {
        return ['Well Done!<br/>',
            'You are typing ' + this.indicator.speedometer.value() + ' symbols per minute.<br/>',
            'Good Job!'].join('');
    }
};
Typing.prototype.start = function() {
    this.timer.start();
    this.started = true;
};
Typing.prototype.finish = function() {
    this.stop();
    var out = '<span class="congratulation">' + this.finishSlogan() + '</span>';
    this.lesson.placeholder.html(out);
};
Typing.prototype.stop = function() {
    this.timer.stop();
    this.input.stop();
    this.started = false;
    this.keyboard.highlight('');
};
Typing.prototype.reset = function() {
    this.errorLength = 0;
    this.timer.reset();
    this.input.reset();
    this.lesson.reset();
    this.started = false;
};
Typing.prototype.run = function() {
    var self = this;

    this.input.keydown = function(event) {
        if (event.keyCode == 8) {
            self.backspace();
            event.preventDefault();
            return false;
        }

        var input = self.input;
        var lesson = self.lesson;
        var keyCode = event.keyCode;
        if (keyCode == 16) {
            self.keyboard.shiftMode(true);
            self.input.input.keyup(function(event) {
                if (event.keyCode == 16) {
                    self.keyboard.shiftMode(false);
                    self.input.input.unbind('keyup');
                }
            });
        }
    };

    this.input.keypress = function(event) {
        var input = self.input;
        var lesson = self.lesson;
        var charCode = event.charCode;
        var ch = String.fromCharCode(charCode);
        if (self.mapping && charCode > 32) {
            ch = self.mapping[ch];
        }
        if (charCode >= 32 && ch && ch.length > 0 && input.value.length < lesson.text.length) {
            if (!self.started) {
                self.start();
            }
            if (lesson.text.charAt(input.index) != ch) {
                self.errorLength++;
                if (self.errorLength == 1) {
                    input.errors++;
                }
            }
            input.value += ch;
            input.total++;
            input.index++;
            self.displayProgress();
            self.refreshIndicators();
            if (!(event.altKey || event.metaKey || event.ctrlKey)) {
                event.preventDefault();
            }
        }
    };

    this.keyboard.set(Typing.layouts[0]);
    this.exercises = Typing.exercises[this.keyboard.name];
    this.lesson.set(this.exercises[0]);
    this.keyboard.active(this.lesson.letters);

    // Select Lessons
    var selectLesson = $(Typing.ui.select(this.exercises));
    this.placeholder.selectLesson.html(selectLesson);
    selectLesson.change(function() {
        var id = $(this).val();
        self.lesson.set(self.exercises[id]);
        self.keyboard.active(self.lesson.letters);
        self.reset();
        self.render();
        $(this).blur();
    });

    // Select Layout
    var selectLayout = $(Typing.ui.select(Typing.layouts));
    this.placeholder.selectLayout.html(selectLayout);
    selectLayout.change(function() {
        var id = $(this).val();
        self.keyboard.set(Typing.layouts[id]);
        self.exercises = Typing.exercises[self.keyboard.name];
        selectLesson.html(Typing.ui.selectOptions(self.exercises));
        self.lesson.set(self.exercises[0]);
        self.keyboard.active(self.lesson.letters);
        self.reset();
        self.render();
        $(this).blur();
    });

    // Select Mapping
    var selectMapping = $(Typing.ui.select(Typing.Mapping, Typing.ui.selectSimpleOptions));
    this.placeholder.selectMapping.html(selectMapping);
    selectMapping.change(function() {
        var id = $(this).val();
        self.mapping = Typing.Mapping[id];
        $(this).blur();
    });

    this.button.reload.click(function() {
        self.reset();
        self.render();
        this.blur();
    });
    this.reset();
    this.render();
};
Typing.prototype.render = function() {
    this.lesson.display();
    this.displayProgress();
    this.refreshIndicators();
    this.indicator.timer.display();
    this.indicator.speedometer.display();
};
Typing.prototype.refreshIndicators = function() {
    this.indicator.progress.display();
    this.indicator.errors.display();
};
Typing.prototype.displayProgress = function() {
    var outText = '';
    var typed = this.input.value;
    var text = this.lesson.text;
    if (typed == text) {
        this.lesson.progress = this.lesson.text.length;
        this.finish();
        return null;
    }
    if (typed.length > 0) {
        var wrongTypedIndex = null;
        for (var i = 0; i < typed.length; i++) {
            if (typed.charAt(i) != text.charAt(i)) {
                wrongTypedIndex = i;
                break;
            }
        }
        outText = '<span class="typed">';
        if (wrongTypedIndex != null && wrongTypedIndex >= 0) {
            outText += text.substring(0, wrongTypedIndex).whiteSpace().escapeHTML();
            outText += '<span class="invalid">' + text.substring(wrongTypedIndex, typed.length).escapeHTML() + '</span>';
            this.lesson.progress = wrongTypedIndex;
        } else {
            outText += text.substring(0, typed.length).whiteSpace().escapeHTML();
            this.lesson.progress = typed.length;
        }
        outText += '</span>';
    } else {
        this.lesson.progress = 0;
    }
    var current = text.substr(typed.length, 1);
    if (this.errorLength == 0){
        this.keyboard.highlight(current);
    } else {
        this.keyboard.highlight('');
    }
    outText += '<span class="marker">' + (current == " " ? '&nbsp;' : current) + '</span>';
    outText += (current == " ") ? '&#x200B;' : '';
    outText += text.substr(typed.length+1).whiteSpace().escapeHTML();
    this.lesson.placeholder.html(outText);
    var marker = this.lesson.placeholder.find('.marker');
    this.lesson.placeholder[0].scrollTop = marker[0].offsetTop - this.lesson.lineHeight;
};
Typing.prototype.backspace = function() {
    var self = this;
    var input = this.input;
    var lesson = this.lesson;

    input.value = input.value.substring(0, input.value.length - 1);
    if (self.errorLength > 0) {
        self.errorLength--;
    }
    if (input.index > 0) {
        input.index--;
    }
    this.displayProgress();
    this.refreshIndicators();
};