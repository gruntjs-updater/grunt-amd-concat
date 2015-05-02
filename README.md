# grunt-amd-concat #

> Build AMD layers the easy way


Build AMD modules into a single layer, without the trouble of a fully fledged builder when pushed into corner case situations. 

The trade-off to pay is that this doesn't automatically pull any dependencies into your build. You'll have to provide the dependencies as a separate layer, either of your own or via a CDN.

A typical use case is when you want to link your code against one or several libraries that are either closed source or in a form that is difficult or impossible to build with the regular builder.



What you configure is the `packages` object that's used for package name resolution, and the layer will contain whatever files you pull into the relevant concat target. 


## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-amd-concat --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-amd-concat');
```

## The "amd_concat" task

### Overview
In your project's Gruntfile, add a section named `amd_concat` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  amd_concat: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    }
  }
});
```

### Options

#### options.packages
Type: `Array`
Default value: `[]`

The packages list. Each array entry has to be an object with at least these two properties : `name` and `location`.

### Usage Examples

The following configuration generates two layers, with two different subsets of the same packages.

```js
grunt.initConfig({
  amd_concat: {
    options: {
        packages : [
            {
                name:"someOtherPackage",
                location: "src/someOtherPackage"
            },
            {
                name:"aPackage",
                location: "src/aPackage"
            },
            {
                name:"app",
                location: "src"
            }
        ]
    },

    mainApp: {
        files: [{
            src:  ['src/MainApp.js','src/aPackage/*.js', 'src/someOtherPackage/*.js'],
            dest: 'tmp/mainAppLayer.js'
        }]
    },
    secondary: {
        files: [{
            src:  ['src/somethingElse.js','src/aPackage/*.js', 'src/someOtherPackage/utils.js'],
            dest: 'tmp/secondaryLayer.js'
        }]
    }
  }
});
```

Please note that this task does not minify the resulting layers. You may want to run something like uglify after it.


## Release History

_0.1.0 : first release, no automated tests yet_

_0.1.1 : stronger package name solver_

_0.1.2 : can include resources : css, html etc..._
