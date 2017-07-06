var BottomNavigation = require('BottomNavigation');

var buttonsSpecs = [
	{
		title : 'First',
		activeIcon : '/images/discussion_green_logo.png',
		inactiveIcon : '/images/discussion_grey_logo.png',
	},
	{
		title : 'Second',
		activeIcon : '/images/notification_green_logo.png',
		inactiveIcon : '/images/notification_grey_logo.png',
	},
	{
		title : 'Third',
		activeIcon : '/images/friend_green_logo.png',
		inactiveIcon : '/images/friend_grey_logo.png',
	}
]; 

var bottomNavigation = BottomNavigation.create({
	buttons : buttonsSpecs,
	activeButtonIndex : 0,
	activeFontColor : "#000",
	//inactiveFontColor : "#A8A8A8",
	rippleColor : "#4DB6AC",
	backgroundColor : '#fff',
	backgroundRipple : true,
	hideInactiveButtonTitle : true
});
$.homepage.add(bottomNavigation);

bottomNavigation.addEventListener('clicked', function(e){
	$.scrollableView.scrollToView(e.index);
});