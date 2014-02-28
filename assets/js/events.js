var htmlliz = false;

window.domReady(function() {
    htmlliz = new HTMLLisible();
    // On form submit
    $_('main-form').addEvent('submit', function(e) {
        window.eventPreventDefault(e);
        var contentItem = $_('content'),
            htmlToClean = contentItem.value;
        // Replace textarea value with clean HTML
        contentItem.value = htmlliz.clean(htmlToClean);
    });
});