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
            element.querySelector(".titlearea .pagetitle").textContent = item.group.title;
            element.querySelector("article .item-title").textContent = item.name;
            element.querySelector("article .item-subtitle").textContent = item.description;
            element.querySelector("article .item-image").src = item.image.contentURL;
            element.querySelector("article .item-image").alt = item.name;
            element.querySelector("article .item-video").src = item.embedURL;
//            element.querySelector("article .item-content").innerHTML = item.articleBody;

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
