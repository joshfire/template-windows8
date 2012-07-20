(function () {
    /* This bootstrap script is documented at http://developer.joshfire.com/ */
    var Joshfire = window.Joshfire || {};
    Joshfire.factory = {
        globalConfig: { "DATAVERSION": "1", "DATAHOSTPORT": "api.datajs.com", "STATSHOSTPORT": "localhost:40023", "HOSTPORT": "localhost:40021" },
        config: { "app": { "id": "5007c853a4b04a5d180000da", "icon": null, "logo": { "height": 117, "width": 364, "encodingFormat": "png", "contentSize": 15841, "contentURL": "http://static.platform.joshfire.com.s3.amazonaws.com/8a/6ece155a4d60f5c7105e48994a8a16/Screen-shot-2012-06-25-at-6.38.31-PM.png", "itemType": "ImageObject", "name": "Screen shot 2012-06-25 at 6.38.31 PM.png", "url": "/transloadit/8a6ece155a4d60f5c7105e48994a8a16" }, "name": "TedxParis Windows 8", "version": "1.0" }, "template": { "id": "4ff2b3b2b04f076cff000192", "name": "sleek", "version": "1.1.18", "options": { "theme": "dark", "color": "gray", "tabs": ["Feed", "Flickr", "Youtube"] } } },
        device: { "type": "phone" },
        plugins: {}
    };
    Joshfire.factory.config.deploy = { "env": "dev", "type": "local", "id": "" };
    Joshfire.factory.config.datasources = { "main": [{ "name": "Feed", "db": "feed", "col": "rss", "query": { "filter": { "url": "blog.steren.fr" } }, "runatclient": false, "missingKeys": [], "outputType": "BlogPosting", "runtime": "hosted" }, { "name": "Flickr", "db": "flickr", "col": "photos", "query": { "filter": { "search": "joshfire" } }, "missingKeys": ["api_key"], "outputType": "ImageObject", "runtime": "win8" }, { "name": "Youtube", "db": "youtube", "col": "videos", "query": { "filter": { "search": "joshfire" } }, "missingKeys": [], "outputType": "VideoObject", "runtime": "win8" }] };
    window.Joshfire = Joshfire;

})();
(function () {
    (function (a) { a.factory.deviceReady = !1; var b = []; a.factory.onDeviceReady = function (c) { if (a.factory.deviceReady) return c(); b.push(c) }; var c = function (a) { if (typeof PhoneGap != "undefined") document.addEventListener("deviceready", a, !1); else if (window.addEventListener) window.addEventListener("load", a, !1); else if (document.addEventListener) document.addEventListener("load", a, !1); else if (window.attachEvent) window.attachEvent("onload", a); else if (typeof window.onload != "function") window.onload = a; else { var b = window.onload; window.onload = function () { b(), a() } } }; c(function () { a.factory.deviceReady = !0; for (var c = 0, d = b.length; c < d; c++) b.pop()() }, !1) })(Joshfire);
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

                // Setting callback parameter when JSONP requested,
                // using user-defined parameters or default conventions
                // (the hash mimics the one generated in jQuery)
                if (params.dataType === 'jsonp') {
                    var jsonp = params.jsonp || "callback";
                    var jsonCallback = params.jsonCallback ||
                      "datajslib_" + (Math.random().toString()).replace(/\D/g, "") + (callbackSeed++);
                    params.url += (/\?/.test(params.url) ? "&" : "?") + jsonp + "=" + jsonCallback;
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
    /*
     * @fileoverview Collection factory that creates the appropriate collection
     * object to request the data server to run the given datasource.
     *
     * This version use the http library, instead of re-defining the JSONP function.
     */

    define('runtime-win8/collection.proxy', ["datajslib!http"], function (http) {
        // TODO: find some way to get that information differently,
        // as this code must not rely on a Factory context!
        var globalConfig = Joshfire.factory.globalConfig;
        var config = Joshfire.factory.config;

        /**
         * Copies all of the properties in the source objects over to the destination
         * object. It's in-order, so the last source will override properties of the
         * same name in previous arguments.
         * Same code as Underscore.js extend function
         * @see http://documentcloud.github.com/underscore/#extend
         */
        var _extend = function (obj1, obj2) {
            for (var key in obj2) {
                if (obj2.hasOwnProperty(key)) {
                    obj1[key] = obj2[key];
                }
            }
            return obj1;
        };

        /**
         * Datasource collection object that exposes a 'find' method to retrieve
         * feed items from the data proxy.
         *
         * @class
         * @param {String} db The datasource provider
         * @param {String} colname The collection in the provider's catalog
         * @param {Object} options Common query options (e.g. filtering options)
         * @returns {Collection} The collection that matches the given parameter.
         */
        var collection = function (datasource) {
            var options = datasource.query || {};
            var db = datasource.db;
            var colname = datasource.col;

            /**
             * Sends a request to the data proxy to fetch collection feed items
             * @function
             * @param {Object} query Query parameters (search field, query filters...)
             * @param {function} callback Callback method that receives a potential
             *  error and the list of data entries as an object. The returned object
             *  includes an 'entries' property that contains the list of items.
             */
            this.find = function (query, callback) {
                var self = this,
                  finalQuery = {},
                  uri = null;

                // Clone default options
                _extend(finalQuery, options);
                _extend(finalQuery, query);

                // Add API key
                finalQuery.apikey = config.app.id;

                // TODO: json2.js for maximum compatibility?
                if (finalQuery.filter) {
                    finalQuery.filter = JSON.stringify(finalQuery.filter);
                }

                uri = 'http://' + globalConfig.DATAHOSTPORT +
                  '/api/' + globalConfig.DATAVERSION +
                  '/' + db + '/' + colname + '?flag=0';

                // do we really need to do this ?
                for (var k in finalQuery) {
                    if (typeof finalQuery[k] == 'Object')
                        finalQuery[k] = JSON.stringify(finalQuery[k]);
                    uri += '&' + k + '=' + encodeURIComponent(finalQuery[k]);
                }

                http.request({ type: 'GET', dataType: 'jsonp', url: uri, data: finalQuery, timeout: 30 }, function (err, data) {
                    if (data && !data.name && self.name) {
                        // Propagate datasource title to the returned feed
                        // if not already set
                        data.name = self.name;
                    }
                    callback(err, data);
                });
            };

            /**
             * Gets the description of the datasource.
             *
             * The description is a JSON object that details the collection
             * parameters. The returned object is usually the collection's
             * "desc" property, but may be more precise depending on the
             * query options (typically the outputType may be adjusted for
             * a more precise one for the given query).
             *
             * @function
             * @param {function} callback Callback function called with the error
             *  and the description.
             */
            this.getDesc = function (callback) {
                client.getCollectionDesc(db, colname, options, callback);
            };
        };


        /**
         * API exposed in Joshfire.datajs
         */
        var client = {
            /**
             * Creates a new datasource collection object.
             *
             * Feed items are not fetched at this stage. Call the 'find' method
             * on the returned object to retrieve the feed.
             *
             * @function
             * @param {String} db The datasource provider
             * @param {String} colname The collection in the provider's catalog
             * @param {Object} options Common query options (e.g. filtering options)
             * @returns {Collection} The collection
             */
            getCollection: function (datasource, callback) {
                var col = new collection(datasource);
                return callback(null, col);
            },

            /**
             * Gets the description of the datasource collection
             * from the data proxy.
             *
             * The description is a JSON object that details the collection
             * parameters.
             *
             * @function
             * @param {String} db The datasource provider
             * @param {String} colname The collection in the provider's catalog
             * @param {Object} options Common query options (e.g. filtering options)
             * @param {function} callback Callback function called with the error
             *  and the description.
             */
            getCollectionDesc: function (db, colname, options, callback) {
                var self = this,
                  finalQuery = {},
                  uri = null;

                if (options) _extend(finalQuery, options);
                if (finalQuery.filter) {
                    finalQuery.filter = JSON.stringify(finalQuery.filter);
                }

                uri = 'http://' + globalConfig.DATAHOSTPORT +
                  '/api/' + globalConfig.DATAVERSION +
                  '/' + db + '/' + colname + '/_desc';

                // do we really need to do this ?
                for (var k in finalQuery) {
                    if (typeof finalQuery[k] == 'Object')
                        finalQuery[k] = JSON.stringify(finalQuery[k]);
                    uri += '&' + k + '=' + encodeURIComponent(finalQuery[k]);
                }

                http.request({ type: 'GET', dataType: 'jsonp', url: uri, data: finalQuery, timeout: 30 }, callback);
            }
        };

        return client;
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
     * @fileoverview Pagination algorithms
     * See http://jsfiddle.net/TaxuS/5/ & http://jsfiddle.net/7XKCJ/1/
     */
    define('runtime-win8/pagination', [], function () {

        return {
            /**
             * Converts skip/limit parameter into page/perPage parameters.
             *
             * Our pagination system uses skip/limit but some datasources actually expect
             * a page number and a number of items per page in their API. This function
             * returns the page/perPage and the optional number of items to skip in the
             * returned list to match the initial skip/limit parameters.
             *
             * Note that, depending on the maximum number of items per page given as
             * parameter, the returned parameters may not be "enough", i.e. the caller
             * may need to send multiple requests to the service provider, using the
             * returned parameters for the first request, and then incrementing the
             * page as needed up until it receives enough items.
             *
             * Mapping is actually very hard. The function returns "stupid" (but ok!)
             * results in certain cases.
             *
             * @function
             * @param {Number} skip The number of items to skip
             * @param {Number} limit The number of items to return
             * @param {Number} maxPerPage The maximum number of items per page that
             *  the service provider accepts (optional)
             * @param {Number} maxPage The maximum number of pages that the service
             *  provider accepts (optional but maxPerPage must be set when this
             *  parameter is set)
             * @param {Boolean} forceLimit Force the number of items per page to "limit"
             *  (for internal use, calling code should not need to set that parameter)
             * @return {Object} An object with a "page" property (starting at 1), a
             *  "perPage" property and a "skip" property that tells the number of items
             *  to skip in the final list of entries returned by the service provider
             */
            paginate: function (skip, limit, maxPerPage, maxPage, forceLimit) {
                var perPage = 0;
                if (maxPerPage && (limit > maxPerPage)) {
                    // No way to accomodate the request as-is, reduce the limit to the
                    // maximum number of items per page possible
                    limit = maxPerPage;
                }
                var fl = Math.floor(skip / limit);
                var m = skip % limit;
                if (fl === 0) {
                    // Case skip < limit, one request is enough, except when the total number
                    // of items to fetch exceeds the maximum number of items allowed.
                    perPage = skip + limit;
                    if (maxPerPage && (perPage > maxPerPage)) {
                        perPage = maxPerPage;
                    }
                    return {
                        "page": 1,
                        "perPage": perPage,
                        "skip": skip
                    };
                } else if (forceLimit) {
                        // The number of items per page must not change
                    return {
                        "page": fl + 1,
                        "perPage": limit,
                        "skip": skip - fl * limit
                    };
                } else if (m === 0) {
                        // Skip is a multiple of limit (typical pagination!)
                    if (maxPage && (fl + 1 > maxPage) &&
                      maxPerPage && (limit < maxPerPage)) {
                        // The page number would be too high, let's try again, forcing the
                        // number of items per page to the maximum allowed to reduce the
                        // number of pages to a bare minimum
                        // (not the smartest thing we could do, but that works)
                        return this.paginate(skip, maxPerPage, maxPerPage, maxPage, true);
                    }
                    else {
                        return {
                            "page": fl + 1,
                            "perPage": limit,
                            "skip": 0
                        };
                    }
                } else {
                    // Generic case, skip is not a multiple of limit
                    var p = Math.floor(skip / (limit + fl - 1));
                    var n = Math.ceil((skip + limit) / (p + 1));
                    if (maxPage && maxPerPage && (p + 1 > max)) {
                        // The page number would be too high, let's try again, forcing the
                        // number of items per page to the maximum allowed to reduce the
                        // number of pages to a bare minimum
                        // (again, not the smartest thing we could do, but that works)
                        return this.paginate(skip, maxPerPage, maxPerPage, maxPage, true);
                    }
                    return { "page": p + 1, "perPage": n, "skip": skip - p * n };
                }
            }

        };

    });
    define('databases/flickr/photos', [
      'datajslib!http',
      'datajslib!underscore',
      'datajslib!iso8601',
      'datajslib!pagination'
    ], function (http, _, iso8601, Pagination) {

        return {
            /**
             * Description of the datasource for the factory
             */
            desc: {
                "options": {
                    "schema": {
                        "search": {
                            "type": "string",
                            "title": "Search text",
                            "description": "Latest items are returned first. Keep in mind that the list of photos featured in the final app will be the results of the search when the app is run. Consider using photo sets if you need more consistent results."
                        },
                        "set": {
                            "type": "string",
                            "title": "Photo set URL",
                            "description": "You may also directly enter a photo set ID, e.g. 72157628064679334" // also accept photo set ID
                        },
                        "api_key": {
                            "type": "string",
                            "title": "API key",
                            "description": "Enter your Flickr API key here. The key is optional to preview your app but required at deployment stage. Follow the instructions on <a href='http://www.flickr.com/services/api/misc.api_keys.html' target='_blank'>Flickr's Web site</a> to obtain an API key.",
                            "joshfire:requiredFor": ["deploy"]
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
                                "legend": "Photo set",
                                "items": [
                                  "set"
                                ]
                            }
                          ]
                      },
                      {
                          "type": "authfieldset",
                          "items": [
                            "api_key"
                          ]
                      }
                    ]
                },
                "runtimes": ["browser", "nodejs", "win8"],
                "outputType": "ImageObject"
            },

            softLimit: 500,

            generateURL: function (query, pagination) {
                var url = null;

                // See Flickr API at: http://www.flickr.com/services/api/
                // We'll use Joshfire's key if no API key is specified
                var filter = query.filter || {};
                var api_key = filter.api_key || '5c7b0ae951c10171dc18f69f6572c537';
                var searchText = null;
                var setId = null;
                var extract = null;

                // List of extra fields to return, see extras parameter in:
                // http://www.flickr.com/services/api/flickr.photos.search.html
                // Note that there are a couple of others not listed here such as license
                var extras = 'description,date_upload,date_taken,owner_name,icon_server,' +
                  'last_update,geo,tags,url_sq,url_t,url_s,url_m,url_z,url_l';

                if (filter.search) {
                    searchText = encodeURIComponent(filter.search);

                    //hard max = 4000 soft max = 500
                    //http://www.flickr.com/services/api/flickr.photos.search.html
                    url = 'http://api.flickr.com/services/rest/?method=flickr.photos.search' +
                      '&api_key=' + api_key +
                      '&text=' + searchText +
                      '&extras=' + extras +
                      '&page=' + pagination.page +
                      '&per_page=' + pagination.perPage +
                      '&format=json';
                }
                else if (filter.set) {
                        // Can we extract ID from a potential URL ?
                    extract = filter.set.match(/(?:www\.)?flickr\.com\/photos\/[^\/]+\/sets\/([^\/]+)/);
                    if (extract) {
                        // The URL looks like:
                        // http://www.flickr.com/photos/siliconmaniacs/sets/72157626989709433/with/5901439714/
                        setId = extract[1];
                    }
                    else if (filter.set.match(/^[a-z0-9]+$/i)) {
                            // if not an URL, is it an ID ?
                        setId = filter.set;
                    } else {
                        // TODO: notify the client that the set ID is not correct
                        return callback(null, null);
                    }
                    // soft max = 500
                    url = 'http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos' +
                      '&api_key=' + api_key +
                      '&photoset_id=' + setId +
                      '&extras=' + extras +
                      '&page=' + query.pageResults.page +
                      '&per_page=' + query.pageResults.perPage +
                      '&format=json';
                }
                return url;
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
                var self = this;

                // How many times the API should be called (1 to do two calls)
                var totalPage = 0;

                if (!query.skip) query.skip = 0;
                if (!query.limit) query.limit = 20;

                // Flickr doesn't handle skip limit, but works with per_page and page
                query.pageResults = Pagination.paginate(query.skip, query.limit);

                // if perPage is more that softLimit, call more pages
                if (query.pageResults.perPage > self.softLimit) {
                    totalPage = Math.floor(query.pageResults.perPage / self.softLimit);
                }
                // API responses, array because can be called many times.
                var responseArray = [];

                var doRequest = function (page) {

                    var url = self.generateURL(query, { page: query.pageResults.page + page, perPage: query.pageResults.perPage });
                    if (!url) {
                        // TODO: notify the client that a parameter should be given
                        return callback(null, null);
                    }

                    http.request({
                        'url': url,
                        'jsonp': 'jsoncallback',
                        'dataType': 'jsonp'
                    }, function (err, data) {
                        responseArray.push(data);

                        if (page === totalPage) {
                            return callback(err, responseArray);
                        } else {
                            page++;
                            doRequest(page);
                        }
                    });
                };

                doRequest(0);
            },


            /**
             * Normalizes the data received from source provider
             * @function
             * @param {Object} data API response or Array of responses
             *(typically the object given to the callback method at the end of a "fetch")
             * @param {Object} query Query parameters (which could include filtering options)
             * @param {function(Object, Object)} callback Callback function.
             *   The second argument of the callback is an object with an "entries" property
             *   that contains the list of items normalized according to the schema.org hierarchy.
             */
            process: function (data, query, callback) {
                var self = this;
                if (!data) {
                    return callback(null, { "entries": [] });
                }

                if (data.stat == 'fail') {
                    if (data.message) {
                        return callback(data.message, data);
                    }
                    else {
                        return callback("Source provider complained about something", data);
                    }
                }

                if (!query.skip) query.skip = 0;
                if (!query.limit) query.limit = 20;
                if (!query.pageResults) {
                    query.pageResults = Pagination.paginate(query.skip, query.limit);
                }

                // make sure we work with an array
                if (!_.isArray(data)) {
                    data = [data];
                }

                var photos = [];
                for (var i = 0; i < data.length; i++) {
                    photos = photos.concat(self.processResponse(data[i], i, query, callback));
                }

                return callback(null, { 'entries': photos });
            },

            /**
             * process a response from the source provider
             */
            processResponse: function (data, index, query, callback) {
                var self = this;
                var filter = query ? query.filter : null;
                var dataphotos = null;
                var owner = null;
                var ownername = null;
                var date = null;
                var photos = [];
                var pic = null;
                var photo = null;
                var purl = null;

                // depending on the URL called, extract the photo objects
                if (filter) {
                    if (filter.search) {
                        // Results of a search
                        dataphotos = data.photos.photo;
                    }
                    else if (filter.set) {
                            // Photos in a set.
                            // The owner's NSID is defined at the root level and not repeated
                            // at the photo level.
                        dataphotos = data.photoset.photo;
                        owner = data.photoset.owner;
                        ownername = data.photoset.ownername;
                    }
                }
                if (!dataphotos) {
                    callback("Filter search or set ID must be defined.", null);
                }

                // store the re-formatted photo objects

                // TODO: The list of thumbnails is typically useless without the dimensions
                // of the images, but Flickr only says that the largest size of the image
                // is 240, 640 or 1024 depending on the suffix. In particular, we don't
                // know whether the image is in portrait or landscape mode.
                // Info about URL generation for buddyicon available at:
                // http://www.flickr.com/services/api/misc.buddyicons.html

                // if index === 0
                var indexStart = query.pageResults.skip;
                var indexEnd = Math.min(dataphotos.length, query.pageResults.skip + query.limit);
                if (index > 0) {
                    indexStart = 0;
                    indexEnd = Math.min(dataphotos.length, query.pageResults.skip + query.limit - index * self.softLimit);
                }

                for (var i = indexStart; i < indexEnd; i++) {
                    pic = dataphotos[i];
                    if (pic.url_l) {
                        purl = {
                            'contentURL': pic.url_l,
                            'width': parseInt(pic.width_l, 10),
                            'height': parseInt(pic.height_l, 10)
                        };
                    }
                    else if (pic.url_z) {
                        purl = {
                            'contentURL': pic.url_z,
                            'width': parseInt(pic.width_z, 10),
                            'height': parseInt(pic.height_z, 10)
                        };
                    }
                    else {
                        purl = {
                            'contentURL': pic.url_m,
                            'width': parseInt(pic.width_m, 10),
                            'height': parseInt(pic.height_m, 10)
                        };
                    }
                    photo = {
                        '@type': 'ImageObject',
                        'itemType': 'ImageObject',
                        'url': 'http://www.flickr.com/photos' +
                          '/' + (pic.owner || owner) +
                          '/' + pic.id,
                        'name': pic.title,
                        'contentURL': purl.contentURL,
                        'width': purl.width,
                        'height': purl.height,
                        'image': {
                            '@type': 'ImageObject',
                            'itemType': 'ImageObject',
                            'contentURL': pic.url_s,
                            'width': parseInt(pic.width_s, 10),
                            'height': parseInt(pic.height_s, 10)
                        },
                        'author': [{
                            '@type': 'Person',
                            'itemType': 'Person',
                            'name': pic.ownername || ownername
                        }],
                        'thumbnail': [
                          {
                              '@type': 'ImageObject',
                              'itemType': 'ImageObject',
                              'contentURL': pic.url_sq,
                              'width': parseInt(pic.width_sq, 10),
                              'height': parseInt(pic.height_sq, 10)
                          },
                          {
                              '@type': 'ImageObject',
                              'itemType': 'ImageObject',
                              'contentURL': pic.url_t,
                              'width': parseInt(pic.width_t, 10),
                              'height': parseInt(pic.height_t, 10)
                          },
                          {
                              '@type': 'ImageObject',
                              'itemType': 'ImageObject',
                              'contentURL': pic.url_s,
                              'width': parseInt(pic.width_s, 10),
                              'height': parseInt(pic.height_s, 10)
                          },
                          {
                              '@type': 'ImageObject',
                              'itemType': 'ImageObject',
                              'contentURL': pic.url_m,
                              'width': parseInt(pic.width_m, 10),
                              'height': parseInt(pic.height_m, 10)
                          }
                        ],
                        'publisher': {
                            '@type': 'Organization',
                            'itemType': 'Organization',
                            'url': 'http://www.flickr.com',
                            'name': 'flickr'
                        }
                    };

                    if (pic.url_z) {
                        photo.thumbnail.push({
                            '@type': 'ImageObject',
                            'itemType': 'ImageObject',
                            'contentURL': pic.url_z,
                            'width': parseInt(pic.width_z, 10),
                            'height': parseInt(pic.height_z, 10)
                        });
                    }

                    if (pic.iconfarm > 0) {
                        photo.author[0].image = {
                            '@type': 'ImageObject',
                            'itemType': 'ImageObject',
                            'contentURL': 'http://farm' + pic.iconfarm + '.static.flickr.com' +
                              '/' + pic.iconserver +
                              '/buddyicons/' + (pic.owner || owner) +
                              '.jpg',
                            'width': 48,
                            'height': 48
                        };
                    }

                    if (pic.latitude && pic.longitude && pic.accuracy) {
                        // Photo contains geo information
                        // (note the accuracy gets lost during the conversion)
                        photo.contentLocation = {
                            '@type': 'Place',
                            'itemType': 'Place',
                            'geo': {
                                '@type': 'GeoCoordinates',
                                'itemType': 'GeoCoordinates',
                                'latitude': pic.latitude,
                                'longitude': pic.longitude
                            }
                        };
                    }

                    if (pic.description && pic.description._content) {
                        photo.description = pic.description._content;
                    }

                    if (pic.tags) {
                        photo.keywords = pic.tags;
                    }

                    if (pic.datetaken) {
                        photo.dateCreated = pic.datetaken.replace(/ /, "T") + "Z";
                    }
                    if (pic.lastupdate) {
                        date = new Date(parseInt(pic.lastupdate, 10) * 1000);
                        photo.dateModified = iso8601.fromDate(date);
                    }
                    if (pic.dateupload) {
                        date = new Date(parseInt(pic.dateupload, 10) * 1000);
                        photo.datePublished = iso8601.fromDate(date);
                    }
                    else if (photo.dateModified) {
                        photo.datePublished = photos[i].dateModified;
                    }
                    else if (photo.dateCreated) {
                        photo.datePublished = photos[i].dateCreated;
                    }

                    photos.push(photo);
                }

                return photos;
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
    define('databases/youtube/lib/api', ['datajslib!http', 'datajslib!underscore'], function (http, _) {

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
                var newUrl = url.replace(new RegExp(':' + param), params[param]);
                if (newUrl != url)
                    url = newUrl;
                else
                    url += ((url.indexOf('?') == -1) ? '?' : '&') + param + (params[param] ? ('=' + params[param]) : '');
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

    define('databases/youtube/videos', [
      './lib/api',
      'datajslib!underscore',
      'datajslib!iso8601'
    ], function (api, _, iso8601) {

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
                        var matches = filter.playlist.match(/http(s?):\/\/(www\.?)(youtube\.com\/playlist\?).*(list=)([A-Z0-9]*)/i);
                        if (matches.length) {
                            filter.playlist = matches.pop();
                        }
                        if (filter.playlist.length > 16) {
                            //strip heading PL ... and any further arguments
                            filter.playlist = filter.playlist.replace(/^PL/, '').substring(0, 16);
                        }
                        //console.warn('playlist !','output', filter.playlist);
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
                    return callback(null, { "entries": [] });
                }
                var videos = data.feed.entry;
                var point = null;
                var id = null;

                for (var i = 0, l = videos.length; i < l; i++) {
                    var vid = videos[i];

                    if (vid.media$group && vid.media$group.media$content) {
                        var url = vid.media$group.media$content[0].url;

                        var match = url.match(/^https?:\/\/(www\.)?youtube\.com\/v\/([a-z0-9_\-]+).*$/i);

                        if (match) {
                            id = match[2];
                        }
                    }


                    videos[i] = {
                        '@type': 'VideoObject',
                        'itemType': 'VideoObject',
                        'url': vid.link[0].href.replace(/\&.*$/, ''), // to remove the extra parameters (&feature=youtube_gdata)
                        'name': vid.title.$t,
                        'playerType': id ? 'iframe' : null,
                        'embedURL': id ? 'http://www.youtube-nocookie.com/embed/' + id + '?rel=0' : null,
                        'publisher': {
                            '@type': 'Organization',
                            'itemType': 'Organization',
                            'url': 'http://www.youtube.com',
                            'name': 'Youtube'
                        },
                        'description': (vid.media$group && vid.media$group.media$description) ? vid.media$group.media$description.$t : '',
                        'author': [],
                        'genre': (vid.media$group && vid.media$group.media$category && vid.media$group.media$category.$t) ? vid.media$group.media$category.$t : '',
                        'thumbnail': [],
                        'datePublished': vid.published ? vid.published.$t : (vid.media$group && vid.media$group.yt$uploaded ? vid.media$group.yt$uploaded.$t : ''),
                        'uploadDate': (vid.media$group && vid.media$group.yt$uploaded) ? vid.media$group.yt$uploaded.$t : '',
                        'duration': (vid.media$group && vid.media$group.yt$duration) ? iso8601.fromDuration(Number(vid.media$group.yt$duration.seconds) * 1000) : ''
                    };
                    // Other possibilities: keywords, license when defined in schema.org.
                    // Add ",'meta': vid" to the above code snipped to view all the information returned by Youtube
                    // Note that vid.updated always returns the current date which is not particularly useful, discarded here.

                    // Complete the list of authors
                    if (vid.author) {
                        for (var k = 0, kl = vid.author.length; k < kl; k++) {
                            if (vid.author[k].uri && vid.author[k].name) {
                                videos[i].author.push({
                                    '@type': 'Person',
                                    'itemType': 'Person',
                                    'url': vid.author[k].uri.$t,
                                    'name': vid.author[k].name.$t
                                });
                            }
                        }
                    }

                    // Complete the list of thumbnails
                    if (vid.media$group && vid.media$group.media$thumbnail) {
                        for (var k2 = 0, kl2 = vid.media$group.media$thumbnail.length; k2 < kl2; k2++) {
                            var thumbnail = vid.media$group.media$thumbnail[k2];
                            videos[i].thumbnail.push({
                                '@type': 'ImageObject',
                                'itemType': 'ImageObject',
                                'url': thumbnail.url,
                                'name': thumbnail.yt$name,
                                'contentURL': thumbnail.url,
                                'width': thumbnail.width,
                                'height': thumbnail.height
                            });
                        }
                        if (videos[i].thumbnail[0]) {
                            videos[i].image = _.clone(videos[i].thumbnail[0]);
                        }
                    }

                    // Location
                    if (vid.georss$where &&
                      vid.georss$where.gml$Point &&
                      vid.georss$where.gml$Point.gml$pos &&
                      vid.georss$where.gml$Point.gml$pos.$t) {
                        point = vid.georss$where.gml$Point.gml$pos.$t.split(' ');
                        if (point.length === 2) {
                            videos[i].contentLocation = {
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
                    if (vid.yt$location && vid.yt$location.$t) {
                        if (!videos[i].contentLocation) {
                            videos[i].contentLocation = {
                                '@type': 'Place',
                                'itemType': 'Place'
                            };
                        }
                        videos[i].contentLocation.name = vid.yt$location.$t;
                    }

                    // Aspect ratio
                    // (remains in Youtube namespace since not a standard property)
                    if (vid.media$group &&
                      vid.media$group.yt$aspectRatio &&
                      vid.media$group.yt$aspectRatio.$t) {
                        videos[i]['yt:aspectRatio'] = vid.media$group.yt$aspectRatio.$t;
                    }
                }

                callback(null, { "entries": videos });
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
    ; (function (a, b) { var c = function (c) { var d = null, e = null, f = 0; return !c || !a || !a.config || !a.config.datasources || !a.config.datasources[c] ? null : (d = a.config.datasources[c], b(["datajslib!collection"], function (a) { if (Object.prototype.toString.call(d) == "[object Array]") { e = { children: [], find: function (a, b) { var c = d.length, f = !1, g = [], h = 0, i = function (a, d) { c -= 1; if (f) return; a && (f = !0), d && g.push(d); if (a || c === 0) return b(a, { entries: g }) }; for (h = 0; h < e.children.length; h++) e.children[h].find(a, i) } }; for (f = 0; f < d.length; f++) e.children[f] = a.getCollection(d[f]), e.children[f].name = d[f].name, e.children[f].config = d[f] } else e = a.getCollection(d), e.name = d.name, e.config = d }, null, !0), e) }; a.getDataSource = c })(window.Joshfire.factory, require);
})();
