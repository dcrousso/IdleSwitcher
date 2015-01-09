function save_options() {
	var timeout = document.getElementById('timeout').value;
	console.log(timeout);
	chrome.storage.sync.set({
		"timeout": parseInt(timeout)
	}, function() {
		var status = document.getElementById('status');
		status.style.opacity = 1;
		setTimeout(function() {
			status.style.opacity = 0;
		}, 1000);
	});
}
function restore_options() {
	chrome.storage.sync.get({
		"timeout": 900
	}, function(items) {
		document.getElementById('timeout').value = parseInt(items.timeout);
	});
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);