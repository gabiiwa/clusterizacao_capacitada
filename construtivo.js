
/**
 * Verifica se o vértice fornecido tem uma ou mais arestas para um conjunto
 * 'c' de vértices. Se 'c' for vazio, retorna true.
 * @param {RanRealSparse|Handover} instancia 
 * @param {*} v Vértice
 * @param {[{ id: integer, peso: float, grau: integer somaArestas: float }]} c Array de vértices
 * @returns {boolean}
 */
function temArestaPraC(instancia, v, c) {
    // Se o conjunto c estiver vazio, considerar que é conexo
    if (c.length === 0) {
        return true
    }
    // Percorre os vértices no array 'c' procurando por arestas
    for (const vertice of c) {
        if (instancia.getGrafo().existeAresta(v.id, vertice.id)) {
            return true
        }
    }
    return false
}

/**
 * 
 * @param {RanRealSparse|Handover} instancia 
 * @param {*} V Array de vértices candidatos
 * @param {[{ id: integer, peso: float, grau: integer somaArestas: float }]} c Array de vértices
 * @returns {{ id: integer, peso: float, grau: integer somaArestas: float }}
 */
function heuristicaLocal(instancia, V, c) {
    let i = 0
    let aux = null

    // Enquanto nenhum vértice foi escolhido
    while (aux === null) {
        if (i < V.length) {
            // Obtem o vértice no indice i
            const v = V[i]
            //v tem aresta com pra algum vértice de c
            if (temArestaPraC(instancia, v, c)) {
                aux = v
                V.splice(V.indexOf(v), 1)
            }
            i += 1
        } else {
            // Escolhe o vértice de menor grau se nenhum outro vértice tem
            // aresta pro conjunto c
            let v = V[V.length - 1] // vértice de V com menor grau
            aux = v
            V.splice(V.indexOf(v), 1)
        }
    }
    return aux
}

/**
 * Retorna o somatório dos pesos dos vértices
 * @param {[{ id: integer, peso: float, grau: integer somaArestas: float }]} c 
 * @returns {float}
 */
function somaPesoVertices(c) {
    let somaArr = [...c] // Faz uma copia da lista 'c'
    // Mapeia os objetos para um array de floats e usa a função reduce
    // para fazer o somatório de todos os elementos
    const soma = somaArr.map(x => x.peso).reduce((x, y) => x + y, 0)
    return soma
}

/**
 * Verifica se a lista de vértices candidatos é válida para a restrição
 * de L e U presentes na instância
 * @param {RanRealSparse|Handover} instancia 
 * @param {[{ id: integer, peso: float, grau: integer somaArestas: float }]} candidato 
 * @returns {boolean}
 */
function verificaRestricao(instancia, candidato) {
    const soma = somaPesoVertices(candidato);
    if (soma >= instancia.get_L() && soma <= instancia.get_U()) {
        return true
    }
    return false
}

/**
 * Algoritmo construtivo em duas etapas. Uma atendendo a restrição inferior (L)
 * e outra atendendo a restrição superior (U)
 * @param {RanRealSparse|Handover} instancia 
 * @returns {array[]} Solução com n clusters
 */
