"use strict";
var whitelistEnabledCheckbox;
var whitelistInput;
var blacklistEnabledCheckbox;
var blacklistInput;

window.onload = function() {
	whitelistEnabledCheckbox = document.getElementById('whitelistEnabledCheckbox');
	whitelistInput = document.getElementById('whitelistInput');
	blacklistEnabledCheckbox = document.getElementById('blacklistEnabledCheckbox');
	blacklistInput = document.getElementById('blacklistInput');
	
    restore();
	
    document.getElementById('save').onclick = save;
};

function save() {
	var whitelistEnabled = whitelistEnabledCheckbox.checked;
	var whitelist = whitelistInput.value.split(",");
	var blacklistEnabled = blacklistEnabledCheckbox.checked;
	var blacklist = blacklistInput.value.split(",");
	
	var saveJSON = {whitelistEnabled: whitelistEnabled, whitelist: whitelist, blacklistEnabled: blacklistEnabled, blacklist: blacklist};

    chrome.storage.sync.set(saveJSON, function() {
		window.alert("Changes saved! Refresh any Facebook tabs.");
    });
    chrome.extension.sendMessage({text: 'disconnect'}, undefined);
}

function restore() {
    chrome.storage.sync.get({whitelistEnabled: false, whitelist: [], blacklistEnabled: false, blacklist: []}, restoreJSON);
}

function restoreJSON(data) {
	whitelistEnabledCheckbox.checked = data.whitelistEnabled;
	whitelistInput.value = data.whitelist;
	blacklistEnabledCheckbox.checked = data.blacklistEnabled;
	blacklistInput.value = data.blacklist;
}