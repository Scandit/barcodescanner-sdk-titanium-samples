function fullscreen() {
    Ti.App.Properties.setString('width', '100%');
    Ti.App.Properties.setString('height', '100%');
    openScanner();
}

function halfscreen() {
    Ti.App.Properties.setString('width', '100%');
    Ti.App.Properties.setString('height', '50%');
    openScanner();
}

function openScanner() {
    if (Ti.Media.hasCameraPermissions === undefined ||
    	Ti.Media.hasCameraPermissions()) {
        Alloy.createController("scanner");
    } else {
        Ti.Media.requestCameraPermissions(function(e) {
            if (e.success) {
            Alloy.createController("scanner");
            } else {
                alert('You denied camera permission.');
            }
        });
    }
}

function settings() {
    Alloy.createController("settings");
}

$.index.open();
