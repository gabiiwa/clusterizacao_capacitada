const Grafo = require('./grafo')

/**
 * Instância de teste usada para o desenvolvimento dos algoritmos
 */
class InstanciaTeste {
    constructor() {
        this.grafoInstancia = new Grafo()
        this.numArestas = 18

        // Teste com o grafo do enunciado do trabalho
        this.grafoInstancia.addNo(0, 1)
        this.grafoInstancia.addNo(1, 1)
        this.grafoInstancia.addNo(2, 2)
        this.grafoInstancia.addNo(3, 3)
        this.grafoInstancia.addNo(4, 1)
        this.grafoInstancia.addNo(5, 1)
        this.grafoInstancia.addNo(6, 1)
        this.grafoInstancia.addNo(7, 1)
        this.grafoInstancia.addNo(8, 1)
        this.grafoInstancia.addNo(9, 1)

        this.grafoInstancia.addAresta(0, 1, 2.0)
        this.grafoInstancia.addAresta(0, 7, 2.0)
        this.grafoInstancia.addAresta(0, 6, 6.0)

        this.grafoInstancia.addAresta(1, 2, 5.0)
        this.grafoInstancia.addAresta(1, 8, 2.0)

        this.grafoInstancia.addAresta(2, 3, 6.0)
        this.grafoInstancia.addAresta(2, 4, 1.0)
        this.grafoInstancia.addAresta(2, 7, 1.0)

        this.grafoInstancia.addAresta(3, 8, 2.0)
        this.grafoInstancia.addAresta(3, 4, 4.0)

        this.grafoInstancia.addAresta(4, 5, 1.0)
        this.grafoInstancia.addAresta(4, 8, 5.0)

        this.grafoInstancia.addAresta(5, 6, 1.0)
        this.grafoInstancia.addAresta(5, 7, 1.0)
        this.grafoInstancia.addAresta(5, 8, 3.0)
        this.grafoInstancia.addAresta(5, 9, 1.0)

        this.grafoInstancia.addAresta(6, 7, 1.0)
        this.grafoInstancia.addAresta(6, 8, 3.0)

        this.grafoInstancia.addAresta(7, 8, 4.0)
        this.grafoInstancia.addAresta(7, 9, 5.0)
    }

    getNumClusters() {
        return 3
    }

    getNumElementos() {
        return 10
    }

    getGrafo() {
        return this.grafoInstancia
    }

    get_L() {
        return 3.0
    }
    
    get_U() {
        return 5.0
    }
}

module.exports = InstanciaTeste;