(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;


    function templateHandler(itemPromise) {
        return itemPromise.then(function (currentItem, recycled) {

            var tplSelect,
                isLarge = (currentItem.data.innerIndex == 0);
            if (isLarge) {
                tplSelect = document.querySelector('.largeitemtemplate').winControl;
            }
            else {
                tplSelect = document.querySelector('.itemtemplate').winControl;
            }

            if (!currentItem.data.name)
                currentItem.data.name = 'No name';

            if (!currentItem.data.description)
                currentItem.data.description = 'No description';


            tplSelect = tplSelect.renderItem(itemPromise, recycled);
            var img = tplSelect.element._value.querySelector('.thumbnail');

            if (currentItem.data.thumbnail.length) {
                var thumbs = currentItem.data.thumbnail,
                    thethumb = {height: 0, width: 0};
                /* Find the best thumb */
                for (var k in thumbs) {
                    if (thumbs.hasOwnProperty(k)) {
                        if (!isLarge && (thumbs[k].height >= 250 || thumbs.width >= 175)) {
                            thethumb = thumbs[k];
                            break;
                        }
                        else if (isLarge && (
                            (thumbs[k].height >= 500 || thumbs.width >= 525) ||
                            (thumbs[k].height > thethumb.height || thumbs[k].width > thethumb.width)
                            )) {
                            thethumb = thumbs[k];
                        }
                    }
                }

                /* Set the image accordingly */
                img.src = thethumb.contentURL;
                img.width = thethumb.width;
                img.height = thethumb.height;

                /* Center it */
                if (!isLarge) {
                    if (thethumb.width > 175)
                        img.style.left = ((175 - parseInt(thethumb.width)) / 2) + 'px';
                    else
                        img.style.left = ((parseInt(thethumb.width) - 175) / 2) + 'px';
                    if (thethumb.height > 250)
                        img.style.top = ((250 - parseInt(thethumb.height)) / 2) + 'px';
                    else
                        img.style.top = ((parseInt(thethumb.height) - 250) / 2) + 'px';
                }
            }

            

            return tplSelect.element;

        });
    }

    function listTemplateHandler(itemPromise) {
        return itemPromise.then(function (currentItem, recycled) {
            var tplSelect = document.querySelector('.listitemtemplate').winControl;
 
            tplSelect = tplSelect.renderItem(itemPromise, recycled);

            return tplSelect.element;

        });
    }

    function layoutGroupInfoHandler() {
        return {
            enableCellSpanning: true,
            cellWidth: 175,
            cellHeight: 250
        };
    }

    ui.Pages.define("/pages/groupedItems/groupedItems.html", {

        // This function updates the ListView with new layouts
        initializeLayout: function (listView, viewState) {
            /// <param name="listView" value="WinJS.UI.ListView.prototype" />

            if (viewState === appViewState.snapped) {
                listView.itemDataSource = Data.groups.dataSource;
                listView.groupDataSource = null;
                listView.itemTemplate = listTemplateHandler;
                listView.layout = new ui.ListLayout();
            } else {
                listView.itemTemplate = templateHandler;
                listView.itemDataSource = Data.homeItems(7).dataSource;
                listView.groupDataSource = Data.homeItems(7).groups.dataSource;
                listView.layout = new ui.GridLayout({ groupHeaderPosition: "top", groupInfo: layoutGroupInfoHandler });
            }
        },

        itemInvoked: function (args) {
            if (appView.value === appViewState.snapped) {
                // If the page is snapped, the user invoked a group.
                var group = Data.groups.getAt(args.detail.itemIndex);
                nav.navigate("/pages/groupDetail/groupDetail.html", { groupKey: group.key });
            } else {
                // If the page is not snapped, the user invoked an item.
                var item = Data.homeItems(7).getAt(args.detail.itemIndex),
                    realIndex = Data.items.indexOf(item);

                nav.navigate("/pages/itemDetail/itemDetail.html", { item: Data.getItemReference(item), index: realIndex });
            }
        },

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            var listView = element.querySelector(".groupeditemslist").winControl;
            listView.groupHeaderTemplate = element.querySelector(".headerTemplate");
            listView.oniteminvoked = this.itemInvoked.bind(this);

            // Listen to the share event
            var dtm = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
            dtm.ondatarequested = null;

            if (Data.appConfig.logo) {
                var logo = document.createElement('img');
                logo.src = Data.appConfig.logo;
                element.querySelector("header[role=banner] .pagetitle").textContent = '';
                element.querySelector("header[role=banner] .pagetitle").appendChild(logo);
            }
            else {
                if (Data.appConfig.name) {
                    element.querySelector("header[role=banner] .pagetitle").textContent = Data.appConfig.name;
                }
            }

            this.initializeLayout(listView, appView.value);
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />
            /// <param name="viewState" value="Windows.UI.ViewManagement.ApplicationViewState" />
            /// <param name="lastViewState" value="Windows.UI.ViewManagement.ApplicationViewState" />

            var listView = element.querySelector(".groupeditemslist").winControl;
            if (lastViewState !== viewState) {
                if (lastViewState === appViewState.snapped || viewState === appViewState.snapped) {
                    var handler = function (e) {
                        listView.removeEventListener("contentanimating", handler, false);
                        e.preventDefault();
                    }
                    listView.addEventListener("contentanimating", handler, false);
                    this.initializeLayout(listView, viewState);
                }
            }
        }
    });
})();
