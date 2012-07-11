(function () {
    "use strict";

    var ui = WinJS.UI,
        utils = WinJS.Utilities,
        _currentItem = null;

    var handleShare = function (e) {
        var item = _currentItem,
            requestData = e.request.data;
         //   deferral = e.request.getDeferral();

        if (item.data.name) {
            requestData.properties.title = item.data.name;
        }
        else {
            requestData.properties.title = 'No title for this element.';
        }

        if (item.data.description) {
            requestData.setText(item.data.description);
            requestData.properties.description = item.data.description;
        }
        else {
            requestData.setText("No description available");
            requestData.properties.description = 'No description available.';
        }

        if (item.data.url) {
            var uri = new Windows.Foundation.Uri(item.data.url);
            requestData.setUri(uri);
        }

        if (item.data.thumbnail || item.data.image) {
            var test = item.data.thumbnail;

            getThumb(item).then(function (file) {
                var streamReference = Windows.Storage.Streams.RandomAccessStreamReference.createFromFile(file);

                requestData.properties.thumbnail = streamReference;
                requestData.setStorageItems([file]);
                requestData.setBitmap(streamReference);

                // deferral.complete();
            });

        }

    };

    var getThumb = function (item) {
        var uri = '';
        if (item.data.thumbnail && item.data.thumbnail.length)
            uri = item.data.thumbnail[0].url;
        if (item.data.image)
            uri = item.data.image.contentURL;

        uri = new Windows.Foundation.Uri(uri);

        var thumbnail = Windows.Storage.Streams.RandomAccessStreamReference.createFromUri(uri);
        // Async return lets us use the famous .then();
        return Windows.Storage.StorageFile.createStreamedFileFromUriAsync(item.data.name + ".jpg", uri, thumbnail);
    };

    ui.Pages.define("/pages/itemDetail/itemDetail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var flipView = document.getElementById('detailsFlipView').winControl;
            ui.setOptions(flipView, {
                itemDataSource: Data.items.dataSource,
                itemTemplate: this.itemRenderer,
                currentPage: options.index
            });

            document.querySelector("header[role=banner] .pagetitle").textContent = Data.items.getAt(options.index).name;

            // Set a ref to the item for the sharing event
            _currentItem = Data.items.dataSource.itemFromIndex(options.index)._value;


            // Listen to share event
            var dtm = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
            dtm.ondatarequested = handleShare;

        },
        itemRenderer: function (itemPromise) {

            // Set static elements
            
            return itemPromise.then(function (currentItem, recycled) {

                var tplSelect;
                switch (currentItem.data["@type"]) {
                    case "VideoObject":
                        tplSelect = document.querySelector('.videoDetailTemplate').winControl;
                        break;
                    case "ImageObject":
                    default:
                        tplSelect = document.querySelector('.imageDetailTemplate').winControl;
                        break;
                }

                tplSelect = tplSelect.renderItem(itemPromise, recycled);
                var data = currentItem.data;
                var elem = tplSelect.element._value;

                if (data.author.length) {
                    var iauthor = elem.querySelector('.author');
                    if (iauthor) {
                        iauthor.textContent = 'By ' + data.author.shift().name;
                    }
                    if (data.datePublished) {
                        iauthor.textContent += ' on the ' + toReadableDate(data.datePublished);
                    }

                }

                return tplSelect.element;

            });
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
