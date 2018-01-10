String.prototype.escapeHTML = function() {
    return this.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};
String.prototype.whiteSpace = function() {
    return this.replace(/ /g, '&nbsp;&#x200B;');
};