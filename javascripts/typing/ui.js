Typing.ui = {};
Typing.ui.select = function(list, func) {
    var out = '';
    out += '<select>';
    if (typeof(func) == 'function') {
        out += func(list);
    } else {
        out += Typing.ui.selectOptions(list);
    }
    out += '</select>';
    return out;
};
Typing.ui.selectOptions = function(list) {
    var out = '';
    for (var i in list) {
        out += ['<option value="', i, '">', list[i].title, '</option>'].join('');
    }
    return out;
};
Typing.ui.selectSimpleOptions = function(list) {
    var out = '';
    for (var i in list) {
        out += ['<option value="', i, '">', i, '</option>'].join('');
    }
    return out;
};