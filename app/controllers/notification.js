var args = arguments[0] || {};

function init(){
	for(var i = 0; i < 10; i++){
		render({});			
	}
}
init();
function render(param){
	var container = $.UI.create("View",{classes:['wfill','hsize','horz','toucha3a3a3'],backgroundColor:"#fff"});
	var image = $.UI.create("ImageView",{width:50,height:50,classes:['padding'],touchEnabled:"false",image:"/images/asp_square_logo.png"});
	var detailContainer = $.UI.create("View",{classes:['wfill','hsize','padding','vert'],touchEnabled:"false",left:0});
	var description = $.UI.create('Label',{classes:['wsize','hsize'],touchEnabled:"false",left:0,text:"Rex Law also repiled to his comment on Rex Law's photo"});
	var time = $.UI.create('Label',{classes:['wsize','hsize','h5','grey'],touchEnabled:"false",left:0,text:"10 hours agos"});
	detailContainer.add(description);
	detailContainer.add(time);
	container.add(image);
	container.add(detailContainer);
	$.motherView.add(container);
	container = undefined;
	image = undefined;
	detailContainer = undefined;
	description = undefined;
	time = undefined;
}
function getData(){
	
}
