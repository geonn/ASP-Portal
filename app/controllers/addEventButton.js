var args = arguments[0] || {};

$.view.addEventListener("click", function(e) {
	Ti.App.fireEvent(args);
});