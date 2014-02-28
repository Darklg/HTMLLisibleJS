/*
 * Plugin Name: Vanilla-JS Events
 * Version: 1.1.1
 * Plugin URL: https://github.com/Darklg/JavaScriptUtilities
 * JavaScriptUtilities Vanilla-JS may be freely distributed under the MIT license.
 */

/* ----------------------------------------------------------
  Domready
---------------------------------------------------------- */

/* From the amazing Dustin Diaz : http://www.dustindiaz.com/smallest-domready-ever */
// "!document.body" check ensures that IE fires domReady correctly
window.domReady = function(func) {
    if (/in/.test(document.readyState) || !document.body) {
        setTimeout(function() {
            window.domReady(func);
        }, 9);
    }
    else {
        func();
    }
};

/* ----------------------------------------------------------
  Add Event
---------------------------------------------------------- */

window.addEvent = function(el, eventName, callback) {
    if (el.addEventListener) {
        el.addEventListener(eventName, callback, false);
    }
    else if (el.attachEvent) {
        el.attachEvent("on" + eventName, function(e) {
            return callback.call(el, e);
        });
    }
};

if (!Element.prototype.addEvent) {
    Element.prototype.addEvent = function(eventName, callback) {
        return window.addEvent(this, eventName, callback);
    };
}

window.eventPreventDefault = function(event) {
    return (event.preventDefault) ? event.preventDefault() : event.returnValue = false;
};

/*
 * Plugin Name: Vanilla-JS Selectors
 * Version: 1.0.1
 * Plugin URL: https://github.com/Darklg/JavaScriptUtilities
 * JavaScriptUtilities Vanilla-JS may be freely distributed under the MIT license.
 */

/* ----------------------------------------------------------
  $_ : Get Element
---------------------------------------------------------- */

var $_ = function(id) {
    return document.getElementById(id);
};