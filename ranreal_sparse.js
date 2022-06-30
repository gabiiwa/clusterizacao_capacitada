const Grafo = require('./grafo')
const fs = require('fs')

/**
 * Classe onde é realizada a leitura das instâncias RanReal e Sparse
 */
class RanRealSparse {

    numArestas = 0
    numeroElementos = 0
    numeroClusters = 0

    /**
     * Construtor da classe, onde é fornecido o caminho da instância
     * @param {string} caminho 
     */
    constructor(caminho) {

        this.grafoInstancia = new Grafo()

        //faz a leitura do arquivo da instancia
        let dataBuffer = fs.readFileSync(caminho);
        const instancia = dataBuffer.toString().split('\n');

        let i = 0;
        for (const linha of instancia) {
            if (i === 0) {
                // Lendo a primeira linha
                const linha1 = linha.trim().split(' ')

                // Obtendo dados do problema
                this.numeroElementos = parseInt(linha1[0])
                this.numeroClusters = parseInt(linha1[1])

                // Obtem limites inferior e superior da soma dos pesos dos nós
                this.L = parseInt(linha1[3])
                this.U = parseInt(linha1[4])

                // Obtem os pesos dos nós
                const lista_pesos_nos = linha1.slice(linha1.indexOf('W') + 1)

                // Cria os nós no grafo com os pesos
                for (let j = 0; j < lista_pesos_nos.length; j++) {
                    this.grafoInstancia.addNo(j, parseFloat(lista_pesos_nos[j]))
                }
            } else {
                // Cria aresta com peso
                const no = parseInt(linha.split(' ')[0])
                const no_vizinho = parseInt(linha.split(' ')[1])
                const peso = parseFloat(linha.split(' ')[2])

                // Se a aresta tem peso 0, ela não vai influenciar no resultado final
                // então, ela não é incluida no grafo final da instância
                if (peso !== 0 && !isNaN(no) && !isNaN(no_vizinho)) {
                    this.grafoInstancia.addAresta(no, no_vizinho, peso)
                    this.numArestas += 1
                }
            }
            i++;
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
        return this.L
    }

    get_U() {
        return this.U
    }

}

module.exports = RanRealSparse; 