var properties = arguments[0];

_.each(properties.properties, function(value, key) {
    $.button[key] = value;
});
if(OS_IOS){
	$.button.image = WPATH("images/button/btn-forward-ios.png");
}else{
	$.button.image = WPATH("images/button/btn-forward.png");
}
$.button.title = properties.properties.title || "";
$.button.addEventListener('click', properties.properties.callback || function(e) {
    properties.pageflow.back();
});
