import { NegociacoesView, MensagemView } from "../views/index"
import { Negociacoes, Negociacao, NegociacaoParcial } from "../models/index"
import { domInject, throttle } from "../helpers/decorators/index"
import { NegociacaoService, HandlerFunction } from "../services/index"
import { imprime } from "../helpers/index";

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
    private _service = new NegociacaoService()

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
        imprime(negociacao, this._negociacoes)
        this._negociacoesView.update(this._negociacoes)
        this._mensageView.update('Negociação adicionada com sucesso!')
    }

    private _ehDiaUtil(data: Date) {
        return data.getDay() !== DiaDaSemana.Sabado && data.getDay() !== DiaDaSemana.Domingo
    }
    
    @throttle()
    importaDados() {
        
        const isOK: HandlerFunction = (res:Response) => {
            if (res.ok) {
                return res
            } else {
                throw new Error(res.statusText)
            }
        }
        
        this._service
            .obterNegociacoes(isOK)
            .then(negociacoesImportadas => { 
                
                const negociacoesExistentes = this._negociacoes.paraArray()

                negociacoesImportadas
                    .filter(negociacao => 
                        !negociacoesExistentes.some(jaExiste => 
                            negociacao.ehIgual(jaExiste)))
                    .forEach(negociacao => 
                        this._negociacoes.adiciona(negociacao))
                    
                this._negociacoesView.update(this._negociacoes)
                this._mensageView.update('Negociação adicionada com sucesso!')
            })

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