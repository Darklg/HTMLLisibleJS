/*
 * HTMLLisible is under MIT License
 */

var HTMLLisible = function() {
    this.clean = function(html) {
        // Add missing slashes to autoclosing tags
        html = this.addMissingSlashes(html);
        // Serialize HTML
        html = this.serializeHTML(html);
        // Reindent HTML
        return html;
    };

    this.addMissingSlashes = function(html) {
        html = String(html).replace(/<(meta|br|hr|link)([^>\/]*)>/g, '<$1$2 />');
        return html;
    };

    this.serializeHTML = function(html) {
        html = String(html).replace(/>([^<]*)</g, '><');
        return html;
    };

    this.reindentHTML = function(html) {
        // Set one tag per line
        html = String(html).replace(/>([^<]*)</g, ">\n$2\n<");
        // Merge double line breaks
        html = String(html).replace(/\n\n/g, "\n");
        return html;
    };
};