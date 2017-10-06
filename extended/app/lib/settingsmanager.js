var _defaultSettings = [{
    'ean13':true,
    'ean8':true,
    'upce':true,
    'code11':false,
    'code25':false,
    'code39':true,
    'code93':false,
    'code128':true,
    'itf':true,
    'msiplessey':false,
    'maxicode':false,
    'codabar':false,
    'qr':true,
    'qr_inverted':false,
    'pdf417':false,
    'micropdf417':false,
    'datamatrix':true,
    'datamatrix_inverted':false,
    'aztec':false,
    'databar':false,
    'databar_expanded':false,
    'databar_limited':false,
    'kix':false,
    'rm4scc':false,
    'msiplessey_checksum':1,

    'restrictscanningarea':false,
    'hotspotheight':0.25,
    'hotspotx':0.5,
    'hotspoty':0.5,

    'guistyle':0,
    'viewfinderwidthportrait':0.7,
    'viewfinderheightportrait':0.3,
    'viewfinderwidthlandscape':0.4,
    'viewfinderheightlandscape':0.3,

    'searchbar':false,
    'beep':true,
    'vibrate':true,
    'torchbutton':true,
    'torchbuttonx':15,
    'torchbuttony':15,
    'camerabutton':0,
    'camerabuttonx':15,
    'camerabuttony':15
}];

var _currentSettings = Ti.App.Properties.getList('settings', _defaultSettings);

exports.get = function(label) {
    if (_currentSettings[0][label] !== undefined) {
        return _currentSettings[0][label];
    } else if (_defaultSettings[0][label] !== undefined) { 
        return _defaultSettings[0][label];
    } else {
        return 0;
    }
};

exports.set = function(label, value) {
    _currentSettings[0][label] = value;
    Ti.App.Properties.setList('settings', _currentSettings);
};
