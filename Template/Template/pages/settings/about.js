(function () {
    "use strict";

    var page = WinJS.UI.Pages.define("/pages/settings/about.html", {

        ready: function (element, options) {
            var aboutElement = document.getElementById('js-about-content');
            aboutElement.innerHTML = Joshfire.factory.config.template.options.abouthtml;
        }

    });

})();
