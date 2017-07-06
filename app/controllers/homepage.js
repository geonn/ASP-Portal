$.button.addEventListener('click', function() {
    Alloy.Globals.pageFlow.addChild({
        controller: 'nextpage',
        navBar: {
            title: 'Nextpage'
        }
    });
});