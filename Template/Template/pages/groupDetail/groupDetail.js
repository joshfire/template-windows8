(function () {
    "use strict";

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    var templateHandler = function (itemPromise) {
        return itemPromise.then(function(currentItem, recycled) {
            var tpl = document.querySelector(".itemtemplate").winControl;
            tpl = tpl.renderItem(itemPromise, recycled);

            var dateItem = tpl.element._value.querySelector('.item-subtitle');
            dateItem.textContent = toReadableDate(currentItem.data.datePublished);
            
            return tpl.element;
        });
    }

    ui.Pages.define("/pages/groupDetail/groupDetail.html", {

        /// <field type="WinJS.Binding.List" />
        items: null,

        // This function updates the ListView with new layouts
        initializeLayout: function (listView, viewState) {
            /// <param name="listView" value="WinJS.UI.ListView.prototype" />

            if (viewState === appViewState.snapped) {
                listView.layout = new ui.ListLayout();
            } else {
                listView.layout = new ui.GridLayout({ groupHeaderPosition: "left" });
            }
        },

        itemInvoked: function (args) {
            var item = this.items.getAt(args.detail.itemIndex);
            nav.navigate("/pages/itemDetail/itemDetail.html", { item: Data.getItemReference(item), index: Data.items.indexOf(item) });
        },

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var listView = element.querySelector(".itemslist").winControl;
            var group = (options && options.groupKey) ? Data.resolveGroupReference(options.groupKey) : Data.groups.getAt(0);
            this.items = Data.getItemsFromGroup(group);
            var pageList = this.items.createGrouped(
                function groupKeySelector(item) { return group.key; },
                function groupDataSelector(item) { return group; }
            );

            element.querySelector("header[role=banner] .pagetitle").textContent = group.title;
            listView.itemDataSource = pageList.dataSource;
            listView.itemTemplate = templateHandler;
            listView.groupDataSource = pageList.groups.dataSource;
            //listView.groupHeaderTemplate = element.querySelector(".headerTemplate");
            listView.oniteminvoked = this.itemInvoked.bind(this);

            this.initializeLayout(listView, Windows.UI.ViewManagement.ApplicationView.value);
            listView.element.focus();

            // Listen to the share event
            var dtm = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
            dtm.ondatarequested = null;
        },

        unload: function () {
            this.items.dispose();
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />
            /// <param name="viewState" value="Windows.UI.ViewManagement.ApplicationViewState" />
            /// <param name="lastViewState" value="Windows.UI.ViewManagement.ApplicationViewState" />

            var listView = element.querySelector(".itemslist").winControl;
            if (lastViewState !== viewState) {
                if (lastViewState === appViewState.snapped || viewState === appViewState.snapped) {
                    var handler = function (e) {
                        listView.removeEventListener("contentanimating", handler, false);
                        e.preventDefault();
                    }
                    listView.addEventListener("contentanimating", handler, false);
                    var firstVisible = listView.indexOfFirstVisible;
                    this.initializeLayout(listView, viewState);
                    listView.indexOfFirstVisible = firstVisible;
                }
            }
        },

        formatDate: function (str) {

        }
    });
    function toReadableDate(str) {
        var thedate = toDateIso(str);
        var month = thedate.getMonth().toString();
        month = (month.length > 1) ? month : '0' + month;
        return thedate.getDate() + '/' + month + '/' + thedate.getFullYear();
    }
    function toDateIso(iso8601) {

        var s = iso8601.trim();
        s = s.replace(/\.\d\d\d+/, ""); // remove milliseconds
        s = s.replace(/-/, "/").replace(/-/, "/");
        s = s.replace(/T/, " ").replace(/Z/, " UTC");
        s = s.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400

        return new Date(s);
    }
})();
