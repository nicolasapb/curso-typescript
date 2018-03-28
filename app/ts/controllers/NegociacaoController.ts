import { NegociacoesView, MensagemView } from "../views/index"
import { Negociacoes, Negociacao, NegociacaoParcial } from "../models/index"
import { domInject, throttle } from "../helpers/decorators/index";

export class NegociacaoController {

    @domInject('#data')
    private _inputData: JQuery

    @domInject('#quantidade')
    private _inputQuantidade: JQuery

    @domInject('#valor')
    private _inputValor: JQuery
    private _negociacoes: Negociacoes = new Negociacoes()
    private _negociacoesView = new NegociacoesView('#negociacoesView')
    private _mensageView = new MensagemView('#mensagemView')

    constructor() { 
        this._negociacoesView.update(this._negociacoes)
    }

    @throttle()
    adiciona() {

        let data = new Date(this._inputData.val().replace(/-/g, ','))

        if (!this._ehDiaUtil(data)) {
            this._mensageView.update('Somente negociações em dias úteis, por favor')
            return            
        }

        const negociacao = new Negociacao(
            data,
            parseInt(this._inputQuantidade.val()),
            parseFloat(this._inputValor.val())
        )

        this._negociacoes.adiciona(negociacao)
        this._negociacoesView.update(this._negociacoes)
        this._mensageView.update('Negociação adicionada com sucesso!')
    }

    private _ehDiaUtil(data: Date) {
        return data.getDay() !== DiaDaSemana.Sabado && data.getDay() !== DiaDaSemana.Domingo
    }
    
    @throttle()
    importaDados() {
        
        const isOK = (res:Response) => {
            if (res.ok) {
                return res
            } else {
                throw new Error(res.statusText)
            }
        }

        fetch('http://localhost:8080/dados')
            .then(res => isOK(res))
            .then(res => res.json()) 
            .then((dados:NegociacaoParcial[]) => {
                dados.map(dado => new Negociacao(new Date(), dado.vezes, dado.montante))
                .forEach(negociacao => this._negociacoes.adiciona(negociacao))
                
                this._negociacoesView.update(this._negociacoes)
                this._mensageView.update('Negociação adicionada com sucesso!')
            })
            .catch(error => console.log('erro:', error.message))
    }
}

enum DiaDaSemana {
    Domingo,
    Segunda,
    Terca,
    Quarta,
    Quinta,
    Sexta,
    Sabado
}