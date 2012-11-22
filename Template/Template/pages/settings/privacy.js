(function () {
    "use strict";

    var page = WinJS.UI.Pages.define("/pages/settings/privacy.html", {

        ready: function (element, options) {
            var aboutElement = document.getElementById('js-privacy-content');
            aboutElement.innerHTML = Joshfire.factory.config.template.options.privacyhtml;
        }

    });

})();
