(function () {
    "use strict";

    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    ui.Pages.define("/pages/itemDetail/itemDetail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var item = options && options.item ? Data.resolveItemReference(options.item) : Data.items.getAt(0);
            element.querySelector(".titlearea .pagetitle").textContent = item.group.title;
            element.querySelector("article .item-title").textContent = item.name;
            element.querySelector("article .item-subtitle").textContent = item.description;
            element.querySelector("article .item-image").src = item.image.contentURL;
            element.querySelector("article .item-image").alt = item.description;
            element.querySelector("article .item-content").innerHTML = item.articleBody;
            element.querySelector(".content").focus();
        }
    });
})();
