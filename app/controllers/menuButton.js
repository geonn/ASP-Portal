var args = arguments[0] || {};
console.log("right:"+JSON.stringify(args));
$.navBarMenubutton.addEventListener('click', function(){
	Ti.App.fireEvent(args);
});
