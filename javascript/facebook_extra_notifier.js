var onlineList = [];
var checkTime = 10000;
var personClass = "_42fz";
var nameSubClass = "_55lr";
var statusContainerClass = "_568z";

var notificationOptions = {
	//icon: "chrome-extension://graphics/facebook_notifier_icon.png"
};

window.addEventListener('load', function () {
	window.setTimeout(initialize, checkTime);
});

function initialize() {
	onlineList = checkOnline();
	console.log("Already online: " + onlineList);
	window.setTimeout(loop, checkTime);
}

function loop() {
	var currentlyOnline = checkOnline();
	for (var i in currentlyOnline) {
		var name = currentlyOnline[i];
		if (!onlineList.includes(name)) {
			notify(name + " is online!");
		}
	}
	
	onlineList = currentlyOnline;
	
	window.setTimeout(loop, checkTime);
}

function notify(string) {
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
		var notification = new Notification(string, notificationOptions);
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