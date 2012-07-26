(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;
    
    var cellW = 175,
        cellH = 250,
        cellRowSpan = 2,
        cellColSpan = 3;


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

            if ((currentItem.data.thumbnail && currentItem.data.thumbnail.length) || currentItem.data.image) {
                var thumbs = currentItem.data.thumbnail,
                    thethumb = { height: 0, width: 0 };
                /* Find the best thumb */
                for (var k in thumbs) {
                    if (thumbs.hasOwnProperty(k)) {
                        /* The first one which has one dimension above cell size */
                        if (!isLarge && (thumbs[k].height >= cellH || thumbs.width >= cellW)) {
                            thethumb = thumbs[k];
                            break;
                        }
                            /* Biggest one or biggest one with both dimensions above cell size */
                        else if (isLarge && (
                            (thumbs[k].height >= (cellH * cellRowSpan) || thumbs.width >= (cellW * cellColSpan)) ||
                            (thumbs[k].height > thethumb.height || thumbs[k].width > thethumb.width)
                            )) {
                            thethumb = thumbs[k];
                        }
                    }
                }

                if (thethumb.height == 0 && thethumb.width == 0)
                    thethumb = currentItem.data.image;

                /* Set the URL */
                img.src = thethumb.contentURL || '/images/placeholders/' + currentItem.data['@type'] + 'Placeholder.png'

                /* Set the image tag's dimentions and its position behind its mask */
                if ((thethumb.height - cellH) < (thethumb.width - cellW)) {
                    img.height = cellH;
                    var newW = thethumb.width * (cellH / thethumb.height);
                    if ((newW - cellW) > 0 && !isLarge)
                        img.style.left = -((newW - cellW) / 2) + 'px';
                }
                else {
                    img.width = cellW;
                    var newH = thethumb.height * (cellW / thethumb.width);
                    if ((newH - cellH) > 0 && !isLarge)
                        img.style.top = -((newH - cellH) / 2) + 'px';
                }

            }
            else {
                img.src = '/images/placeholders/' + currentItem.data['@type'] + 'Placeholder.png'
                img.width = '100%';
                img.height = '100%';
            }

            return tplSelect.element;

        });
    }

    function listTemplateHandler(itemPromise) {
        return itemPromise.then(function (currentItem, recycled) {
            var tplSelect = document.querySelector('.listitemtemplate').winControl;
            

            tplSelect = tplSelect.renderItem(itemPromise, recycled);

            // Get the first item and grab its image if it has one. Display it as BG.
            var firstItem = Data.getItemsFromGroup(currentItem).getAt(0);
            var thethumb = null;

            if (firstItem.image)
                thethumb = firstItem.image;
            if (firstItem.thumbnail && firstItem.thumbnail.length) {
                var bestW = 0;
                for (var k in firstItem.thumbnail) {
                    if (firstItem.thumbnail[k].width > bestW) {
                        thethumb = firstItem.thumbnail[k];
                        bestW = firstItem.thumbnail[k].width;
                    }
                }
            }

            var img = tplSelect.element._value.querySelector('.tilebackground');
            img.src = thethumb.contentURL || '/images/' + currentItem.data['@type'] + 'Placeholder.png';
            img.style.top = -(thethumb.height - 120);
            img.width = '100%';

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

            if (Data.dataloaded) {
                var loadingControl = document.getElementById('loadingControl');
                loadingControl.style.display = 'none';
            }

            if (Data.appConfig.logo) {
                var logo = document.createElement('img');
                logo.src = Data.appConfig.logo.contentURL;
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
