﻿// For an introduction to the Grid template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=232446
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;
    WinJS.Binding.optimizeBindingReferences = true;
    WinJS.strictProcessing();

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

            if (app.sessionState.history) {
                nav.history = app.sessionState.history;
            }
            args.setPromise(WinJS.UI.processAll().then(function () {
                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }
            }));
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. If you need to 
        // complete an asynchronous operation before your application is 
        // suspended, call args.setPromise().
        app.sessionState.history = nav.history;
    };

    // Add a privacy policy, support link / email and about page in the settings
    app.onsettings = function (e) {

        var settingPages = {};
        if (Joshfire.factory.config.template.options.supporthtml) {
            settingPages["support"] = { title: "Support", href: "/pages/settings/support.html" };
        }
        if (Joshfire.factory.config.template.options.privacyhtml) {
            settingPages["privacy"] = { title: "Privacy policy", href: "/pages/settings/privacy.html" };
        }
        if (Joshfire.factory.config.template.options.abouthtml) {
            settingPages["about"] = { title: "About", href: "/pages/settings/about.html" };
        }

        e.detail.applicationcommands = settingPages;
        WinJS.UI.SettingsFlyout.populateSettings(e);
    };

    app.start();
})();
