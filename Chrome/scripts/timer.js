var timeout;
chrome.storage.sync.get({
	"timeout": 15
}, function(items) {
	timeout = items.timeout * 60;
});
chrome.storage.onChanged.addListener(function(changes) {
	if("timeout" in changes) {
		timeout = changes.timeout.newValue * 60;
	}
});
setInterval(function() {
	chrome.idle.queryState(timeout, function(newState) {
		if(newState == "idle") {
			chrome.tabs.query({index: 0}, function(tabs) {
				if(tabs[0].active == false) {
					chrome.tabs.update(tabs[0].id, {active: true, selected: true});
				}
			});
		}
	});
}, 30000);