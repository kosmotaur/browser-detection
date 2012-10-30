# Browser detection

Detect the browser (or browser set) by the features it supports. It is virtually impossible to tackle this, unlike for UA sniffing.
The drawbacks are that feature support data does not make it possible to pinpoint exact vendor/browser for every browser out there.
Currently it recognizes Safari, IE, Opera, and approximately recognizes Firefox and Chrome.

The script takes into account a set of browsers you wanna determine if the visitor falls in to. You configure that in ``config/browserSet.js``. If it is not possible to tell, it falls back to UA sniffing

## Usage (make sure [prerequisites](#prerequisites) are met)

1. In ``config`` directory, copy templates to the same directory removing ``template.`` from the name. Change contents as needed. It's the config after all.
2. [Update and pre-process caniuse.com data](#updating-and-pre-processing-data)
3. For the page where you want to detect the browser, include 2 custom built libraries (Modernizr and lodash) and ``browserTest-min.js`` built in the previous step

``BT.test()`` does the full test, falling back to UA sniffing if necessary, and tells you if the detected set is a subset of your browser set configured in ``config/browserSet.js``

``BT.detectByFeatures()`` tests only by features, and calculates a diff between the browsers likely to be the one currently tested and those you define in ``config/browserSet.js``.
The diff object contains the intersection and difference between the set you wanna make sure the browser falls into (``config/browserSet.js``) and the set determined by tests. If there is only intersection, and no difference, then you got yourself what you were looking for.

See ``test.html`` file to see an example.

## Updating and pre-processing data
1. ``$ cd pre-proces``
2. ``$ npm install`` (only have to do this once)
3. ``$ node index.js``

## Strategy

* <http://caniuse.com/> and <http://modernizr.com/>
	* node data preprocessing
		* get support data from Github at https://github.com/Fyrd/caniuse.git — the ``data.json`` file has both support data as well as a listing of past, current and near future browser versions
		* extract needed information from ``data.json``
			* write support data mappable to features detected by Modernizr (the mapping object can be found in ``pre-process/index.js``) and current browser versions to ``src/btData.js``
	* in the browser
		* iterate through features support data
		* if Modernizr indicates feature is supported, get all browsers/versions from feature support data which do not support that feature and remove those browseres/versions from set of all browsers
		* if Modernizr indicates feature is not supported, get all browsers/versions from feature support data which support that feature and remove those browseres/versions from from set of all browsers
		* if browsers remaining in the initial set of all browsers is a non-emtpy subset of checked-for browsers set, the currently checked browser is within that set
		* if browsers remaining in the initial set of all browsers is non-emtpy and has together with checked-for browsers set:
        * a non-empty intersection
        * a non-empty difference
      then it's not definitive if the current browser falls into the set of checked-for browser set, move on to fallback
		* if remaining browsers is an empty set, move on to fallback
* userAgent sniffing as fallback, based on [jQuery](http://jquery.com)'s solution

## Prerequisites

### Node preprocessing

* node >=v0.8
* git CLI installed

### Browser (both custom built libs are included)

* [Modernizr](http://modernizr.com/) - custom build with selected feature tests found in ``config/modernizrToCaniuseMapping.template.js`` in ``modernizrToCaniuseMapping`` object
* [lodash](https://github.com/bestiejs/lodash) custom build: ``lodash category="collections, arrays" exports="global"`` (install it by ``npm install -g lodash``)

## License

Copyright (C) 2012 Marek Stasikowski <marek.stasikowski@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.