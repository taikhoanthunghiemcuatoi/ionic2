- How to use 3rd party libs: https://ionicframework.com/docs/v2/resources/third-party-libs/
  + To add an additional library to your app, run: npm install <theLibName> --save.
    . Ex: npm install bcryptjs --save
    (install will download a copy of the library from NPM, and save it in your app's node_modules
     directory. --save will tell the NPM CLI to add an entry to your app's package.json dependency list)
  + If this was just JavaScript, the process above would be enough for installing third party libraries.
    But Ionic 2 uses TypeScript, there is an additional step to the process.
    . Since TypeScript utilizes static types, we need to be able to "describe" code we want to use and import.
      TypeScript does this through type definitions. The TypeScript team actually maintains a large collection of these,
      which can be installed through NPM as well.
      Similar to our library installation, run: npm install @types/<theLibName> --save.
        . Ex: npm install @types/bcryptjs --save

    . In the rare case that types don't exist for your library, there are 02 options to proceed.
      Create a short-hand type definition. (1)
        In the app's src/ directory, make a new file called declarations.d.ts. The .d.ts denotes that the file is a definition file and not actual code.
        In the file, we can add a line to declare our module.
          declare module '<theLibName';
          (All this does is tell the TypeScript compiler that the module is found, and it is an object of any type.
           This will allow the library to be used freely without the TypeScript compiler giving errors)
        For ex:
          declare module 'bcryptjs';
        Use Libraries:
          After installing the library and its type definition, we can use it by importing the library:

      Create a complete type definition. (2)

---20170224---
Pariss-iMac:dms-contact paris$ ionic platform add ios
Adding ios project...

Creating Cordova project for the iOS platform:

        Path: platforms/ios

        Package: com.domisu.contact
        Name: dms-contact

iOS project created with cordova-ios@4.3.1
Installing "cordova-plugin-compat" for ios
Installing "cordova-plugin-console" for ios
Installing "cordova-plugin-contacts" for ios
Dependent plugin "cordova-plugin-compat" already installed on ios.
Installing "cordova-plugin-device" for ios
Installing "cordova-plugin-splashscreen" for ios
Installing "cordova-plugin-statusbar" for ios
Installing "cordova-plugin-whitelist" for ios
Installing "cordova-sqlite-storage" for ios
installing external dependencies via npm
npm install of external dependencies ok
Installing "ionic-plugin-keyboard" for ios

Pariss-iMac:dms-contact paris$

---20170301---
***install the plugin "cordova-plugin-crosswalk-webview" to support minSdkVersion>=16
***URL: https://github.com/crosswalk-project/cordova-plugin-crosswalk-webview
***URL: https://github.com/driftyco/ionic-cli/issues/898
***URL: https://github.com/driftyco/ionic-cli/issues/958
***URL: http://stackoverflow.com/questions/12319809/application-error-the-connection-to-the-server-was-unsuccessful-file-andr
(<preference name="loadUrlTimeoutValue" value="700000" />)
***URL: http://stackoverflow.com/questions/24547924/android-install-failed-version-downgrade
***URL: https://forum.ionicframework.com/t/solved-android-build-broken-in-cordova-6-4-cordova-android-6-0-0-not-working-with-crosswalk/69715/5
***URL: https://github.com/apache/cordova-android/blob/master/RELEASENOTES.md
***URL: https://forum.ionicframework.com/t/showing-blank-white-screen/15545/28

Pariss-iMac:dms-contact paris$ ionic plugin add cordova-plugin-crosswalk-webview --save
Fetching plugin "cordova-plugin-crosswalk-webview@2.3.0" via npm
Installing "cordova-plugin-crosswalk-webview" for android
ANDROID_HOME=/Users/paris/Desktop/workspace/Android/sdk
JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_121.jdk/Contents/Home
Subproject Path: CordovaLib
Starting a new Gradle Daemon for this build (subsequent builds will be faster).
Incremental java compilation is an incubating feature.
:clean
:CordovaLib:clean

BUILD SUCCESSFUL
Total time: 5.24 secs
Subproject Path: CordovaLib
        After much discussion and analysis of the market, we have decided to discontinue support for Android 4.0 (ICS) in Crosswalk starting with version 20.
        So the minSdkVersion of Cordova project is configured to 16 by default.

Installing "cordova-plugin-crosswalk-webview" for ios
        After much discussion and analysis of the market, we have decided to discontinue support for Android 4.0 (ICS) in Crosswalk starting with version 20.
        So the minSdkVersion of Cordova project is configured to 16 by default.

Saved plugin info for "cordova-plugin-crosswalk-webview" to config.xml
Pariss-iMac:dms-contact paris$


