requirejs.config({

    baseUrl: "./src",

    //Set paths for modules. If relative paths, set relative to baseUrl above.
    //If a special value of "empty:" is used for the path value, then that
    //acts like mapping the path to an empty file. It allows the optimizer to
    //resolve the dependency to path, but then does not include it in the output.
    //Useful to map module names that are to resources on a CDN or other
    //http: URL when running in the browser and during an optimization that
    //file should be skipped because it has no dependencies.
    paths: {
        'socket.io' : 'vendor/socket.io',
        'underscore' : 'vendor/underscore'
    },

    shim: {
        'underscore' : {
            exports: '_'
        }
    }

})