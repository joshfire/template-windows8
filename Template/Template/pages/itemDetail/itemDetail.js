(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;
    var ui = WinJS.UI,
        utils = WinJS.Utilities,
        _currentItem = null,
        flipView = null;

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

        if (item.data.articleBody) {
            requestData.setText(item.data.articleBody.toString());
            requestData.properties.description = item.data.articleBody;
        }

        if (item.data.url) {
            var uri = new Windows.Foundation.Uri(item.data.url);
            requestData.setUri(uri);
        }

        if (item.data.thumbnail || item.data.image) {

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
            flipView = document.getElementById('detailsFlipView').winControl;
            ui.setOptions(flipView, {
                itemDataSource: Data.items.dataSource,
                itemTemplate: this.itemRenderer,
                currentPage: options.index
            });

            // Set a ref to the item for the sharing event
            _currentItem = Data.items.dataSource.itemFromIndex(options.index)._value;

            // Set the title of the page
            if(_currentItem && _currentItem.data && _currentItem.data.name)
                document.querySelector("header[role=banner] .pagetitle").textContent = _currentItem.data.name;

            // Listen to share event
            var dtm = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
            dtm.ondatarequested = handleShare;

            flipView.addEventListener("pageselected", this.itemChanged);


        },

        itemChanged: function(e) {
            // Set a ref to the item for the sharing event
            _currentItem = Data.items.dataSource.itemFromIndex(flipView.currentPage)._value;
            // Set the title of the page
            document.querySelector("header[role=banner] .pagetitle").textContent = _currentItem.data.name;
        },

        itemRenderer: function (itemPromise) {

            // Set static elements
            
            return itemPromise.then(function (currentItem, recycled) {

                var tplSelect;
                switch (currentItem.data["@type"]) {
                    case "VideoObject":
                        return videoRenderer(itemPromise, currentItem, recycled);
                        break;
                    case "ImageObject":
                        return imageRenderer(itemPromise, currentItem, recycled);
                        break;
                    case "BlogPosting":
                        return blogPostingRenderer(itemPromise, currentItem, recycled);
                        break;
                    case "Article/Status":
                        return statusRenderer(itemPromise, currentItem, recycled);
                        break;
                    default:
                        return blogPostingRenderer(itemPromise, currentItem, recycled);
                        break;
                }

            });
        }        
    });

    function blogPostingRenderer(itemPromise, currentItem, recycled) {
        var tplSelect = document.querySelector('.blogpostDetailTemplate').winControl;
        tplSelect = tplSelect.renderItem(itemPromise, recycled);
        var data = currentItem.data;
        var elem = tplSelect.element._value;

        var iauthor = elem.querySelector('.authorname');
        if (iauthor && data.author && data.author.length) {
            iauthor.textContent = data.author[0].name;
        }

        var idate = elem.querySelector('.datepublished');
        if (idate && data.datePublished) {
            idate.textContent = toReadableDate(data.datePublished);
        }

        if (!data.articleBody) data.articleBody = '';

        /* 
        * The render is called several times and we only want the first image to be removed (as it
        * is grabbed by the factory and set on the left). So we set an empty image that'll be caught by the regexp next time.
        */
        data.articleBody = data.articleBody.replace(/<img[^>]+\>/i, '<img style="display:none">');
        
        var iimg = elem.querySelector('.mask img');
        if (data.image) {
            iimg.src = data.image.contentURL;
        }
        else {
            iimg.src = '/images/placeholders/' + currentItem.data['@type'] + 'Placeholder.png';
        }

        utils.setInnerHTML(elem.querySelector('article'), toStaticHTML(data.articleBody));

        return tplSelect.element;
    }

    function statusRenderer(itemPromise, currentItem, recycled) {

        var tplSelect = document.querySelector('.statusDetailTemplate').winControl;
        tplSelect = tplSelect.renderItem(itemPromise, recycled);
        var data = currentItem.data;
        var elem = tplSelect.element._value;

        var iauthor = elem.querySelector('.authorname');
        if (iauthor && data.author && data.author.length) {
            iauthor.textContent = data.author[0].name;
        }

        var idate = elem.querySelector('.datepublished');
        if (idate && data.datePublished) {
            idate.textContent = toReadableDate(data.datePublished);
        }

        if (!data.articleBody) data.articleBody = '';
        
        var iimg = elem.querySelector('.mask img');
        if (data.author && data.author.length && data.author[0].image) {
            iimg.src = data.author[0].image.contentURL;
        }
        else {
            iimg.src = '/images/placeholders/' + currentItem.data['@type'] + 'Placeholder.png';
        }

        utils.setInnerHTML(elem.querySelector('article'), toStaticHTML(data.articleBody));

        return tplSelect.element;
    }

    function imageRenderer(itemPromise, currentItem, recycled) {

        var tplSelect = document.querySelector('.imageDetailTemplate').winControl;
        tplSelect = tplSelect.renderItem(itemPromise, recycled);
        var data = currentItem.data;
        var elem = tplSelect.element._value;

        var iauthor = elem.querySelector('.authorname');
        if (iauthor && data.author && data.author.length) {
            iauthor.textContent = data.author[0].name;
        }

        var idate = elem.querySelector('.datepublished');
        if (idate && data.datePublished) {
            idate.textContent = toReadableDate(data.datePublished);
        }

        return tplSelect.element;
    }

    function videoRenderer(itemPromise, currentItem, recycled) {
        var tplSelect = document.querySelector('.videoDetailTemplate').winControl;
        tplSelect = tplSelect.renderItem(itemPromise, recycled);
        var data = currentItem.data;
        var elem = tplSelect.element._value;

        // iframe cannot be directly binded using WinJS.Binding.Template, it throws a WinJS.Utilities.requireSupportedForProcessing exception.
        var iframe = elem.querySelector('.item-video');
        iframe.src = data.embedURL;

        var iauthor = elem.querySelector('.authorname');
        if (iauthor && data.author && data.author.length) {
            iauthor.textContent = data.author[0].name;
        }

        var idate = elem.querySelector('.datepublished');
        if (idate && data.datePublished) {
            idate.textContent = toReadableDate(data.datePublished);
        }

        return tplSelect.element;
    }

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
