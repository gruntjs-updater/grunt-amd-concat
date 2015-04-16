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


// Expects packages sorted by decreasing location path length
function processForAmdCache(sortedPackages, src, filePath) {

    function removeJsExtension(aPath) {
        return aPath.lastIndexOf(".js")===aPath.length-3 ? aPath.slice(0,aPath.length-3) : aPath;
    }

    function toPackagePrefix(aPath) {
        var normalizedPath = path.resolve(process.cwd(), aPath);

        for(var i=0; i<sortedPackages.length; ++i) {
            var normalizedPackageLocation = path.resolve(process.cwd(), sortedPackages[i].location) + '/';
            if(normalizedPath.slice(0, normalizedPackageLocation.length) === normalizedPackageLocation) {
                return sortedPackages[i].name + '/' + normalizedPath.slice(normalizedPackageLocation.length);
            }
        }
        throw new Error('Could not resolve a package name for file : ' + filePath); // I know... filePath is in the outer scope
    }                                                                               // Let's act responsibly, this is very small

    return '"' + toPackagePrefix(removeJsExtension(filePath)) +
        '":function () {' + src + '}';
}

module.exports = function(grunt) {

    grunt.registerMultiTask('amd_concat', 'Build AMD layers the easy way', function() {
        var options = this.options({
            packages:[]
        });
        
        var sortedPackages = options.packages.slice();
        sortedPackages.sort(function(a,b) {return b.location.length - a.location.length;});

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
                return processForAmdCache(sortedPackages,
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
