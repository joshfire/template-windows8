(function () {
    "use strict";

    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    var _currentItem = null;


    ui.Pages.define("/html/itemDetailPage.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            var flipView = document.getElementById('detailsFlipView').winControl;
            ui.setOptions(flipView, {
                itemDataSource: data.items.dataSource,
                itemTemplate: this.itemRenderer,
                currentPage: options.index
            });


            // Code to handle the sharing
            var dtm = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
            dtm.addEventListener("datarequested", function (e) {
                var item = _currentItem;
                var request = e.request;

                request.data.properties.title = item.name;
                if (item.description) {
                    request.data.properties.description = item.description;
                } else request.data.properties.description = "Pas de description";

                // Share text

                var contenu = (item.description);
                request.data.setText(contenu);
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
    })
})();
