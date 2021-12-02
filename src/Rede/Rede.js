import Neuronio from './Neuronio';

export default class Rede {

    camadaOculta = [];
    camadaSaida  = [];
    saida        = [];

    constructor(numNeuroniosOculta, numNeuroniosSaida) {
        if (numNeuroniosOculta <= 0 || numNeuroniosSaida <= 0) {
            numNeuroniosOculta = 5;
            numNeuroniosSaida  = 4;
        }
        this.camadaOculta = new Neuronio(numNeuroniosOculta);
        this.camadaSaida  = new Neuronio(numNeuroniosSaida);
    }

    setModelWeights(numEntradas, pesos) {
        let k   = 0;
        let tmp = [];

        for (let i = 0; i < this.camadaOculta.length; i++) {
            tmp = Array(numEntradas + 1);
            for (let j = 0; j < numEntradas + 1; j++) {
                tmp[j] = pesos[k];
                k++;
            }
            this.camadaOculta[i] = new Neuronio(tmp);
        }

        for (let i = 0; i < this.camadaSaida.length; i++) {
            tmp = Array(this.camadaOculta.length + 1);
            for (let j = 0; j < this.camadaOculta.length + 1; j++) {
                tmp[j] = pesos[k];
                k++;
            }
            this.camadaSaida[i] = new Neuronio(tmp); //chamando classe Neuronio
        }
    }

    propagation(x) {
        if (x == null) return null;

        let saidaOculta = Array(this.camadaOculta.length);
        this.saida      = Array(this.camadaSaida.length);
        for (let i = 0; i < this.camadaOculta.length; i++) {
            saidaOculta[i] = this.camadaOculta[i].calculaY(x);
        }
        for (let i = 0; i < this.camadaSaida.length; i++) {
            this.saida[i] = this.camadaSaida[i].calculaY(saidaOculta);
        }
        return this.saida;
    }

    toString() {
        let msg = 'Pesos da rede\n';
        msg     = msg + 'Camada Oculta\n';
        for (let i = 0; i < this.camadaOculta.length; i++) {
            msg = msg + 'Neuronio ' + i + ': ' + this.camadaOculta[i] + '\n';
        }
        msg = msg + 'Camada Saida\n';
        for (let i = 0; i < this.camadaSaida.length; i++) {
            msg = msg + 'Neuronio ' + i + ': ' + this.camadaSaida[i] + '\n';
        }
        return msg;
    }
}
