/*
 * HTMLLisible is under MIT License
 */

var HTMLLisible = function() {
    this.clean = function(html) {
        // Add missing slashes to autoclosing tags
        html = this.addMissingSlashes(html);
        // Clean HTML
        html = this.cleanHTML(html);
        // Prepare indent HTML
        html = this.reindentHTML(html);
        return html;
    };

    this.addMissingSlashes = function(html) {
        html = String(html).replace(/<(meta|br|hr|link)([^>\/]*)>/g, '<$1$2 />');
        return html;
    };

    this.cleanHTML = function(html) {
        // Replace spaces after tag
        html = String(html).replace(/>([ \t\n]+)/gm, '>');
        // Replace spaces before tag
        html = html.replace(/(\s\t\n+)</gm, '<');
        // Set one tag per line
        html = html.replace(/>([^<]*)</g, ">\n$1\n<");
        return html;
    };

    this.reindentHTML = function(html) {

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
            if (line.match(/^<\//)) {
                indentLevel--;
            }

            // Prepare indentHTML
            indentHTML = this.pad(indentLevel);

            // Opening line (not unique tag)
            if (line.match(/^<([a-zA-Z])/) && !line.match(/\/>$/)) {
                indentLevel++;
            }
            reindentedHTML += indentHTML + line + "\n";
        }

        return reindentedHTML;
    };

    /* Utilities */

    // Pad a string to a given number
    this.pad = function(nb, str) {
        str = !str ? "\t" : str;
        nb = !nb ? 0 : nb;
        return new Array(nb + 1).join(str);
    };

    // Trim a string
    this.trim = function(str) {
        return str.replace(/^\s+/g, '').replace(/\s+$/g, '');
    };
};