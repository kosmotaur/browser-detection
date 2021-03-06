/*
 * Copyright (C) 2012 Marek Stasikowski <marek.stasikowski@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/*jslint sloppy: true, vars: true, white: true, plusplus: true, newcap: true, nomen: true */
/*global Modernizr, _, BT, navigator*/

BT._compare = function(setA, setB) {
    var diff = {
        intersection : {},
        difference   : {}
    };

    _.each(setA, function(versions, browserName) {
        if (typeof versions === "string") {
            versions = [versions];
        }
        var majorVersions = _.map(versions, function(version) {
            return version.split(".")[0];
        });
        var intersection = [];
        var difference = [];
        _.each(versions, function(version, i) {
            if (_.any(setB[browserName], function(supportedVersion) {
                var majorSupportedVersion = supportedVersion.split(".")[0];
                return majorVersions[i] === majorSupportedVersion;
            })) {
                intersection.push(version);
            }
            else {
                difference.push(version);
            }
        });
        if (intersection.length) {
            diff.intersection[browserName] = intersection;
        }
        if (difference.length) {
            diff.difference[browserName] = difference;
        }
    });

    return diff;
};

BT.detectByFeatures = function() {
    var removeFromSuspects = function(featureData, supportStatus, featureName) {
        _.each(featureData, function(versions, browser) {
            _.each(versions, function(status, version) {
                if (status === supportStatus) {
                    BT.browserVersions[browser] = _.without(BT.browserVersions[browser], version);
                }
            });
        });
    };

    _.each(BT.supportData, function(featureData, featureName) {
        var parts = featureName.split("."); //some features are stored under keys like "input.multiple"
        var modernizrFeatureState = Modernizr;
        var i, partsLen, part;
        for (i = 0, partsLen = parts.length; i < partsLen; i++) {
            part = parts[i];
            modernizrFeatureState = modernizrFeatureState[part];
        }

        if (typeof modernizrFeatureState === 'boolean') { //not all Modernizr feature states are Boolean - some are eg. String("probably")
            removeFromSuspects(featureData, !modernizrFeatureState, part);
        }
    });

    return BT._compare(BT.browserVersions, BT.targetBrowserSet);
};

BT.test = function() {
    var isBrowserInSetOfInterest = false;

    var detectedByFeatureTests = BT.detectByFeatures();
    var finalDiff;

    if (_.keys(detectedByFeatureTests.difference).length && _.keys(detectedByFeatureTests.intersection).length) { // can't be sure about support status for this browser, falling back to userAgent sniffing

        /*!
         * browser sniffing based on techniques used in jQuery JavaScript Library v1.8.2
         * http://jquery.com/
         *
         * Copyright 2012 jQuery Foundation and other contributors
         * Released under the MIT license
         * http://jquery.org/license
         *
         * Date: Thu Sep 20 2012 21:13:05 GMT-0400 (Eastern Daylight Time)
         */

        var matched, browser;
        var uaMatch = function(ua) {
            ua = ua.toLowerCase();

            var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
                /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
                /(msie) ([\w.]+)/.exec(ua) ||
                (ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)) ||
                [];

            return {
                browser : match[1] || "",
                version : match[2] || "0"
            };
        };

        matched = uaMatch(navigator.userAgent);
        browser = {};

        if (matched.browser) {
            browser[matched.browser === 'mozilla' ? 'firefox' : matched.browser] = matched.version;
        }

        finalDiff = BT._compare(browser, BT.targetBrowserSet);
    }
    else if (_.keys(detectedByFeatureTests.intersection).length) {
        finalDiff = detectedByFeatureTests;
    }

    if (finalDiff && _.keys(finalDiff.intersection).length && !_.keys(finalDiff.difference).length) {
        isBrowserInSetOfInterest = true;
    }

    return isBrowserInSetOfInterest;
};