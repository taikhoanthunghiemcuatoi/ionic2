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
