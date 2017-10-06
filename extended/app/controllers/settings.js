var sm = require('settingsmanager');
var ready = false;
var symbologies = {
    'ean8': $.ean8,
    'ean13': $.ean13,
    'upce': $.upce,
    'code11': $.code11,
    'code25': $.code25,
    'code39': $.code39,
    'code93': $.code93,
    'code128': $.code128,
    'codabar': $.codabar,
    'databar': $.databar,
    'databar_expanded': $.databar_expanded,
    'databar_limited': $.databar_limited,
    'itf': $.itf,
    'msiplessey': $.msiplessey,
    'maxicode': $.maxicode,
    'qr': $.qr,
    'qr_inverted': $.qr_inverted,
    'pdf417': $.pdf417,
    'micropdf417': $.micropdf417,
    'datamatrix': $.datamatrix,
    'datamatrix_inverted': $.datamatrix_inverted,
    'aztec': $.aztec,
    'kix': $.kix,
    'rm4scc': $.rm4scc
};
var msiplessey_checksums = [
    'None', 'Mod 10', 'Mod 11', 'Mod 1010', 'Mod 1110'
]
var camerabutton_visibilities = [
    'Never', 'Only on tablets', 'Always'
]
var gui_styles = [
    'Frame', 'None'
]
var isIOS = (Titanium.Platform.osname === 'iphone' || Titanium.Platform.osname === 'ipad');

function setupSettings() {
    for (sym in symbologies) {
        symbologies[sym].value = sm.get(sym).toString();
    }
    $.msiplessey_checksumvalue.text = msiplessey_checksums[sm.get('msiplessey_checksum')];

    $.restrictscanningarea.value = sm.get('restrictscanningarea').toString();
    setupSliderSetting('hotspotheight', $.hotspotheight, $.hotspotheightvalue, 2);
    setupSliderSetting('hotspotx', $.hotspotx, $.hotspotxvalue, 2);
    setupSliderSetting('hotspoty', $.hotspoty, $.hotspotyvalue, 2);

    $.guistylevalue.text = gui_styles[sm.get('guistyle')];
    setupSliderSetting('viewfinderwidthportrait', $.viewfinderwidthportrait, $.viewfinderwidthportraitvalue, 2);
    setupSliderSetting('viewfinderheightportrait', $.viewfinderheightportrait, $.viewfinderheightportraitvalue, 2);
    setupSliderSetting('viewfinderwidthlandscape', $.viewfinderwidthlandscape, $.viewfinderwidthlandscapevalue, 2);
    setupSliderSetting('viewfinderheightlandscape', $.viewfinderheightlandscape, $.viewfinderheightlandscapevalue, 2);

    $.searchbar.value = sm.get('searchbar').toString();

    $.beep.value = sm.get('beep').toString();
    $.vibrate.value = sm.get('vibrate').toString();

    $.torchbutton.value = sm.get('torchbutton').toString();
    setupSliderSetting('torchbuttonx', $.torchbuttonx, $.torchbuttonxvalue, 0);
    setupSliderSetting('torchbuttony', $.torchbuttony, $.torchbuttonyvalue, 0);

    $.camerabuttonvalue.text = camerabutton_visibilities[sm.get('camerabutton')];
    setupSliderSetting('camerabuttonx', $.camerabuttonx, $.camerabuttonxvalue, 0);
    setupSliderSetting('camerabuttony', $.camerabuttony, $.camerabuttonyvalue, 0);
    ready = true;
}

function setupSliderSetting(settingId, uiSlider, uiValue, decimals) {
    uiSlider.value = sm.get(settingId);
    uiValue.text = sm.get(settingId).toFixed(decimals);
}

function updateSettings() {
    if (!ready) {
        return;
    }

    for (sym in symbologies) {
        sm.set(sym, JSON.parse(symbologies[sym].value));
    }

    sm.set('restrictscanningarea', JSON.parse($.restrictscanningarea.value));
    updateSliderSetting('hotspotheight', $.hotspotheight, $.hotspotheightvalue, 2);
    updateSliderSetting('hotspotx', $.hotspotx, $.hotspotxvalue, 2);
    updateSliderSetting('hotspoty', $.hotspoty, $.hotspotyvalue, 2);

    updateSliderSetting('viewfinderwidthportrait', $.viewfinderwidthportrait, $.viewfinderwidthportraitvalue, 2);
    updateSliderSetting('viewfinderheightportrait', $.viewfinderheightportrait, $.viewfinderheightportraitvalue, 2);
    updateSliderSetting('viewfinderwidthlandscape', $.viewfinderwidthlandscape, $.viewfinderwidthlandscapevalue, 2);
    updateSliderSetting('viewfinderheightlandscape', $.viewfinderheightlandscape, $.viewfinderheightlandscapevalue, 2);

    sm.set('searchbar', JSON.parse($.searchbar.value));

    sm.set('beep', JSON.parse($.beep.value));
    sm.set('vibrate', JSON.parse($.vibrate.value));

    sm.set('torchbutton', JSON.parse($.torchbutton.value));
    updateSliderSetting('torchbuttonx', $.torchbuttonx, $.torchbuttonxvalue, 0);
    updateSliderSetting('torchbuttony', $.torchbuttony, $.torchbuttonyvalue, 0);

    updateSliderSetting('camerabuttonx', $.camerabuttonx, $.camerabuttonxvalue, 0);
    updateSliderSetting('camerabuttony', $.camerabuttony, $.camerabuttonyvalue, 0);
}

function updateSliderSetting(settingId, uiSlider, uiValue, decimals) {
    sm.set(settingId, parseFloat(uiSlider.value));
    uiValue.text = parseFloat(uiSlider.value).toFixed(decimals);
}

function msiPlesseyChecksum() {
    showDialog('Choose MSI Plessey Checksum', msiplessey_checksums,
        'msiplessey_checksum', $.msiplessey_checksumvalue);
}

function guiStyle() {
    showDialog('Choose GUI Style', gui_styles, 'guistyle', $.guistylevalue);
}

function cameraButtonVisibility() {
    showDialog('Choose Camera Switch Button Visibility', camerabutton_visibilities,
        'camerabutton', $.camerabuttonvalue);
}

function showDialog(title, options, settingId, uiValue) {
    var opts = {
      options: options,
      selectedIndex: sm.get(settingId),
      title: title
    };

    var dialog = Ti.UI.createOptionDialog(opts);
    dialog.addEventListener('click', function(evt) {
        if (evt.index >= 0 && evt.index < options.length) {
            sm.set(settingId, JSON.parse(evt.index));
            uiValue.text = options[sm.get(settingId)];
        }
    });
    dialog.show();
}

setupSettings();
if (isIOS) {
    var navwindow = Titanium.UI.iOS.createNavigationWindow({window:$.index});
    var bbutton = Titanium.UI.createButton({title:'Back'});
    bbutton.addEventListener('click', function() {
        navwindow.close();
        $.settings.close();
    });
    $.settings.setLeftNavButtons([bbutton]);
    navwindow.setWindow($.settings);
    navwindow.open();
} else {
    $.settings.open();
}
