export default class Neuronio {

    pesos = null;
    defineFuncao;

    constructor(pesos) {
        this.setPesos(pesos);
        this.defineFuncao = 0;
    }

    setPesos(pesos) {
        this.pesos = pesos;
    }

    setFuncao(defineFuncao) {
        this.defineFuncao = defineFuncao;
    }

    calculaY(x) {
        let v = 0;
        let i;

        for (i = 0; i < x.length; i++) {
            v = v + this.pesos[i] * x[i];
        }
        v = v + this.pesos[i]; //bias

        switch (this.defineFuncao) {
            case 1:
                return this.tangenteHiperbolica(v);
            default:
                return this.logistica(v);
        }
    }

    logistica(v) {
        return 1 / (1 + Math.exp(-v));
    }


    tangenteHiperbolica(v) {
        return Math.tanh(v);
    }

    toString() {
        let msg = '';
        let i;
        for (i = 0; i < this.pesos.length; i++) {
            msg = msg + this.pesos[i] + ' ';
        }
        return msg;
    }
}
