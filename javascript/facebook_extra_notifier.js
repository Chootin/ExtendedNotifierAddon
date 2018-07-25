var onlineList = [];
var checkTime = 10000;
var personClass = "_42fz";
var nameSubClass = "_55lr";
var statusContainerClass = "_568z";

//icon: "chrome-extension://graphics/facebook_notifier_icon.png"

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
			notify("Facebook Extended Notifier", name + " has come online!");
		}
	}
	
	onlineList = currentlyOnline;
	
	window.setTimeout(loop, checkTime);
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
			body: body
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