var timeout, tabID;
chrome.storage.sync.get({
	"timeout": 15,
	"tabID": 0
}, function(items) {
	timeout = items.timeout * 60;
	tabID = items.tabID;
	chrome.idle.setDetectionInterval(timeout);
});
chrome.storage.onChanged.addListener(function(changes) {
	if("timeout" in changes) {
		timeout = changes.timeout.newValue * 60;
		chrome.idle.setDetectionInterval(timeout);
	}
	if("tabID" in changes) {
		tabID = changes.tabID.newValue;
	}
});
chrome.idle.onStateChanged.addListener(function(newState) {
	if(newState == "idle" || newState == "locked") {
		if(tabID == -1) {
			toggleToNextTab();
			chrome.alarms.create("inactivityAlarm", {'when': Date.now() + timeout * 1000});
		} else if(tabID == 0) {
			chrome.tabs.query({index:0}, function(tabs) {
				chrome.tabs.update(tabs[0].id, {active: true, selected: true});
			});
		} else {
			chrome.tabs.update(tabID, {active: true, selected: true});
		}
	} else {
		chrome.alarms.clear("inactivityAlarm", function() {});
	}
});
chrome.alarms.onAlarm.addListener(function(alarm) {
	if (alarm.name == 'inactivityAlarm') {
		toggleToNextTab();
		chrome.alarms.create("inactivityAlarm", {'when': Date.now() + timeout * 1000});
	}
});
function toggleToNextTab() {
	chrome.tabs.query({}, function(tabs) {
		if (tabs.length == 0) return;
		var current = tabs.findIndex(function(tab) {return tab.active;});
		chrome.tabs.update(
			tabs[current == tabs.length - 1 ? 0 : current + 1].id,
			{active: true, selected: true}
		);
	});
}
