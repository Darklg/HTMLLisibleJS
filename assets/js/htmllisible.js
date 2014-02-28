/*
 * HTMLLisible is under MIT License
 */

var HTMLLisible = function() {
    this.clean = function(html) {
        // Add missing slashes to autoclosing tags
        html = this.addMissingSlashes(html);
        // Serialize HTML
        html = this.serializeHTML(html);
        return html;
    };

    this.addMissingSlashes = function(html) {
        return html;
    };

    this.serializeHTML = function(html) {
        html = String(html).replace(/>([^<]*)</g, '><');
        return html;
    };
};