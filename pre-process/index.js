/*
 * Copyright (C) 2012 Marek Stasikowski <marek.stasikowski@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/*jslint sloppy: true, vars: true, white: true, plusplus: true, newcap: true, node: true, nomen: true */
/*global */

// this is a node.js program! don't include on your page :)

(function() {
    "use strict";

    var fs = require("fs");
    var exec = require("child_process").exec;
    var when = require("when");
    var _ = require("underscore");
    var UglifyJS = require("uglify-js2");
    var modernizrToCaniuseMapping = require("../config/modernizrToCaniuseMapping.js").modernizrToCaniuseMapping;

    var gitDeferred = when.defer();
    exec("git pull", {
        cwd : "../caniuse"
    }, function(err, stdout, stderr) {
        if (err === null) {
            console.log(stdout);
        }
        else {
            console.log(stderr);
        }
        gitDeferred.resolve(err, stdout, stderr);
    });

    var jsonDataDeferred = when.defer();
    gitDeferred.then(function() {
        fs.readFile('../caniuse/data.json', function(err, dataBuffer) {
            if (err) {
                throw err;
            }
            var json = JSON.parse(dataBuffer);
            var data = json.data;
            var browsers = json.agents;
            var browserVersions = {};
            _.chain(browsers).each(function(browserDescription, browserName) {
                browserVersions[browserName] = browserDescription.versions.filter(function(version) {
                    return version !== null;
                });
            });

            var featureMatrix = {};
            _(modernizrToCaniuseMapping).each(function(v, k) {
                var feature = data[v].stats;
                var transformedFeature = {};
                _.each(feature, function(versions, browser) {
                    transformedFeature[browser] = {};
                    _.each(versions, function(state, version) {
                        if (state === "y" || state === "y x") {
                            transformedFeature[browser][version] = true;
                        }
                        if (state === "n") {
                            transformedFeature[browser][version] = false;
                        }
                    });
                });
                featureMatrix[k] = transformedFeature;
            });
            jsonDataDeferred.resolve([featureMatrix, browserVersions]);
        });
    });
    var writeDataDeferred = when.defer();
    var dataDirDeferred = when.defer();
    jsonDataDeferred.then(function(values) {
        var fm = values[0];
        var bv = values[1];
        var writePath = "../src";
        fs.stat(writePath, function(err, stats) {
            if (err) {
                fs.mkdir(writePath, function() {
                    dataDirDeferred.resolve();
                });
            }
            else {
                dataDirDeferred.resolve();
            }
        });
        dataDirDeferred.then(function() {
            fs.writeFile(
                writePath + "/btData.js",
                "BT.supportData = " + JSON.stringify(fm) + ";" + "BT.browserVersions = " + JSON.stringify(bv) + ";",
                function(err) {
                    writeDataDeferred.resolve((err || "btData.js written to " + __dirname + "/" + writePath), writePath);
                }
            );
        });
    });

    var writeMinifiedDeferred = when.defer();
    writeDataDeferred.then(function(result, path) {
        writeMinifiedDeferred.resolve(UglifyJS.minify(
            [
                "../src/namespace.js",
                "../config/browserSet.js",
                "../src/btData.js",
                "../src/browserTest.js"
            ]
        ).code);
    });


    writeMinifiedDeferred.then(function(code) {
        fs.writeFile(
            "../browserTest-min.js",
            code,
            function(err) {
                console.log(err || "browser script written to ../browserTest-min.js");
            }
        );
    });
}());