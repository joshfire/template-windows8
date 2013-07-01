(function () {
    "use strict";

    // Get a reference for an item, using the group key and item title as a
    // unique reference to the item that can be easily serialized.
    function getItemReference(item) {
        return [item.group.key, item.title];
    }

    function resolveGroupReference(key) {
        for (var i = 0; i < groupedItems.groups.length; i++) {
            if (groupedItems.groups.getAt(i).key === key) {
                return groupedItems.groups.getAt(i);
            }
        }
    }

    function resolveItemReference(reference) {
        for (var i = 0; i < groupedItems.length; i++) {
            var item = groupedItems.getAt(i);
            if (item.group.key === reference[0] && item.title === reference[1]) {
                return item;
            }
        }
    }


    // This function returns a WinJS.Binding.List containing only the items
    // that belong to the provided group.
    function getItemsFromGroup(group) {
        return list.createFiltered(function (item) { return item.group.key === group.key; });
    }

    // all our data are stored inside an unique list
    var list = new WinJS.Binding.List();

    var groupedItems = list.createGrouped(
        function groupKeySelector(item) { return item.group.key; },
        function groupDataSelector(item) { return item.group; }
    );

    /**
     *  Get a filtered list with items having an index inferior to the given x parameter
     */
    var getxItems = function (x) {

        var ltdList = list.createFiltered(function (item) {
            var key = item.group.key;
            if (item.innerIndex < x) {
                return true;
            }
            return false;
        });

        ltdList = ltdList.createGrouped(
            function groupKeySelector(item) { return item.group.key; },
            function groupDataSelector(item) { return item.group; }
        );

        return ltdList;
    };

    var getHomeItemReference = function (index) {

    };

    // Expose the config for general use through the app.
    var factoryconfig = Joshfire.factory.config;

    var populateListFromDataSource = function () {
        Data.dataloading = true;

        // Use Joshfire Factory data sources for the moment.
        // See http://developer.joshfire.com/doc/dev/develop/datasources
        // They are defined in the bootstrap.js file
        var datasources = Joshfire.factory.getDataSource("main");

        // note that external <script> cannot be called on a local context, so no JSONP
        // http://msdn.microsoft.com/library/windows/apps/Hh452745
        // http://msdn.microsoft.com/library/windows/apps/Hh465373

        // a counter of the number of datasources which actually answered
        var queryCompleteCounter = 0;
        // a counter of the number of datasources successfully received from the servers
        var successCounter = 0;

        var dsWaitingForResponse;

        for (var dsNb = 0; dsNb < datasources.children.length; dsNb++) {
            var group = { key: 'main' + dsNb, title: datasources.children[dsNb].name, index: dsNb, length: 0 };

            datasources.children[dsNb].find({}, function (g) {

                return function (err, data) {
                    queryCompleteCounter++;
                    if (queryCompleteCounter == datasources.children.length) {
                        Data.dataloading = false;
                    }

                    // If all datasources have been loaded, remove the loading spinner
                    if (queryCompleteCounter == datasources.children.length) {
                        setTimeout(function () {
                            var loadingControl = document.getElementById('loadingControl');
                            Data.dataloaded = true;
                            if (loadingControl) {
                                loadingControl.style.display = 'none';
                            }
                        }, 1400);
                    }

                    if (err) {
                        console.error(err.toString());
                        return;
                    }

                    successCounter++;

                    // Add received data entries into the data list
                    var k = 0;
                    g.length = data.entries.length;
                    data.entries.forEach(function (item) {
                        item.group = g;
                        item.simpleType = item['@type'].replace('/', '').toLocaleLowerCase() || 'thing';
                        // index inside its datasource
                        item.innerIndex = k;
                        list.push(item);
                        k++;
                    });
                };
            }(group)
            );
        }
    }
    /** Get the first item and grab its image if it has one */
    function getTypeFromGroup(groupItem) {
        return this.getItemsFromGroup(groupItem).getAt(0).simpleType;
    }

    /** Get the first item and grab its image if it has one */
    function getImageFromGroup(groupItem) {
        var firstItem = this.getItemsFromGroup(groupItem).getAt(0);
        var thethumb = null;

        if (firstItem.image)
            thethumb = firstItem.image;
        if (firstItem.thumbnail && firstItem.thumbnail.length) {
            var bestW = 0;
            for (var k in firstItem.thumbnail) {
                if (firstItem.thumbnail[k].width > bestW) {
                    thethumb = firstItem.thumbnail[k];
                    bestW = firstItem.thumbnail[k].width;
                }
            }
        }
        if (firstItem.author && firstItem.author.length && firstItem.author[0].image) {
            thethumb = firstItem.author[0].image;
        }
        if (firstItem.simpleType == 'imageobject' && firstItem.contentURL) {
            thethumb = {
                contentURL: firstItem.contentURL
            }
        }
        return thethumb;
    }

    WinJS.Namespace.define("Data", {
        items: groupedItems,
        groups: groupedItems.groups,
        getItemsFromGroup: getItemsFromGroup,
        getImageFromGroup: getImageFromGroup,
        getTypeFromGroup: getTypeFromGroup,
        getItemReference: getItemReference,
        resolveGroupReference: resolveGroupReference,
        resolveItemReference: resolveItemReference,

        dataloading: false,
        dataloaded: false,

        homeItems: getxItems,
        getHomeItemReference: getHomeItemReference,

        appConfig: factoryconfig.app,

        update: populateListFromDataSource
    });

    populateListFromDataSource();
})();
