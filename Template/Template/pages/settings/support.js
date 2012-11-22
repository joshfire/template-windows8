(function () {
    "use strict";

    var page = WinJS.UI.Pages.define("/pages/settings/support.html", {

        ready: function (element, options) {
            var aboutElement = document.getElementById('js-support-content');
            aboutElement.innerHTML = Joshfire.factory.config.template.options.supporthtml;
        }

    });

})();
