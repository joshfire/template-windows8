(function () {
    "use strict";

    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    ui.Pages.define("/pages/itemDetail/itemDetail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var flipView = document.getElementById('detailsFlipView').winControl;
            ui.setOptions(flipView, {
                itemDataSource: Data.items.dataSource,
                itemTemplate: this.itemRenderer,
                currentPage: options.index
            });
        },
        itemRenderer: function (itemPromise) {
            return itemPromise.then(function (currentItem, recycled) {

                var tplSelect;
                switch (currentItem.data["@type"]) {
                    case "VideoObject":
                        tplSelect = document.querySelector('.videoDetailTemplate').winControl;
                        break;
                    case "ImageObject":
                    default:
                        tplSelect = document.querySelector('.imageDetailTemplate').winControl;
                        break;
                }

                tplSelect = tplSelect.renderItem(itemPromise, recycled);

                return tplSelect.element;

            });
        }
    });
})();
