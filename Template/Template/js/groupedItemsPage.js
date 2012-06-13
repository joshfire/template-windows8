(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    function groupInfo() {
        return {
            enableCellSpanning: true,
            cellWidth: 150,
            cellHeight: 150
        };
    }


    function multisizeItemTemplateRenderer(itemPromise) {
        return itemPromise.then(function (currentItem) {
            var content;
            // Grab the default item template used on the groupeditems page.
            content = document.getElementsByClassName("multisizebaseitemtemplate")[0];
            var result = content.cloneNode(true);

            // Change the CSS class of the item depending on the group, then set the size in CSS.

            // For the first item, use the largest template.
            if (currentItem.index == 0) {
                result.className = "largeitemtemplate";
            }
            else {
                result.className = "mediumitemtemplate";
            }

            // Because we used a WinJS template, we need to strip off some attributes
            // for it to render.
            result.attributes.removeNamedItem("data-win-control");
            result.attributes.removeNamedItem("style");
            result.style.overflow = "hidden";

            // Because we're doing the rendering, we need to put the data into the item.
            // We can't use databinding.
            result.getElementsByClassName("item-image")[0].src = currentItem.data.image.contentURL;
            result.getElementsByClassName("item-title")[0].textContent = currentItem.data.name;
            //result.getElementsByClassName("item-subtitle")[0].textContent = currentItem.data.subtitle;
            return result;
        });
    }


    ui.Pages.define("/html/groupedItemsPage.html", {

        // This function is used in updateLayout to select the data to display
        // from an item's group.
        groupDataSelector: function (item) {
            return {
                title: item.group.title,
                click: function () {
                    nav.navigate("/html/groupDetailPage.html", { group: item.group });
                }
            }
        },

        // This function is used in updateLayout to select an item's group key.
        groupKeySelector: function (item) {
            return item.group.key;
        },

        itemInvoked: function (eventObject) {
            if (appView.value === appViewState.snapped) {
                // If the page is snapped, the user invoked a group.
                var group = data.groups.getAt(eventObject.detail.itemIndex);
                nav.navigate("/html/groupDetailPage.html", { group: group });
            } else {
                // If the page is not snapped, the user invoked an item.
                var item = data.items.getAt(eventObject.detail.itemIndex);
                nav.navigate("/html/itemDetailPage.html", { item: item });
            }
        },

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var listView = element.querySelector(".groupeditemslist").winControl;

            ui.setOptions(listView, {
                groupHeaderTemplate: element.querySelector(".headerTemplate"),
                oniteminvoked: this.itemInvoked.bind(this)
            });

            this.updateLayout(element, appView.value);
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState) {
            var listView = element.querySelector(".groupeditemslist").winControl;
            if (viewState === appViewState.snapped) {
                // If the page is snapped, display a list of groups.
                ui.setOptions(listView, {
                    itemDataSource: data.groups.dataSource,
                    groupDataSource: null,
                    layout: new ui.ListLayout(),
                    itemTemplate: element.querySelector(".itemtemplate")
                });
            } else {
                // If the page is not snapped, display a grid of grouped items.
                var groupDataSource = data.items.createGrouped(this.groupKeySelector, this.groupDataSelector).groups;

                ui.setOptions(listView, {
                    itemDataSource: data.items.dataSource,
                    groupDataSource: groupDataSource.dataSource,
                    layout: new ui.GridLayout({ groupInfo: groupInfo, groupHeaderPosition: "top" }),
                    itemTemplate: multisizeItemTemplateRenderer
                });
            }
        },

    });
})();
