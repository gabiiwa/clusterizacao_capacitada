
class Grafo {
    constructor() {
        this.grafo = {} // dicionário de nós
        this.nos = [] // lista de dicionários, tendo o formato {id, peso}
        this.arestas = [] // lista de dicionários, tendo o formato {id, vizinho, peso}
        this.pesos_nos = []
    }

    addNo(id, peso) {
        this.grafo[id] = []
        this.nos.push({ id: parseInt(id), peso: parseFloat(peso), grau: 0 })
        this.pesos_nos.push(parseFloat(peso))
    }

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

    existeAresta(id, vizinho){
        return this.grafo[id].includes(vizinho)
    }

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

    addAresta(no, no_vizinho, peso) {
        // print('Add aresta {}-{} com peso {}'.format(no, no_vizinho, peso))
        for (const [x, y] of [[no, no_vizinho], [no_vizinho, no]]) {
            this.grafo[x].push(y)
            // Acrescenta o grau de cada nó
            let no_aux = this.getNo(x)
            no_aux.grau += 1
            // Cria a aresta
            this.arestas.push({ id: x, vizinho: y, peso: peso })
        }
    }

    getSubgrafo(vertices) {
        const g_sub = new Grafo()

        for (const v of vertices) {
            g_sub.addNo(v.id, v.peso)
        }

        for (let i = 0; i < vertices.length; i++) {
            for (let j = i; j < vertices.length; j++) {
                if (i !== j) {
                    let a = this.getAresta(vertices[i].id, vertices[j].id)
                    if (a !== null) {
                        g_sub.addAresta(a.id, a.vizinho, a.peso)
                    }
                }
            }
        }

        return g_sub
    }
}

module.exports = Grafo;

// Teste, comentar quando terminar de desenvolver
// g = new Grafo()
// g.addNo(1, 6)
// g.addNo(2, 4)
// g.addNo(3, 8)
// g.addAresta(1, 2, 3.5)
// g.addAresta(1, 3, 4.5)

// console.log('grafo', g.grafo)
// console.log('arestas', g.arestas)
// console.log('nos', g.nos)
