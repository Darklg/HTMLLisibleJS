/*
 * HTMLLisible is under MIT License
 */

var HTMLLisible = function() {

    var self = this,
        uniqueTags = ['meta', 'br', 'hr', 'link', 'input'],
        tagsToTrim = ['a', 'span', 'strong', 'em', 'h1', 'h2', 'h3', 'label', 'button', 'title'],
        tagsToTrimLength = tagsToTrim.length,
        indentations = {
            'spaces2': {
                isDefault: 0,
                name: "2 spaces",
                value: "  ",
            },
            'spaces4': {
                isDefault: 1,
                name: "4 spaces",
                value: "    ",
            },
            'tabs1': {
                isDefault: 0,
                name: "1 tab",
                value: "\t",
            }
        },
        isolations = [{
            treatAsAutoclosingTag: 0,
            name: 'php',
            exp: /<\?php([\s\S]*?)?>/gm,
            values: []
        }, {
            treatAsAutoclosingTag: 0,
            name: 'ifcomm',
            exp: /<!--\[if([\s\S.]*?)endif\]-->/gm,
            values: []
        }, {
            treatAsAutoclosingTag: 1,
            name: 'pre',
            exp: /<pre([\s\S]*?)<\/pre>/gm,
            values: []
        }, {
            treatAsAutoclosingTag: 1,
            name: 'style',
            exp: /<style([\s\S]*?)<\/style>/gm,
            values: []
        }, {
            treatAsAutoclosingTag: 1,
            name: 'script',
            exp: /<script([\s\S]*?)<\/script>/gm,
            values: []
        }];

    this.setFormActions = function(els) {

        // Set Select values
        this.setElements(els);

        // Events
        this.setEvents(els);

    };

    // Elements
    this.setElements = function(els) {
        // Select
        var tmpHTML = '',
            indobj = '';
        for (var ind in indentations) {
            indobj = indentations[ind];
            tmpHTML += '<option value="' + ind + '" ' + (indobj.isDefault ? 'selected="selected"' : '') + '>' + indobj.name + '</option>';
        }
        els.indentItem.innerHTML = tmpHTML;
    };

    // Events
    this.setEvents = function(els) {
        // On form submit
        els.mainform.addEvent('submit', function(e) {
            window.eventPreventDefault(e);
            var htmlToClean = els.contentItem.value,
                indent = els.indentItem.value;
            // Replace textarea value with clean HTML
            els.contentItem.value = self.clean(htmlToClean, indent);
        });
        els.compressBtn.addEvent('click', function(e) {
            window.eventPreventDefault(e);
            els.contentItem.value = self.clean(els.contentItem.value, -1);
        });
    };

    // Returns cleaned HTML
    this.clean = function(html, indent) {
        // Isolate string
        html = this.setIsolationStrings(html);
        // Remove line breaks inside tags
        html = this.removeLineBreaksInsideTags(html);
        // Add missing slashes to autoclosing tags
        html = this.addMissingSlashes(html);
        // Clean HTML
        html = this.cleanHTML(html);
        if (indent !== -1) {
            // Prepare indent HTML
            html = this.reindentHTML(html, indent);
        }
        // Trim content on some tags
        html = this.trimContentTags(html);
        // Trim empty tags
        html = this.trimEmptyTags(html);
        // Unset string isolation
        html = this.unsetIsolationStrings(html);
        return this.trim(html);
    };

    this.setIsolationStrings = function(html) {
        var isolobj = false,
            strings = [],
            replaceNb = 0,
            tmpstr = '',
            str = '';
        for (var isol in isolations) {
            isolobj = isolations[isol];
            // Empty old values
            isolobj.values = [];
            str = '';
            // Get strings
            strings = html.match(isolobj.exp);
            for (str in strings) {
                replaceNb++;
                tmpstr = '__##__' + replaceNb + '__##__';
                if (isolobj.treatAsAutoclosingTag) {
                    tmpstr = '<' + tmpstr + '/>';
                }
                isolobj.values.push({
                    'str': strings[str],
                    'tmpstr': tmpstr
                });
                // Replace string by a rand string
                html = html.replace(strings[str], tmpstr);
            }
        }
        return html;
    };

    this.unsetIsolationStrings = function(html) {
        var isol, isolstr, isolval;
        isolations.reverse();
        for (isol in isolations) {
            isolobj = isolations[isol];
            isolstr = '';
            isolobj.values.reverse();
            for (isolstr in isolobj.values) {
                isolval = isolobj.values[isolstr];
                html = html.replace(isolval.tmpstr, isolval.str);
            }
        }
        return html;
    };

    // Add missing slashes to autoclosing tags
    this.addMissingSlashes = function(html) {
        var regMissing = new RegExp("<(" + uniqueTags.join('|') + ")([^>]*)([^>\/]{1})>", 'g');
        html = String(html).replace(regMissing, '<$1$2$3 />');
        return html;
    };

    // Remove line breaks inside tags
    this.removeLineBreaksInsideTags = function(html) {
        html = String(html).replace(/<([^>]*)\n([^>]*)>/g, '<$1 $2>');
        return html;
    };

    this.cleanHTML = function(html) {
        // Replace spaces after tag
        html = String(html).replace(/>([ \t\n]+)/gm, '>');
        // Replace spaces before tag
        html = String(html).replace(/([ \t\n]+)</gm, '<');
        return html;
    };

    this.reindentHTML = function(html, indent) {

        // Set one tag per line
        html = html.replace(/>([^<]*)</g, ">\n$1\n<");

        // Extract lines
        var lines = String(html).split("\n"),
            linesLength = lines.length,
            reindentedHTML = '',
            isOpening = false,
            indentLevel = 0,
            indentHTML = '',
            line = '';

        // For each line
        for (var i = 0; i < linesLength; i++) {

            line = this.trim(lines[i]);
            // Dont look at empty lines
            if (!line) {
                continue;
            }

            // Closing line
            if (line.match(/^<\//) || line == '<![endif]-->') {
                indentLevel--;
            }

            var indentType = !! (indentations[indent]) ? indentations[indent].value : false;

            // Prepare indentHTML
            indentHTML = this.pad(indentLevel, indentType);

            // Opening line (not unique tag)
            if (line.match(/^<([a-zA-Z])/) && !line.match(/\/>$/)) {
                indentLevel++;
            }
            reindentedHTML += indentHTML + line + "\n";
        }

        return reindentedHTML;
    };

    // Trim some tag contents if they dont contain HTML
    this.trimContentTags = function(html) {
        var i = 0,
            j = 0,
            reg, tag, matches, matchesLength;

        for (; i < tagsToTrimLength; i++) {
            tag = tagsToTrim[i];
            reg = new RegExp("<" + tag + "([^>]*)>([^<]*)</" + tag + ">", 'gm');
            matches = html.match(reg);
            if (matches) {
                matchesLength = matches.length;
                for (j = 0; j < matchesLength; j++) {
                    html = html.replace(matches[j], this.cleanHTML(matches[j]));
                }
            }
        }
        return html;
    };

    // Trim empty tags
    this.trimEmptyTags = function(html) {
        // Empty tag = opening & non unique tag, following by space and a closing tag
        html = html.replace(/<([^\/])([^>]*)([^\/])>([\s\t\n]*)<\//g, '<$1$2$3></');
        return html;
    };

    /* Utilities */

    // Pad a string to a given number
    this.pad = function(nb, str) {
        str = !str ? "    " : str;
        nb = !nb ? 0 : nb;
        return new Array(nb + 1).join(str);
    };

    // Trim a string
    this.trim = function(str) {
        return str.replace(/^\s+/g, '').replace(/\s+$/g, '');
    };
};