/**
 * @constructor
 */
Typing.Lesson = function() {};
Typing.Lesson.sort = function(x, y) {
    return Math.random() - Math.random();
};
Typing.Lesson.prototype = {

    title : "",
    letters : null,
    words : null,
    originText : "",
    wordPerLesson : null,

    text : "",
    progress : 0,

    placeholder : null,
    lineHeight : 0,

    defaultWordPerLesson : 50,

    build : function() {
        if (this.words && this.words.length > 0) {
            var list = this.words.slice(0);
            var wordPerLesson = this.wordPerLesson;
            if (list.length > 0) {
                while(list.length < wordPerLesson) {
                    list = list.concat(list);
                }
            }
            this.text = list.sort(Typing.Lesson.sort).slice(0, wordPerLesson).join(' ');
        } else if (typeof(this.originText) == 'object') {
            var i = Math.floor(Math.random() * this.originText.length);
            this.text = this.originText[i];
        } else {
            this.text = this.originText;
        }
    },

    set : function(lesson) {
        this.title = lesson.title;
        this.words = lesson.words;
        this.wordPerLesson = lesson.wordPerLesson || this.defaultWordPerLesson;
        this.letters = lesson.letters;
        this.originText = lesson.text;
        this.build();
    },

    reset : function() {
        this.build();
        this.placeholder[0].scrollTop = 0;
    },

    display : function() {
        var el = $('<div>!</div>');
        this.placeholder.append(el);
        this.lineHeight = el[0].clientHeight;
        this.placeholder.html(this.text.escapeHTML());
    }
};