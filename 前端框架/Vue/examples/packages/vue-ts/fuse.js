const {
    FuseBox,
    VueComponentPlugin,
    QuantumPlugin,
    HTMLPlugin,
    LESSPlugin,
    SassPlugin,
    CSSPlugin,
    CSSResourcePlugin,
    WebIndexPlugin,
    Sparky,
    BabelPlugin,   
    TypeScriptHelpers,
    JSONPlugin 
   
} = require("fuse-box");

let fuse;
let isProduction = false;

Sparky.task("set-prod", () => {
    isProduction = true;
});
Sparky.task("clean", () => Sparky.src("./dist").clean("dist/"));
Sparky.task("watch-assets", () => Sparky.watch("./assets", { base: "./src" }).dest("./dist"));
Sparky.task("copy-assets", () => Sparky.src("./assets", { base: "./src" }).dest("./dist"));

Sparky.task("config", () => {
    fuse = FuseBox.init({
        homeDir: "./src", //Statement "components/admin/editpost.js" has failed to resolve in module "default"
        output: "dist/$name.js",
        //hash: isProduction,
        sourceMaps: !isProduction,
        useTypescriptCompiler: true,
        polyfillNonStandardDefaultUsage: true,
        target: "browser",
        plugins: [
            VueComponentPlugin({
                style: [
                    LESSPlugin({
                      
                       // paths: [path.resolve(__dirname, 'node_modules')]
                    }),
                   // TypeScriptHelpers(),
                    CSSResourcePlugin(),
                    CSSPlugin({
                        group: 'components.css',
                        inject: 'components.css'
                    })
                ]
            }),
            TypeScriptHelpers(),
            CSSPlugin(),
            WebIndexPlugin({
                template: "./index.html"
            }),
            isProduction && QuantumPlugin({
                bakeApiIntoBundle: "vendor",
                uglify: true,
                treeshake: true
            }),
        ],
        shim: {
            jquery: {
                source: "node_modules/jquery/dist/jquery.min.js",
                exports: "$"
            }
            ,tether: {
                source: 'node_modules/tether/dist/js/tether.js',
                exports: 'Tether'
            }
        }
    });

    if(!isProduction){
        fuse.dev({
            open: true,
            port: 8080
        });
    }
    
    const vendor = fuse.bundle("vendor")
        .instructions("~ app.ts");

    const app = fuse.bundle("app")
        .instructions("> [app.ts]");

    if(!isProduction){
        app.watch().hmr();
    }
})

Sparky.task("default", ["clean", "watch-assets", "config"], () => {
    return fuse.run();
});

Sparky.task("dist", [ "clean", "copy-assets", "set-prod", "config"], () => {
    return fuse.run();
});