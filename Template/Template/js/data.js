(function () {
    "use strict";

    var groupDescription = "Group Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tempor scelerisque lorem in vehicula. Aliquam tincidunt, lacus ut sagittis tristique, turpis massa volutpat augue, eu rutrum ligula ante a ante";
    var itemDescription = "Item Description: Pellentesque porta mauris quis interdum vehicula urna sapien ultrices velit nec venenatis dui odio in augue cras posuere enim a cursus convallis neque turpis malesuada erat ut adipiscing neque tortor ac erat";
    var itemContent = "<p>Curabitur class aliquam vestibulum nam curae maecenas sed integer cras phasellus suspendisse quisque donec dis praesent accumsan bibendum pellentesque condimentum adipiscing etiam consequat vivamus dictumst aliquam duis convallis scelerisque est parturient ullamcorper aliquet fusce suspendisse nunc hac eleifend amet blandit facilisi condimentum commodo scelerisque faucibus aenean ullamcorper ante mauris dignissim consectetuer nullam lorem vestibulum habitant conubia elementum pellentesque morbi facilisis arcu sollicitudin diam cubilia aptent vestibulum auctor eget dapibus pellentesque inceptos leo egestas interdum nulla consectetuer suspendisse adipiscing pellentesque proin lobortis sollicitudin augue elit mus congue fermentum parturient fringilla euismod feugiat</p><p>Curabitur class aliquam vestibulum nam curae maecenas sed integer cras phasellus suspendisse quisque donec dis praesent accumsan bibendum pellentesque condimentum adipiscing etiam consequat vivamus dictumst aliquam duis convallis scelerisque est parturient ullamcorper aliquet fusce suspendisse nunc hac eleifend amet blandit facilisi condimentum commodo scelerisque faucibus aenean ullamcorper ante mauris dignissim consectetuer nullam lorem vestibulum habitant conubia elementum pellentesque morbi facilisis arcu sollicitudin diam cubilia aptent vestibulum auctor eget dapibus pellentesque inceptos leo egestas interdum nulla consectetuer suspendisse adipiscing pellentesque proin lobortis sollicitudin augue elit mus congue fermentum parturient fringilla euismod feugiat</p><p>Curabitur class aliquam vestibulum nam curae maecenas sed integer cras phasellus suspendisse quisque donec dis praesent accumsan bibendum pellentesque condimentum adipiscing etiam consequat vivamus dictumst aliquam duis convallis scelerisque est parturient ullamcorper aliquet fusce suspendisse nunc hac eleifend amet blandit facilisi condimentum commodo scelerisque faucibus aenean ullamcorper ante mauris dignissim consectetuer nullam lorem vestibulum habitant conubia elementum pellentesque morbi facilisis arcu sollicitudin diam cubilia aptent vestibulum auctor eget dapibus pellentesque inceptos leo egestas interdum nulla consectetuer suspendisse adipiscing pellentesque proin lobortis sollicitudin augue elit mus congue fermentum parturient fringilla euismod feugiat</p><p>Curabitur class aliquam vestibulum nam curae maecenas sed integer cras phasellus suspendisse quisque donec dis praesent accumsan bibendum pellentesque condimentum adipiscing etiam consequat vivamus dictumst aliquam duis convallis scelerisque est parturient ullamcorper aliquet fusce suspendisse nunc hac eleifend amet blandit facilisi condimentum commodo scelerisque faucibus aenean ullamcorper ante mauris dignissim consectetuer nullam lorem vestibulum habitant conubia elementum pellentesque morbi facilisis arcu sollicitudin diam cubilia aptent vestibulum auctor eget dapibus pellentesque inceptos leo egestas interdum nulla consectetuer suspendisse adipiscing pellentesque proin lobortis sollicitudin augue elit mus congue fermentum parturient fringilla euismod feugiat</p><p>Curabitur class aliquam vestibulum nam curae maecenas sed integer cras phasellus suspendisse quisque donec dis praesent accumsan bibendum pellentesque condimentum adipiscing etiam consequat vivamus dictumst aliquam duis convallis scelerisque est parturient ullamcorper aliquet fusce suspendisse nunc hac eleifend amet blandit facilisi condimentum commodo scelerisque faucibus aenean ullamcorper ante mauris dignissim consectetuer nullam lorem vestibulum habitant conubia elementum pellentesque morbi facilisis arcu sollicitudin diam cubilia aptent vestibulum auctor eget dapibus pellentesque inceptos leo egestas interdum nulla consectetuer suspendisse adipiscing pellentesque proin lobortis sollicitudin augue elit mus congue fermentum parturient fringilla euismod feugiat</p><p>Curabitur class aliquam vestibulum nam curae maecenas sed integer cras phasellus suspendisse quisque donec dis praesent accumsan bibendum pellentesque condimentum adipiscing etiam consequat vivamus dictumst aliquam duis convallis scelerisque est parturient ullamcorper aliquet fusce suspendisse nunc hac eleifend amet blandit facilisi condimentum commodo scelerisque faucibus aenean ullamcorper ante mauris dignissim consectetuer nullam lorem vestibulum habitant conubia elementum pellentesque morbi facilisis arcu sollicitudin diam cubilia aptent vestibulum auctor eget dapibus pellentesque inceptos leo egestas interdum nulla consectetuer suspendisse adipiscing pellentesque proin lobortis sollicitudin augue elit mus congue fermentum parturient fringilla euismod feugiat</p><p>Curabitur class aliquam vestibulum nam curae maecenas sed integer cras phasellus suspendisse quisque donec dis praesent accumsan bibendum pellentesque condimentum adipiscing etiam consequat vivamus dictumst aliquam duis convallis scelerisque est parturient ullamcorper aliquet fusce suspendisse nunc hac eleifend amet blandit facilisi condimentum commodo scelerisque faucibus aenean ullamcorper ante mauris dignissim consectetuer nullam lorem vestibulum habitant conubia elementum pellentesque morbi facilisis arcu sollicitudin diam cubilia aptent vestibulum auctor eget dapibus pellentesque inceptos leo egestas interdum nulla consectetuer suspendisse adipiscing pellentesque proin lobortis sollicitudin augue elit mus congue fermentum parturient fringilla euismod feugiat";

    // These three strings encode placeholder images. You will want to set the
    // backgroundImage property in your real data to be URLs to images.
    var lightGray = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY7h4+cp/AAhpA3h+ANDKAAAAAElFTkSuQmCC";
    var mediumGray = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY5g8dcZ/AAY/AsAlWFQ+AAAAAElFTkSuQmCC";
    var darkGray = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY3B0cPoPAANMAcOba1BlAAAAAElFTkSuQmCC";

    // Each of these sample groups must have a unique key to be displayed
    // separately.
    var sampleGroups = [
        { key: "main1", title: "Group Title: 1", subtitle: "Group Subtitle: 1", backgroundImage: darkGray, description: groupDescription },
        { key: "main2", title: "Group Title: 2", subtitle: "Group Subtitle: 2", backgroundImage: lightGray, description: groupDescription },
        { key: "main3", title: "Group Title: 3", subtitle: "Group Subtitle: 3", backgroundImage: mediumGray, description: groupDescription }
    ];

    // Each of these sample items should have a reference to a particular
    // group.
    var sampleItems = [
        { group: sampleGroups[0], title: "Item Title: 1", subtitle: "Item Subtitle: 1", description: itemDescription, content: itemContent, backgroundImage: lightGray },
        { group: sampleGroups[0], title: "Item Title: 2", subtitle: "Item Subtitle: 2", description: itemDescription, content: itemContent, backgroundImage: darkGray },
        { group: sampleGroups[0], title: "Item Title: 3", subtitle: "Item Subtitle: 3", description: itemDescription, content: itemContent, backgroundImage: mediumGray },
        { group: sampleGroups[0], title: "Item Title: 4", subtitle: "Item Subtitle: 4", description: itemDescription, content: itemContent, backgroundImage: darkGray },
        { group: sampleGroups[0], title: "Item Title: 5", subtitle: "Item Subtitle: 5", description: itemDescription, content: itemContent, backgroundImage: mediumGray },

        { group: sampleGroups[1], title: "Item Title: 1", subtitle: "Item Subtitle: 1", description: itemDescription, content: itemContent, backgroundImage: darkGray },
        { group: sampleGroups[1], title: "Item Title: 2", subtitle: "Item Subtitle: 2", description: itemDescription, content: itemContent, backgroundImage: mediumGray },
        { group: sampleGroups[1], title: "Item Title: 3", subtitle: "Item Subtitle: 3", description: itemDescription, content: itemContent, backgroundImage: lightGray },

        { group: sampleGroups[2], title: "Item Title: 1", subtitle: "Item Subtitle: 1", description: itemDescription, content: itemContent, backgroundImage: mediumGray },
        { group: sampleGroups[2], title: "Item Title: 2", subtitle: "Item Subtitle: 2", description: itemDescription, content: itemContent, backgroundImage: lightGray },
        { group: sampleGroups[2], title: "Item Title: 3", subtitle: "Item Subtitle: 3", description: itemDescription, content: itemContent, backgroundImage: darkGray },
        { group: sampleGroups[2], title: "Item Title: 4", subtitle: "Item Subtitle: 4", description: itemDescription, content: itemContent, backgroundImage: lightGray },
        { group: sampleGroups[2], title: "Item Title: 5", subtitle: "Item Subtitle: 5", description: itemDescription, content: itemContent, backgroundImage: mediumGray },
        { group: sampleGroups[2], title: "Item Title: 6", subtitle: "Item Subtitle: 6", description: itemDescription, content: itemContent, backgroundImage: darkGray },
        { group: sampleGroups[2], title: "Item Title: 7", subtitle: "Item Subtitle: 7", description: itemDescription, content: itemContent, backgroundImage: mediumGray },

        { group: sampleGroups[3], title: "Item Title: 1", subtitle: "Item Subtitle: 1", description: itemDescription, content: itemContent, backgroundImage: darkGray },
        { group: sampleGroups[3], title: "Item Title: 2", subtitle: "Item Subtitle: 2", description: itemDescription, content: itemContent, backgroundImage: lightGray },
        { group: sampleGroups[3], title: "Item Title: 3", subtitle: "Item Subtitle: 3", description: itemDescription, content: itemContent, backgroundImage: darkGray },
        { group: sampleGroups[3], title: "Item Title: 4", subtitle: "Item Subtitle: 4", description: itemDescription, content: itemContent, backgroundImage: lightGray },
        { group: sampleGroups[3], title: "Item Title: 5", subtitle: "Item Subtitle: 5", description: itemDescription, content: itemContent, backgroundImage: mediumGray },
        { group: sampleGroups[3], title: "Item Title: 6", subtitle: "Item Subtitle: 6", description: itemDescription, content: itemContent, backgroundImage: lightGray },

        { group: sampleGroups[4], title: "Item Title: 1", subtitle: "Item Subtitle: 1", description: itemDescription, content: itemContent, backgroundImage: lightGray },
        { group: sampleGroups[4], title: "Item Title: 2", subtitle: "Item Subtitle: 2", description: itemDescription, content: itemContent, backgroundImage: darkGray },
        { group: sampleGroups[4], title: "Item Title: 3", subtitle: "Item Subtitle: 3", description: itemDescription, content: itemContent, backgroundImage: lightGray },
        { group: sampleGroups[4], title: "Item Title: 4", subtitle: "Item Subtitle: 4", description: itemDescription, content: itemContent, backgroundImage: mediumGray },

        { group: sampleGroups[5], title: "Item Title: 1", subtitle: "Item Subtitle: 1", description: itemDescription, content: itemContent, backgroundImage: lightGray },
        { group: sampleGroups[5], title: "Item Title: 2", subtitle: "Item Subtitle: 2", description: itemDescription, content: itemContent, backgroundImage: darkGray },
        { group: sampleGroups[5], title: "Item Title: 3", subtitle: "Item Subtitle: 3", description: itemDescription, content: itemContent, backgroundImage: mediumGray },
        { group: sampleGroups[5], title: "Item Title: 4", subtitle: "Item Subtitle: 4", description: itemDescription, content: itemContent, backgroundImage: darkGray },
        { group: sampleGroups[5], title: "Item Title: 5", subtitle: "Item Subtitle: 5", description: itemDescription, content: itemContent, backgroundImage: lightGray },
        { group: sampleGroups[5], title: "Item Title: 6", subtitle: "Item Subtitle: 6", description: itemDescription, content: itemContent, backgroundImage: mediumGray },
        { group: sampleGroups[5], title: "Item Title: 7", subtitle: "Item Subtitle: 7", description: itemDescription, content: itemContent, backgroundImage: darkGray },
        { group: sampleGroups[5], title: "Item Title: 8", subtitle: "Item Subtitle: 8", description: itemDescription, content: itemContent, backgroundImage: lightGray }
    ];

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

    // web cannot be called on a local context
    // http://msdn.microsoft.com/library/windows/apps/Hh452745
    // http://msdn.microsoft.com/library/windows/apps/Hh465373
    var dsNb = 1;
    datasources.children[dsNb].find({}, function (err, data) {
        // Process data entries in data.entries
        data.entries.forEach(function (item) {
            item.group = "main" + dsNb;
            list.push(item);
        });
    });


    WinJS.Namespace.define("data", {
        items: groupedItems,
        groups: groupedItems.groups,
        getItemsFromGroup: getItemsFromGroup
    });
})();
