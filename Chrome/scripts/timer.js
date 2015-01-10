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
		if(tabID == 0) {
			chrome.tabs.query({index: 0}, function(tabs) {
				if(tabs[0].active == false) {
					chrome.tabs.update(tabs[0].id, {active: true, selected: true});
				}
			});
		} else {
			chrome.tabs.update(tabID, {active: true, selected: true});
		}
	}
});