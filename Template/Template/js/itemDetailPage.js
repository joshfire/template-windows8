(function () {
    "use strict";

    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    ui.Pages.define("/html/itemDetailPage.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var item = options && options.item ? options.item : data.items.getAt(0);
            element.querySelector(".titlearea .pagetitle").textContent = item.group.title;
            element.querySelector("article .item-title").textContent = item.name;
            element.querySelector("article .item-subtitle").textContent = item.author;
            element.querySelector("article .item-image").src = item.image.contentURL;
            element.querySelector("article .item-image").alt = item.name;
            element.querySelector("article .item-content").innerHTML = item.articleBody;
        }
    })
})();
