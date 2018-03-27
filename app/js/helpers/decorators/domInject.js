System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function domInject(seletor) {
        return (target, key) => {
            let elemento;
            Object.defineProperty(target, key, {
                get: () => (!elemento) ? elemento = $(seletor) : elemento
            });
        };
    }
    exports_1("domInject", domInject);
    return {
        setters: [],
        execute: function () {
        }
    };
});
