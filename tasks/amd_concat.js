/*
 * grunt-amd-concat
 * https://github.com/mdolidon/grunt-amd-concat
 *
 * Copyright (c) 2015 Mathias Dolidon
 * Licensed under the GPL license.
 */

'use strict';

var uuid = require('node-uuid');
var path = require('path');

function makeLayerHeader() {
    return "require({cache:{";
}


function makeLayerFooter() {
    return "}});\n\ndefine('AMDLayer"+uuid.v4()+"', [], 1);";
}


function processForAmdCache(packages, src, filePath) {

    function removeJsExtension(aPath) {
        return aPath.lastIndexOf(".js")===aPath.length-3 ? aPath.slice(0,aPath.length-3) : aPath;
    }

    function toPackagePrefix(aPath) {
        var normalizedPath = path.resolve(process.cwd(), aPath);

        for(var i=0; i<packages.length; ++i) {
            var normalizedPackageLocation = path.resolve(process.cwd(), packages[i].location);
            if(normalizedPath.slice(0, normalizedPackageLocation.length) === normalizedPackageLocation) {
                return packages[i].name + normalizedPath.slice(normalizedPackageLocation.length);
            }
        }
        return aPath;
    }

    return '"' + toPackagePrefix(removeJsExtension(filePath)) +
        '":function () {' + src + '}';
}

module.exports = function(grunt) {

    grunt.registerMultiTask('amd_concat', 'Build AMD layers the easy way', function() {
        var options = this.options({
            packages:[]
        });


        this.files.forEach(function(f) {

            var layerContent = makeLayerHeader() + 
                
                f.src.filter(function(filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } 
                else {
                    return true;
                }
            }).
                
                map(function(filepath) {
                return processForAmdCache(options.packages,
                                          grunt.file.read(filepath),
                                          filepath
                                         );
            }).
                
                join(',') + makeLayerFooter();



            grunt.file.write(f.dest, layerContent);

            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });

};
