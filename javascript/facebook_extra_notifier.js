var whitelistEnabled = false;
var whitelist = [];
var blacklistEnabled = false;
var blacklist = [];

var onlineList = [];
var checkTime = 5000;
var personClass = "_42fz";
var nameSubClass = "_55lr";
var statusContainerClass = "_568z";
var notificationIcon = chrome.extension.getURL('graphics/facebook_notifier_icon.png');

window.addEventListener('load', function () {
	chrome.storage.sync.get({whitelistEnabled: false, whitelist: [], blacklistEnabled: false, blacklist: []}, restoreData);
	window.setTimeout(initialize, checkTime);
});

function restoreData(data) {
	console.log(data);
	whitelistEnabled = data.whitelistEnabled;
	whitelist = data.whitelist;
	blacklistEnabled = data.blacklistEnabled;
	blacklist = data.blacklist;
}

function initialize() {
	onlineList = filterResults(checkOnline());
	console.log("Already online: " + onlineList);
	window.setTimeout(loop, checkTime);
}

function loop() {
	var currentlyOnline = filterResults(checkOnline());
	for (var i in currentlyOnline) {
		var name = currentlyOnline[i];
		if (!onlineList.includes(name)) {
			notify("Facebook Extended Notifier", name + " has come online!");
		}
	}
	
	onlineList = currentlyOnline;
	
	window.setTimeout(loop, checkTime);
}

function filterResults(results) {
	if (whitelistEnabled || blacklistEnabled) {
		console.log(results);
		for (var i = 0; i < results.length; i++) {
			var name = results[i];
			if (whitelistEnabled) {
				if (!whitelist.includes(name)) {
					results.splice(i, 1);
					i--;
					continue;
				}
			}
			
			if (blacklistEnabled) {
				if (blacklist.includes(name)) {
					results.splice(i, 1);
					i--;
					continue;
				}
			}
		}
	}
	return results;
}

function notify(header, body) {
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
			icon: notificationIcon
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
				if (nameEl.childElementCount == 0) {
					onlinePersons.push(nameEl.innerHTML);
				}
			}
		}
	}
	
	return onlinePersons;
}