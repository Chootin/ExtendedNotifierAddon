"use strict";

var checkListenerAliveInterval = 15000;
var activeListener;
var nonListeners = [];

// Test alive
window.setTimeout(checkListenerAlive, checkListenerAliveInterval);

function checkListenerAlive() {
    if (activeListener === undefined && nonListeners.length > 0) {
        activeListener = nonListeners.pop();
    }

    if (activeListener !== undefined) {
        chrome.tabs.get(activeListener, function () {
            if (chrome.runtime.lastError) {
                activeListener = undefined;
                if (nonListeners.length > 0) {
                    checkListenerAlive();
                    return;
                }
            }
        });
    }

    window.setTimeout(checkListenerAlive, checkListenerAliveInterval);
}

chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.text === "Should I be watching?") {
        if (activeListener === undefined) {
            activeListener = sender.tab.id;
            sendResponse({watch: true});
        } else {
            nonListeners.push(sender.tab.id);
            sendResponse({watch: false});
        }
    } else if (message.text === 'My watch has ended.') {
        if (sender.tab.id === activeListener) {
            activeListener = undefined;
        } else {
            for (var i = 0; i < nonListeners.length; i++) {
                if (nonListeners[i] === sender.tab.id) {
                    nonListeners.splice(i, 1);
                    return;
                }
            }
        }
    }
});
