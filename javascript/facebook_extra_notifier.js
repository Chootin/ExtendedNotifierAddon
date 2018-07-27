var whitelistEnabled = false;
var whitelist = [];
var blacklistEnabled = false;
var blacklist = [];

var addonName = "Facebook Extended Notifier";
var onlineList = [];
var checkTime = 5000;
var personClass = "_42fz";
var nameSubClass = "_55lr";
var statusContainerClass = "_568z";
var imageClass = "_1gyw _55lt";
var notificationIcon = chrome.extension.getURL('graphics/facebook_notifier_icon.png');

window.addEventListener('load', function () {
	chrome.storage.sync.get({whitelistEnabled: false, whitelist: [], blacklistEnabled: false, blacklist: []}, restoreData);
});

function restoreData(data) {
	whitelistEnabled = data.whitelistEnabled;
	whitelist = data.whitelist;
	blacklistEnabled = data.blacklistEnabled;
	blacklist = data.blacklist;
	
	//Data acquired. Let's get to it.
	window.setTimeout(initialize, checkTime);
}

function initialize() {
	onlineList = getNameListFromResults(filterResults(checkOnline()));
	notify(addonName, "Facebook Extended Notifier Active.", notificationIcon);
	console.log("Already online: " + onlineList);
	window.setTimeout(loop, checkTime);
}

function loop() {
	var currentlyOnline = filterResults(checkOnline());
	for (var i in currentlyOnline) {
		var result = currentlyOnline[i];
		if (!onlineList.includes(result.name)) {
			notify(addonName, result.name + " has come online!", result.image);
		}
	}
	
	onlineList = getNameListFromResults(currentlyOnline);
	
	window.setTimeout(loop, checkTime);
}

function getNameListFromResults(results) {
	var names = [];
	
	for (var i in results) {
		names.push(results[i].name);
	}
	
	return names;
}

function filterResults(results) {
	if (whitelistEnabled || blacklistEnabled) {
		for (var i = 0; i < results.length; i++) {
			var result = results[i];
			if (whitelistEnabled) {
				if (!whitelist.includes(result.name)) {
					results.splice(i, 1);
					i--;
					continue;
				}
			}
			
			if (blacklistEnabled) {
				if (blacklist.includes(result.name)) {
					results.splice(i, 1);
					i--;
					continue;
				}
			}
		}
	}
	return results;
}

function notify(header, body, imageUrl) {
	if (Notification.permission !== "granted") {
		if (Notification.permission === "denied") {
			window.alert("You must construct additional permissions!");
		}
		
		Notification.requestPermission(function (permission) {
			if (permission === "granted") {
				var notification = new Notification("Notification permission granted!");
			}
		});
	}
	
	if (Notification.permission === "granted") {
		var notificationOptions = {
			body: body,
			icon: imageUrl
		};
		var notification = new Notification(header, notificationOptions);
	}
}

function checkOnline() {
	var onlinePersons = [];
	var persons = document.getElementsByClassName(personClass);

	for (var i in persons) {
		var personEl = persons[i];
		if (personEl.getElementsByClassName) {
			var statusEl = personEl.getElementsByClassName(statusContainerClass)[0];
			var online = false;
			
			try {
				online = statusEl.getElementsByTagName("span").length == 1;
			} catch {
			}
			
			if (online) {
				var nameEl = personEl.getElementsByClassName(nameSubClass)[0];
				var imageUrl = personEl.getElementsByClassName(imageClass)[0].getElementsByTagName("img")[0].src;
				if (nameEl.childElementCount == 0) {
					onlinePersons.push({name: nameEl.innerHTML, image: imageUrl});
				}
			}
		}
	}
	
	return onlinePersons;
}