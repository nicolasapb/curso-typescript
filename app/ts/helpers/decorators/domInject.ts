export function domInject(seletor:string) {
    return (target:any, key:string) => {
        
        let elemento:JQuery

        const get = () => (!elemento) ? elemento = $(seletor) : elemento

        Object.defineProperty(target, key, { get })
    }
}