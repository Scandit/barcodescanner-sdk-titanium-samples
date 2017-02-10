# Scandit Samples for Titanium

This repository contains sample applications that show how to use the Scandit Barcode Scanner SDK together with Titanium. At the moment, one sample application is available.

## Running and Building the Samples from the Command-Line

These instructions show how the sample application can be run from the command-line.

```
cp -r extended  /tmp/extended
cd /tmp/extended
appc new --name=ExtendedSample --id=com.scandit.test --import --no-services
appc alloy install plugin
# asumes that the packages have been downloaded to the Downloads folder. Adjust accordingly
unzip ~/Downloads/scandit-barcodescanner-titanium*.zip
appc run --platform=android --target=device
```

For iOS, you need to specify the provisioning profile (`--pp-uuid`) and developer name (`--developer-name`) for deploying to the device. The complete command will look something like this: `appc run --platform=ios --target=device --developer-name=`Your Name (LASW8D4321)' --pp-uuid='aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'`. To figure out the parameters, just run it once without `--developer-name` and `--pp-uuid` options, which will prompt the available options. Depending on the Appcelerator version, you might need to create a special certificate to sign the application, because automatic signing is not supported. See [this ticket](https://jira.appcelerator.org/browse/TIMOB-24008) for details.

The titanium version defaults to 6.0.0.GA. If you want to test with older versions, you will have to modify the `sdk-version` in `tiapp.xml`.

## Useful Links

* [Scandit Barcode Scanner SDK documentation for Titanium](http://docs.scandit.com/stable/titanium/index.html)

