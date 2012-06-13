(function () {
    "use strict";

    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    var _currentItem = null;


    ui.Pages.define("/html/itemDetailPage.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var item = options && options.item ? options.item : data.items.getAt(0);
            _currentItem = item;
            
            // Main title is the Group title
            element.querySelector(".titlearea .pagetitle").textContent = item.group.title;

            // Then choose the page layout depending on the type of the item
            var tplSelect;
            switch (item["@type"]) {
                case "VideoObject":
                    tplSelect = "#videoDetailTemplate";
                    break;
                case "ImageObject":
                default:
                    tplSelect = "#imageDetailTemplate";
                    break;
            }

            // For the moment, we use jQuery and underscore, use Windows Template when we figure out how to use them
            var result = _.template($(tplSelect).html(), item);
            // weird: when I add <%= description %> in a template, it crashes
            // problem: if we insert an iframe, it throws an error :/
            $("section", element).append(result);



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


        }
    })
})();
