// ==UserScript==
// @name         Xenoblade preorder checker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       Tony
// @description  A simple script to check the status of XB3 Collectors Edition.
// @match        https://www.nintendo.com/store/products/xenoblade-chronicles-3-special-edition-switch/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hibbard.eu
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @run-at document-idle
// ==/UserScript==
(function() {
    'use strict';

    let statusText = '';
    let statusHTML = '';


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
            if (granted === true) {
                $.get("https://graph.nintendo.com/?operationName=ProductDetail&variables=%7B%22slug%22%3A%22xenoblade-chronicles-3-special-edition-switch%22%2C%22locale%22%3A%22en_US%22%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22c6211f0f1ee9c21463b70c891f99476678bc137b0d37374fedabb514e621401f%22%7D%7D", function(data) {
                    if (data.data.products[0].availability[0] === 'Coming soon') {
                        statusText = 'Script is currently running. Please leave page open.';
                        statusHTML = $("<div style='padding:1rem; color:#055160;background-color: #cff4fc;border-color: #b6effb;}'><span class='Textstyles__StyledSpan-sc-14mne8t-3 hNqrMw StoreNotificationstyles__Text-sc-1g8xmtg-5 Pqbsw'>" + statusText + "</span></div>");
                        $('.StoreNotificationstyles__Wrapper-sc-1g8xmtg-0').empty().append(statusHTML);

                        setTimeout(function() {
                            checkAvailabilityStatus();
                        }, 30000);
                    } else {
                        // Preorder is ready to go
                        showNotification();
                    }
                })
            } else {
                statusText = 'This script REQUIRES notifications to be turned on, please do so and refresh,';
                statusHTML = $("<div style='padding:1rem; color:#842029;background-color: #f8d7da;border-color: #b6effb;}'><span class='Textstyles__StyledSpan-sc-14mne8t-3 hNqrMw StoreNotificationstyles__Text-sc-1g8xmtg-5 Pqbsw'>" + statusText + "</span></div>");
                $('.StoreNotificationstyles__Wrapper-sc-1g8xmtg-0').empty().append(statusHTML);
            }

        }
        checkAvailabilityStatus();

    })();

})();
