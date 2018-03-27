export function domInject(seletor:string) {
    return (target:any, key:string) => {
        let elemento:JQuery 
        Object.defineProperty(target, key, { 
            get: () => (!elemento) ? elemento = $(seletor) : elemento 
        })
    }
}