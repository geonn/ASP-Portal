var args = arguments[0] || {};//u_id date

//var rotate = Ti.UI.create2DMatrix().rotate(90);
//var counterRotate = rotate.rotate(-180);

var scrollView = Titanium.UI.createScrollableView({
    showPagingControl:true,
    backgroundColor: "blue",
    classes: ['vert', 'wfill', 'hsize'],
    //transform: rotate
});

scrollView.addView($.UI.create("View", {classes:['wfill', 'hfill'], backgroundColor: "gray"}));
scrollView.addView($.UI.create("View", {classes:['wfill', 'hfill'], backgroundColor: "red"}));
scrollView.addView($.UI.create("View", {classes:['wfill', 'hfill'], backgroundColor: "yellow"}));

$.view.add(scrollView);