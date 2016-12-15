declare var requirejs: any;

class App {
    public config(): void {
        var pathConfig;
        if (window['env'] === "Development") {
            pathConfig = {
                jquery: ["//cdn.jsdelivr.net/jquery/3.1.1/jquery", "/lib/jquery/dist/jquery"],
                bootstrap: ["//cdn.jsdelivr.net/bootstrap/3.3.7/js/bootstrap", "/lib/bootstrap/dist/js/bootstrap"]
            };
        }
        else {
            pathConfig = {
                jquery: ["//cdn.jsdelivr.net/jquery/3.1.1/jquery.min", "/lib/jquery/dist/jquery.min"],
                bootstrap: ["//cdn.jsdelivr.net/bootstrap/3.3.7/js/bootstrap.min", "/lib/bootstrap/dist/js/bootstrap.min"]
            };
        }
        pathConfig['modernizr'] = "/js/modernizr";

        requirejs.config({
            baseUrl: '/script/',
            paths: pathConfig,
            shim: {
                jquery: { exports: '$' },
                bootstrap: ['jquery'],
                modernizr: { exports: 'Modernizr' }
            }
        });
    }

    public run(): void {
        requirejs(['jquery', 'bootstrap'], ($: any, b: any) => {
        });
    }
}

var app = new App();
app.config();
app.run();