function construtivo(instancia) {

    let S = [] // Solução inicial
    let c_parcial = [] // Cluster parcial
    let n = instancia.getNumClusters() // Número de clusters indicado na instância 
    let V = [] // Vetor ordenado pelo grau dos vértices, do maior para menor
    let c_espera = [] // Fila de espera

    // Constroi a lista de vertices candidatos
    V = [...instancia.getGrafo().nos]
    V.sort((a, b) => b.grau - a.grau)

    // Etapa 1: Constroi uma solução incompleta com n clusters respeitando a
    // restrição inferior (L)
    while (V.length > 0 && S.length < n) {
        let v = heuristicaLocal(instancia, V, c_parcial) // Seleciona melhor primeiro vértice
        c_linha = c_parcial.concat(v) // Constroi um cluster parcial

        if (verificaRestricao(instancia, c_linha)) {
            // Se o conjunto c atende pelo menos a restrição inferior
            // adiciona o cluster parcial a solução
            S.push([...c_linha])
            // Limpa o cluster parcial
            c_parcial = []
        } else if (somaPesoVertices(c_linha) < instancia.get_L()) {
            // Se o conjunto c parcial não atende a restrição inferior
            // esse conjunto passa a ser o conjunto c
            c_parcial = [...c_linha]
        } else {
            // Se a inserção de v violar a restrição superior, coloca esse vértice
            // em uma lista de espera
            c_espera.push(v)
            if (verificaRestricao(instancia, c_espera)) {
                // Se o conjunto c atende pelo menos a restrição inferior
                // adiciona o cluster parcial a solução
                S.push([...c_espera])
                // Limpa o cluster parcial
                c_espera = []
            }
        }
    }

    // Etapa 1: Se ainda tiver alguma coisa no c_espera, coloca denovo no V
    // e recalcula a ordenação
    if (c_espera.length > 0) {
        V = V.concat(V, c_espera)
        V.sort((a, b) => b.grau - a.grau)
    }


    // Etapa 2: Coloca os vértices restantes na melhor posição dentro
    // dos clusters já criados.
    // V só será vazio se já formamos o número de clusters máximo
    while (V.length > 0) {
        let v = V[0] // Seleciona o vértice de maior grau
        let maior_soma = -1
        let indice_do_cluster_pra_entrar = -1
        
        // Percorre os clusters de S
        for (const [j, s_j] of S.entries()) {
            // Faz a soma dos pesos das arestas de v_i para o cluster s_j
            // percorrendo todas as arestas de v_i e testando se existem
            soma_aresta = 0
            for (const v_j of s_j) {
                aresta_vj_v = instancia.getGrafo().getAresta(v_j.id, v.id)
                if (aresta_vj_v !== null) {
                    soma_aresta += aresta_vj_v.peso //peso da aresta v_j e v_i
                }
            }
            // Se a soma das arestas for maior que a soma já armazenada
            // indica o cluster j como o cluster que o v_i vai entrar
            if (soma_aresta > maior_soma) {
                if (somaPesoVertices(s_j.concat(v)) <= instancia.get_U()) {
                    // Se s_j união v_i atende a restrição superior
                    // marca esse cluster pro vértice entrar
                    indice_do_cluster_pra_entrar = j
                    maior_soma = soma_aresta
                }
            }
        }

        if (indice_do_cluster_pra_entrar != -1) {
            // Coloca o v no cluster que deu a maior soma
            S[indice_do_cluster_pra_entrar] = S[indice_do_cluster_pra_entrar].concat(v)
            // retira v_i da lista c
            V.splice(0, 1)
        } else {
            // O vértice v não tem aresta pra nenhum cluster, ou ele não
            // cabe nos clusters onde ele pode entrar. Nesse caso deve-se
            // incluir esse vértice em qualquer cluster onde ele possa entrar

            // Percorre os clusters de S
            entrou = false
            for (const s_j of S) {
                if (somaPesoVertices(s_j.concat(v)) <= instancia.get_U()) {
                    s_j = s_j.concat(v)
                    V.splice(0, 1)
                    entrou = True
                    break // Interrompe o loop quando achar um cluster pra colocar o vértice
                }
            }
            if (entrou === false) {
                // Não conseguiu colocar em nenhum cluster. Cria um novo mesmo q seja inválido
                S.push([v])
                V.splice(0, 1)
            }
        }
    }

    return S
}

/**
 * Obtem a qualidade da solução
 * @param {RanRealSparse|Handover} instancia 
 * @param {array[]} S 
 * @returns {float}
 */
function getQualidade(instancia, S) {
    let qualidade = 0
    for (const s of S) {
        // Obtem o subgrafo do cluster 's' dessa solução
        let subgrafo_cluster = instancia.getGrafo().getSubgrafo(s)
        // Calcula a soma dos pesos das arestas e divide por dois, porque essa lista
        // de arestas tá com elas dobradas. Por exemplo, tem a 1-2 e 2-1 na lista.
        if (subgrafo_cluster.arestas.length > 0) {
            qualidade += (subgrafo_cluster.arestas.map(x => x.peso).reduce((a, b) => a + b) / 2.0)
        }
    }
    return qualidade
}

/**
 * Imprime a solução encontrada informando a sua qualidade
 * @param {RanRealSparse|Handover} instancia 
 * @param {array[]} S 
 */
function printSolucao(instancia, S ) {
    console.log(`\nSolução para ${instancia.getNumClusters()} clusters`)
    for (const s of S) {
        console.log(s.map(x => x.id), `\tRestrição: ${instancia.get_L()} <= ${somaPesoVertices(s)} <= ${instancia.get_U()}`)
    }
    console.log(`\nQualidade da solução: ${getQualidade(instancia, S)}`)
    console.log("Solução no formato pra planília de resultados")
    console.log(`S={${S.map(c => `{${c.map(x => x.id).join(',')}}`)}}`)
}

module.exports = {
    construtivo,
    getQualidade,
    printSolucao,
    verificaRestricao
}