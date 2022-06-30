const Grafo = require('./grafo')
const fs = require('fs')

/**
 * Classe onde é realizada a leitura das instâncias Handover
 */
class Handover {

    numArestas = 0
    numeroElementos = 0
    numeroClusters = 0

    /**
     * Particiona um array em uma matriz, com o tamanho da linha sendo dado
     * pelo parâmetro size
     * @param {array} array 
     * @param {number} size 
     * @returns {array[]} Matriz resultante
     */
    npSplit(array, size) {
        return array.reduce(function (rows, key, index) {
            return (index % size == 0 ? rows.push([key])
                : rows[rows.length - 1].push(key)) && rows;
        }, []);
    }

    /**
     * Construtor da classe, onde é fornecido o caminho da instância
     * @param {string} caminho 
     */
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
                //lendo o array de pesos da aresta,uma linha única
                let array_pesos = ls.split(" ").map(peso => parseFloat(peso))

                // Matriz de interligação entre os nós, peso das arestas
                let matrix_pesos_aresta = this.npSplit(array_pesos, parseInt(this.numeroElementos))

                // Percorre a matriz de interligação para obter as arestas
                for (const [no_ind, no_linha] of matrix_pesos_aresta.entries()) {
                    for (const [viz_ind, valor_viz] of no_linha.entries()) {
                        // Se a aresta tem peso 0, ela não vai influenciar no resultado final
                        // então, ela não é incluida no grafo final da instância
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
        return 0
    }

    get_U() {
        return this.U
    }

}

module.exports = Handover;