var scanditsdk = require('com.mirasense.scanditsdk');
scanditsdk.appKey = '--- ENTER YOUR SCANDIT LICENSE KEY HERE ---';
scanditsdk.cameraFacingPreference = 0;
var sm = require('settingsmanager');
var code = "";
var sym = "";

var isIOS = (Titanium.Platform.osname === 'iphone' || Titanium.Platform.osname === 'ipad');

function openScanner() {

   var picker = scanditsdk.createView({
        width:Ti.App.Properties.getString('width'),
        height:Ti.App.Properties.getString('height')
    });
    picker.init();

    picker.setEan13AndUpc12Enabled(sm.get('ean13'));
    picker.setEan8Enabled(sm.get('ean8'));
    picker.setUpceEnabled(sm.get('upce'));
    picker.setCode11Enabled(sm.get('code11'));
    picker.setCode25Enabled(sm.get('code25'));
    picker.setCode32Enabled(sm.get('code32'));
    picker.setCode39Enabled(sm.get('code39'));
    picker.setCode93Enabled(sm.get('code93'));
    picker.setCode128Enabled(sm.get('code128'));
    picker.setItfEnabled(sm.get('itf'));
    picker.setMsiPlesseyEnabled(sm.get('msiplessey'));
    picker.setMsiPlesseyChecksumType(sm.get('msiplessey_checksum'));
    picker.setMaxiCodeEnabled(sm.get('maxicode'));
    picker.setDataMatrixEnabled(sm.get('datamatrix'));
    picker.setCodabarEnabled(sm.get('codabar'));
    picker.setQrEnabled(sm.get('qr'));
    picker.setPdf417Enabled(sm.get('pdf417'));
    picker.setMicroPdf417Enabled(sm.get('micropdf417'));
    picker.setKIXEnabled(sm.get('kix'));
    picker.setRM4SCCEnabled(sm.get('rm4scc'));
    picker.setAztecEnabled(sm.get('aztec'));
    picker.setDotCodeEnabled(sm.get('dotcode'));
    picker.setGS1DataBarEnabled(sm.get('databar'));
    picker.setGS1DataBarExpandedEnabled(sm.get('databar_expanded'));
    picker.setGS1DataBarLimitedEnabled(sm.get('databar_limited'));
    picker.setBeepEnabled(sm.get('beep'));
    picker.setVibrateEnabled(sm.get('vibrate'));
    picker.setTorchEnabled(sm.get('torchbutton'));
    picker.setTorchButtonMarginsAndSize(sm.get('torchbuttonx'), sm.get('torchbuttony'), 40, 40);

    picker.setCameraSwitchVisibility(sm.get('camerabutton'));
    picker.setCameraSwitchButtonMarginsAndSize(sm.get('camerabuttonx'), sm.get('camerabuttony'), 40, 40);

    picker.setInverseDetectionEnabled(sm.get('qr_inverted') || sm.get('datamatrix_inverted'));

    picker.drawViewfinder(sm.get('guistyle') == 0);
    picker.setViewfinderSize(
        sm.get('viewfinderwidthportrait'), sm.get('viewfinderheightportrait'),
        sm.get('viewfinderwidthlandscape'), sm.get('viewfinderheightlandscape'));

    picker.showSearchBar(sm.get('searchbar'));

    var splitscreen = (Ti.App.Properties.getString('height') !== "100%");

    // If the active scanning area is bigger than the camera preview we set it to the
    // camera preview's size.
    if (splitscreen && (!sm.get('restrictscanningarea') || sm.get('hotspotheight') > 0.5)) {
        picker.restrictActiveScanningArea(true);
        picker.setScanningHotSpot(0.5, 0.5);
        picker.setScanningHotSpotHeight(0.5);
    } else {
        picker.setScanningHotSpot(parseFloat(sm.get('hotspotx')), parseFloat(sm.get('hotspoty')));
        picker.setScanningHotSpotHeight(sm.get('hotspotheight'));
        // Restricting Active Scanning Area has to be done after setting scanning HotSpot height,
        // because on iOS the setScanningHotSpot method internally enables the active scanning area
        // (by setting activeScanningAreaPortrait and activeScanningAreaLandscape properties).
        picker.restrictActiveScanningArea(sm.get('restrictscanningarea'));
    }

    if (isIOS && !splitscreen) {
        var navwindow = Titanium.UI.iOS.createNavigationWindow({window:$.scanner});
        var window = Titanium.UI.createWindow({
            title:'Scandit SDK',
            navBarHidden:false,
           });
        var bbutton = Titanium.UI.createButton({title:'Back'});
        bbutton.addEventListener('click', function() {
            navwindow.close();
            window.remove(picker);
            $.scanner.close();
        });
        window.setLeftNavButtons([bbutton]);
        navwindow.setWindow(window);
    } else {
        var window = Titanium.UI.createWindow({
            title:'Scandit SDK',
            navBarHidden:true,
        });
    }

    if (splitscreen) {
        var scanlabel = Titanium.UI.createLabel({
            text:'',
            bottom:50
        });
        var bbutton2 = Titanium.UI.createButton({
            title:'Return to Menu',
            bottom:10
        });
        bbutton2.addEventListener('click', function() {
            if (isIOS  && !splitscreen) {
                   navwindow.close();
            } else {
                window.close();
            }
            window.remove(picker);
            $.scanner.close();
        });
        window.add(scanlabel);
        window.add(bbutton2);
    }

    picker.setSuccessCallback(function(e) {

        if (splitscreen) {
            scanlabel.text = 'Scanned Code (' + e.symbology + '): ' + e.barcode;
        } else {
            picker.stopScanning();
            setTimeout(function() {
                   if (isIOS  && !splitscreen) {
                    navwindow.close();
                  } else {
                      window.close();
                  }
                window.remove(picker);
                code = e.barcode;
                sym = e.symbology;
            }, 1);
        }

    });
    picker.setCancelCallback(function(e) {
        picker.stopScanning();
        if (isIOS  && !splitscreen) {
               navwindow.close();
        } else {
            window.close();
        }
        window.remove(picker);
    });

    window.add(picker);
    window.addEventListener('open', function(e) {
        if (typeof window.activity !== "undefined"
            && typeof window.activity.actionBar !== "undefined") {
            // Hide the action bar on android
            window.activity.actionBar.hide();
        }
        picker.startScanning();
    });
    window.addEventListener('close', function(e) {
        $.scanner.close();
        if (code !== "") {
            alert("success (" + sym + "): " + code);
        }
    });
    if (isIOS  && !splitscreen) {
           navwindow.open();
    } else {
        window.open();
    }
}

$.scanner.open();
openScanner();
