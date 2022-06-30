const Grafo = require('./grafo')
const fs = require('fs')
var path = require("path");

class Handover {

    numArestas = 0
    numeroElementos = 0
    numeroClusters = 0

    npSplit(array, size) {
        return array.reduce(function (rows, key, index) {
            return (index % size == 0 ? rows.push([key])
                : rows[rows.length - 1].push(key)) && rows;
        }, []);
    }

    constructor(caminho) {

        this.grafoInstancia = new Grafo()

        //faz a leitura do arquivo da instancia
        let dataBuffer = fs.readFileSync(caminho);
        const instancia = dataBuffer.toString().split('\n');


        //anda pelas linhas
        let i = 0;
        for (const line of instancia) {

            const ls = line.trim()

            if (i === 0) {
                // Lendo a primeira linha
                let linha1 = ls
                this.numeroElementos = parseInt(linha1)
            } else if (i === 1) {
                this.numeroClusters = parseInt(ls)
            } else if (i === 2) {
                //inicializando restrição superior
                this.U = parseFloat(ls)
            } else if (i > 2 && i <= this.numeroElementos + 2) {
                this.grafoInstancia.addNo(i - 3, parseFloat(ls))
            } else {
                //calculando restrição inferior
                //média dos pesos de todos nós
                this.L = this.grafoInstancia.pesos_nos.reduce((a, b) => a + b) / this.numeroElementos
                //this.L = sum(this.grafoInstancia.pesos_nos)/this.numeroElementos
                //lendo o array de pesos da aresta,uma linha única
                let array_pesos = ls.split(" ").map(peso => parseFloat(peso))
                //array_pesos = np.array([float(peso) for peso in ls.split(" ")])
                //matrix de interligação entre os nós, peso das arestas
                let matrix_pesos_aresta = this.npSplit(array_pesos, parseInt(this.numeroElementos))

                for (const [no_ind, no_linha] of matrix_pesos_aresta.entries()) {
                    //for no_ind,no_linha in enumerate(matrix_pesos_aresta):
                    for (const [viz_ind, valor_viz] of no_linha.entries()) {
                        //for viz_ind,valor_viz in enumerate(no_linha):
                        //0.0 é quando não tem ligação
                        if (valor_viz !== 0) {
                            this.grafoInstancia.addAresta(no_ind, viz_ind, valor_viz)
                            this.numArestas += 1
                        }
                    }
                }

            }
            i += 1
        }
    }

    getNumClusters() {
        return this.numeroClusters
    }

    getNumElementos() {
        return this.numeroElementos
    }

    getGrafo() {
        return this.grafoInstancia
    }

    get_L() {
        return 0 //this.L
    }

    get_U() {
        return this.U
    }

}

module.exports = Handover; 

// let inst = new Handover('instancias/handover/20_5_270001.txt')
// console.log(JSON.stringify(inst, null, 4))