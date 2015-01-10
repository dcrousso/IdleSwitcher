function save_options() {
	var timeout = document.getElementById("timeout").value;
	var tabID = document.getElementById("tabID").value;
	chrome.storage.sync.set({
		"timeout": parseInt(timeout),
		"tabID": parseInt(tabID)
	}, function() {
		var status = document.getElementById("status");
		status.style.opacity = 1;
		setTimeout(function() {
			status.style.opacity = 0;
		}, 1000);
	});
}
function restore_options() {
	chrome.storage.sync.get({
		"timeout": 15,
		"tabID": 0
	}, function(items) {
		document.getElementById("timeout").value = parseInt(items.timeout);
		document.getElementById(items.tabID).selected = true;
	});
}

var selectTab = document.getElementById("tabID");
chrome.tabs.query({}, function(tabs) {
	tabs.forEach(function(tab) {
		var option = document.createElement("option");
		option.id = tab.id;
		option.value = tab.id;
		option.text = tab.title;
		selectTab.appendChild(option);
	});
});

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);

