(function () {
    /* This bootstrap script is documented at http://developer.joshfire.com/ */
    var Joshfire = window.Joshfire || {};
    Joshfire.factory = {
        globalConfig: { "DATAVERSION": "1", "DATAHOSTPORT": "localhost:40020", "STATSHOSTPORT": "localhost:40023", "HOSTPORT": "localhost:40021" },
        config: { "app": { "id": "50f9524f2fdf4ce2a2000001", "icon": null, "logo": null, "name": "Win8 debug", "version": "1.0" }, "template": { "name": "window8", "version": "1.0.1", "options": { "abouthtml": "<p>This application was generated with the <a href='http://factory.joshfire.com'>Joshfire Factory</a></p>", "theme": "dark" }, "hooks": [] } },
        device: { "type": "tablet-windows8" },
        addons: {}
    };
    Joshfire.factory.config.deploy = { "env": "dev", "type": "local", "flags": { "web": true }, "id": "" };
    Joshfire.factory.config.datasources = {
        "main": [
            { "name": "Twitter", "db": "operator", "col": "updatelinks", "query": { "filter": { "datasources": { "main": { "name": "Twitter", "db": "twitter", "col": "tweets", "query": { "filter": { "user": "Notch" }, "options": {} }, "missingKeys": [], "outputType": "Article/Status", "runtime": "win8" } }, "action": "addtarget" } }, "outputType": "Article/Status", "runtime": "browser" },
            { "name": "Youtube", "db": "operator", "col": "updatelinks", "query": { "filter": { "datasources": { "main": { "name": "Youtube", "db": "youtube", "col": "videos", "query": { "filter": { "search": "Because I Can" } }, "missingKeys": [], "outputType": "VideoObject", "runtime": "win8" } }, "action": "addtarget" } }, "outputType": "VideoObject", "runtime": "browser" }]
    };
    Joshfire.factory.config.addons = [{ "name": "splashscreen", "options": { "web-mode": "factory" }, "hooks": ["loaded"] }];
    window.Joshfire = Joshfire;

})();
(function () {
    (function (a) { a.factory.ready = !1; var b = []; a.factory.onReady = function (c) { if (a.factory.ready) return c(); b.push(c) }, a.factory.onDeviceReady = a.factory.onReady; var c = function (a) { if (typeof blackberry != "undefined") document.addEventListener("webworksready", a, !1); else if (typeof cordova != "undefined") document.addEventListener("deviceready", a, !1); else if (window.addEventListener) window.addEventListener("load", a, !1); else if (document.addEventListener) document.addEventListener("load", a, !1); else if (window.attachEvent) window.attachEvent("onload", a); else if (typeof window.onload != "function") window.onload = a; else { var b = window.onload; window.onload = function () { b(), a() } } }; c(function () { a.factory.ready = !0; for (var c = 0, d = b.length; c < d; c++) try { b.pop()() } catch (e) { } var f = function () { var b = 0; if (a.factory.config && a.factory.config.template && a.factory.config.template.hooks) { b = a.factory.config.template.hooks; for (c = 0; c < b.length; c++) if (b[c] === "loaded") return !1 } return !0 }(); try { f && a.factory.getAddOns("loaded").run() } catch (e) { } typeof cordova != "undefined" && cordova.exec(null, null, "SplashScreen", "hide", []) }, !1) })(Joshfire);
    (function (a, b, c) { var d = "http://" + c.globalConfig.STATSHOSTPORT, e = function () { return }, f = function (a) { var b = []; for (var c in a) a.hasOwnProperty(c) && b.push(c + "=" + encodeURIComponent(a[c])); var f = new Image(1, 1); f.src = d + "/pixel.gif?" + b.join("&"), f.onload = function () { e() } }, g = function () { return { tz: (new Date).getTimezoneOffset(), url: b.location.toString(), ref: a.referrer, app: c.config.app.id, appv: c.config.app.version, tpl: c.config.template.id, dev: c.device.type, env: (c.config.deploy || {}).env || "preview", dp: (c.config.deploy || {}).id, dpr: (c.config.deploy || {}).type, id: "" } }; c.stats = {}, c.stats.event = function (a) { var b = g(); b.type = a, f(b) }, c.stats.event("open"), a.addEventListener && a.addEventListener("resume", function () { c.stats.event("resume") }, !1) })(document, window, Joshfire.factory);

    /**
     * almond 0.0.3 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
     * Available via the MIT or new BSD license.
     * see: http://github.com/jrburke/almond for details
     */
    /*jslint strict: false, plusplus: false */
    /*global setTimeout: false */

    var requirejs, require, define;
    (function (undef) {

        var defined = {},
            waiting = {},
            aps = [].slice,
            main, req;

        if (typeof define === "function") {
            //If a define is already in play via another AMD loader,
            //do not overwrite.
            return;
        }

        /**
         * Given a relative module name, like ./something, normalize it to
         * a real name that can be mapped to a path.
         * @param {String} name the relative name
         * @param {String} baseName a real name that the name arg is relative
         * to.
         * @returns {String} normalized name
         */
        function normalize(name, baseName) {
            //Adjust any relative paths.
            if (name && name.charAt(0) === ".") {
                //If have a base name, try to normalize against it,
                //otherwise, assume it is a top-level require that will
                //be relative to baseUrl in the end.
                if (baseName) {
                    //Convert baseName to array, and lop off the last part,
                    //so that . matches that "directory" and not name of the baseName's
                    //module. For instance, baseName of "one/two/three", maps to
                    //"one/two/three.js", but we want the directory, "one/two" for
                    //this normalization.
                    baseName = baseName.split("/");
                    baseName = baseName.slice(0, baseName.length - 1);

                    name = baseName.concat(name.split("/"));

                    //start trimDots
                    var i, part;
                    for (i = 0; (part = name[i]) ; i++) {
                        if (part === ".") {
                            name.splice(i, 1);
                            i -= 1;
                        } else if (part === "..") {
                            if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                                //End of the line. Keep at least one non-dot
                                //path segment at the front so it can be mapped
                                //correctly to disk. Otherwise, there is likely
                                //no path mapping for a path starting with '..'.
                                //This can still fail, but catches the most reasonable
                                //uses of ..
                                break;
                            } else if (i > 0) {
                                name.splice(i - 1, 2);
                                i -= 2;
                            }
                        }
                    }
                    //end trimDots

                    name = name.join("/");
                }
            }
            return name;
        }

        function makeRequire(relName, forceSync) {
            return function () {
                //A version of a require function that passes a moduleName
                //value for items that may need to
                //look up paths relative to the moduleName
                return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
            };
        }

        function makeNormalize(relName) {
            return function (name) {
                return normalize(name, relName);
            };
        }

        function makeLoad(depName) {
            return function (value) {
                defined[depName] = value;
            };
        }

        function callDep(name) {
            if (waiting.hasOwnProperty(name)) {
                var args = waiting[name];
                delete waiting[name];
                main.apply(undef, args);
            }
            return defined[name];
        }

        /**
         * Makes a name map, normalizing the name, and using a plugin
         * for normalization if necessary. Grabs a ref to plugin
         * too, as an optimization.
         */
        function makeMap(name, relName) {
            var prefix, plugin,
                index = name.indexOf('!');

            if (index !== -1) {
                prefix = normalize(name.slice(0, index), relName);
                name = name.slice(index + 1);
                plugin = callDep(prefix);

                //Normalize according
                if (plugin && plugin.normalize) {
                    name = plugin.normalize(name, makeNormalize(relName));
                } else {
                    name = normalize(name, relName);
                }
            } else {
                name = normalize(name, relName);
            }

            //Using ridiculous property names for space reasons
            return {
                f: prefix ? prefix + '!' + name : name, //fullName
                n: name,
                p: plugin
            };
        }

        main = function (name, deps, callback, relName) {
            var args = [],
                usingExports,
                cjsModule, depName, i, ret, map;

            //Use name if no relName
            if (!relName) {
                relName = name;
            }

            //Call the callback to define the module, if necessary.
            if (typeof callback === 'function') {

                //Default to require, exports, module if no deps if
                //the factory arg has any arguments specified.
                if (!deps.length && callback.length) {
                    deps = ['require', 'exports', 'module'];
                }

                //Pull out the defined dependencies and pass the ordered
                //values to the callback.
                for (i = 0; i < deps.length; i++) {
                    map = makeMap(deps[i], relName);
                    depName = map.f;

                    //Fast path CommonJS standard dependencies.
                    if (depName === "require") {
                        args[i] = makeRequire(name);
                    } else if (depName === "exports") {
                        //CommonJS module spec 1.1
                        args[i] = defined[name] = {};
                        usingExports = true;
                    } else if (depName === "module") {
                        //CommonJS module spec 1.1
                        cjsModule = args[i] = {
                            id: name,
                            uri: '',
                            exports: defined[name]
                        };
                    } else if (defined.hasOwnProperty(depName) || waiting.hasOwnProperty(depName)) {
                        args[i] = callDep(depName);
                    } else if (map.p) {
                        map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                        args[i] = defined[depName];
                    } else {
                        throw name + ' missing ' + depName;
                    }
                }

                ret = callback.apply(defined[name], args);

                if (name) {
                    //If setting exports via "module" is in play,
                    //favor that over return value and exports. After that,
                    //favor a non-undefined return value over exports use.
                    if (cjsModule && cjsModule.exports !== undef) {
                        defined[name] = cjsModule.exports;
                    } else if (!usingExports) {
                        //Use the return value from the function.
                        defined[name] = ret;
                    }
                }
            } else if (name) {
                //May just be an object definition for the module. Only
                //worry about defining if have a module name.
                defined[name] = callback;
            }
        };

        requirejs = req = function (deps, callback, relName, forceSync) {
            if (typeof deps === "string") {

                //Just return the module wanted. In this scenario, the
                //deps arg is the module name, and second arg (if passed)
                //is just the relName.
                //Normalize module name, if it contains . or ..
                return callDep(makeMap(deps, callback).f);
            } else if (!deps.splice) {
                //deps is a config object, not an array.
                //Drop the config stuff on the ground.
                if (callback.splice) {
                    //callback is an array, which means it is a dependency list.
                    //Adjust args if there are dependencies
                    deps = callback;
                    callback = arguments[2];
                } else {
                    deps = [];
                }
            }

            //Simulate async callback;
            if (forceSync) {
                main(undef, deps, callback, relName);
            } else {
                setTimeout(function () {
                    main(undef, deps, callback, relName);
                }, 15);
            }

            return req;
        };

        /**
         * Just drops the config on the floor, but returns req in case
         * the config return value is used.
         */
        req.config = function () {
            return req;
        };

        /**
         * Export require as a global, but only if it does not already exist.
         */
        if (!require) {
            require = req;
        }

        define = function (name, deps, callback) {

            //This module may not have dependencies
            if (!deps.splice) {
                //deps is not an array, so probably means
                //an object literal or factory function for
                //the value. Adjust args.
                callback = deps;
                deps = [];
            }

            if (define.unordered) {
                waiting[name] = [name, deps, callback];
            } else {
                main(name, deps, callback);
            }
        };

        define.amd = {
            jQuery: true
        };
    }());
    define("runtime/hosted/almond", function () { });

    /* RequireJS plugin */
    define('datajslib', {
        normalize: function (name, normalize) {
            if (!(typeof module !== 'undefined' && module.exports)) {
                //Special case for libs with special AMD implementation
                if (name == "jquery"/* || name=="underscore"*/) return name;
            }
            return normalize("runtime-win8/" + name);
        },
        load: function (name, req, load, config) {
            //req has the same API as require().
            req([name], function (value) {
                load(value);
            });
        }
    });
    /**
     * @fileoverview Defines the current runtime environment.
     *
     * This lets datasources and operators know whether they are being run
     * client-side or server-side (this should not be needed most of the
     * time, but is useful, e.g. for graph execution to prepare the graph
     * accordingly)
     */
    define('runtime-win8/runtime', {
        name: 'win8'
    });
    /*
     * @fileoverview Collection factory that creates the appropriate collection
     * object to run a given datasource.
     *
     * The code dynamically delegates to collection.client or collection.proxy
     * depending on whether the datasource needs to run client-side or server-side.
     *
     * If this code is run server-side, trying to run a client-side datasource
     * will throw an error.
     */

    define('runtime-win8/collection', [
      'require',
      'datajslib!runtime'
    ], function (require, runtime) {
        // Taken from underscore.js (not included here to save a few bytes)
        var _extend = function (obj1, obj2) {
            for (var key in obj2) {
                if (obj2.hasOwnProperty(key)) {
                    obj1[key] = obj2[key];
                }
            }
            return obj1;
        };

        var collectionFactory = {
            /**
             * Returns the datasource that matches the given source provider and collection.
             * Returned datasource object features a "find" method that takes a query.
             *
             * @function
             * @param {String} datasource The datasource to execute
             * @param {Boolean} atomicCollection True to return an "atomic" collection for
             *  the given datasource, False to return a graph collection that can be used
             *  to execute the datasource. The flag should typically be set when a graph is
             *  run to create the appropriate collections for each node in the graph. Note
             *  that the function does not return a graph if the datasource does not have
             *  inputs and thus does not need to be executed as a graph.
             */
            getCollection: function (datasource, atomicCollection) {
                if (!datasource) {
                    // Datasource not set, return an empty collection
                    return {
                        desc: {},
                        name: '',
                        find: function (options, callback) {
                            return callback(null, { entries: [] });
                        },
                        onLoaded: function (f) {
                            f();
                        },
                        getDesc: function (callback) {
                            callback(null, {});
                        },
                        getOutputType: function () {
                            return 'Thing';
                        }
                    };
                }
                return new collection(datasource, atomicCollection);
            }
        };

        /**
         * Collection class that exposes a "find" method to run queries against
         * the underlying datasource.
         *
         * @constructor
         * @param {Object} datasource The datasource description
         * @param {Boolean} atomicCollection True to return an atomic collection,
         *   false to create a graph if needed
         */
        var collection = function (datasource, atomicCollection) {
            var query = datasource.query;
            var self = this;
            var _loadedCallbacks = [];
            var _loaded = false;
            var collectionObject = null;
            var collectionLib = 'datajslib!collection.';
            var collectionError = null;

            var completeQuery = function (options) {
                var extendedQuery = _extend({}, query);
                extendedQuery = _extend(extendedQuery, options);
                if (!extendedQuery.filter) {
                    extendedQuery.filter = {};
                }
                if (collectionObject.setDefaultValues) {
                    collectionObject.setDefaultValues(extendedQuery.filter);
                }
                return extendedQuery;
            };

            /**
             * Runs the function when the collection is loaded.
             * @function
             * @param {function} f Function to execute. The function won't receive
             *  any parameter.
             * @private
             */
            self.onLoaded = function (f) {
                if (!_loaded) {
                    _loadedCallbacks.push(f);
                } else {
                    f();
                }
            };

            /**
             * Sends a request to the underlying datasource and calls the callback
             * function once done with the retrieved feed (or the error).
             * @function
             * @param {Object} options Query options that complete/override the query
             *  parameters used to create the collection.
             * @param {function(string,Object)} callback The callback function to call
             *  once done
             * @public
             */
            self.find = function (options, callback) {
                self.onLoaded(function () {
                    // console.log('collection', datasource.db, datasource.col, 'find');
                    var fullQuery = completeQuery(options);
                    // console.log(fullQuery);
                    if (collectionError) return callback(collectionError);
                    if (!collectionObject) return callback('Collection does not exist.');
                    if (collectionObject.find) {
                        collectionObject.find(fullQuery, function (err, data) {
                            if (data && !data.name && datasource.name) {
                                // Propagate datasource title if the returned feed does not have one
                                data.name = datasource.name;
                            }
                            if (data && !data.maxAge &&
                              collectionObject.desc &&
                              collectionObject.desc.maxAge) {
                                // Add response max-age if not already done
                                data.maxAge = collectionObject.desc.maxAge;
                            }
                            return callback(err, data);
                        });
                    }
                    else if (collectionObject.fetch && collectionObject.process) {
                        collectionObject.fetch(fullQuery, function (err, data) {
                            if (err) {
                                return callback(err, null);
                            }
                            else {
                                collectionObject.process(data, fullQuery, function (err, data) {
                                    if (data && !data.name && datasource.name) {
                                        // Propagate datasource title if the returned feed does not have one
                                        data.name = datasource.name;
                                    }
                                    if (data && !data.maxAge &&
                                      collectionObject.desc &&
                                      collectionObject.desc.maxAge) {
                                        // Add response max-age if not already done
                                        data.maxAge = collectionObject.desc.maxAge;
                                    }
                                    return callback(err, data);
                                });
                            }
                        });
                    }
                    else {
                        return callback('Invalid collection');
                    }
                });
            };


            /**
             * Sends a request to the underlying operator and calls the callback
             * function once done with the retrieved feed (or the error).
             *
             * @function
             * @param {Object} data Processor inputs. Typical example for a single
             *  input: { "main": { "entries": [list of items] }}. Input names are
             *  operator specific, "main" by default.
             * @param {Object} options Query options that complete/override the query
             *  parameters used to create the collection.
             * @param {function(string,Object)} callback The callback function to call
             *  once done
             * @public
             */
            self.process = function (data, options, callback) {
                self.onLoaded(function () {
                    //console.log('collection', datasource.db, datasource.col, 'process');
                    if (collectionError) return callback(collectionError);
                    if (!collectionObject) return callback('Collection does not exist.');
                    if (collectionObject.process) {
                        collectionObject.process(data, completeQuery(options), callback);
                    }
                    else {
                        callback('Collection does not have a "process" method.');
                    }
                });
            };


            /**
             * Fetches feed items from the source provider.
             *
             * @function
             * @param {Object} options Query options that complete/override the query
             *  parameters used to create the collection.
             * @param {function(Object, Object)} callback Callback function.
             *   The data type depends on the datasource.
             */
            self.fetch = function (options, callback) {
                self.onLoaded(function () {
                    //console.log('collection', datasource.db, datasource.col, 'fetch');
                    if (collectionError) return callback(collectionError);
                    if (!collectionObject) return callback('Collection does not exist.');
                    if (collectionObject.fetch) {
                        collectionObject.fetch(completeQuery(options), callback);
                    }
                    else {
                        // Return a null object when the "fetch" method does not exist
                        // (Note that "collection.graph" decides to fetch inputs on its
                        // own based on this "null" value)
                        callback(null, null);
                    }
                });
            };


            /**
             * Updates the generic query options for a proper resolution of the
             * inputs of the underlying operator.
             *
             * In particular, the operator might want to adjust "skip" and "limit"
             * depending on what it does.
             *
             * Note there is simply no way for an operator that filters entries or that
             * generates a response from multiple inputs to know beforehand how many
             * items it needs for each input. The adjustment may not be enough. We'll
             * have to live with it to keep things simple enough (otherwise the graph
             * would need to implement some sort of "fetchMore" but there are all sorts
             * of corner-cases to take into account such as the use of intermediary
             * caches)
             *
             * @function
             * @param {Object} options current query options
             * @param {function} callback Callback function called with the error
             *   and/or the new generic options to use to resolve the inputs
             */
            self.updateInputOptions = function (options, callback) {
                self.onLoaded(function () {
                    // console.log('collection', datasource.db, datasource.col, 'updateInputOptions');
                    if (collectionError) return callback(collectionError);
                    if (!collectionObject) return callback('Collection does not exist.');

                    // Copy all options (skipping datasource specific filter) by default
                    var inputOptions = {};
                    for (var key in options) {
                        if ((key !== 'filter') &&
                          (key !== 'graph') &&
                          options.hasOwnProperty(key)) {
                            inputOptions[key] = options[key];
                        }
                    }

                    if (collectionObject.updateInputOptions) {
                        // The operator may need to adjust query options for its inputs
                        collectionObject.updateInputOptions(inputOptions, callback);
                    }
                    else {
                        // The operator does not need to adjust query options
                        return callback(null, inputOptions);
                    }
                });
            };


            /**
             * Returns true if collection is loaded and exposes a "fetch" function
             *
             * The function is only useful for unit testing purpose.
             *
             * @function
             */
            self.canBeFetched = function () {
                return (collectionObject &&
                  !collectionError &&
                  collectionObject.fetch);
            };


            /**
             * Returns true if collection is loaded and exposes a "process" function
             *
             * The function is only useful for unit testing purpose.
             *
             * @function
             */
            self.canBeProcessed = function () {
                return (collectionObject &&
                  !collectionError &&
                  collectionObject.process);
            };


            /**
             * Gets the description of the datasource.
             *
             * The description is a JSON object that details the collection
             * parameters. The returned object is usually the collection's
             * "desc" property, but may be more precise depending on the
             * query options (typically the outputType may be adjusted for
             * a more precise one for the given query)
             *
             * @function
             * @param {function} callback Callback function called with the error
             *  and the description.
             */
            self.getDesc = function (callback) {
                self.onLoaded(function () {
                    //console.log('collection', datasource.db, datasource.col, 'getDesc');
                    if (collectionError) return callback(err);
                    if (!collectionObject) return callback('Collection does not exist.');

                    if (collectionObject.setDefaultValues) {
                        collectionObject.setDefaultValues(query.filter);
                    }

                    if (collectionObject.getDesc) {
                        return callback(null, collectionObject.getDesc(query));
                    }
                    else {
                        return callback(null, collectionObject.desc);
                    }
                });
            };


            /**
             * Returns the type of items that a call to find would return.
             *
             * The output type returned by this function is taken from the datasource
             * query options (the Factory saves the outputType along with
             * query parameters). For datasources that return mixed content, the
             * output type is normally the most precise type that is possible.
             *
             * In the absence of bugs, getOutputType() should return the same value
             * as getDesc().outputType for simple collections.
             *
             * @function
             * @return {string} Type of items returned by the collection,
             *   "Thing" if the output type is not present in the query options.
             */
            self.getOutputType = function () {
                if (datasource.outputType) {
                    return datasource.outputType;
                }
                else {
                    return 'Thing';
                }
            };

            // Ensure query is set.
            query = query || {};
            if (!query.filter) query.filter = {};

            // Select the right library to require based on the
            // "runtime" property (or the deprecated "runatclient" flag)
            if (!atomicCollection && (datasource.db === 'operator')) {
                // Note it's useless to create a graph client-side if the operator
                // is to run server-side.
                if ((runtime.name !== 'hosted') &&
                  !datasource.runatclient &&
                  (!datasource.runtime || (datasource.runtime === 'hosted'))) {
                    collectionLib += 'proxy';
                }
                else {
                    collectionLib += 'graph';
                }
            }
            else if (datasource.runatclient || (datasource.runtime !== 'hosted')) {
                collectionLib += 'client';
            }
            else {
                collectionLib += 'proxy';
            }

            // Require the appropriate factory library and retrieve the collection
            // Run the "loaded" callbacks when done
            require([collectionLib], function (colFactory) {
                colFactory.getCollection(datasource, function (err, col) {
                    collectionError = err;
                    collectionObject = col;
                    _loaded = true;
                    for (var i = 0; i < _loadedCallbacks.length; i++) {
                        _loadedCallbacks[i]();
                    }
                    _loadedCallbacks = [];
                });
            });
        };

        return collectionFactory;
    });
    /**
     * @fileoverview Represents and executes queries against a datasource defined
     * as an oriented graph.
     *
     * Each node in the graph takes zero, one or more inputs that connect the node
     * to other nodes in the graph. Each node either generates a data feed
     * (no input case), or performs an atomic operation on the data feeds received
     * as inputs.
     *
     * The inputs of an operator are formally described in its description.
     *
     * TODO: return error instead of throwing errors
     */

    /*global define*/

    define('runtime-win8/collection.graph', [
      'datajslib!collection',
      'datajslib!runtime'
    ], function (collectionFactory, runtime) {
        // The code makes use _.keys, _.isArray, _.each, _.isObject and async.map
        // To avoid having to include the whole Underscore and Async libraries,
        // these functions are copied here
        // TODO: think about that some more, operators and datasources are likely
        // to depend on (at least) Underscore anyway, so this could actually end up
        // duplicating code instead of saving lines of code...
        var breaker = {};
        var _keys = Object.keys || function (obj) {
            if (obj !== Object(obj)) throw new TypeError('Invalid object');
            var keys = [];
            for (var key in obj) if (hasOwnProperty.call(obj, key)) keys[keys.length] = key;
            return keys;
        };
        var _isArray = Array.isArray || function (obj) {
            return toString.call(obj) == '[object Array]';
        };
        var _each = function (obj, iterator, context) {
            if (obj == null) return;
            if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
                obj.forEach(iterator, context);
            } else if (obj.length === +obj.length) {
                for (var i = 0, l = obj.length; i < l; i++) {
                    if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
                }
            } else {
                for (var key in obj) {
                    if (hasOwnProperty.call(obj, key)) {
                        if (iterator.call(context, obj[key], key, obj) === breaker) return;
                    }
                }
            }
        };
        var _isObject = function (obj) {
            return obj === Object(obj);
        };

        // Extract async.map from the async library
        var asyncMap = (function () {
            var _forEach = function (arr, iterator) {
                if (arr.forEach) {
                    return arr.forEach(iterator);
                }
                for (var i = 0; i < arr.length; i += 1) {
                    iterator(arr[i], i, arr);
                }
            };

            var _map = function (arr, iterator) {
                if (arr.map) {
                    return arr.map(iterator);
                }
                var results = [];
                _forEach(arr, function (x, i, a) {
                    results.push(iterator(x, i, a));
                });
                return results;
            };

            var forEach = function (arr, iterator, callback) {
                if (!arr.length) {
                    return callback();
                }
                var completed = 0;
                _forEach(arr, function (x) {
                    iterator(x, function (err) {
                        if (err) {
                            callback(err);
                            callback = function () { };
                        }
                        else {
                            completed += 1;
                            if (completed === arr.length) {
                                callback();
                            }
                        }
                    });
                });
            };

            var doParallel = function (fn) {
                return function () {
                    var args = Array.prototype.slice.call(arguments);
                    return fn.apply(null, [forEach].concat(args));
                };
            };

            var _asyncMap = function (eachfn, arr, iterator, callback) {
                var results = [];
                arr = _map(arr, function (x, i) {
                    return { index: i, value: x };
                });
                eachfn(arr, function (x, callback) {
                    iterator(x.value, function (err, v) {
                        results[x.index] = v;
                        callback(err);
                    });
                }, function (err) {
                    callback(err, results);
                });
            };

            return doParallel(_asyncMap);
        })();


        /**
         * Represents an arbitrary complex datasource within a list of datasources.
         *
         * The class exposes a "find" function that can be used to retrieve the feed
         * entries of the datasource by running the graph it is connected to.
         *
         * @class
         * @param {Object} datatsource The datasource that we're interested in.
         */
        var Graph = function (datasource) {
            var self = this;

            this.counter = 0;
            this.nodes = {};

            // Recurse through the list of connected inputs and build the graph
            // The "ds" parameter must be an object that describes a datasource.
            // The inputs of this datasource should be in ds.query.filter.datasources,
            // which can either be:
            // - a datasource
            // - a reference to a datasource
            // - an array whose items are either a datasource or a reference to
            // a datasource
            // (reference names must be unique across the graph!)
            var buildGraph = function (name, ds) {
                // console.log('buildGraph', ds.db, ds.col);
                // No need to process the same unique name twice
                if (self.nodes[name]) return self.nodes[name];

                // Create a node for the current datasource
                var node = new GraphNode(name, ds, self.nodes);
                self.nodes[name] = node;

                // No need to go any further up in the graph if it runs client-side
                // and if the current node is to run server-side.
                if ((runtime.name !== 'hosted') &&
                  !ds.runatclient &&
                  (!ds.runtime || (ds.runtime === 'hosted'))) {
                    return node;
                }

                // Recurse through the list of connected inputs for the datasource
                if (!ds.query || !ds.query.filter) return node;
                _each(ds.query.filter.datasources, function (inputDatasource, inputName) {
                    var refName = null;
                    var refNode = null;
                    if (_isArray(inputDatasource)) {
                        // The input is a multiple datasource
                        node.inputNodes[inputName] = [];
                        _each(inputDatasource, function (subDatasource, index) {
                            var subName = '_:' + (++self.counter);
                            var subNode = null;
                            if (_isObject(subDatasource)) {
                                // The subdatasource is defined in place,
                                // build the graph node for the subdatasource
                                subNode = buildGraph(subName, subDatasource);
                                node.inputNodes[inputName].push(subNode);
                            }
                            else {
                                // The subdatasource is a reference to a datasource,
                                // replace the reference by a link to the datasource and
                                // build the graph node unless already done
                                subName = subDatasource;
                                subNode = self.nodes[subName];
                                if (subNode) {
                                    subDatasource = subNode.datasource;
                                }
                                else {
                                    subDatasource = ds.query.filter.datasources[subName] ||
                                      datasource.query.filter.datasources[subName] ||
                                      (datasource.query.graph ? datasource.query.graph[subName] : null);
                                    if (!subDatasource) {
                                        throw new Error('Missing datasource "' + subName + '" detected');
                                    }
                                    subNode = buildGraph(subName, subDatasource);
                                }
                                inputDatasource[index] = subDatasource;
                                node.inputNodes[inputName].push(subNode);
                            }
                        });
                    }
                    else if (_isObject(inputDatasource)) {
                        // The input defines a datasource,
                        // build the graph node for the datasource
                        refName = '_:' + (++self.counter);
                        node.inputNodes[inputName] = buildGraph(refName, inputDatasource);
                    }
                    else {
                        // The input is a reference to a datasource,
                        // replace the reference by a link to the datasource and
                        // build the graph node unless already done
                        refName = inputDatasource;
                        refNode = self.nodes[refName];
                        if (!refNode) {
                            inputDatasource = ds.query.filter.datasources[refName] ||
                              datasource.query.filter.datasources[refName] ||
                              (datasource.query.graph ? datasource.query.graph[refName] : null);
                            if (!inputDatasource) {
                                throw new Error('Missing datasource "' + refName + '" detected');
                            }
                            ds.query.filter.datasources[inputName] = inputDatasource;
                            refNode = buildGraph(refName, inputDatasource);
                        }
                        node.inputNodes[inputName] = refNode;
                    }
                });
                return node;
            };

            // Initialize the structure of the graph
            // (this will create all the additional nodes in this.nodes)
            // Note the clone of the initial query as buildGraph is likely going to
            // change the structure in place.
            this.finalNode = buildGraph('_:final', JSON.parse(JSON.stringify(datasource)));
        };


        /**
         * Retrieves the collection feed, running all operators that are connected
         * to the inputs of this collection as necessary.
         *
         * @function
         * @param {Object} options Request parameters
         * @param {function(string,Object)} callback The callback function to call
         *  once done
         * @public
         */
        Graph.prototype.find = function (options, callback) {
            var self = this;

            if (!this.finalNode) {
                return callback('No data source to retrieve');
            }

            // Step 1: reset all nodes in the graph
            _each(this.nodes, function (node) {
                node.reset();
            });

            // Only keep generic options, query filters are already scattered across
            // the graph and have already been adjusted for execution
            // (typically references to datasources have been expanded to include
            // datasources definition)
            var queryOptions = {};
            _each(options, function (optionValue, optionName) {
                if ((optionName === 'graph') || (optionName === 'filter')) return;
                queryOptions[optionName] = optionValue;
            });

            // Step 2: parse the graph and compute the number of times each node
            // ends up being connected to the final node.
            this.finalNode.prepare();

            // Step 3: execute the final node
            this.finalNode.find(queryOptions, function (err, values) {
                // Step 4: reset all nodes in the graph to release memory
                _each(self.nodes, function (node) {
                    node.reset();
                });

                // Final step: pass results back to the caller
                return callback(err, values);
            });
        };


        /**
         * Object that performs an atomic operation on one or more outputs
         * produced by other nodes of the underlying graph that are connected
         * to this node.
         *
         * @class
         * @param {string} id The id of the datasource in the graph
         * @param {Object} ds The datasource definition
         * @param {Object} dsNodes Pointer to the list of nodes in the graph
         */
        var GraphNode = function (id, ds, graphNodes) {
            // Clone the node definition, that's our starting point
            this.id = id;
            this.graphNodes = graphNodes;
            this.datasource = ds;
            this.inputNodes = {};
            this.reset();
        };


        /**
         * Resets node properties to free up resources and allow reuse
         *
         * @function
         */
        GraphNode.prototype.reset = function () {
            this.err = null;
            this.data = null;
            this.running = false;
            this.occurrences = 0;
            this.doneCallbacks = [];
            this.collection = null;
        };


        /**
         * Connects the outputs of the other nodes of the graph to the inputs
         * of this node, as appropriate
         *
         * @class
         */
        GraphNode.prototype.prepare = function () {
            var self = this;

            // Increment the maximum number of times the node will take part in the
            // execution of the graph
            this.occurrences += 1;

            // Prepare the underlying collection
            if (this.occurrences === 1) {
                // console.log('prepare', JSON.stringify(this.datasource, null, 2));
                this.collection = collectionFactory.getCollection(this.datasource, true);
            }

            // Infinite loop check
            if (this.occurrences > 1000) {
                throw new Error('Infinite loop detected while preparing datasource execution');
            }

            // Recurse through the list of connected inputs
            // Note the query has been updated inline at graph creation phase
            // to ensure that all inputs can only "reference" a datasource
            // or a list of datasources. In other words, inputs can never define
            // a datasource on their own.
            _each(this.inputNodes, function (inputNode) {
                if (_isArray(inputNode)) {
                    // Input is a multiple input
                    _each(inputNode, function (subNode) {
                        subNode.prepare();
                    });
                }
                else {
                    inputNode.prepare();
                }
            });
        };


        /**
         * Runs the given function when the operation is done processing.
         * @function
         * @param {function} f Callback function to execute
         * @public
         */
        GraphNode.prototype.onDone = function (callback) {
            this.doneCallbacks.push(callback);
        };


        /**
         * Runs the graph node, fetching the node's inputs as necessary.
         *
         * @function
         * @public
         */
        GraphNode.prototype.find = function (options, callback) {
            var self = this;

            // Finish the execution of the node and trigger the "done" event
            var finishExecution = function (err, values) {
                self.running = false;

                // Temporarily save errors and results
                self.err = err;
                self.data = values;

                // Trigger "done" event, passing copies of errors and results
                // (except when it is the last time the node is to be called)
                _each(self.doneCallbacks, function (doneCallback) {
                    var values = null;
                    if (self.occurrences > 1) {
                        values = JSON.parse(JSON.stringify(self.data));
                    }
                    else {
                        values = self.data;
                    }
                    doneCallback(self.err, values);
                });
                self.doneCallbacks = [];

                if (self.occurrences === 0) {
                    self.err = null;
                    self.data = null;
                }
            };

            // Short async function that retrieves an input for the current graph node
            var findInput = function (inputName, cb) {
                var graphNode = self.inputNodes[inputName];
                if (_isArray(graphNode)) {
                    // The input is actually a list of inputs, run all subnodes
                    asyncMap(graphNode, function (subNode, innerCb) {
                        self.collection.updateInputOptions(options, function (err, inputOptions) {
                            if (err) return innerCb(err, null);
                            subNode.find(inputOptions, innerCb);
                        });
                    }, cb);
                }
                else {
                    self.collection.updateInputOptions(options, function (err, inputOptions) {
                        if (err) return cb(err);
                        graphNode.find(inputOptions, cb);
                    });
                }
            };

            // Register the callback function as a "done" event handler
            this.onDone(function (err, values) {
                self.occurrences -= 1;
                return callback(err, values);
            });

            // Return if the node is already running
            // (the callback function will get called once processing is over)
            if (this.running) {
                // Sanity check: the number of occurrences must be greater
                // than 1 in that case
                if (this.occurrences <= 1) {
                    throw new Error('Node is executed more than expected');
                }
                return;
            }

            // Report the results if the node has already been run through
            // another path in the graph
            if (this.err || this.data) {
                return finishExecution(this.err, this.data);
            }

            // If we're still around, it means the node has not yet been run,
            // time to flag it as "running" and do the work.
            this.running = true;

            if (this.datasource.db === "operator") {
                // The collection is an operator.
                // Let it fetch its inputs if wants to, in other words if it has inputs
                // and defines a "fetch" method. Fetch its inputs otherwise.
                // Then call "process" with the list of inputs.
                // console.log('collection.graph', this.datasource.db, this.datasource.col, 'find');
                if (!this.inputNodes) return finishExecution(null, { entries: [] });
                this.collection.fetch(options, function (err, inputs) {
                    if (err) return finishExecution(err);
                    if (inputs !== null) {
                        // All inputs are available, time to run the operator!
                        self.collection.process(inputs, options, function (err, values) {
                            // Propagate the inputs' maxAge property (keeping the minimum)
                            if (values && !values.maxAge) {
                                _each(inputs, function (input) {
                                    if (input.maxAge &&
                                      (!values.maxAge || (input.maxAge < values.maxAge))) {
                                        values.maxAge = input.maxAge;
                                    }
                                });
                            }
                            return finishExecution(err, values);
                        });
                    }
                    else {
                        // Operator does not implement a "fetch" method, let's do it on our own
                        asyncMap(_keys(self.inputNodes), findInput, function (err, values) {
                            // Final callback called when all inputs have been processed
                            if (err) return finishExecution(err);

                            // Link input results back to input names
                            // console.log('inputNodes', JSON.stringify(_keys(self.inputNodes), null, 2));
                            // console.log('values', JSON.stringify(values, null, 2));
                            var inputs = {};
                            _each(_keys(self.inputNodes), function (key, idx) {
                                inputs[key] = values[idx];
                            });

                            // All inputs are available, time to run the operator!
                            self.collection.process(inputs, options, function (err, values) {
                                // Propagate the inputs' maxAge property (keeping the minimum)
                                if (values && !values.maxAge) {
                                    _each(inputs, function (input) {
                                        if (input && input.maxAge &&
                                          (!values.maxAge || (input.maxAge < values.maxAge))) {
                                            values.maxAge = input.maxAge;
                                        }
                                    });
                                }
                                return finishExecution(err, values);
                            });
                        });
                    }
                });
            }
            else {
                // The collection is a "pure" datasource,
                // or it needs to run server-side
                // console.log('collection.graph', this.datasource.db, this.datasource.col, 'find');
                this.collection.find(options, finishExecution);
            }
        };


        return {
            /**
             * Creates a new Collection instance for the final node given as parameter
             *
             * @function
             * @function {Object} datasource The datasource we're interested in
             * @function {function} callback Callback function
             */
            "getCollection": function (datasource, callback) {
                var collection = new Graph(datasource);
                return callback(null, collection);
            }
        };
    });
    /**
     * @fileoverview The JSON Form "defaults" library exposes a setDefaultValues
     * method that extends the object passed as argument so that it includes
     * values for all required fields of the JSON schema it is to follow that
     * define a default value.
     *
     * The library is called to complete the configuration settings of a template in
     * the Factory and to complete datasource settings.
     *
     * The library is useless if the settings have already been validated against the
     * schema using the JSON schema validator (typically, provided the validator is
     * loaded, submitting the form created from the schema will raise an error when
     * required properties are missing).
     *
     * Note the library does not validate the created object, it merely sets missing
     * values to the default values specified in the schema. All other values may
     * be invalid.
     *
     * Nota Bene:
     * - in data-joshfire, the runtime/nodejs/lib/jsonform-defaults.js file is a
     * symbolic link to the jsonform submodule in deps/jsonform
     * - in platform-joshfire, the server/public/js/libs/jsonform-defaults.js file
     * is a symbolic link to the jsonform submodule in deps/jsonform
     */

    (function () {
        // Establish the root object:
        // that's "window" in the browser, "global" in node.js
        var root = this;

        /**
         * Sets default values, ensuring that fields defined as "required" in the
         * schema appear in the object. If missing, the hierarchy that leads to
         * a required key is automatically created.
         *
         * @function
         * @param {Object} obj The object to complete with default values according
         *  to the schema
         * @param {Object} schema The JSON schema that the object follows
         * @param {boolean} includeOptionalValues Include default values for fields
         *  that are not "required"
         * @return {Object} The completed object (same instance as obj)
         */
        var setDefaultValues = function (obj, schema, includeOptionalValues) {
            if (!obj || !schema) return obj;

            // Inner function that parses the schema recursively to build a flat
            // list of defaults
            var defaults = {};
            var extractDefaultValues = function (schemaItem, path) {
                var properties = null;
                var child = null;

                if (!schemaItem || (schemaItem !== Object(schemaItem))) return null;

                if (schemaItem.required) {
                    // Item is required
                    if (schemaItem['default']) {
                        // Item defines a default value, let's use it,
                        // no need to continue in that case, we have the default value
                        // for the whole subtree starting at schemaItem.
                        defaults[path] = schemaItem['default'];
                        return;
                    }
                    else if ((schemaItem.type === 'object') || schemaItem.properties) {
                        // Item is a required object
                        defaults[path] = {};
                    }
                    else if ((schemaItem.type === 'array') || schemaItem.items) {
                        // Item is a required array
                        defaults[path] = [];
                    }
                    else if (schemaItem.type === 'string') {
                        defaults[path] = '';
                    }
                    else if ((schemaItem.type === 'number') || (schemaItem.type === 'integer')) {
                        defaults[path] = 0;
                    }
                    else if (schemaItem.type === 'boolean') {
                        defaults[path] = false;
                    }
                    else {
                        // Unknown type, use an empty object by default
                        defaults[path] = {};
                    }
                }
                else if (schemaItem['default'] && includeOptionalValues) {
                    // Item is not required but defines a default value and the
                    // include optional values flag is set, so let's use it.
                    // No need to continue in that case, we have the default value
                    // for the whole subtree starting at schemaItem.
                    defaults[path] = schemaItem['default'];
                    return;
                }

                // Parse schema item's properties recursively
                properties = schemaItem.properties;
                if (properties) {
                    for (var key in properties) {
                        if (properties.hasOwnProperty(key)) {
                            extractDefaultValues(properties[key], path + '.' + key);
                        }
                    }
                }

                // Parse schema item's children recursively
                if (schemaItem.items) {
                    // Items may be a single item or an array composed of only one item
                    child = schemaItem.items;
                    if (_isArray(child)) {
                        child = child[0];
                    }

                    extractDefaultValues(child, path + '[]');
                }
            };

            // Build a flat list of default values
            extractDefaultValues(schema, '');

            // Ensure the object's default values are correctly set
            for (var key in defaults) {
                if (defaults.hasOwnProperty(key)) {
                    setObjKey(obj, key, defaults[key]);
                }
            }
        };


        /**
         * Retrieves the default value for the given key in the schema
         *
         * Levels in the path are separated by a dot. Array items are marked
         * with []. For instance:
         *  foo.bar[].baz
         *
         * @function
         * @param {Object} schema The schema to parse
         * @param {String} key The path to the key whose default value we're
         *  looking for. each level is separated by a dot, and array items are
         *  flagged with [x].
         * @return {Object} The default value, null if not found.
         */
        var getSchemaKeyDefaultValue = function (schema, key) {
            var schemaKey = key
              .replace(/\./g, '.properties.')
              .replace(/\[.*\](\.|$)/g, '.items$1');
            var schemaDef = getObjKey(schema, schemaKey);
            if (schemaDef) return schemaDef['default'];
            return null;
        };

        /**
         * Retrieves the key identified by a path selector in the structured object.
         *
         * Levels in the path are separated by a dot. Array items are marked
         * with []. For instance:
         *  foo.bar[].baz
         *
         * @function
         * @param {Object} obj The object to parse
         * @param {String} key The path to the key whose default value we're
         *  looking for. each level is separated by a dot, and array items are
         *  flagged with [x].
         * @return {Object} The key definition, null if not found.
         */
        var getObjKey = function (obj, key) {
            var innerobj = obj;
            var keyparts = key.split('.');
            var subkey = null;
            var arrayMatch = null;
            var reArraySingle = /\[([0-9]*)\](?:\.|$)/;

            for (var i = 0; i < keyparts.length; i++) {
                if (typeof innerobj !== 'object') return null;
                subkey = keyparts[i];
                arrayMatch = subkey.match(reArraySingle);
                if (arrayMatch) {
                    // Subkey is part of an array
                    subkey = subkey.replace(reArraySingle, '');
                    if (!_.isArray(innerobj[subkey])) {
                        return null;
                    }
                    innerobj = innerobj[subkey][parseInt(arrayMatch[1], 10)];
                }
                else {
                    innerobj = innerobj[subkey];
                }
            }

            return innerobj;
        };


        /**
         * Sets the key identified by a path selector to the given value.
         *
         * Levels in the path are separated by a dot. Array items are marked
         * with []. For instance:
         *  foo.bar[].baz
         *
         * The hierarchy is automatically created if it does not exist yet.
         *
         * Default values are added to all array items. Array items are not
         * automatically created if they do not exist (in particular, the
         * minItems constraint is not enforced)
         *
         * @function
         * @param {Object} obj The object to build
         * @param {String} key The path to the key to set where each level
         *  is separated by a dot, and array items are flagged with [x].
         * @param {Object} value The value to set, may be of any type.
         */
        var setObjKey = function (obj, key, value) {
            var keyparts = key.split('.');

            // Recursive version of setObjKey
            var recSetObjKey = function (obj, keyparts, value) {
                var arrayMatch = null;
                var reArray = /\[([0-9]*)\]$/;
                var subkey = keyparts.shift();
                var idx = 0;

                if (keyparts.length > 0) {
                    // Not the end yet, build the hierarchy
                    arrayMatch = subkey.match(reArray);
                    if (arrayMatch) {
                        // Subkey is part of an array, check all existing array items
                        // TODO: review that! Only create the right item!!!
                        subkey = subkey.replace(reArray, '');
                        if (!_isArray(obj[subkey])) {
                            obj[subkey] = [];
                        }
                        obj = obj[subkey];
                        if (arrayMatch[1] !== '') {
                            idx = parseInt(arrayMatch[1], 10);
                            if (!obj[idx]) {
                                obj[idx] = {};
                            }
                            recSetObjKey(obj[idx], keyparts, value);
                        }
                        else {
                            for (var k = 0; k < obj.length; k++) {
                                recSetObjKey(obj[k], keyparts, value);
                            }
                        }
                        return;
                    }
                    else {
                        // "Normal" subkey
                        if (typeof obj[subkey] !== 'object') {
                            obj[subkey] = {};
                        }
                        obj = obj[subkey];
                        recSetObjKey(obj, keyparts, value);
                    }
                }
                else {
                    // Last key, time to set the value, unless already defined
                    arrayMatch = subkey.match(reArray);
                    if (arrayMatch) {
                        subkey = subkey.replace(reArray, '');
                        if (!_isArray(obj[subkey])) {
                            obj[subkey] = [];
                        }
                        idx = parseInt(arrayMatch[1], 10);
                        if (!obj[subkey][idx]) {
                            obj[subkey][idx] = value;
                        }
                    }
                    else if (!obj[subkey]) {
                        obj[subkey] = value;
                    }
                }
            };

            // Skip first item if empty (key starts with a '.')
            if (!keyparts[0]) {
                keyparts.shift();
            }
            recSetObjKey(obj, keyparts, value);
        };

        // Taken from Underscore.js (not included to save bytes)
        var _isArray = Array.isArray || function (obj) {
            return Object.prototype.toString.call(obj) == '[object Array]';
        };


        // Export the code as:
        //  1. an AMD module (the "define" method exists in that case), or
        //  2. a node.js module ("module.exports" is defined in that case), or
        //  3. a global JSONForm object (using "root")
        if (typeof define !== 'undefined') {
            // AMD module
            define('runtime-win8/jsonform-defaults', [], function () {
                return {
                    setDefaultValues: setDefaultValues
                };
            });
        }
        else if ((typeof module !== 'undefined') && module.exports) {
            // Node.js module
            module.exports = {
                setDefaultValues: setDefaultValues
            };
        }
        else {
            // Export the function to the global context, using a "string" for
            // Google Closure Compiler "advanced" mode
            // (not sure why it's needed, done by Underscore)
            root['JSONForm'] = root['JSONForm'] || {};
            root['JSONForm'].setDefaultValues = setDefaultValues;
            root['JSONForm'].setObjKey = setObjKey;
            root['JSONForm'].getSchemaKeyDefaultValue = getSchemaKeyDefaultValue;
        }
    })();
    /*
     * @fileoverview Collection factory that creates the appropriate collection
     * object to run a given datasource directly on the client.
     *
     * This version is client-side specific.
     */

    define('runtime-win8/collection.client', ['require'], function (require) {

        /**
         * Path to databases definitions. This path is relative to the baseUrl
         * config parameter of requirejs.
         *
         * @type {string}
         */
        var urlRoot = 'databases/';


        return {
            /**
             * Returns the datasource that matches the given source provider and collection.
             * Returned datasource object features a "find" method that takes a query
             *
             * @function
             * @param {string} datasource The datasource to execute
             * @param {function} callback Callback function called with created collection
             */
            getCollection: function (datasource, callback) {
                var db = datasource.db;
                var colname = datasource.col;

                require([
                  urlRoot + db + '/' + colname,
                  'datajslib!jsonform-defaults'
                ], function (col, defaults) {
                    col = col || {};
                    col.setDefaultValues = function (filter) {
                        var desc = (col.GetDesc ? col.getDesc() : col.desc) || {};
                        var options = desc.options || {};
                        var schema = options.schema || {};
                        if (!schema.properties) {
                            schema = { properties: schema };
                        }
                        defaults.setDefaultValues(filter, schema);
                    };
                    return callback(null, col);
                });
            }
        };
    });
    /**
     * @fileoverview The "Update links" operator updates links it finds
     * in the "articleBody" and/or the "content" property of feed items.
     * 
     * Depending on the operation requested, the operator either removes
     * the links or adds a target="_blank" attribute to force the links
     * to open in a new browser window.
      *
     * For the sake of simplifying the amount of code shipped to the client
     * and the amount of processing needed, the operator uses regular
     * expressions to search and replace links in the HTML fragments.
     * By essence, this approach is doomed to fail in some cases
     * (regular expressions cannot account for comments, nested structures
     * or with the use of '>' as attribute values for instance).
     * The solution to do things properly would be to use a real HTML parser.
     */
    define('databases/operator/updatelinks', [], function () {

        /**
         * Regular expression used to detect the start-tag of a link
         */
        var reLinkStart = /<a\s[^>]*>/gi;

        /**
         * Regular expression used to detect the end-tag of a link
         */
        var reLinkEnd = /<\/a\s*>/gi;

        return {
            /**
             * Description of the datasource for the factory
             */
            desc: {
                "datasources": {
                    "main": {
                        "title": "Input",
                        "multiple": false
                    }
                },
                "options": {
                    "action": {
                        "type": "string",
                        "title": "Requested action",
                        "default": "addtarget",
                        "enum": [
                          "addtarget",
                          "remove"
                        ]
                    }
                },
                "form": [
                  "datasources.main",
                  {
                      "key": "action",
                      "titleMap": {
                          "addtarget": "Force links to open in a new window",
                          "remove": "Remove links (keeping link titles)"
                      }
                  }
                ],
                "runtimes": [
                  "hosted",
                  "browser",
                  "nodejs",
                  "win8"
                ]
            },


            /**
             * Applies the operator, updating links that appear in the articleBody
             * and content properties of all items.
             *
             * @function
             * @param {Object} data The feed associated with the "main" input.
             *  The feed is updated in place, meaning the feed's "entries" property
             *  is directly updated.
             * @param {Object} query Query parameters.
             * @param {function(Object, Object)} callback Callback function.
             *   The second argument of the callback is the data object given as argument.
             *   Its "entries" property contains the sorted feed.
             */
            process: function (data, query, callback) {
                var action = null;
                var i = 0;
                query = query || {};

                // Sanity checks
                if (data && data.main) {
                    data = data.main;
                }
                if (!data || !data.entries || !data.entries.length) {
                    return callback(null, { "entries": [] });
                }

                // Remove links or force them to open in a new window based on requested
                // action (default is to force them to open in a new window)
                action = this.desc.options.action['default'];
                if (query.filter && query.filter.action) {
                    action = query.filter.action;
                }

                // Update feed items
                for (i = 0; i < data.entries.length; i++) {
                    this.updateItemLinks(data.entries[i], action);
                }

                // Send updated feed to the callback method
                callback(null, data);
            },


            /**
             * Updates the links that appear in the item's articleBody and content
             * properties, removing them or adding a target="_blank" attribute as
             * needed.
             *
             * Properties are updated in place.
             *
             * @function
             * @param {Object} item The item to update
             * @param {String} action The action to perform on links
             */
            updateItemLinks: function (item, action) {
                if (!item) return;
                if (item.articleBody) {
                    item.articleBody = this.updateHtml(item.articleBody, action);
                }
                if (item.content) {
                    item.content = this.updateHtml(item.content, action);
                }
            },


            /**
             * Updates links that appear in the given HTML content as requested
             * by the given action and returns the updated HTML fragment.
             *
             * See file overview for warning about the use of regular expressions
             *
             * @function
             * @param {String} html The HTML fragment to update
             * @param {String} action The action to perform
             *  (one of "addtarget" or "remove")
             */
            updateHtml: function (html, action) {
                if (action === 'remove') {
                    html = html.replace(reLinkStart, '');
                    html = html.replace(reLinkEnd, '');
                }
                else {
                    html = html.replace(reLinkStart, function (match, p1, offset, string) {
                        if (match.toLowerCase().indexOf('target=') !== -1) {
                            return match;
                        }
                        else {
                            return '<a target="_blank" ' + match.substring(3);
                        }
                    });
                }
                return html;
            }
        };
    });


    // IMPORTANT: Same code as the original Underscore lib except code gets
    // exported as an AMD module and lines 58 and following have been commented
    // out not to leak '_' to the global scope
    //     Underscore.js 1.3.3
    //     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
    //     Underscore is freely distributable under the MIT license.
    //     Portions of Underscore are inspired or borrowed from Prototype,
    //     Oliver Steele's Functional, and John Resig's Micro-Templating.
    //     For all details and documentation:
    //     http://documentcloud.github.com/underscore

    define('runtime-win8/underscore', [], function () {

        // Baseline setup
        // --------------

        // Establish the root object, `window` in the browser, or `global` on the server.
        var root = this;

        // Save the previous value of the `_` variable.
        var previousUnderscore = root._;

        // Establish the object that gets returned to break out of a loop iteration.
        var breaker = {};

        // Save bytes in the minified (but not gzipped) version:
        var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

        // Create quick reference variables for speed access to core prototypes.
        var slice = ArrayProto.slice,
            unshift = ArrayProto.unshift,
            toString = ObjProto.toString,
            hasOwnProperty = ObjProto.hasOwnProperty;

        // All **ECMAScript 5** native function implementations that we hope to use
        // are declared here.
        var
          nativeForEach = ArrayProto.forEach,
          nativeMap = ArrayProto.map,
          nativeReduce = ArrayProto.reduce,
          nativeReduceRight = ArrayProto.reduceRight,
          nativeFilter = ArrayProto.filter,
          nativeEvery = ArrayProto.every,
          nativeSome = ArrayProto.some,
          nativeIndexOf = ArrayProto.indexOf,
          nativeLastIndexOf = ArrayProto.lastIndexOf,
          nativeIsArray = Array.isArray,
          nativeKeys = Object.keys,
          nativeBind = FuncProto.bind;

        // Create a safe reference to the Underscore object for use below.
        var _ = function (obj) { return new wrapper(obj); };

        // Export the Underscore object for **Node.js**, with
        // backwards-compatibility for the old `require()` API. If we're in
        // the browser, add `_` as a global object via a string identifier,
        // for Closure Compiler "advanced" mode.
        /*
        // Section commented out to avoid leaking '_' to the global scope (tidoust) 
        if (typeof exports !== 'undefined') {
          if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
          }
          exports._ = _;
        } else {
          root['_'] = _;
        }
        */

        // Current version.
        _.VERSION = '1.3.3';

        // Collection Functions
        // --------------------

        // The cornerstone, an `each` implementation, aka `forEach`.
        // Handles objects with the built-in `forEach`, arrays, and raw objects.
        // Delegates to **ECMAScript 5**'s native `forEach` if available.
        var each = _.each = _.forEach = function (obj, iterator, context) {
            if (obj == null) return;
            if (nativeForEach && obj.forEach === nativeForEach) {
                obj.forEach(iterator, context);
            } else if (obj.length === +obj.length) {
                for (var i = 0, l = obj.length; i < l; i++) {
                    if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
                }
            } else {
                for (var key in obj) {
                    if (_.has(obj, key)) {
                        if (iterator.call(context, obj[key], key, obj) === breaker) return;
                    }
                }
            }
        };

        // Return the results of applying the iterator to each element.
        // Delegates to **ECMAScript 5**'s native `map` if available.
        _.map = _.collect = function (obj, iterator, context) {
            var results = [];
            if (obj == null) return results;
            if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
            each(obj, function (value, index, list) {
                results[results.length] = iterator.call(context, value, index, list);
            });
            if (obj.length === +obj.length) results.length = obj.length;
            return results;
        };

        // **Reduce** builds up a single result from a list of values, aka `inject`,
        // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
        _.reduce = _.foldl = _.inject = function (obj, iterator, memo, context) {
            var initial = arguments.length > 2;
            if (obj == null) obj = [];
            if (nativeReduce && obj.reduce === nativeReduce) {
                if (context) iterator = _.bind(iterator, context);
                return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
            }
            each(obj, function (value, index, list) {
                if (!initial) {
                    memo = value;
                    initial = true;
                } else {
                    memo = iterator.call(context, memo, value, index, list);
                }
            });
            if (!initial) throw new TypeError('Reduce of empty array with no initial value');
            return memo;
        };

        // The right-associative version of reduce, also known as `foldr`.
        // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
        _.reduceRight = _.foldr = function (obj, iterator, memo, context) {
            var initial = arguments.length > 2;
            if (obj == null) obj = [];
            if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
                if (context) iterator = _.bind(iterator, context);
                return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
            }
            var reversed = _.toArray(obj).reverse();
            if (context && !initial) iterator = _.bind(iterator, context);
            return initial ? _.reduce(reversed, iterator, memo, context) : _.reduce(reversed, iterator);
        };

        // Return the first value which passes a truth test. Aliased as `detect`.
        _.find = _.detect = function (obj, iterator, context) {
            var result;
            any(obj, function (value, index, list) {
                if (iterator.call(context, value, index, list)) {
                    result = value;
                    return true;
                }
            });
            return result;
        };

        // Return all the elements that pass a truth test.
        // Delegates to **ECMAScript 5**'s native `filter` if available.
        // Aliased as `select`.
        _.filter = _.select = function (obj, iterator, context) {
            var results = [];
            if (obj == null) return results;
            if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
            each(obj, function (value, index, list) {
                if (iterator.call(context, value, index, list)) results[results.length] = value;
            });
            return results;
        };

        // Return all the elements for which a truth test fails.
        _.reject = function (obj, iterator, context) {
            var results = [];
            if (obj == null) return results;
            each(obj, function (value, index, list) {
                if (!iterator.call(context, value, index, list)) results[results.length] = value;
            });
            return results;
        };

        // Determine whether all of the elements match a truth test.
        // Delegates to **ECMAScript 5**'s native `every` if available.
        // Aliased as `all`.
        _.every = _.all = function (obj, iterator, context) {
            var result = true;
            if (obj == null) return result;
            if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
            each(obj, function (value, index, list) {
                if (!(result = result && iterator.call(context, value, index, list))) return breaker;
            });
            return !!result;
        };

        // Determine if at least one element in the object matches a truth test.
        // Delegates to **ECMAScript 5**'s native `some` if available.
        // Aliased as `any`.
        var any = _.some = _.any = function (obj, iterator, context) {
            iterator || (iterator = _.identity);
            var result = false;
            if (obj == null) return result;
            if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
            each(obj, function (value, index, list) {
                if (result || (result = iterator.call(context, value, index, list))) return breaker;
            });
            return !!result;
        };

        // Determine if a given value is included in the array or object using `===`.
        // Aliased as `contains`.
        _.include = _.contains = function (obj, target) {
            var found = false;
            if (obj == null) return found;
            if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
            found = any(obj, function (value) {
                return value === target;
            });
            return found;
        };

        // Invoke a method (with arguments) on every item in a collection.
        _.invoke = function (obj, method) {
            var args = slice.call(arguments, 2);
            return _.map(obj, function (value) {
                return (_.isFunction(method) ? method || value : value[method]).apply(value, args);
            });
        };

        // Convenience version of a common use case of `map`: fetching a property.
        _.pluck = function (obj, key) {
            return _.map(obj, function (value) { return value[key]; });
        };

        // Return the maximum element or (element-based computation).
        _.max = function (obj, iterator, context) {
            if (!iterator && _.isArray(obj) && obj[0] === +obj[0]) return Math.max.apply(Math, obj);
            if (!iterator && _.isEmpty(obj)) return -Infinity;
            var result = { computed: -Infinity };
            each(obj, function (value, index, list) {
                var computed = iterator ? iterator.call(context, value, index, list) : value;
                computed >= result.computed && (result = { value: value, computed: computed });
            });
            return result.value;
        };

        // Return the minimum element (or element-based computation).
        _.min = function (obj, iterator, context) {
            if (!iterator && _.isArray(obj) && obj[0] === +obj[0]) return Math.min.apply(Math, obj);
            if (!iterator && _.isEmpty(obj)) return Infinity;
            var result = { computed: Infinity };
            each(obj, function (value, index, list) {
                var computed = iterator ? iterator.call(context, value, index, list) : value;
                computed < result.computed && (result = { value: value, computed: computed });
            });
            return result.value;
        };

        // Shuffle an array.
        _.shuffle = function (obj) {
            var shuffled = [], rand;
            each(obj, function (value, index, list) {
                rand = Math.floor(Math.random() * (index + 1));
                shuffled[index] = shuffled[rand];
                shuffled[rand] = value;
            });
            return shuffled;
        };

        // Sort the object's values by a criterion produced by an iterator.
        _.sortBy = function (obj, val, context) {
            var iterator = _.isFunction(val) ? val : function (obj) { return obj[val]; };
            return _.pluck(_.map(obj, function (value, index, list) {
                return {
                    value: value,
                    criteria: iterator.call(context, value, index, list)
                };
            }).sort(function (left, right) {
                var a = left.criteria, b = right.criteria;
                if (a === void 0) return 1;
                if (b === void 0) return -1;
                return a < b ? -1 : a > b ? 1 : 0;
            }), 'value');
        };

        // Groups the object's values by a criterion. Pass either a string attribute
        // to group by, or a function that returns the criterion.
        _.groupBy = function (obj, val) {
            var result = {};
            var iterator = _.isFunction(val) ? val : function (obj) { return obj[val]; };
            each(obj, function (value, index) {
                var key = iterator(value, index);
                (result[key] || (result[key] = [])).push(value);
            });
            return result;
        };

        // Use a comparator function to figure out at what index an object should
        // be inserted so as to maintain order. Uses binary search.
        _.sortedIndex = function (array, obj, iterator) {
            iterator || (iterator = _.identity);
            var low = 0, high = array.length;
            while (low < high) {
                var mid = (low + high) >> 1;
                iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
            }
            return low;
        };

        // Safely convert anything iterable into a real, live array.
        _.toArray = function (obj) {
            if (!obj) return [];
            if (_.isArray(obj)) return slice.call(obj);
            if (_.isArguments(obj)) return slice.call(obj);
            if (obj.toArray && _.isFunction(obj.toArray)) return obj.toArray();
            return _.values(obj);
        };

        // Return the number of elements in an object.
        _.size = function (obj) {
            return _.isArray(obj) ? obj.length : _.keys(obj).length;
        };

        // Array Functions
        // ---------------

        // Get the first element of an array. Passing **n** will return the first N
        // values in the array. Aliased as `head` and `take`. The **guard** check
        // allows it to work with `_.map`.
        _.first = _.head = _.take = function (array, n, guard) {
            return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
        };

        // Returns everything but the last entry of the array. Especcialy useful on
        // the arguments object. Passing **n** will return all the values in
        // the array, excluding the last N. The **guard** check allows it to work with
        // `_.map`.
        _.initial = function (array, n, guard) {
            return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
        };

        // Get the last element of an array. Passing **n** will return the last N
        // values in the array. The **guard** check allows it to work with `_.map`.
        _.last = function (array, n, guard) {
            if ((n != null) && !guard) {
                return slice.call(array, Math.max(array.length - n, 0));
            } else {
                return array[array.length - 1];
            }
        };

        // Returns everything but the first entry of the array. Aliased as `tail`.
        // Especially useful on the arguments object. Passing an **index** will return
        // the rest of the values in the array from that index onward. The **guard**
        // check allows it to work with `_.map`.
        _.rest = _.tail = function (array, index, guard) {
            return slice.call(array, (index == null) || guard ? 1 : index);
        };

        // Trim out all falsy values from an array.
        _.compact = function (array) {
            return _.filter(array, function (value) { return !!value; });
        };

        // Return a completely flattened version of an array.
        _.flatten = function (array, shallow) {
            return _.reduce(array, function (memo, value) {
                if (_.isArray(value)) return memo.concat(shallow ? value : _.flatten(value));
                memo[memo.length] = value;
                return memo;
            }, []);
        };

        // Return a version of the array that does not contain the specified value(s).
        _.without = function (array) {
            return _.difference(array, slice.call(arguments, 1));
        };

        // Produce a duplicate-free version of the array. If the array has already
        // been sorted, you have the option of using a faster algorithm.
        // Aliased as `unique`.
        _.uniq = _.unique = function (array, isSorted, iterator) {
            var initial = iterator ? _.map(array, iterator) : array;
            var results = [];
            // The `isSorted` flag is irrelevant if the array only contains two elements.
            if (array.length < 3) isSorted = true;
            _.reduce(initial, function (memo, value, index) {
                if (isSorted ? _.last(memo) !== value || !memo.length : !_.include(memo, value)) {
                    memo.push(value);
                    results.push(array[index]);
                }
                return memo;
            }, []);
            return results;
        };

        // Produce an array that contains the union: each distinct element from all of
        // the passed-in arrays.
        _.union = function () {
            return _.uniq(_.flatten(arguments, true));
        };

        // Produce an array that contains every item shared between all the
        // passed-in arrays. (Aliased as "intersect" for back-compat.)
        _.intersection = _.intersect = function (array) {
            var rest = slice.call(arguments, 1);
            return _.filter(_.uniq(array), function (item) {
                return _.every(rest, function (other) {
                    return _.indexOf(other, item) >= 0;
                });
            });
        };

        // Take the difference between one array and a number of other arrays.
        // Only the elements present in just the first array will remain.
        _.difference = function (array) {
            var rest = _.flatten(slice.call(arguments, 1), true);
            return _.filter(array, function (value) { return !_.include(rest, value); });
        };

        // Zip together multiple lists into a single array -- elements that share
        // an index go together.
        _.zip = function () {
            var args = slice.call(arguments);
            var length = _.max(_.pluck(args, 'length'));
            var results = new Array(length);
            for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
            return results;
        };

        // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
        // we need this function. Return the position of the first occurrence of an
        // item in an array, or -1 if the item is not included in the array.
        // Delegates to **ECMAScript 5**'s native `indexOf` if available.
        // If the array is large and already in sort order, pass `true`
        // for **isSorted** to use binary search.
        _.indexOf = function (array, item, isSorted) {
            if (array == null) return -1;
            var i, l;
            if (isSorted) {
                i = _.sortedIndex(array, item);
                return array[i] === item ? i : -1;
            }
            if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
            for (i = 0, l = array.length; i < l; i++) if (i in array && array[i] === item) return i;
            return -1;
        };

        // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
        _.lastIndexOf = function (array, item) {
            if (array == null) return -1;
            if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
            var i = array.length;
            while (i--) if (i in array && array[i] === item) return i;
            return -1;
        };

        // Generate an integer Array containing an arithmetic progression. A port of
        // the native Python `range()` function. See
        // [the Python documentation](http://docs.python.org/library/functions.html#range).
        _.range = function (start, stop, step) {
            if (arguments.length <= 1) {
                stop = start || 0;
                start = 0;
            }
            step = arguments[2] || 1;

            var len = Math.max(Math.ceil((stop - start) / step), 0);
            var idx = 0;
            var range = new Array(len);

            while (idx < len) {
                range[idx++] = start;
                start += step;
            }

            return range;
        };

        // Function (ahem) Functions
        // ------------------

        // Reusable constructor function for prototype setting.
        var ctor = function () { };

        // Create a function bound to a given object (assigning `this`, and arguments,
        // optionally). Binding with arguments is also known as `curry`.
        // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
        // We check for `func.bind` first, to fail fast when `func` is undefined.
        _.bind = function bind(func, context) {
            var bound, args;
            if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
            if (!_.isFunction(func)) throw new TypeError;
            args = slice.call(arguments, 2);
            return bound = function () {
                if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
                ctor.prototype = func.prototype;
                var self = new ctor;
                var result = func.apply(self, args.concat(slice.call(arguments)));
                if (Object(result) === result) return result;
                return self;
            };
        };

        // Bind all of an object's methods to that object. Useful for ensuring that
        // all callbacks defined on an object belong to it.
        _.bindAll = function (obj) {
            var funcs = slice.call(arguments, 1);
            if (funcs.length == 0) funcs = _.functions(obj);
            each(funcs, function (f) { obj[f] = _.bind(obj[f], obj); });
            return obj;
        };

        // Memoize an expensive function by storing its results.
        _.memoize = function (func, hasher) {
            var memo = {};
            hasher || (hasher = _.identity);
            return function () {
                var key = hasher.apply(this, arguments);
                return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
            };
        };

        // Delays a function for the given number of milliseconds, and then calls
        // it with the arguments supplied.
        _.delay = function (func, wait) {
            var args = slice.call(arguments, 2);
            return setTimeout(function () { return func.apply(null, args); }, wait);
        };

        // Defers a function, scheduling it to run after the current call stack has
        // cleared.
        _.defer = function (func) {
            return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
        };

        // Returns a function, that, when invoked, will only be triggered at most once
        // during a given window of time.
        _.throttle = function (func, wait) {
            var context, args, timeout, throttling, more, result;
            var whenDone = _.debounce(function () { more = throttling = false; }, wait);
            return function () {
                context = this; args = arguments;
                var later = function () {
                    timeout = null;
                    if (more) func.apply(context, args);
                    whenDone();
                };
                if (!timeout) timeout = setTimeout(later, wait);
                if (throttling) {
                    more = true;
                } else {
                    result = func.apply(context, args);
                }
                whenDone();
                throttling = true;
                return result;
            };
        };

        // Returns a function, that, as long as it continues to be invoked, will not
        // be triggered. The function will be called after it stops being called for
        // N milliseconds. If `immediate` is passed, trigger the function on the
        // leading edge, instead of the trailing.
        _.debounce = function (func, wait, immediate) {
            var timeout;
            return function () {
                var context = this, args = arguments;
                var later = function () {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                if (immediate && !timeout) func.apply(context, args);
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };

        // Returns a function that will be executed at most one time, no matter how
        // often you call it. Useful for lazy initialization.
        _.once = function (func) {
            var ran = false, memo;
            return function () {
                if (ran) return memo;
                ran = true;
                return memo = func.apply(this, arguments);
            };
        };

        // Returns the first function passed as an argument to the second,
        // allowing you to adjust arguments, run code before and after, and
        // conditionally execute the original function.
        _.wrap = function (func, wrapper) {
            return function () {
                var args = [func].concat(slice.call(arguments, 0));
                return wrapper.apply(this, args);
            };
        };

        // Returns a function that is the composition of a list of functions, each
        // consuming the return value of the function that follows.
        _.compose = function () {
            var funcs = arguments;
            return function () {
                var args = arguments;
                for (var i = funcs.length - 1; i >= 0; i--) {
                    args = [funcs[i].apply(this, args)];
                }
                return args[0];
            };
        };

        // Returns a function that will only be executed after being called N times.
        _.after = function (times, func) {
            if (times <= 0) return func();
            return function () {
                if (--times < 1) { return func.apply(this, arguments); }
            };
        };

        // Object Functions
        // ----------------

        // Retrieve the names of an object's properties.
        // Delegates to **ECMAScript 5**'s native `Object.keys`
        _.keys = nativeKeys || function (obj) {
            if (obj !== Object(obj)) throw new TypeError('Invalid object');
            var keys = [];
            for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
            return keys;
        };

        // Retrieve the values of an object's properties.
        _.values = function (obj) {
            return _.map(obj, _.identity);
        };

        // Return a sorted list of the function names available on the object.
        // Aliased as `methods`
        _.functions = _.methods = function (obj) {
            var names = [];
            for (var key in obj) {
                if (_.isFunction(obj[key])) names.push(key);
            }
            return names.sort();
        };

        // Extend a given object with all the properties in passed-in object(s).
        _.extend = function (obj) {
            each(slice.call(arguments, 1), function (source) {
                for (var prop in source) {
                    obj[prop] = source[prop];
                }
            });
            return obj;
        };

        // Return a copy of the object only containing the whitelisted properties.
        _.pick = function (obj) {
            var result = {};
            each(_.flatten(slice.call(arguments, 1)), function (key) {
                if (key in obj) result[key] = obj[key];
            });
            return result;
        };

        // Fill in a given object with default properties.
        _.defaults = function (obj) {
            each(slice.call(arguments, 1), function (source) {
                for (var prop in source) {
                    if (obj[prop] == null) obj[prop] = source[prop];
                }
            });
            return obj;
        };

        // Create a (shallow-cloned) duplicate of an object.
        _.clone = function (obj) {
            if (!_.isObject(obj)) return obj;
            return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
        };

        // Invokes interceptor with the obj, and then returns obj.
        // The primary purpose of this method is to "tap into" a method chain, in
        // order to perform operations on intermediate results within the chain.
        _.tap = function (obj, interceptor) {
            interceptor(obj);
            return obj;
        };

        // Internal recursive comparison function.
        function eq(a, b, stack) {
            // Identical objects are equal. `0 === -0`, but they aren't identical.
            // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
            if (a === b) return a !== 0 || 1 / a == 1 / b;
            // A strict comparison is necessary because `null == undefined`.
            if (a == null || b == null) return a === b;
            // Unwrap any wrapped objects.
            if (a._chain) a = a._wrapped;
            if (b._chain) b = b._wrapped;
            // Invoke a custom `isEqual` method if one is provided.
            if (a.isEqual && _.isFunction(a.isEqual)) return a.isEqual(b);
            if (b.isEqual && _.isFunction(b.isEqual)) return b.isEqual(a);
            // Compare `[[Class]]` names.
            var className = toString.call(a);
            if (className != toString.call(b)) return false;
            switch (className) {
                // Strings, numbers, dates, and booleans are compared by value.
                case '[object String]':
                    // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
                    // equivalent to `new String("5")`.
                    return a == String(b);
                case '[object Number]':
                    // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
                    // other numeric values.
                    return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
                case '[object Date]':
                case '[object Boolean]':
                    // Coerce dates and booleans to numeric primitive values. Dates are compared by their
                    // millisecond representations. Note that invalid dates with millisecond representations
                    // of `NaN` are not equivalent.
                    return +a == +b;
                    // RegExps are compared by their source patterns and flags.
                case '[object RegExp]':
                    return a.source == b.source &&
                           a.global == b.global &&
                           a.multiline == b.multiline &&
                           a.ignoreCase == b.ignoreCase;
            }
            if (typeof a != 'object' || typeof b != 'object') return false;
            // Assume equality for cyclic structures. The algorithm for detecting cyclic
            // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
            var length = stack.length;
            while (length--) {
                // Linear search. Performance is inversely proportional to the number of
                // unique nested structures.
                if (stack[length] == a) return true;
            }
            // Add the first object to the stack of traversed objects.
            stack.push(a);
            var size = 0, result = true;
            // Recursively compare objects and arrays.
            if (className == '[object Array]') {
                // Compare array lengths to determine if a deep comparison is necessary.
                size = a.length;
                result = size == b.length;
                if (result) {
                    // Deep compare the contents, ignoring non-numeric properties.
                    while (size--) {
                        // Ensure commutative equality for sparse arrays.
                        if (!(result = size in a == size in b && eq(a[size], b[size], stack))) break;
                    }
                }
            } else {
                // Objects with different constructors are not equivalent.
                if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) return false;
                // Deep compare objects.
                for (var key in a) {
                    if (_.has(a, key)) {
                        // Count the expected number of properties.
                        size++;
                        // Deep compare each member.
                        if (!(result = _.has(b, key) && eq(a[key], b[key], stack))) break;
                    }
                }
                // Ensure that both objects contain the same number of properties.
                if (result) {
                    for (key in b) {
                        if (_.has(b, key) && !(size--)) break;
                    }
                    result = !size;
                }
            }
            // Remove the first object from the stack of traversed objects.
            stack.pop();
            return result;
        }

        // Perform a deep comparison to check if two objects are equal.
        _.isEqual = function (a, b) {
            return eq(a, b, []);
        };

        // Is a given array, string, or object empty?
        // An "empty" object has no enumerable own-properties.
        _.isEmpty = function (obj) {
            if (obj == null) return true;
            if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
            for (var key in obj) if (_.has(obj, key)) return false;
            return true;
        };

        // Is a given value a DOM element?
        _.isElement = function (obj) {
            return !!(obj && obj.nodeType == 1);
        };

        // Is a given value an array?
        // Delegates to ECMA5's native Array.isArray
        _.isArray = nativeIsArray || function (obj) {
            return toString.call(obj) == '[object Array]';
        };

        // Is a given variable an object?
        _.isObject = function (obj) {
            return obj === Object(obj);
        };

        // Is a given variable an arguments object?
        _.isArguments = function (obj) {
            return toString.call(obj) == '[object Arguments]';
        };
        if (!_.isArguments(arguments)) {
            _.isArguments = function (obj) {
                return !!(obj && _.has(obj, 'callee'));
            };
        }

        // Is a given value a function?
        _.isFunction = function (obj) {
            return toString.call(obj) == '[object Function]';
        };

        // Is a given value a string?
        _.isString = function (obj) {
            return toString.call(obj) == '[object String]';
        };

        // Is a given value a number?
        _.isNumber = function (obj) {
            return toString.call(obj) == '[object Number]';
        };

        // Is a given object a finite number?
        _.isFinite = function (obj) {
            return _.isNumber(obj) && isFinite(obj);
        };

        // Is the given value `NaN`?
        _.isNaN = function (obj) {
            // `NaN` is the only value for which `===` is not reflexive.
            return obj !== obj;
        };

        // Is a given value a boolean?
        _.isBoolean = function (obj) {
            return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
        };

        // Is a given value a date?
        _.isDate = function (obj) {
            return toString.call(obj) == '[object Date]';
        };

        // Is the given value a regular expression?
        _.isRegExp = function (obj) {
            return toString.call(obj) == '[object RegExp]';
        };

        // Is a given value equal to null?
        _.isNull = function (obj) {
            return obj === null;
        };

        // Is a given variable undefined?
        _.isUndefined = function (obj) {
            return obj === void 0;
        };

        // Has own property?
        _.has = function (obj, key) {
            return hasOwnProperty.call(obj, key);
        };

        // Utility Functions
        // -----------------

        // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
        // previous owner. Returns a reference to the Underscore object.
        _.noConflict = function () {
            root._ = previousUnderscore;
            return this;
        };

        // Keep the identity function around for default iterators.
        _.identity = function (value) {
            return value;
        };

        // Run a function **n** times.
        _.times = function (n, iterator, context) {
            for (var i = 0; i < n; i++) iterator.call(context, i);
        };

        // Escape a string for HTML interpolation.
        _.escape = function (string) {
            return ('' + string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
        };

        // If the value of the named property is a function then invoke it;
        // otherwise, return it.
        _.result = function (object, property) {
            if (object == null) return null;
            var value = object[property];
            return _.isFunction(value) ? value.call(object) : value;
        };

        // Add your own custom functions to the Underscore object, ensuring that
        // they're correctly added to the OOP wrapper as well.
        _.mixin = function (obj) {
            each(_.functions(obj), function (name) {
                addToWrapper(name, _[name] = obj[name]);
            });
        };

        // Generate a unique integer id (unique within the entire client session).
        // Useful for temporary DOM ids.
        var idCounter = 0;
        _.uniqueId = function (prefix) {
            var id = idCounter++;
            return prefix ? prefix + id : id;
        };

        // By default, Underscore uses ERB-style template delimiters, change the
        // following template settings to use alternative delimiters.
        _.templateSettings = {
            evaluate: /<%([\s\S]+?)%>/g,
            interpolate: /<%=([\s\S]+?)%>/g,
            escape: /<%-([\s\S]+?)%>/g
        };

        // When customizing `templateSettings`, if you don't want to define an
        // interpolation, evaluation or escaping regex, we need one that is
        // guaranteed not to match.
        var noMatch = /.^/;

        // Certain characters need to be escaped so that they can be put into a
        // string literal.
        var escapes = {
            '\\': '\\',
            "'": "'",
            'r': '\r',
            'n': '\n',
            't': '\t',
            'u2028': '\u2028',
            'u2029': '\u2029'
        };

        for (var p in escapes) escapes[escapes[p]] = p;
        var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
        var unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g;

        // Within an interpolation, evaluation, or escaping, remove HTML escaping
        // that had been previously added.
        var unescape = function (code) {
            return code.replace(unescaper, function (match, escape) {
                return escapes[escape];
            });
        };

        // JavaScript micro-templating, similar to John Resig's implementation.
        // Underscore templating handles arbitrary delimiters, preserves whitespace,
        // and correctly escapes quotes within interpolated code.
        _.template = function (text, data, settings) {
            settings = _.defaults(settings || {}, _.templateSettings);

            // Compile the template source, taking care to escape characters that
            // cannot be included in a string literal and then unescape them in code
            // blocks.
            var source = "__p+='" + text
              .replace(escaper, function (match) {
                  return '\\' + escapes[match];
              })
              .replace(settings.escape || noMatch, function (match, code) {
                  return "'+\n_.escape(" + unescape(code) + ")+\n'";
              })
              .replace(settings.interpolate || noMatch, function (match, code) {
                  return "'+\n(" + unescape(code) + ")+\n'";
              })
              .replace(settings.evaluate || noMatch, function (match, code) {
                  return "';\n" + unescape(code) + "\n;__p+='";
              }) + "';\n";

            // If a variable is not specified, place data values in local scope.
            if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

            source = "var __p='';" +
              "var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" +
              source + "return __p;\n";

            var render = new Function(settings.variable || 'obj', '_', source);
            if (data) return render(data, _);
            var template = function (data) {
                return render.call(this, data, _);
            };

            // Provide the compiled function source as a convenience for build time
            // precompilation.
            template.source = 'function(' + (settings.variable || 'obj') + '){\n' +
              source + '}';

            return template;
        };

        // Add a "chain" function, which will delegate to the wrapper.
        _.chain = function (obj) {
            return _(obj).chain();
        };

        // The OOP Wrapper
        // ---------------

        // If Underscore is called as a function, it returns a wrapped object that
        // can be used OO-style. This wrapper holds altered versions of all the
        // underscore functions. Wrapped objects may be chained.
        var wrapper = function (obj) { this._wrapped = obj; };

        // Expose `wrapper.prototype` as `_.prototype`
        _.prototype = wrapper.prototype;

        // Helper function to continue chaining intermediate results.
        var result = function (obj, chain) {
            return chain ? _(obj).chain() : obj;
        };

        // A method to easily add functions to the OOP wrapper.
        var addToWrapper = function (name, func) {
            wrapper.prototype[name] = function () {
                var args = slice.call(arguments);
                unshift.call(args, this._wrapped);
                return result(func.apply(_, args), this._chain);
            };
        };

        // Add all of the Underscore functions to the wrapper object.
        _.mixin(_);

        // Add all mutator Array functions to the wrapper.
        each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function (name) {
            var method = ArrayProto[name];
            wrapper.prototype[name] = function () {
                var wrapped = this._wrapped;
                method.apply(wrapped, arguments);
                var length = wrapped.length;
                if ((name == 'shift' || name == 'splice') && length === 0) delete wrapped[0];
                return result(wrapped, this._chain);
            };
        });

        // Add all accessor Array functions to the wrapper.
        each(['concat', 'join', 'slice'], function (name) {
            var method = ArrayProto[name];
            wrapper.prototype[name] = function () {
                return result(method.apply(this._wrapped, arguments), this._chain);
            };
        });

        // Start chaining a wrapped Underscore object.
        wrapper.prototype.chain = function () {
            this._chain = true;
            return this;
        };

        // Extracts the result from a wrapped and chained object.
        wrapper.prototype.value = function () {
            return this._wrapped;
        };

        return _;

    });
    define('runtime-win8/http', [], function () {
        // Windows 8 style

        // Used to generate unique number for JSON callback function name
        var callbackSeed = (new Date()).getTime();

        return {
            "request": function (params, callback) {
                // Ensure parameters are correct
                if (!params || !params.url) {
                    return callback("No URI to request");
                }

                // Ensure URL starts with http:// or https://
                if (params.url.search(/^http(s?)\:\/\//i) === -1) {
                    return callback("URI to request does not start with 'http://' or 'https://'.");
                }

                if (!params.data) params.data = {};

                // Setting callback parameter when JSONP requested,
                // using user-defined parameters or default conventions
                // (the hash mimics the one generated in jQuery)
                if (params.dataType === 'jsonp') {
                    var jsonp = params.jsonp || "callback";
                    var jsonCallback = params.jsonCallback ||
                      "datajslib_" + (Math.random().toString()).replace(/\D/g, "") + (callbackSeed++);
                    params.data[jsonp] = jsonCallback;
                }

                var type = (params.type || 'get').toLowerCase();

                // Depending of the method of the request, we either append
                // to the URL or create formdata.
                if (type === "post") {
                    var fd = new FormData();
                    for (var j in params.data) {
                        if (params.data.hasOwnProperty(j))
                            fd.append(j, params.data[j]);
                    }
                    params.data = fd;
                } else if (type === "put") {

                } else if (type === "delete") {

                } else {
                    // Stringify the query data that should be sent to the
                    // server in the event of a GET query. This is something
                    // that's usually done by http modules (jquery and such)
                    // but is not done by WinJS's xhr() which expects
                    // the formatted querystring in params.data
                    var finalQs = '';
                    for (var k in params.data) {
                        if (params.data.hasOwnProperty(k)) {
                            finalQs += encodeURIComponent(k) + '=' + encodeURIComponent(params.data[k]) + '&';
                        }
                    }
                    finalQs = finalQs.substr(0, finalQs.length - 1) || "";
                    params.url += (/\?/.test(params.url) ? "&" : "?") + finalQs;
                }

                WinJS.xhr(params).then(
                  // success
                  function (ret) {
                      var body = ret.responseText;

                      if (params.dataType == 'json' ||
                        params.dataType == 'text json' ||
                        params.dataType == 'jsonp') {
                          var tmp_json;

                          try {
                              // Strip out JSONP function
                              if (params.dataType === "jsonp") {
                                  // replace the last parenthethis
                                  body = body.replace(/\)$/, "").replace(/\)\;$/, "");
                                  // replace before the first patenthethis
                                  body = body.replace(/^[^\(]+\(/, "");
                              }
                              tmp_json = JSON.parse(body);
                          } catch (e) {
                              // console.warn('Invalid JSON received: ', body);
                              return callback("Could not parse the response received as JSON.\n" +
                                "Possible causes:\n" +
                                "- the provider did not wrap the object in a JSONP function" +
                                " (ensure the jsonp parameter is the right one)\n" +
                                "- the JSON is invalid (not much to do in that case)\n" +
                                "Exception triggered: " + e);
                          }
                          return callback(null, tmp_json);
                      } else {
                          return callback(null, body);
                      }
                  },
                  // error
                  function (err) {
                      callback(err);
                  });

                return true;
            }
        };

    });
    /**
     * @fileoverview ISO8601 conversion functions.
     *
     * Original code from http://webcloud.se/log/JavaScript-and-ISO-8601/
     *
     * The code has been largely re-written because it did not parse local/UTC
     * dates quite well. In particular, strings such as "2012-02-10T00:00:00Z"
     * were parsed as local dates.
     */
    define('runtime-win8/iso8601', [], function () {

        /**
         * Regular expression that matches an ISO8601 date
         * @private
         */
        var reDate = /^([0-9]{4})(\-([0-9]{2})(\-([0-9]{2})(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?(Z|(([\-+])([0-9]{2}):([0-9]{2})))?)?)?)?$/;

        /**
         * Regular expression that matches an ISO8601 duration
         * @private
         */
        var reDuration = /^PT([0-9]+)H([0-9]+)M([0-9]+)S$/;


        //from http://webcloud.se/log/JavaScript-and-ISO-8601/
        return {
            /**
             * Returns a Date object that matches the given ISO8601 string.
             *
             * If the string only specifies a day but not time, the string is
             * interpreted as a local date whose time is midnight. That is
             * consistent with the way dates are parsed in JavaScript:
             * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/parse
             *
             * @function
             * @param {string} string The ISO8601 string to parse
             * @return {Date} The date object that matches the given string,
             *  null if the incoming string is not a valid date
             */
            toDate: function (string) {
                var d = null,
                  offset = 0,
                  date = null,
                  time = null;

                if (!string) {
                    return null;
                }

                // Parse the string
                d = string.trim().match(reDate);
                if (!d) {
                    // Not a valid date
                    return null;
                }
                //console.log(d);

                // If "Z" or a timezone is specified, construct the date as a UTC date,
                // and apply the specified timezone as necessary.
                // If not, the date is to be understood as a local date, where "local"
                // means local to the system that runs the function.
                // Note that a date without time is interpreted as a UTC date whose
                // time is midnight.
                date = new Date(2010, 0, 1);
                if (d[13]) {
                    // No time specified, or there's a "Z" or a timezone
                    date.setUTCFullYear(d[1], 0, 1);
                    date.setUTCHours(0, 0, 0, 0);
                    if (d[3]) { date.setUTCMonth(d[3] - 1); }
                    if (d[5]) { date.setUTCDate(d[5]); }

                    if (d[7]) { date.setUTCHours(d[7]); }
                    if (d[8]) { date.setUTCMinutes(d[8]); }
                    if (d[10]) { date.setUTCSeconds(d[10]); }
                    if (d[12]) { date.setUTCMilliseconds(Number("0." + d[12]) * 1000); }

                    if (d[14]) {
                        // Some timezone specified, apply the offset
                        // and generate the new date
                        offset = (Number(d[16]) * 60) + Number(d[17]);
                        offset *= ((d[15] == '-') ? 1 : -1);

                        time = date.getTime() + (offset * 60 * 1000);
                        date.setTime(time);
                    }
                }
                else {
                    // No time, or time but no timezone, interpret the date as a local date
                    date.setFullYear(d[1], 0, 1, 0, 0, 0, 0);
                    if (d[3]) { date.setMonth(d[3] - 1); }
                    if (d[5]) { date.setDate(d[5]); }
                    if (d[7]) { date.setHours(d[7]); }
                    if (d[8]) { date.setMinutes(d[8]); }
                    if (d[10]) { date.setSeconds(d[10]); }
                    if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
                }

                return date;
            },

            /**
             * Returns the ISO8601 string representation of the date, given as a string.
             * The method supports the following formats for the given date string:
             * - RFC822
             * - ISO8601, regardless of whether the code is run under JavaScript v1.8.5+
             * or not.
             *
             * @function
             * @param {string} string The date string to convert to an ISO8601 string
             * @returns {string} The ISO8601 string representation for this date, an
             *  empty string if the string could not be parsed.
             */
            fromString: function (string) {
                var date = null;

                if (!string) {
                    return '';
                }

                date = new Date(string);
                if (isNaN(date.getTime())) {
                    // The date could not be parsed by the Date object, try to parse the
                    // string as ISO8601 (this won't change anything if the underlying
                    // JavaScript engine already supports that format, but won't be harmful
                    // either).
                    date = this.toDate(string);
                }

                // Convert the final date
                return this.fromDate(date);
            },


            /**
             * Returns the ISO8601 string representation of the given date.
             *
             * Milliseconds are only returned when different from 0.
             *
             * @function
             * @param {Date} d The date object to convert
             * @returns {string} The ISO8601 string representation for this date
             */
            fromDate: function (d) {
                var pad = function (n) {
                    return (n < 10) ? '0' + n : n;
                };
                var padms = function (n) {
                    if (n < 10) {
                        return '00' + n;
                    }
                    else if (n < 100) {
                        return '0' + n;
                    }
                    else {
                        return n;
                    }
                };

                if (!d || !(d instanceof Date) || isNaN(d.getTime())) {
                    return "";
                }

                return d.getUTCFullYear() +
                  '-' + pad(d.getUTCMonth() + 1) +
                  '-' + pad(d.getUTCDate()) +
                  'T' + pad(d.getUTCHours()) +
                  ':' + pad(d.getUTCMinutes()) +
                  ':' + pad(d.getUTCSeconds()) +
                  ((d.getUTCMilliseconds() !== 0) ? '.' + padms(d.getUTCMilliseconds()) : '') +
                  'Z';
            },


            /**
             * Returns the ISO8601 string representation of the given date,
             * omitting the time part.
             *
             * The method outputs the local day when the local time evaluates to zero
             * The method outputs the UTC day otherwise. This apparently weird rule
             * allows to stick to the "right" day if the author created the date with:
             *  new Date("21 Apr 1997");
             *
             * This method should only really be used with dates created without time
             * counterpart.
             *
             * @function
             * @param {Date} d The date object to convert
             * @return {string} The ISO8601 string representation for this date
             */
            fromDateNoTime: function (d) {
                var pad = function (n) {
                    return (n < 10) ? '0' + n : n;
                };

                if (!d || !(d instanceof Date) || isNaN(d.getTime())) {
                    return "";
                }

                if (!d || isNaN(d.getTime())) {
                    return "";
                }

                if ((d.getHours() === 0) &&
                  (d.getMinutes() === 0) &&
                  (d.getSeconds() === 0) &&
                  (d.getMilliseconds() === 0)) {
                    // Local time evaluates to 0, return local day
                    return d.getFullYear() +
                      '-' + pad(d.getMonth() + 1) +
                      '-' + pad(d.getDate());
                }
                else {
                    // Return UTC day
                    return d.getUTCFullYear() +
                      '-' + pad(d.getUTCMonth() + 1) +
                      '-' + pad(d.getUTCDate());
                }
            },


            /**
             * Returns the number of milliseconds that correspond to the given ISO8601 duration.
             * Note the function is restricted to durations of the form "PTnnHnnMnnS" for the time being.
             * @function
             * @param {string} string The ISO8601 string that represents a duration
             * @return {number} The duration in milliseconds
             */
            toDuration: function (string) {
                if (!string) {
                    return 0;
                }

                var d = string.match(reDuration);
                if (!d) {
                    return 0;
                }

                var ms = 0;
                if (d[2]) { ms += Number(d[2]) * 3600 * 1000; }
                if (d[3]) { ms += Number(d[3]) * 60 * 1000; }
                if (d[4]) { ms += Number(d[4]) * 1000; }

                return ms;
            },


            /**
             * Returns the ISO8601 representation of the given duration.
             * The function is not fully generic and only generates durations in the form "PTnnHnnMnnS"
             * (no year, month or day)
             * @function
             * @param {number} ms The duration to convert in milliseconds
             * @return {string} The ISO8601 representation of the duration
             */
            fromDuration: function (ms) {
                var seconds = Math.round(ms / 1000);
                var hours = Math.floor(seconds / 3600);
                var minutes = 0;

                seconds = seconds - hours * 3600;
                minutes = Math.floor(seconds / 60);

                seconds = seconds - minutes * 60;

                return "PT" +
                  hours + "H" +
                  minutes + "M" +
                  seconds + "S";
            }
        };


    });
    /**
     * @fileoverview The JSON Form lang field library exposes a getLangField method
     * that returns the appropriate JSON Form description object to generate a
     * dropdown box that lists common languages.
     *
     * The two-letter ISO 639-1 language code of the selected language gets passed
     * to the schema upon form submission:
     * http://www.loc.gov/standards/iso639-2/php/code_list.php
     */

    define('runtime-win8/jsonform-langfield', [], function () {

        /**
         * Taken from:
         * http://stackoverflow.com/questions/3217492/list-of-language-codes-in-yaml-or-json
         *
         * @author Phil Teare
         * using wikipedia data
         */
        /*var isoLangs = {
          "ab":{
            "name":"Abkhaz",
            "nativeName":"аҧсуа"
          },
          "aa":{
            "name":"Afar",
            "nativeName":"Afaraf"
          },
          "af":{
            "name":"Afrikaans",
            "nativeName":"Afrikaans"
          },
          "ak":{
            "name":"Akan",
            "nativeName":"Akan"
          },
          "sq":{
            "name":"Albanian",
            "nativeName":"Shqip"
          },
          "am":{
            "name":"Amharic",
            "nativeName":"አማርኛ"
          },
          "ar":{
            "name":"Arabic",
            "nativeName":"العربية"
          },
          "an":{
            "name":"Aragonese",
            "nativeName":"Aragonés"
          },
          "hy":{
            "name":"Armenian",
            "nativeName":"Հայերեն"
          },
          "as":{
            "name":"Assamese",
            "nativeName":"অসমীয়া"
          },
          "av":{
            "name":"Avaric",
            "nativeName":"авар мацӀ, магӀарул мацӀ"
          },
          "ae":{
            "name":"Avestan",
            "nativeName":"avesta"
          },
          "ay":{
            "name":"Aymara",
            "nativeName":"aymar aru"
          },
          "az":{
            "name":"Azerbaijani",
            "nativeName":"azərbaycan dili"
          },
          "bm":{
            "name":"Bambara",
            "nativeName":"bamanankan"
          },
          "ba":{
            "name":"Bashkir",
            "nativeName":"башҡорт теле"
          },
          "eu":{
            "name":"Basque",
            "nativeName":"euskara, euskera"
          },
          "be":{
            "name":"Belarusian",
            "nativeName":"Беларуская"
          },
          "bn":{
            "name":"Bengali",
            "nativeName":"বাংলা"
          },
          "bh":{
            "name":"Bihari",
            "nativeName":"भोजपुरी"
          },
          "bi":{
            "name":"Bislama",
            "nativeName":"Bislama"
          },
          "bs":{
            "name":"Bosnian",
            "nativeName":"bosanski jezik"
          },
          "br":{
            "name":"Breton",
            "nativeName":"brezhoneg"
          },
          "bg":{
            "name":"Bulgarian",
            "nativeName":"български език"
          },
          "my":{
            "name":"Burmese",
            "nativeName":"ဗမာစာ"
          },
          "ca":{
            "name":"Catalan; Valencian",
            "nativeName":"Català"
          },
          "ch":{
            "name":"Chamorro",
            "nativeName":"Chamoru"
          },
          "ce":{
            "name":"Chechen",
            "nativeName":"нохчийн мотт"
          },
          "ny":{
            "name":"Chichewa; Chewa; Nyanja",
            "nativeName":"chiCheŵa, chinyanja"
          },
          "zh":{
            "name":"Chinese",
            "nativeName":"中文 (Zhōngwén), 汉语, 漢語"
          },
          "cv":{
            "name":"Chuvash",
            "nativeName":"чӑваш чӗлхи"
          },
          "kw":{
            "name":"Cornish",
            "nativeName":"Kernewek"
          },
          "co":{
            "name":"Corsican",
            "nativeName":"corsu, lingua corsa"
          },
          "cr":{
            "name":"Cree",
            "nativeName":"ᓀᐦᐃᔭᐍᐏᐣ"
          },
          "hr":{
            "name":"Croatian",
            "nativeName":"hrvatski"
          },
          "cs":{
            "name":"Czech",
            "nativeName":"česky, čeština"
          },
          "da":{
            "name":"Danish",
            "nativeName":"dansk"
          },
          "dv":{
            "name":"Divehi; Dhivehi; Maldivian;",
            "nativeName":""
          },
          "nl":{
            "name":"Dutch",
            "nativeName":"Nederlands, Vlaams"
          },
          "en":{
            "name":"English",
            "nativeName":"English"
          },
          "eo":{
            "name":"Esperanto",
            "nativeName":"Esperanto"
          },
          "et":{
            "name":"Estonian",
            "nativeName":"eesti, eesti keel"
          },
          "ee":{
            "name":"Ewe",
            "nativeName":"Eʋegbe"
          },
          "fo":{
            "name":"Faroese",
            "nativeName":"føroyskt"
          },
          "fj":{
            "name":"Fijian",
            "nativeName":"vosa Vakaviti"
          },
          "fi":{
            "name":"Finnish",
            "nativeName":"suomi, suomen kieli"
          },
          "fr":{
            "name":"French",
            "nativeName":"français, langue française"
          },
          "ff":{
            "name":"Fula; Fulah; Pulaar; Pular",
            "nativeName":"Fulfulde, Pulaar, Pular"
          },
          "gl":{
            "name":"Galician",
            "nativeName":"Galego"
          },
          "ka":{
            "name":"Georgian",
            "nativeName":"ქართული"
          },
          "de":{
            "name":"German",
            "nativeName":"Deutsch"
          },
          "el":{
            "name":"Greek, Modern",
            "nativeName":"Ελληνικά"
          },
          "gn":{
            "name":"Guaraní",
            "nativeName":"Avañeẽ"
          },
          "gu":{
            "name":"Gujarati",
            "nativeName":"ગુજરાતી"
          },
          "ht":{
            "name":"Haitian; Haitian Creole",
            "nativeName":"Kreyòl ayisyen"
          },
          "ha":{
            "name":"Hausa",
            "nativeName":"Hausa, هَوُسَ"
          },
          "he":{
            "name":"Hebrew (modern)",
            "nativeName":"עברית"
          },
          "hz":{
            "name":"Herero",
            "nativeName":"Otjiherero"
          },
          "hi":{
            "name":"Hindi",
            "nativeName":"हिन्दी, हिंदी"
          },
          "ho":{
            "name":"Hiri Motu",
            "nativeName":"Hiri Motu"
          },
          "hu":{
            "name":"Hungarian",
            "nativeName":"Magyar"
          },
          "ia":{
            "name":"Interlingua",
            "nativeName":"Interlingua"
          },
          "id":{
            "name":"Indonesian",
            "nativeName":"Bahasa Indonesia"
          },
          "ie":{
            "name":"Interlingue",
            "nativeName":"Originally called Occidental; then Interlingue after WWII"
          },
          "ga":{
            "name":"Irish",
            "nativeName":"Gaeilge"
          },
          "ig":{
            "name":"Igbo",
            "nativeName":"Asụsụ Igbo"
          },
          "ik":{
            "name":"Inupiaq",
            "nativeName":"Iñupiaq, Iñupiatun"
          },
          "io":{
            "name":"Ido",
            "nativeName":"Ido"
          },
          "is":{
            "name":"Icelandic",
            "nativeName":"Íslenska"
          },
          "it":{
            "name":"Italian",
            "nativeName":"Italiano"
          },
          "iu":{
            "name":"Inuktitut",
            "nativeName":"ᐃᓄᒃᑎᑐᑦ"
          },
          "ja":{
            "name":"Japanese",
            "nativeName":"日本語 (にほんご／にっぽんご)"
          },
          "jv":{
            "name":"Javanese",
            "nativeName":"basa Jawa"
          },
          "kl":{
            "name":"Kalaallisut, Greenlandic",
            "nativeName":"kalaallisut, kalaallit oqaasii"
          },
          "kn":{
            "name":"Kannada",
            "nativeName":"ಕನ್ನಡ"
          },
          "kr":{
            "name":"Kanuri",
            "nativeName":"Kanuri"
          },
          "ks":{
            "name":"Kashmiri",
            "nativeName":"कश्मीरी, كشميري‎"
          },
          "kk":{
            "name":"Kazakh",
            "nativeName":"Қазақ тілі"
          },
          "km":{
            "name":"Khmer",
            "nativeName":"ភាសាខ្មែរ"
          },
          "ki":{
            "name":"Kikuyu, Gikuyu",
            "nativeName":"Gĩkũyũ"
          },
          "rw":{
            "name":"Kinyarwanda",
            "nativeName":"Ikinyarwanda"
          },
          "ky":{
            "name":"Kirghiz, Kyrgyz",
            "nativeName":"кыргыз тили"
          },
          "kv":{
            "name":"Komi",
            "nativeName":"коми кыв"
          },
          "kg":{
            "name":"Kongo",
            "nativeName":"KiKongo"
          },
          "ko":{
            "name":"Korean",
            "nativeName":"한국어 (韓國語), 조선말 (朝鮮語)"
          },
          "ku":{
            "name":"Kurdish",
            "nativeName":"Kurdî, كوردی‎"
          },
          "kj":{
            "name":"Kwanyama, Kuanyama",
            "nativeName":"Kuanyama"
          },
          "la":{
            "name":"Latin",
            "nativeName":"latine, lingua latina"
          },
          "lb":{
            "name":"Luxembourgish, Letzeburgesch",
            "nativeName":"Lëtzebuergesch"
          },
          "lg":{
            "name":"Luganda",
            "nativeName":"Luganda"
          },
          "li":{
            "name":"Limburgish, Limburgan, Limburger",
            "nativeName":"Limburgs"
          },
          "ln":{
            "name":"Lingala",
            "nativeName":"Lingála"
          },
          "lo":{
            "name":"Lao",
            "nativeName":"ພາສາລາວ"
          },
          "lt":{
            "name":"Lithuanian",
            "nativeName":"lietuvių kalba"
          },
          "lu":{
            "name":"Luba-Katanga",
            "nativeName":""
          },
          "lv":{
            "name":"Latvian",
            "nativeName":"latviešu valoda"
          },
          "gv":{
            "name":"Manx",
            "nativeName":"Gaelg, Gailck"
          },
          "mk":{
            "name":"Macedonian",
            "nativeName":"македонски јазик"
          },
          "mg":{
            "name":"Malagasy",
            "nativeName":"Malagasy fiteny"
          },
          "ms":{
            "name":"Malay",
            "nativeName":"bahasa Melayu, بهاس ملايو‎"
          },
          "ml":{
            "name":"Malayalam",
            "nativeName":"മലയാളം"
          },
          "mt":{
            "name":"Maltese",
            "nativeName":"Malti"
          },
          "mi":{
            "name":"Māori",
            "nativeName":"te reo Māori"
          },
          "mr":{
            "name":"Marathi (Marāṭhī)",
            "nativeName":"मराठी"
          },
          "mh":{
            "name":"Marshallese",
            "nativeName":"Kajin M̧ajeļ"
          },
          "mn":{
            "name":"Mongolian",
            "nativeName":"монгол"
          },
          "na":{
            "name":"Nauru",
            "nativeName":"Ekakairũ Naoero"
          },
          "nv":{
            "name":"Navajo, Navaho",
            "nativeName":"Diné bizaad, Dinékʼehǰí"
          },
          "nb":{
            "name":"Norwegian Bokmål",
            "nativeName":"Norsk bokmål"
          },
          "nd":{
            "name":"North Ndebele",
            "nativeName":"isiNdebele"
          },
          "ne":{
            "name":"Nepali",
            "nativeName":"नेपाली"
          },
          "ng":{
            "name":"Ndonga",
            "nativeName":"Owambo"
          },
          "nn":{
            "name":"Norwegian Nynorsk",
            "nativeName":"Norsk nynorsk"
          },
          "no":{
            "name":"Norwegian",
            "nativeName":"Norsk"
          },
          "ii":{
            "name":"Nuosu",
            "nativeName":"ꆈꌠ꒿ Nuosuhxop"
          },
          "nr":{
            "name":"South Ndebele",
            "nativeName":"isiNdebele"
          },
          "oc":{
            "name":"Occitan",
            "nativeName":"Occitan"
          },
          "oj":{
            "name":"Ojibwe, Ojibwa",
            "nativeName":"ᐊᓂᔑᓈᐯᒧᐎᓐ"
          },
          "cu":{
            "name":"Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic",
            "nativeName":"ѩзыкъ словѣньскъ"
          },
          "om":{
            "name":"Oromo",
            "nativeName":"Afaan Oromoo"
          },
          "or":{
            "name":"Oriya",
            "nativeName":"ଓଡ଼ିଆ"
          },
          "os":{
            "name":"Ossetian, Ossetic",
            "nativeName":"ирон æвзаг"
          },
          "pa":{
            "name":"Panjabi, Punjabi",
            "nativeName":"ਪੰਜਾਬੀ, پنجابی‎"
          },
          "pi":{
            "name":"Pāli",
            "nativeName":"पाऴि"
          },
          "fa":{
            "name":"Persian",
            "nativeName":"فارسی"
          },
          "pl":{
            "name":"Polish",
            "nativeName":"polski"
          },
          "ps":{
            "name":"Pashto, Pushto",
            "nativeName":"پښتو"
          },
          "pt":{
            "name":"Portuguese",
            "nativeName":"Português"
          },
          "qu":{
            "name":"Quechua",
            "nativeName":"Runa Simi, Kichwa"
          },
          "rm":{
            "name":"Romansh",
            "nativeName":"rumantsch grischun"
          },
          "rn":{
            "name":"Kirundi",
            "nativeName":"kiRundi"
          },
          "ro":{
            "name":"Romanian, Moldavian, Moldovan",
            "nativeName":"română"
          },
          "ru":{
            "name":"Russian",
            "nativeName":"русский язык"
          },
          "sa":{
            "name":"Sanskrit (Saṁskṛta)",
            "nativeName":"संस्कृतम्"
          },
          "sc":{
            "name":"Sardinian",
            "nativeName":"sardu"
          },
          "sd":{
            "name":"Sindhi",
            "nativeName":"सिन्धी, سنڌي، سندھی‎"
          },
          "se":{
            "name":"Northern Sami",
            "nativeName":"Davvisámegiella"
          },
          "sm":{
            "name":"Samoan",
            "nativeName":"gagana faa Samoa"
          },
          "sg":{
            "name":"Sango",
            "nativeName":"yângâ tî sängö"
          },
          "sr":{
            "name":"Serbian",
            "nativeName":"српски језик"
          },
          "gd":{
            "name":"Scottish Gaelic; Gaelic",
            "nativeName":"Gàidhlig"
          },
          "sn":{
            "name":"Shona",
            "nativeName":"chiShona"
          },
          "si":{
            "name":"Sinhala, Sinhalese",
            "nativeName":"සිංහල"
          },
          "sk":{
            "name":"Slovak",
            "nativeName":"slovenčina"
          },
          "sl":{
            "name":"Slovene",
            "nativeName":"slovenščina"
          },
          "so":{
            "name":"Somali",
            "nativeName":"Soomaaliga, af Soomaali"
          },
          "st":{
            "name":"Southern Sotho",
            "nativeName":"Sesotho"
          },
          "es":{
            "name":"Spanish; Castilian",
            "nativeName":"español, castellano"
          },
          "su":{
            "name":"Sundanese",
            "nativeName":"Basa Sunda"
          },
          "sw":{
            "name":"Swahili",
            "nativeName":"Kiswahili"
          },
          "ss":{
            "name":"Swati",
            "nativeName":"SiSwati"
          },
          "sv":{
            "name":"Swedish",
            "nativeName":"svenska"
          },
          "ta":{
            "name":"Tamil",
            "nativeName":"தமிழ்"
          },
          "te":{
            "name":"Telugu",
            "nativeName":"తెలుగు"
          },
          "tg":{
            "name":"Tajik",
            "nativeName":"тоҷикӣ, toğikī, تاجیکی‎"
          },
          "th":{
            "name":"Thai",
            "nativeName":"ไทย"
          },
          "ti":{
            "name":"Tigrinya",
            "nativeName":"ትግርኛ"
          },
          "bo":{
            "name":"Tibetan Standard, Tibetan, Central",
            "nativeName":"བོད་ཡིག"
          },
          "tk":{
            "name":"Turkmen",
            "nativeName":"Türkmen, Түркмен"
          },
          "tl":{
            "name":"Tagalog",
            "nativeName":"Wikang Tagalog"
          },
          "tn":{
            "name":"Tswana",
            "nativeName":"Setswana"
          },
          "to":{
            "name":"Tonga (Tonga Islands)",
            "nativeName":"faka Tonga"
          },
          "tr":{
            "name":"Turkish",
            "nativeName":"Türkçe"
          },
          "ts":{
            "name":"Tsonga",
            "nativeName":"Xitsonga"
          },
          "tt":{
            "name":"Tatar",
            "nativeName":"татарча, tatarça, تاتارچا‎"
          },
          "tw":{
            "name":"Twi",
            "nativeName":"Twi"
          },
          "ty":{
            "name":"Tahitian",
            "nativeName":"Reo Tahiti"
          },
          "ug":{
            "name":"Uighur, Uyghur",
            "nativeName":"Uyƣurqə, ئۇيغۇرچە‎"
          },
          "uk":{
            "name":"Ukrainian",
            "nativeName":"українська"
          },
          "ur":{
            "name":"Urdu",
            "nativeName":"اردو"
          },
          "uz":{
            "name":"Uzbek",
            "nativeName":"zbek, Ўзбек, أۇزبېك‎"
          },
          "ve":{
            "name":"Venda",
            "nativeName":"Tshivenḓa"
          },
          "vi":{
            "name":"Vietnamese",
            "nativeName":"Tiếng Việt"
          },
          "vo":{
            "name":"Volapük",
            "nativeName":"Volapük"
          },
          "wa":{
            "name":"Walloon",
            "nativeName":"Walon"
          },
          "cy":{
            "name":"Welsh",
            "nativeName":"Cymraeg"
          },
          "wo":{
            "name":"Wolof",
            "nativeName":"Wollof"
          },
          "fy":{
            "name":"Western Frisian",
            "nativeName":"Frysk"
          },
          "xh":{
            "name":"Xhosa",
            "nativeName":"isiXhosa"
          },
          "yi":{
            "name":"Yiddish",
            "nativeName":"ייִדיש"
          },
          "yo":{
            "name":"Yoruba",
            "nativeName":"Yorùbá"
          },
          "za":{
            "name":"Zhuang, Chuang",
            "nativeName":"Saɯ cueŋƅ, Saw cuengh"
          }
        };*/

        // Only keep most common ones
        var isoLangs = {
            "af": {
                "name": "Afrikaans",
                "nativeName": "Afrikaans"
            },
            "ar": {
                "name": "Arabic",
                "nativeName": "العربية"
            },
            "hy": {
                "name": "Armenian",
                "nativeName": "Հայերեն"
            },
            "be": {
                "name": "Belarusian",
                "nativeName": "Беларуская"
            },
            "bg": {
                "name": "Bulgarian",
                "nativeName": "български език"
            },
            "ca": {
                "name": "Catalan",
                "nativeName": "Català"
            },
            "zh": {
                "name": "Chinese",
                "nativeName": "中文 (Zhōngwén), 汉语, 漢語"
            },
            "hr": {
                "name": "Croatian",
                "nativeName": "hrvatski"
            },
            "cs": {
                "name": "Czech",
                "nativeName": "česky, čeština"
            },
            "da": {
                "name": "Danish",
                "nativeName": "dansk"
            },
            "nl": {
                "name": "Dutch",
                "nativeName": "Nederlands, Vlaams"
            },
            "en": {
                "name": "English",
                "nativeName": "English"
            },
            "eo": {
                "name": "Esperanto",
                "nativeName": "Esperanto"
            },
            "et": {
                "name": "Estonian",
                "nativeName": "eesti, eesti keel"
            },
            "tl": {
                "name": "Filipino",
                "nativeName": "Wikang Tagalog"
            },
            "fi": {
                "name": "Finnish",
                "nativeName": "suomi, suomen kieli"
            },
            "fr": {
                "name": "French",
                "nativeName": "français"
            },
            "de": {
                "name": "German",
                "nativeName": "Deutsch"
            },
            "el": {
                "name": "Greek",
                "nativeName": "Ελληνικά"
            },
            "he": {
                "name": "Hebrew (modern)",
                "nativeName": "עברית"
            },
            "hi": {
                "name": "Hindi",
                "nativeName": "हिन्दी, हिंदी"
            },
            "hu": {
                "name": "Hungarian",
                "nativeName": "Magyar"
            },
            "is": {
                "name": "Icelandic",
                "nativeName": "Íslenska"
            },
            "id": {
                "name": "Indonesian",
                "nativeName": "Bahasa Indonesia"
            },
            "it": {
                "name": "Italian",
                "nativeName": "Italiano"
            },
            "ja": {
                "name": "Japanese",
                "nativeName": "日本語 (にほんご／にっぽんご)"
            },
            "ko": {
                "name": "Korean",
                "nativeName": "한국어 (韓國語), 조선말 (朝鮮語)"
            },
            "lv": {
                "name": "Latvian",
                "nativeName": "latviešu valoda"
            },
            "lt": {
                "name": "Lithuanian",
                "nativeName": "lietuvių kalba"
            },
            "no": {
                "name": "Norwegian",
                "nativeName": "Norsk"
            },
            "fa": {
                "name": "Persian",
                "nativeName": "فارسی"
            },
            "pl": {
                "name": "Polish",
                "nativeName": "polski"
            },
            "pt": {
                "name": "Portuguese",
                "nativeName": "Português"
            },
            "ro": {
                "name": "Romanian",
                "nativeName": "română"
            },
            "ru": {
                "name": "Russian",
                "nativeName": "русский язык"
            },
            "sr": {
                "name": "Serbian",
                "nativeName": "српски језик"
            },
            "sk": {
                "name": "Slovak",
                "nativeName": "slovenčina"
            },
            "sl": {
                "name": "Slovenian",
                "nativeName": "slovenščina"
            },
            "es": {
                "name": "Spanish",
                "nativeName": "español, castellano"
            },
            "sw": {
                "name": "Swahili",
                "nativeName": "Kiswahili"
            },
            "sv": {
                "name": "Swedish",
                "nativeName": "svenska"
            },
            "th": {
                "name": "Thai",
                "nativeName": "ไทย"
            },
            "tr": {
                "name": "Turkish",
                "nativeName": "Türkçe"
            },
            "uk": {
                "name": "Ukrainian",
                "nativeName": "українська"
            },
            "vi": {
                "name": "Vietnamese",
                "nativeName": "Tiếng Việt"
            }
        };

        /**
         * Most common codes.
         */
        var commonIsoLangCodes = [
          "af", "ar", "hy", "be", "bg", "ca", "zh", "hr", "cs", "da", "nl", "en", "eo",
          "et", "tl", "fi", "fr", "de", "el", "he", "hi", "hu", "is", "id", "it", "ja",
          "ko", "lv", "lt", "no", "fa", "pl", "pt", "ro", "ru", "sr", "sk", "sl",
          "es", "sw", "sv", "th", "tr", "uk", "vi"
        ];

        /**
         * Returns the JSON Form object that describes a language select field
         * based on the given information
         *
         * @param {String} key The name of the schema key (dotted notation possible)
         *  linked to the select field. The key will receive the ISO 639.1 value of
         *  the selected language upon form submission.
         * @param {String} title The title of the field in the form
         * @param {Boolean} all Whether to add an "Any" choice to the list of
         *  languages (defaults to true). The schema key is set to "" when the
         *  "Any" choice is selected.
         * @param {Array} include A list of language codes to include
         *  (defaults to a list of "common" languages)
         * @returns {Object} A JSON Form description that generates the appropriate
         *  select field. The object should be set in the JSON Form "form" section
         *  of the form.
         */
        var getLangField = function (key, title, all, include) {
            key = key || "language";
            title = title || "Language";
            if (all !== false) all = true;
            include = include || commonIsoLangCodes;

            var enumeration = [];
            var length = include.length;
            var code;
            var lang;

            if (all) {
                enumeration.push({
                    "title": "All",
                    "value": ""
                });
            }

            for (var i = 0; i < length; i++) {
                code = include[i];

                if (isoLangs.hasOwnProperty(code)) {
                    lang = isoLangs[code];
                    enumeration.push({
                        "title": lang.name + " (" + lang.nativeName + ")",
                        "value": code
                    });
                }
            }

            return {
                "key": key,
                "title": title,
                "type": "select",
                "options": enumeration
            };
        };

        return {
            getLangField: getLangField
        };
    });

    define('databases/twitter/tweets', [
      'datajslib!underscore',
      'datajslib!http',
      'datajslib!iso8601',
      'datajslib!jsonform-langfield'
    ], function (_, http, iso8601, langfield) {

        var reAvatarUrl = /_normal\.(jpg|JPG|png|PNG|jpeg|JPEG|gif|GIF)$/;

        return {
            /**
             * Description of the datasource for the factory
             */
            desc: {
                "options": {
                    "schema": {
                        "user": {
                            "type": "string",
                            "title": "Username"
                        },
                        "search": {
                            "type": "string",
                            "title": "Search text"
                        },
                        "excluderetweets": {
                            "title": "Exclude retweets",
                            "type": "boolean"
                        },
                        "excludereplies": {
                            "title": "Exclude replies",
                            "type": "boolean"
                        },
                        "language": {
                            "type": "string",
                            "title": "Restrict language"
                        }
                    },
                    "form": [
                      {
                          "type": "selectfieldset",
                          "title": "Search by",
                          "items": [
                            {
                                "type": "optionfieldset",
                                "legend": "Text",
                                "items": [
                                  "search",
                                  langfield.getLangField('language', 'Restrict language')
                                ]
                            },
                            {
                                "type": "optionfieldset",
                                "legend": "Username",
                                "items": [
                                  "user"
                                ]
                            }
                          ]
                      },
                      {
                          "key": "excluderetweets",
                          "inlinetitle": "Exclude retweets",
                          "type": "checkbox",
                          "notitle": true
                      },
                      {
                          "key": "excludereplies",
                          "inlinetitle": "Exclude replies",
                          "type": "checkbox",
                          "notitle": true
                      }
                    ]
                },
                "runtimes": ["browser", "nodejs", "win8"], //Because twitter has IP-based API limits
                "outputType": "Article/Status"
            },


            /**
             * Fetches feed items from the source provider.
             * @function
             * @param {Object} query Query parameters. Must define a 'filter' property
             *   with a 'url' property that contains the absolute URL to the page.
             * @param {function(Object, Object)} callback Callback function.
             *   Returns a text.
             */
            fetch: function (query, callback) {
                // See https://dev.twitter.com/
                var filter = (query && query.filter) ? query.filter : {};
                var finalqs = {};
                var apiUrl, cntParamName, cntMax;

                var apiQuery = function (url, qs, cb) {
                    http.request({
                        'url': url,
                        'data': qs,
                        'dataType': 'jsonp'
                    }, function (err, data) {
                        if (err || !data) return cb(err || "empty data");
                        if (typeof data[0] == "string") return cb(data[0]); // Usually, rate limit exceeded. TODO what format w/ search queries?
                        return cb(null, data);
                    });
                };

                if (!query.limit) query.limit = 20;
                if (!query.skip) query.skip = 0;

                //This could be optimized by making simple queries (without metadata and all)
                var totalToFetch = query.limit + query.skip;

                var fetchedItems = [];

                if (filter.search) {
                    apiUrl = 'https://search.twitter.com/search.json';
                    cntParamName = "rpp";
                    cntMax = 100;

                    //page:Math.floor(((query.skip||0)/(query.limit||20))+1) });

                    finalqs = {
                        q: filter.search,
                        include_entities: "1"
                    };

                    if (filter.language) {
                        finalqs.lang = filter.language;
                    }

                } else if (filter.user) {
                    apiUrl = 'https://api.twitter.com/1/statuses/user_timeline.json';
                    cntParamName = "count";
                    cntMax = 200;

                    finalqs = {
                        screen_name: filter.user,
                        include_entities: "1",
                        include_rts: (filter.excluderetweets ? "0" : "1"),
                        exclude_replies: (filter.excludereplies ? "1" : "0")
                    };
                } else {
                    callback(null, { "entries": [] });
                    return;
                }

                var fetchMore = function (max_id, stillToFetch, cb) {
                    var qs = _.clone(finalqs);
                    qs[cntParamName] = Math.max(2, Math.min(cntMax, stillToFetch));
                    if (max_id) {
                        qs.max_id = max_id;
                    }
                    apiQuery(apiUrl, qs, function (err, data) {
                        if (err) return cb(err, fetchedItems);
                        if (data && typeof data.error == "string") return cb(data.error, fetchedItems);
                        if (data.results) data = data.results;

                        //Twitter's max_id is >= but it should be >.
                        if (max_id && data.length > 0) data = data.slice(1);
                        fetchedItems = fetchedItems.concat(data);

                        if (data.length < stillToFetch && data.length > 0) {
                            //console.log("need to fetch ",stillToFetch-data.length,"more");
                            fetchMore(fetchedItems[fetchedItems.length - 1].id_str, stillToFetch - data.length, cb);
                        } else {
                            cb(null);
                        }
                    });

                };

                fetchMore(false, totalToFetch, function (err) {
                    return callback(err, { "entries": fetchedItems.slice(query.skip, query.skip + query.limit) });
                });

            },


            /**
             * Normalizes the data received from the source provider.
             * @function
             * @param {Object} data The data that was received
             *(typically the object given to the callback method at the end of a "fetch")
             * @param {Object} query Query parameters (which could include filtering options)
             * @param {function(Object, Object)} callback Callback function.
             *   The second argument of the callback is an object with an "entries" property
             *   that contains the list of items normalized according to the schema.org hierarchy.
             */
            process: function (data, query, callback) {
                var filter = (query && query.filter) ? query.filter : {};

                // Helper function that extracts the first image from
                // the list of entities returned by Twitter
                var findImage = function (el) {
                    if (el.entities && el.entities.media) {
                        //look for the first photo
                        for (var y = 0, m = null; y < el.entities.media.length; y++) {
                            m = el.entities.media[y];
                            if (m.type == "photo") {
                                return m.media_url;
                            }
                        }
                        //TODO we discard other metadata?
                    }
                    return false;
                };

                /**
                 * Returns the avatar image object of a Twitter user, replacing
                 * the image sent by Twitter by default (48x48) by a bigger version
                 * (73x73).
                 * There is no long-term guarantee that this "hack" will work, the
                 * right way to do it would be to issue the right API call with
                 * a "size=bigger" parameter:
                 *  https://dev.twitter.com/docs/api/1/get/users/profile_image/:screen_name
                 * Note that the "_reasonably_small" suffix seems to work and return
                 * a 128x128 but dates back from an older version of Twitter, so
                 * probably safer to avoid it.
                 * The original image is also available, but there's no way to tell
                 * its dimensions.
                 * @function
                 * @param {string} url URL of the avatar image returned by Twitter
                 * @returns
                 */
                var getAuthorImage = function (url) {
                    if (!url) {
                        return null;
                    }
                    return {
                        "@type": "ImageObject",
                        "itemType": "ImageObject",
                        "contentURL": url.replace(reAvatarUrl, "_bigger.$1"),
                        "width": 73,
                        "height": 73
                    };
                };

                // Helper function that returns the contentLocation property of the tweet
                // if possible. The position is approximative if a place is given.
                var getContentLocation = function (el) {
                    var geo = null;
                    var place = null;
                    var sum = null;

                    geo = el.geo || el.coordinates;
                    if (!geo && !el.place) {
                        // No location defined
                        return null;
                    }

                    place = {
                        '@type': 'Place',
                        'itemType': 'Place'
                    };

                    if (el.place) {
                        place.name = el.place.name;
                        place.url = el.place.url;
                    }

                    if (geo && (geo.type === 'Point') && geo.coordinates) {
                        place.geo = {
                            '@type': 'GeoCoordinates',
                            'itemType': 'GeoCoordinates',
                            'latitude': geo.coordinates[0],
                            'longitude': geo.coordinates[1]
                        };
                    }
                    else if (el.place && el.place.bounding_box && el.place.bounding_box &&
                      (el.place.bounding_box.type === 'Polygon') &&
                      el.place.bounding_box.coordinates &&
                      el.place.bounding_box.coordinates[0] &&
                      (el.place.bounding_box.coordinates[0].length > 0)) {
                        // Approximate the position as the 'center' of the first bounding box
                        sum = _.reduce(el.place.bounding_box.coordinates[0], function (memo, item) {
                            return [
                              memo[0] + item[0],
                              memo[1] + item[1]
                            ];
                        }, [0, 0]);
                        place.geo = {
                            '@type': 'GeoCoordinates',
                            'itemType': 'GeoCoordinates',
                            'latitude': sum[0] / el.place.bounding_box.coordinates[0].length,
                            'longitude': sum[1] / el.place.bounding_box.coordinates[0].length
                        };
                    }

                    return place;
                };

                var apiType = 'default';
                if (filter.search) {
                    apiType = 'search';
                }
                var i, l, el, e;
                if (apiType == 'default') {
                    for (i = 0, l = data.entries.length; i < l; i++) {
                        el = data.entries[i];

                        data.entries[i] = {
                            '@type': 'Article/Status',
                            'itemType': 'Article/Status',
                            'url': 'http://twitter.com/' + el.user.screen_name + '/status/' + el.id,
                            'publisher': {
                                '@type': 'Organization',
                                'itemType': 'Organization',
                                'url': 'http://twitter.com/',
                                'name': 'Twitter'
                            },
                            'author': [ // TODO: twitter returns much more information about the user
                              {
                                  '@type': 'Person',
                                  'itemType': 'Person',
                                  'url': 'http://twitter.com/' + el.user.screen_name,
                                  'name': el.user.name,
                                  'foaf:nick': el.user.screen_name,
                                  'image': getAuthorImage(el.user.profile_image_url)
                              }
                            ],
                            // twitter dates are RFC822 dates, e.g. "Mon Jun 27 19:32:19 2011 +0000"
                            'datePublished': iso8601.fromString(el.created_at),
                            'name': el.text,
                            'contentLocation': getContentLocation(el)
                        };

                        if (findImage(el)) {
                            data.entries[i].image = {
                                '@type': 'ImageObject',
                                'itemType': 'ImageObject',
                                'contentURL': findImage(el)
                            };
                        }
                    }
                }
                else {
                    var finalData = [];
                    for (i = 0, l = data.entries.length, e = null, el = null; i < l; i++) {
                        el = data.entries[i];

                        if (filter.excludereplies && el.to_user_id) {
                            continue;
                        }
                        if (filter.excluderetweets && el.text.substring(0, 4) == "RT @") {
                            continue;
                        }

                        e = {
                            '@type': 'Article/Status',
                            'itemType': 'Article/Status',
                            'url': 'http://twitter.com/' + el.from_user + '/status/' + el.id,
                            'publisher': {
                                '@type': 'Organization',
                                'itemType': 'Organization',
                                'url': 'http://twitter.com/',
                                'name': 'Twitter'
                            },
                            'author': [
                              {
                                  '@type': 'Person',
                                  'itemType': 'Person',
                                  'url': 'http://twitter.com/' + el.from_user,
                                  'name': el.from_user_name,
                                  'foaf:nick': el.from_user,
                                  'image': getAuthorImage(el.profile_image_url)
                              }
                            ],
                            'datePublished': iso8601.fromString(el.created_at),
                            'name': el.text,
                            'contentLocation': getContentLocation(el)
                        };

                        if (findImage(el)) {
                            e.image = {
                                '@type': 'ImageObject',
                                'itemType': 'ImageObject',
                                'contentURL': findImage(el)
                            };
                        }
                        finalData.push(e);
                    }
                    data.entries = finalData;
                }

                if (filter.user && apiType == "search") {
                    data.entries = _.select(data, function (el) {
                        if (el.author && el.author["foaf:nick"] && (el.author["foaf:nick"] === filter.user)) {
                            return true;
                        }
                    });
                }

                callback(null, data);
                return;
            },


            /**
             * Fetches and normalizes the data.
             * @function
             * @param {Object} query Query parameters. Feed specific object.
             * @param {function(Object, Object)} callback Callback function.
             *   receives the error or the normalized feed.
             */
            find: function (query, callback) {
                // Implementation note: same code as example/news
                var self = this;
                self.fetch(query, function (err, data) {
                    if (err) {
                        return callback(err, null);
                    }
                    else {
                        self.process(data, query, function (err, convertedData) {
                            return callback(err, convertedData);
                        });
                    }
                });
            }
        };
    });

    define('databases/youtube/lib/api', ['datajslib!http'], function (http) {

        var api = {};

        // Options: handle mongo's like options

        api.options = function (query) {
            var ret = {};
            if (query.skip) ret["start-index"] = query.skip + 1;
            if (query.limit) ret['max-results'] = query.limit;

            return ret;
        };


        // Generate final URL
        api.generateUrl = function (url, params) {
            for (var param in params) {
                var newUrl = url.replace(new RegExp(':' + param),
                  encodeURIComponent(params[param]));
                if (newUrl !== url) {
                    url = newUrl;
                }
                else {
                    url += ((url.indexOf('?') === -1) ? '?' : '&') +
                      param + (params[param] ? ('=' + encodeURIComponent(params[param])) : '');
                }
            }
            return url;
        };


        // Call API
        api.request = function (url, cb) {
            var baseUrl = 'http://gdata.youtube.com/feeds/api/';

            // We add default parameter
            url = baseUrl + api.generateUrl(url, { alt: 'json-in-script', v: 2 });

            // console.log("url",url);
            http.request({
                'url': url,
                'dataType': 'jsonp'
            }, cb);
        };


        // Export --------------------------------------------------------------------

        return api;

    });

    /**
     * @fileoverview Youtube video to schema.org VideoObject converter function
     *
     * Youtube response format description:
     * https://developers.google.com/youtube/2.0/reference#youtube_data_api_tag_entry
     *
     * Youtube video example:
     * https://gdata.youtube.com/feeds/api/videos/yLsr-P2pmxY?v=2&alt=json
     */

    define('databases/youtube/lib/convert', [
      'datajslib!underscore',
      'datajslib!iso8601'
    ], function (_, iso8601) {

        /**
         * Regular expression used to extract the ID of a Youtube video from
         * its media$content URL
         */
        var reVideoUrl = /^https?:\/\/(www\.)?youtube\.com\/v\/([a-z0-9_\-]+).*$/i;

        /**
         * Regular expression used to extract the inner ID of a Youtube video
         * from its "id" property
         */
        var reVideoId = /^tag:youtube.com.*:video:(.*)$/;

        /**
         * Converts an incoming Youtube video object to a schema.org compatible
         * VideoObject.
         *
         * @function
         * @param {Object} video Youtube video object
         * @return {Object} A VideoObject video or null if the video parameter
         *  was null
         */
        var convert = function convert(video) {
            var match = null;
            var videoId = null;
            var res = {
                '@type': 'VideoObject',
                'itemType': 'VideoObject',
                'publisher': {
                    '@type': 'Organization',
                    'itemType': 'Organization',
                    'url': 'http://www.youtube.com',
                    'name': 'Youtube'
                }
            };
            var duration = 0;

            if (!video) return null;

            // Extract the unique URL of the video
            if (video.link && video.link[0] && video.link[0].href) {
                // Note we remove extra parameters from the URL such as
                // "&feature=youtube_gdata"
                res.url = video.link[0].href.replace(/\&.*$/, '');
            }

            // Set the video title
            if (video.title && video.title.$t) {
                res.name = video.title.$t;
            }

            // Extract the ID of the video
            // (Note the ID is only extracted from the "id" property when the right
            // media$content property is not present. Both IDs should match.
            if (video.media$group &&
              video.media$group.media$content &&
              video.media$group.media$content[0] &&
              video.media$group.media$content[0].url) {
                match = video.media$group.media$content[0].url.match(reVideoUrl);
                if (match) {
                    videoId = match[2];
                }
            }
            if (!videoId && video.id && video.id.$t) {
                match = video.id.$t.match(reVideoId);
                if (match) {
                    videoId = match[1];
                }
            }

            if (videoId) {
                res.playerType = 'iframe';
                res.embedURL = 'http://www.youtube-nocookie.com/embed/' +
                  videoId + '?rel=0';
            }

            if (video.media$group &&
              video.media$group.media$description &&
              video.media$group.media$description.$t) {
                res.description = video.media$group.media$description.$t;
            }

            if (video.media$group &&
              video.media$group.media$category &&
              video.media$group.media$category.$t) {
                res.genre = video.media$group.media$category.$t;
            }

            if (video.published && video.published.$t) {
                res.datePublished = video.published.$t;
            }
            else if (video.media$group &&
              video.media$group.yt$uploaded &&
              video.media$group.yt$uploaded.$t) {
                res.datePublished = video.media$group.yt$uploaded.$t;
            }

            if (video.media$group &&
              video.media$group.yt$uploaded &&
              video.media$group.yt$uploaded.$t) {
                res.uploadDate = video.media$group.yt$uploaded.$t;
            }

            if (video.media$group &&
              video.media$group.yt$duration &&
              video.media$group.yt$duration.seconds) {
                duration = Number(video.media$group.yt$duration.seconds) * 1000;
                res.duration = iso8601.fromDuration(duration);
            }

            // Other possibilities: keywords, license when defined in schema.org.
            // Add ",'meta': vid" to the above code snipped to view all the information returned by Youtube
            // Note that video.updated always returns the current date which is not particularly useful, discarded here.

            // Complete the list of authors
            if (video.author) {
                res.author = [];
                for (var k = 0, kl = video.author.length; k < kl; k++) {
                    if (video.author[k].uri &&
                      video.author[k].uri.$t &&
                      video.author[k].name &&
                      video.author[k].name.$t) {
                        res.author.push({
                            '@type': 'Person',
                            'itemType': 'Person',
                            'url': video.author[k].uri.$t,
                            'name': video.author[k].name.$t
                        });
                    }
                }
            }

            // Complete the list of thumbnails
            if (video.media$group && video.media$group.media$thumbnail) {
                res.thumbnail = [];
                for (var k2 = 0, kl2 = video.media$group.media$thumbnail.length; k2 < kl2; k2++) {
                    var thumbnail = video.media$group.media$thumbnail[k2];
                    if (thumbnail &&
                      thumbnail.url &&
                      thumbnail.yt$name) {
                        res.thumbnail.push({
                            '@type': 'ImageObject',
                            'itemType': 'ImageObject',
                            'url': thumbnail.url,
                            'name': thumbnail.yt$name,
                            'contentURL': thumbnail.url,
                            'width': thumbnail.width,
                            'height': thumbnail.height
                        });
                    }
                }
                if (res.thumbnail[0]) {
                    res.image = _.clone(res.thumbnail[0]);
                }
            }

            // Location
            if (video.georss$where &&
              video.georss$where.gml$Point &&
              video.georss$where.gml$Point.gml$pos &&
              video.georss$where.gml$Point.gml$pos.$t) {
                point = video.georss$where.gml$Point.gml$pos.$t.split(' ');
                if (point.length === 2) {
                    res.contentLocation = {
                        '@type': 'Place',
                        'itemType': 'Place',
                        'geo': {
                            '@type': 'GeoCoordinates',
                            'itemType': 'GeoCoordinates',
                            'latitude': parseFloat(point[0], 10),
                            'longitude': parseFloat(point[1], 10)
                        }
                    };
                }
            }
            if (video.yt$location && video.yt$location.$t) {
                if (!res.contentLocation) {
                    res.contentLocation = {
                        '@type': 'Place',
                        'itemType': 'Place'
                    };
                }
                res.contentLocation.name = video.yt$location.$t;
            }

            // Aspect ratio
            // (remains in Youtube namespace since not a standard property)
            if (video.media$group &&
              video.media$group.yt$aspectRatio &&
              video.media$group.yt$aspectRatio.$t) {
                res['yt:aspectRatio'] = video.media$group.yt$aspectRatio.$t;
            }

            return res;
        };

        // Export the "convert" function
        return convert;
    });
    define('databases/youtube/videos', [
      './lib/api',
      './lib/convert',
      'datajslib!underscore',
      'datajslib!iso8601'
    ], function (api, convert, _, iso8601) {

        return {
            /**
             * Description of the datasource for the factory
             */
            desc: {
                "options": {
                    "schema": {
                        "playlist": {
                            "type": "string",
                            "title": "Playlist URL",
                            "description": "You may also enter the ID of the playlist"
                        },
                        "search": {
                            "type": "string",
                            "title": "Search text",
                            "description": "Keep in mind that the list of videos featured in the final app will be the results of the search when the app is run. Consider using playlists if you need more consistent results."
                        },
                        "feed": {
                            "type": "string",
                            "title": "Feed",
                            "enum": [
                              "",
                              "top_rated",
                              "most_viewed",
                              "most_shared",
                              "most_popular",
                              "most_recent",
                              "most_discussed",
                              "most_responded",
                              "recently_featured",
                              "on_the_web"
                            ]
                        },
                        "user": {
                            "type": "string",
                            "title": "Username",
                            "description": "Filter results by username"
                        }
                    },
                    "form": [
                      {
                          "type": "selectfieldset",
                          "title": "Search by",
                          "items": [
                            {
                                "type": "optionfieldset",
                                "legend": "Text",
                                "items": [
                                  "search"
                                ]
                            },
                            {
                                "type": "optionfieldset",
                                "legend": "Playlist",
                                "items": [
                                  "playlist"
                                ]
                            },
                            {
                                "type": "optionfieldset",
                                "legend": "Username",
                                "items": [
                                  "user"
                                ]
                            },
                            {
                                "type": "optionfieldset",
                                "legend": "Feed",
                                "items": [
                                  "feed"
                                ]
                            }
                          ]
                      }
                    ]
                },
                "runtimes": ["browser", "nodejs", "win8"],
                "outputType": "VideoObject"
            },


            /**
             * Fetches feed items from the source provider.
             * @function
             * @param {Object} query Query parameters. Must define a 'filter' property
             *   with a 'url' property that contains the absolute URL to the page.
             * @param {function(Object, Object)} callback Callback function.
             *   Returns a text.
             */
            fetch: function (query, callback) {
                // See Youtube API at http://code.google.com/apis/youtube/2.0/reference.html
                var filter = (query && query.filter) ? query.filter : {};
                var validFeed = this.desc.options.schema.feed["enum"];
                var url = null;

                if (filter.search) {
                    url = 'videos';
                    filter = _.extend({ q: encodeURI(filter.search) }, filter.user ? { author: filter.user } : {});
                }
                else if (filter.feed) {
                    url = 'standardfeeds/:feed';
                    if (_.indexOf(validFeed, filter.feed) == -1) return callback('Invalid feed type "' + filter.feed + '".');
                    filter = _.extend({ feed: filter.feed }, filter.user ? { author: filter.user } : {});
                }
                else if (filter.playlist) {
                    url = 'playlists/:playlist';

                    /* Playlist should be 16-char String
                      Clean up user input : often PL{playlistId} or http://youtube.com/xxxxx
                      */
                    //console.warn('playlist ?','input', filter.playlist);
                    if (filter.playlist.length > 16) {
                        //full url ?
                        var matches = filter.playlist.match(/http(s?):\/\/(www\.?)(youtube\.com\/playlist\?).*(list=)([A-Z0-9_-]*)/i);
                        if (matches && matches.length) {
                            filter.playlist = matches.pop();
                        }
                        if (filter.playlist.length > 16) {
                            //strip heading PL ... and any further arguments
                            filter.playlist = filter.playlist.replace(/^PL([a-z0-9_-]+).*$/i, '$1');
                        }
                        // console.warn('playlist !','output', filter.playlist);
                    }

                    filter = _.extend({ playlist: filter.playlist }, filter.user ? { author: filter.user } : {});
                }
                else if (filter.user) {
                    url = 'users/:user/uploads';
                }
                else { // if nothing was specified
                    return callback(null, null);
                }
                // use url = 'videos'; to display most popular videos

                url = api.generateUrl(url, _.extend({}, filter, api.options(query)));

                api.request(url, function (err, data) {
                    return callback(err, data);
                });
            },

            /**
             * Normalizes the data received from the source provider.
             * @function
             * @param {Object} data The data that was received
             *(typically the object given to the callback method at the end of a "fetch")
             * @param {Object} query Query parameters (which could include filtering options)
             * @param {function(Object, Object)} callback Callback function.
             *   The second argument of the callback is an object with an "entries" property
             *   that contains the list of items normalized according to the schema.org hierarchy.
             */
            process: function (data, query, callback) {
                if (!data || !data.feed || !data.feed.entry) {
                    return callback(null, { entries: [] });
                }

                var videos = data.feed.entry;
                for (var i = 0, l = videos.length; i < l; i++) {
                    videos[i] = convert(videos[i]);
                }

                callback(null, { entries: videos });
            },


            /**
             * Fetches and normalizes the data.
             * @function
             * @param {Object} query Query parameters. Feed specific object.
             * @param {function(Object, Object)} callback Callback function.
             *   receives the error or the normalized feed.
             */
            find: function (query, callback) {
                // Implementation note: same code as example/news
                var self = this;
                self.fetch(query, function (err, data) {
                    if (err) {
                        return callback(err, null);
                    }
                    else {
                        self.process(data, query, function (err, convertedData) {
                            return callback(err, convertedData);
                        });
                    }
                });
            }
        };
    });
    ;
    ;
    define("addons/splashscreen/loaded", [], function () { return function (a) { return { generate: function (a, b) { try { var c = document.getElementsByClassName("_joshfire_factory_splashscreen"); c && c.length && (c[0].style.opacity = "0", setTimeout(function () { c[0].style.display = "none" }, 700)) } catch (d) { } b() } } } })
    ; (function (a, b) { var c = function (c) { var d = null, e = null, f = 0; return !c || !a || !a.config || !a.config.datasources || !a.config.datasources[c] ? null : (d = a.config.datasources[c], b(["datajslib!collection"], function (a) { if (Object.prototype.toString.call(d) == "[object Array]") { e = { children: [], find: function (a, b) { var c = d.length, f = !1, g = [], h = 0, i = function (a, d) { c -= 1; if (f) return; a && (f = !0), d && g.push(d); if (a || c === 0) return b(a, { entries: g }) }; for (h = 0; h < e.children.length; h++) e.children[h].find(a, i) } }; for (f = 0; f < d.length; f++) e.children[f] = a.getCollection(d[f]), e.children[f].name = d[f].name, e.children[f].config = d[f] } else e = a.getCollection(d), e.name = d.name, e.config = d }, null, !0), e) }; a.getDataSource = c })(window.Joshfire.factory, require);
    (function (a, b) { var c = function (a) { return a = a || document.getElementById("body") || document.documentElement, Object.prototype.toString.call(a) === "[object String]" ? document.querySelector ? document.querySelector(a) : document.getElementById(a) : a }, d = function (b) { var d = [], f = null, g, h, i = []; if (!b) return []; d = a.config.addons || []; for (g = 0; g < d.length; g++) { f = d[g]; for (h = 0; h < f.hooks.length; h++) if (b === f.hooks[h]) { i.push(new e(f, b)); break } } return i.run = i.render = function (a, b, d) { var e = 0, f = c(a), g = null; d = d || function () { return }; var h = 0, j = function (a) { a && (g = a), h += 1; if (h === i.length) return d(g) }; b = b || {}, b.replaceContent && delete b.replaceContent; for (e = 0; e < i.length; e++) i[e].render(f, b, j) }, i.startActivity = function (a, b, c) { a = a || {}, b = b || function () { return }, c = c || function () { return }; if (i.length > 0) i[0].startActivity(a, b, c); else if (c) return c("No installed add-on for the given intent") }, i }, e = function (a, d) { var e = this, f = !1, g = [], h = function (a) { f ? a() : g.push(a) }; this.config = a, this.intent = a.intent, this.run = this.render = function (a, b, d) { b = b || {}, d = d || function () { return }, h(function () { if (!e.addon) return d("Add-on not available"); if (!e.addon.generate) return d("Invalid add-on, no generate function"); var f = c(a), g = f; e.addon.generate(b, function (a, c) { return a ? d(a) : (c ? (b.replaceContent ? e.setContent(g, c) : (g = document.createElement("div"), e.setContent(g, c), f.appendChild(g)), e.addon.enhance && e.addon.enhance(g, b)) : b.replaceContent && e.setContent(g, ""), d()) }) }) }, this.generate = function (a, b) { a = a || {}, b = b || function () { return }, h(function () { if (!e.addon) return b("Add-on not available"); if (!e.addon.generate) return b("Invalid add-on, no generate function"); e.addon.generate(a, b) }) }, this.setContent = function (a, b) { function e(a, b) { b(a); for (var c in a.childNodes) e(a.childNodes[c], b) } function f(a, b) { return a.nodeName && a.nodeName.toUpperCase() === b.toUpperCase() } function g(a) { var b = a.text || a.textContent || a.innerHTML || "", c = a.getAttribute("src"), d = document.getElementsByTagName("head")[0] || document.documentElement, e = document.createElement("script"); e.type = "text/javascript", c && e.setAttribute("src", c), b && e.appendChild(document.createTextNode(b)), d.insertBefore(e, d.firstChild), a.parentNode && a.parentNode.removeChild(a) } var d = c(a); d.innerHTML = ("" + b).trim(); var h = [], i = null; e(d, function (a) { a.nodeName && a.nodeName.toUpperCase() === "SCRIPT" && (!a.type || a.type === "text/javascript") && h.push(a) }); for (i in h) g(h[i]) }, this.enhance = function (a, b) { b = b || {}; if (!this.addon) return; if (!this.addon.enhance) return; var d = c(a); this.addon.enhance(d, b) }, this.startActivity = function (a, b, c) { a = a || {}, b = b || function () { return }, c = c || function () { return }, h(function () { if (!e.addon) return c("Add-on not available"); if (!e.addon.startActivity) return c("Add-on does not implement a startActivity function"); e.addon.startActivity(a, b, c) }) }, b(["addons/" + this.config.name + "/" + d], function (a) { e.addon = a({ options: e.config.options || {}, deploy: Joshfire.factory.config.deploy }), f = !0; for (var b = 0, c = g.length; b < c; b++) g.pop()() }) }; a.getAddOns = d })(window.Joshfire.factory, require);
})();