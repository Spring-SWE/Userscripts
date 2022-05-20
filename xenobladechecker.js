// ==UserScript==
// @name         Xenoblade preorder checker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       Tony
// @match        https://www.nintendo.com/store/products/xenoblade-chronicles-3-special-edition-switch/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hibbard.eu
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==
(function() {
    'use strict';

    (async () => {
        // create and show the notification
        const showNotification = () => {
            // create a new notification
            const notification = new Notification('Xenoblade available for Preorder NOW!');

            // navigate to a URL when clicked
            notification.addEventListener('click', () => {

                window.open('https://www.nintendo.com/store/products/xenoblade-chronicles-3-special-edition-switch/', '_blank');
            });
        }

        // check notification permission
        let granted = false;

        if (Notification.permission === 'granted') {
            granted = true;
        } else if (Notification.permission !== 'denied') {
            let permission = await Notification.requestPermission();
            granted = permission === 'granted' ? true : false;
        }

        const checkAvailabilityStatus = () => {
            $.get("https://graph.nintendo.com/?operationName=ProductDetail&variables=%7B%22slug%22%3A%22xenoblade-chronicles-3-special-edition-switch%22%2C%22locale%22%3A%22en_US%22%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22c6211f0f1ee9c21463b70c891f99476678bc137b0d37374fedabb514e621401f%22%7D%7D", function(data) {
                if (data.data.products[0].availability[0] === 'Coming soon') {
                    console.log('product still TBD....will check again in 30 seconds.')
                    setTimeout(function() {
                        checkAvailabilityStatus();
                    }, 30000);
                } else {
                    // it's up
                    showNotification();
                }
            })
        }
        checkAvailabilityStatus();

    })();

})();
