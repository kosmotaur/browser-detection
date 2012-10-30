/*
 * Copyright (C) 2012 Marek Stasikowski <marek.stasikowski@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/*jslint sloppy: true, vars: true, white: true, plusplus: true, newcap: true, node: true */
/*global */

// The tests from Modernizr having support data in caniuse.com — the default set narrows down the suspect browsers by quite much,
// so you can just copy this file to modernizrToCaniuseMapping.js and leave it be.
// Or you can modify the mappings to fit your needs.
// Remember that the Modernizr build included in this repo is a custom build containing only the feature tests from this
// mapping; if you change it, you will need to configure and download your own matching build on http://modernizr.com/

exports.modernizrToCaniuseMapping = {
    "apng"              : "apng",
    "applicationcache"  : "offline-apps",
    "backgroundsize"    : "background-img-opts",
    "borderimage"       : "border-image",
    "borderradius"      : "border-radius",
    "boxshadow"         : "css-boxshadow",
    "canvas"            : "canvas",
    "canvastext"        : "canvas-text",
    "contextmenu"       : "menu",
    "cssanimations"     : "css-animation",
    "csscolumns"        : "multicolumn",
    "cssgradients"      : "css-gradients",
    "cssreflections"    : "css-reflections",
    "csstransforms"     : "transforms2d",
    "csstransforms3d"   : "transforms3d",
    "csstransitions"    : "css-transitions",
    "draganddrop"       : "dragndrop",
    "flexbox"           : "flexbox",
    "fontface"          : "fontface",
    "generatedcontent"  : "css-gencontent",
    "geolocation"       : "geolocation",
    "hashchange"        : "hashchange",
    "history"           : "history",
    "hsla"              : "css3-colors",
    "indexeddb"         : "indexeddb",
    "inlinesvg"         : "svg-html5",
    "input.placeholder" : "input-placeholder",
    "localstorage"      : "namevalue-storage",
    "multiplebgs"       : "multibackgrounds",
    "notification"      : "notifications",
    "opacity"           : "css-opacity",
    "performance"       : "nav-timing",
    "postmessage"       : "x-doc-messaging",
    "raf"               : "requestanimationframe",
    "rgba"              : "css3-colors",
    "ruby"              : "ruby",
    "sessionstorage"    : "namevalue-storage",
    "smil"              : "svg-smil",
    "svg"               : "svg",
    "textshadow"        : "css-textshadow",
    "webgl"             : "webgl",
    "websockets"        : "websockets",
    "websqldatabase"    : "sql-storage",
    "webworkers"        : "webworkers"
};