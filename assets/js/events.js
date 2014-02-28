window.domReady(function() {
    // On form submit
    $_('main-form').addEvent('submit', function(e) {
        window.eventPreventDefault(e);
        var contentItem = $_('content'),
            htmlToClean = contentItem.value,
            htmlliz = new HTMLLisible();
        // Replace textarea value with clean HTML
        contentItem.value = htmlliz.clean(htmlToClean);
    });
});