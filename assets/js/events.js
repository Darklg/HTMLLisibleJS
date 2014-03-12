var htmlliz = false;

window.domReady(function() {
    htmlliz = new HTMLLisible();
    htmlliz.setFormActions({
        mainform: $_('main-form'),
        compressBtn: $_('compress-btn'),
        contentItem: $_('content'),
        indentItem: $_('tabs')
    });
});