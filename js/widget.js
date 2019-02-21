/**
 * Created by danielg on 11/16/17.
 */
var sections;
var sectionClicks = {};
var SDK = lpTag.agentSDK || {};
$(function() {
    SDK.init({});
    _loadSections();
});

function _loadSections() {
    $.getJSON("js/sections.json", function(json) {
        sections = json;
        for (var i = 0; i < sections.length; i++) {
            _displaySection(i);
        }
    });
}

function _displaySection(index) {
    var section = sections[index];
    if (section) {
        section.isOpen = index === 0;
        sectionClicks[index] = _sectionClick.bind(this, index);
        $("#sections").append('<div class=\"section\" id=\"section' + index + '\"></div>');
        $("#section" + index).append('<div class=\"closedSection\" id=\"closedSection' + index + '\"></div>');
        $("#closedSection" + index).append('<div class=\"titleContainer\" id=\"closedTitle' + index + '\" onclick=\"sectionClicks[' + index +']()\"></div>');
        $("#closedTitle" + index).append('<span class=\"sectionTitle\">' + section.title + '</span>');
        $("#closedTitle" + index).append('<span class=\"sectionArrow down\"></span>');
        $("#section" + index).append('<div class=\"openSection\" id=\"openSection' + index + '\""></div>');
        $("#openSection" + index).append('<div class=\"titleContainer\" id=\"openTitle' + index + '\" onclick=\"sectionClicks[' + index +']()\"></div>');
        $("#openTitle" + index).append('<span class=\"sectionTitle\">' + section.title + '</span>');
        $("#openTitle" + index).append('<span class=\"sectionArrow up\"></span>');
        $("#openSection" + index).append('<div class=\"sectionContainer\" id=\"sectionContainer' + index + '\"></div>');
        if (section.innerTitle) {
            $("#sectionContainer" + index).append(section.innerTitle);
        }
        $("#sectionContainer" + index).append('<div class=\"sectionContent\" id=\"sectionContent' + index + '\"></div>');
        if (section.type === 'buttons') {
            buttons = section.buttons;
            _displayButtons(index);
        }
        _setSectionVisibility(index);
    }
}

function _sectionClick(index) {
    if (sections && sections.length > index) {
        var section = sections[index];
        if (section) {
            section.isOpen = !section.isOpen;
            _setSectionVisibility(index);
        }
    }
}

function _setSectionVisibility(index) {
    $('#section' + index).removeClass('open');
    if (sections[index].isOpen) {
        $('#section' + index).addClass('open');
    }
}

function _displayButtons(section) {
    if (sections && sections.length > section) {
        var buttons = sections[section].buttons;
        if (!sections[section].buttonClicks) {
            sections[section].buttonClicks = {};
        }
        if (buttons) {
            for (var i = 0; i < buttons.length; i++) {
                var button = buttons[i];
                sections[section].buttonClicks[i] = _buttonClick.bind(this, section, i);
                $("#sectionContent" + section).append('<button class=\"button\" onclick=\"sections[' + section + '].buttonClicks[' + i + ']()\" title=\"' + button.title + '\">' + button.html + '</button>');
            }
        }
    }
}

function _buttonClick(section, button) {
    if (sections && sections.length > section) {
        var buttons = sections[section].buttons;
        if (buttons && buttons.length > button) {
            var data = buttons[button];
            if (data && data.structuredContent) {
                _sendStructuredContent(data.structuredContent, data.metaData);
            }
        }
    }
}

function _sendStructuredContent(sc, md) {
    var cmdName = lpTag.agentSDK.cmdNames.writeSC;
    var data = {
        json: sc,
        metadata: md
    };

    SDK.command(cmdName, data, function (err) {
        if (err) {
            _log('There was a problem sending the structured content! error message: ' + err);
        } else {
            _log('');
        }
    });
}

function _log(text){
    var area = $("#log");
    area.text(text);
}
