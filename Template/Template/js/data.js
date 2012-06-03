(function () {
    "use strict";

    function groupKeySelector(item) {
        return item.group.key;
    }

    function groupDataSelector(item) {
        return item.group;
    }

    // This function returns a WinJS.Binding.List containing only the items
    // that belong to the provided group.
    function getItemsFromGroup(group) {
        return list.createFiltered(function (item) { return item.group.key === group.key; });
    }

    var list = new WinJS.Binding.List();
    var groupedItems = list.createGrouped(groupKeySelector, groupDataSelector);

    // Use Joshfire Factory data sources for the moment.
    // See http://developer.joshfire.com/doc/dev/develop/datasources
    // They are defined in the bootstrap.js file
    var datasources = Joshfire.factory.getDataSource("main");

    // note that external <script> cannot be called on a local context, so no JSONP
    // http://msdn.microsoft.com/library/windows/apps/Hh452745
    // http://msdn.microsoft.com/library/windows/apps/Hh465373

    for (var dsNb = 1; dsNb < datasources.children.length; dsNb++) {
        var group = { key: "main" + dsNb, title: datasources.children[dsNb].name };

        datasources.children[dsNb].find({}, function(g) { 
                return function (err, data) {
                    // Process data entries in data.entries
                    data.entries.forEach(function (item) {
                        item.group = g;
                        list.push(item);
                    });
                };
            }(group)
        );
    }


    WinJS.Namespace.define("data", {
        items: groupedItems,
        groups: groupedItems.groups,
        getItemsFromGroup: getItemsFromGroup
    });
})();
