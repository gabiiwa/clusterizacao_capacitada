/**
 * Classe que cria uma representação de um grafo não direcionado
 */
class Grafo {
    constructor() {
        this.grafo = {} // dicionário de nós
        this.nos = [] // lista de dicionários, tendo o formato {id, peso}
        this.arestas = [] // lista de dicionários, tendo o formato {id, vizinho, peso}
        this.pesos_nos = []
    }

    /**
     * Adiciona um nó ao grafo
     * @param {integer} id 
     * @param {float} peso 
     */
    addNo(id, peso) {
        this.grafo[id] = []
        this.nos.push({ id: parseInt(id), peso: parseFloat(peso), grau: 0, somaArestas: 0 })
        this.pesos_nos.push(parseFloat(peso))
    }

    /**
     * 
     * @param {integer} id 
     * @returns {{ id: integer, peso: float, grau: integer somaArestas: float }}
     */
    getNo(id) {
        // Filtra os itens da lista de nós pela chave 'id'
        let res = this.nos.filter(x => parseInt(x.id) === parseInt(id))
        if (res.length === 0) {
            // Se não retornar nenhum vértice na lista de retorno
            return null
        } else {
            // Se encontrar algum vértice com 'id' igual, vai ser somente um, e retorna ele
            return res[0]
        }
    }

    /**
     * Testa se uma aresta dada pelo par id-vizinho existe
     * @param {integer} id 
     * @param {integer} vizinho 
     * @returns {boolean}
     */
    existeAresta(id, vizinho){
        return this.grafo[id].includes(vizinho)
    }

    /**
     * Retorna a aresta dada pelo par id-vizinho. Se não existir retorna null
     * @param {integer} id 
     * @param {integer} vizinho 
     * @returns {{ id: integer, vizinho: integer, peso: float } | null}
     */
    getAresta(id, vizinho) {
        // Filtra a lista de arestas por id e vizinho
        const res = this.arestas.filter(x => (parseInt(x.id) === parseInt(id) && parseInt(x.vizinho) === parseInt(vizinho)))
        if (res.length === 0) {
            // Se não retornar nenhuma aresta na lista de retorno
            return null
        } else {
            // Se encontrar alguma aresta com 'id' e 'vizinho' igual, vai ser somente um, e retorna ele
            return res[0]
        }
    }

    /**
     * Adiciona uma aresta ao grafo
     * @param {integer} no 
     * @param {integer} no_vizinho 
     * @param {float} peso 
     */
    addAresta(no, no_vizinho, peso) {
        for (const [x, y] of [[no, no_vizinho], [no_vizinho, no]]) {
            // Acrescenta nó a lista de adjacência
            this.grafo[x].push(y)
            let no_aux = this.getNo(x)
            // Acrescenta o grau de cada nó
            no_aux.grau += 1
            // Acrescenta o peso ao somatório das arestas do vértice
            no_aux.somaArestas += peso
            // Cria a aresta
            this.arestas.push({ id: x, vizinho: y, peso: peso })
        }
    }

    /**
     * Obtem o subgrafo dado o array de objetos de vértices
     * @param {[{ id: integer, peso: float, grau: integer somaArestas: float }]} vertices 
     * @returns {Grafo}
     */
    getSubgrafo(vertices) {
        // Cria o grafo auxiliar
        const g_sub = new Grafo()

        // Adiciona os vértices
        for (const v of vertices) {
            g_sub.addNo(v.id, v.peso)
        }

        // Percorre as combinações de vértices sem repetição
        for (let i = 0; i < vertices.length; i++) {
            for (let j = i; j < vertices.length; j++) {
                if (i !== j) {
                    // Obtem a aresta i-j
                    let a = this.getAresta(vertices[i].id, vertices[j].id)
                    if (a !== null) {
                        // Se a aresta i-j existir, adiciona ao grafo auxiliar
                        g_sub.addAresta(a.id, a.vizinho, a.peso)
                    }
                }
            }
        }

        return g_sub
    }
}

module.exports = Grafo;