(function() {
    var HTMLLisibleJS = new HTMLLisible();
    var tests = [{
        'text': 'An indent of -1 do not reindent a tag',
        'testedHTML': HTMLLisibleJS.clean('<p>a</p>', -1),
        'expectedHTML': '<p>a</p>',
    }, {
        'text': 'An indent of 4 correctly reindent a tag',
        'testedHTML': HTMLLisibleJS.clean('<div>a</div>', 4),
        'expectedHTML': "<div>\n" +
            "    a\n" +
            "</div>",
    }, {
        'text': 'Tag in tag is reindented.',
        'testedHTML': HTMLLisibleJS.clean('<div><div>a</div></div>', 4),
        'expectedHTML': "<div>\n" +
            "    <div>\n" +
            "        a\n" +
            "    </div>\n" +
            "</div>",
    }, , {
        'text': 'Tag in tag is reindented, but content in inline tag is not.',
        'testedHTML': HTMLLisibleJS.clean('<div><p>a</p></div>', 4),
        'expectedHTML': "<div>\n" +
            "    <p>a</p>\n" +
            "</div>",
    }];
    test('Basic HTML tests', function() {
        for (var t in tests) {
            equal(tests[t].testedHTML, tests[t].expectedHTML, tests[t].text);
        }
    })
}());