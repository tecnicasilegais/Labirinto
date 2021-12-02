export default class Neuronio {

    pesos=null;
    defineFuncao;

    constructor(pesos) {
        this.setPesos(pesos);
        this.defineFuncao=0;
    }

    setPesos(pesos){
        this.pesos = pesos;
    }

    setFuncao(defineFuncao){
        this.defineFuncao = defineFuncao;
    }

    calculaY(x) {
        var v = 0;
        var i;
        
        for (i = 0; i < x.length; i++) {
            v = v + this.pesos[i] * x[i];
        }
        v = v + this.pesos[i]; //bias

        switch (this.defineFuncao) {
            case 1:
                this.tangenteHiperbolica(v);
                break;
            default:
                this.logistica(v);
        }
    }

    logistica(v) {
        return 1 / (1 + Math.exp(-v));
    }


    tangenteHiperbolica(v) {
        return Math.tanh(v);
    }

    toString() {
        var msg = "";
        var i;
        for (i = 0; i < this.pesos.length; i++) {
            msg = msg + this.pesos[i] + " ";
        }
        return msg;
    }
}