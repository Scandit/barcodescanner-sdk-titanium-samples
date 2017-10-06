/*
 * This code example illustrates how to integrate the Scandit SDK 
 * into your own application.  
 * 
 * IMPORTANT NOTE: Since we added support for landscape scanning
 * in the 1.1.0 version of our plugin, you will need to update the 
 * way you instantiate the Scandit SDK in your Titanium app. See
 * example below for more details. 
 *   
 * The example shows how to add a "start scan" button that invokes
 * the scan view. A Ti.Gesture.addEventListener is used to detect 
 * orientation changes and to update the Scandit SDK picker to 
 * update the camera feed accordingly. If you are intending to 
 * use portrait and landscape mode in your app, make sure that the 
 * supported interface orientations are set correctly in the XCode 
 * project. 
 * 
 * NOTE: You will need a Scandit SDK License Key! If you don't have one
 * yet, sign up at http://www.scandit.com. The Scandit SDK License Key
 * is then available from your Scandit SDK account. 
 * 
 * For more information, see http://www.scandit.com/support or
 * contact us at info@scandit.com. 
 */
// load the Scandit SDK module
var scanditsdk = require("com.mirasense.scanditsdk");
// disable the status bar for the camera view on the iphone and ipad
if(Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad'){
    Titanium.UI.iPhone.statusBarHidden = true;
}
var openScannerIfPermission = function() {
    if (Ti.Media.hasCameraPermissions()) {
        openScanner();
    } else {
        Ti.Media.requestCameraPermissions(function(e) {
            if (e.success) {
                openScanner();
            } else {
                alert('You denied camera permission.');
            }
        });
    }
};
// Sets up the scanner and starts it in a new window.
var openScanner = function() {
    // First set the license key and which direction the camera should face.
    scanditsdk.appKey = "-- ENTER YOUR SCANDIT LICENSE KEY HERE --"; 
    scanditsdk.cameraFacingPreference = 0;
    // Only after setting the license key instantiate the Scandit SDK Barcode Picker view
    var picker = scanditsdk.createView({
        width:"100%",
        height:"100%"
    });
    // Before calling any other functions on the picker you have to call init()
    picker.init();
    // add a tool bar at the bottom of the scan view with a cancel button (iphone/ipad only)
    picker.showToolBar(true);
    // enable a few of the barcode symbologies. Note that the below list of symbologies 
    // is already enabled by default in Titanium. These calls are shown for illustration 
    // purposes. In your application make sure to only enable symbologies that you actually 
    // require and turn off anything else as every additional enabled symbology slows 
    // down recognition.
    picker.setEan13AndUpc12Enabled(true);
    picker.setEan8Enabled(true);
    picker.setUpceEnabled(true);
    picker.setCode39Enabled(true);
    picker.setCode128Enabled(true);
    picker.setQrEnabled(true);
    picker.setDataMatrixEnabled(true);
    // Create a window to add the picker to and display it. 
    var window = Titanium.UI.createWindow({  
            title:'Scandit SDK',
            navBarHidden:true
    });
    
    // Set callback functions for when scanning succeeds and for when the 
    // scanning is canceled. This callback is called on the scan engine's
    // thread to allow you to synchronously call stopScanning or
    // pauseScanning. Any UI specific calls from within this function 
    // have to be issued through setTimeout to switch to the UI thread
    // first.
    picker.setSuccessCallback(function(e) {
        picker.stopScanning();
        
        setTimeout(function() {
            window.close();
            window.remove(picker);
            alert("success (" + e.symbology + "): " + e.barcode);
        }, 1);
    });
    picker.setCancelCallback(function(e) {
        picker.stopScanning();
        window.close();
        window.remove(picker);
    });
    window.add(picker);
    window.addEventListener('open', function(e) {
        picker.startScanning();     // startScanning() has to be called after the window is opened. 
    });
    window.open();
};
// Create button to open and start the scanner
var button = Titanium.UI.createButton({
    "width":200,
    "height": 80,
    "title": "start scanner"
});
button.addEventListener('click', function() {
    openScannerIfPermission();
});
var rootWindow = Titanium.UI.createWindow({
    backgroundColor:'#000'
});
rootWindow.add(button);
rootWindow.open();

