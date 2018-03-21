class View<T> {

    private _elemento: Element

    constructor(seletor: string) {
        this._elemento = document.querySelector(seletor)
    }

    update(model: T): void {
        this._elemento.innerHTML = this.template(model)
    }

    template(model: T): string {
        throw new Error('Você deve sobrescrever o método template')
    }   
}