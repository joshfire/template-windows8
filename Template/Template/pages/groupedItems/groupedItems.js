(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;
    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var utils = WinJS.Utilities;

    var cellW = 175,
        cellH = 250,
        cellRowSpan = 2,
        cellColSpan = 3;

    function getTemplateName(itemIndex, itemType) {
        var isLarge = (itemIndex === 0),
            tplName = '.';

        if (isLarge)
            tplName += 'large';

        switch (itemType) {
            case 'articlestatus':
                tplName = '.status';
                break;
            default:
                tplName += 'item';
                break;
        }

        tplName += 'template';
        return tplName;
    }

    function setBestImageCover(currentItem, img, isLarge) {
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
            img.src = thethumb.contentURL;
            if (img.src.indexOf('http://') < 0) {
                img.src = '/images/placeholders/' + currentItem.simpleType + 'Placeholder.png';
                img.style.left = -((545 - cellW) / 2) + 'px';
                img.style.top = -((510 - cellH) / 2) + 'px';
            }

            /* Set the image tag's dimentions and its position behind its mask */
            if (!thethumb.height || !thethumb.width || (thethumb.height - cellH) < (thethumb.width - cellW)) {
                img.height = cellH;
                // center the image
                var newW = thethumb.width * (cellH / thethumb.height);
                if ((newW - cellW) > 0 && !isLarge)
                    img.style.left = -((newW - cellW) / 2) + 'px';
            }
            else {
                img.width = cellW;
                // center
                var newH = thethumb.height * (cellW / thethumb.width);
                if ((newH - cellH) > 0 && !isLarge)
                    img.style.top = -((newH - cellH) / 2) + 'px';
            }

        }
        else {
            img.src = '/images/placeholders/' + currentItem.data.simpleType + 'Placeholder.png';
            if (!isLarge) {
                /* Set the image tag's dimentions and its position behind its mask */
                img.style.left = -((545 - cellW) / 2) + 'px';
                img.style.top = -((510 - cellH) / 2) + 'px';
            }
        }
    }

    function templateHandler(itemPromise) {
        return itemPromise.then(function (currentItem, recycled) {
            var tplName = getTemplateName(currentItem.data.innerIndex, currentItem.data.simpleType);
            var tplSelect = document.querySelector(tplName).winControl,
                isLarge = (currentItem.data.innerIndex === 0);

            if (!currentItem.data.name)
                currentItem.data.name = 'No name';

            if (!currentItem.data.description)
                currentItem.data.description = 'No description';

            if (!currentItem.data.datePublished)
                currentItem.data.datePublished = 'No Date';

            switch (currentItem.data.simpleType) {

                case 'articlestatus':
                    console.dir(currentItem);

                    currentItem.data.authorName = currentItem.data.author[0].name;
                    currentItem.data.authorAvatar = currentItem.data.author[0].image.contentURL;

                    tplSelect = tplSelect.renderItem(itemPromise, recycled);
                    break;
                default:
                    tplSelect = tplSelect.renderItem(itemPromise, recycled);
                    var coverImage = tplSelect.element._value.querySelector('.thumbnail');
                    setBestImageCover(currentItem, coverImage, isLarge);
                    break;

            }
            
            return tplSelect.element;

        });
    }

    function setThumb(currentItem, tplSelect) {
        // Get the first item and grab its image if it has one. Display it as BG.
        var thethumb = Data.getImageFromGroup(currentItem);

        var img = tplSelect.element._value.querySelector('.tilebackground');
        var src = (thethumb && typeof thethumb !== 'undefined' && thethumb.contentURL) ? thethumb.contentURL : '/images/placeholders/' + currentItem.data.simpleType + 'Placeholder.png';

        img.src = src;
        if (thethumb && typeof thethumb !== 'undefined')
            img.style.top = -(thethumb.height - 120);
        img.width = '100%';

        return tplSelect.element;
    }

    function listTemplateHandler(itemPromise) {
        return itemPromise.then(function (currentItem, recycled) {
            var tplSelect = document.querySelector('.listitemtemplate').winControl;
            tplSelect = tplSelect.renderItem(itemPromise, recycled);
            return setThumb(currentItem, tplSelect);
        });
    }

    function zoomedOutTemplateHandler(itemPromise) {
        return itemPromise.then(function (currentItem, recycled) {
            var tplSelect = document.querySelector('#zoomedOutItemTemplate').winControl;
            tplSelect = tplSelect.renderItem(itemPromise, recycled);
            return setThumb(currentItem, tplSelect);
        });
    }

    function layoutGroupInfoHandler() {
        return {
            enableCellSpanning: true,
            cellWidth: 175,
            cellHeight: 120
        };
    }

    /**
     * Checks internet status and display a warning message
     */
    var checkInternet = function () {
        var internetConnection = Windows.Networking.Connectivity.NetworkInformation.getInternetConnectionProfile();
        var messageElement = document.getElementById("no-internet-message");

        if (internetConnection && internetConnection.getNetworkConnectivityLevel() === Windows.Networking.Connectivity.NetworkConnectivityLevel.internetAccess) {
            if (messageElement) {
                messageElement.style.display = 'none';
            }
            if (!Data.dataloaded && !Data.dataloading) {
                Data.update();
            }
        } else {
            if (messageElement) {
                messageElement.style.display = 'block';
            }
        }
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
            this.initializeLayout(listView, appView.value);

            var zoomedOutListView = element.querySelector(".zoomedOutGroupeditemslist").winControl;
            zoomedOutListView.itemTemplate = zoomedOutTemplateHandler;
            //zoomedOutListView.layout = new ui.ListLayout();

            // Listen to the share event and display nothing
            var dtm = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
            dtm.ondatarequested = Application.nothingToShare;

            // if data have all been loaded, remove spinner (for example, when going to the home page after from a detail page, after a full load)
            if (Data.dataloaded) {
                var loadingControl = document.getElementById('loadingControl');
                loadingControl.style.display = 'none';
            }

            // add app title in the header
            if (Data.appConfig.name) {
                element.querySelector("header[role=banner] .pagetitle").textContent = Data.appConfig.name;
            }

            // replace the application title with the application logo if exists.
            if (Data.appConfig.logo) {
                var logo = document.createElement('img');
                // replace only after loading, we may be in offline mode.
                logo.onload = function () {
                    element.querySelector("header[role=banner] .pagetitle").textContent = '';
                    element.querySelector("header[role=banner] .pagetitle").appendChild(logo);
                };
                logo.src = Data.appConfig.logo.contentURL;
            }

            // check for internet changes 
            Windows.Networking.Connectivity.NetworkInformation.addEventListener("networkstatuschanged", checkInternet);
            // also check now
            checkInternet();
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
