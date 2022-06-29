const RanRealSparse = require('./ranreal_sparse')
const Handover = require('./handover')

// v é do formato {'id': str, 'peso': float, 'grau': int}
// c é no formato [{'id': str, 'peso': float, 'grau': int}]

function tem_aresta_pra_c(instancia, v, c) {

    // Se o conjunto c estiver vazio, considerar que é conexo
    if (c.length === 0) {
        return true
    }

    for (const vertice of c) {
        if (instancia.getGrafo().existeAresta(v.id, vertice.id)) {
            return true
        }
    }

    return false
}

function heuristica_local(instancia, V, c) {
    i = 0
    aux = null
    // console.log('------------- heuristica_local --------------')
    // console.log(list(map(lambda x: x['id'], V)))
    // console.log(c)
    // Enquanto nenhum vértice foi escolhido
    while (aux === null) {
        if (i < V.length) {
            // Obtem o vértice no indice i
            const v = V[i]
            //v tem aresta com pra algum vértice de c
            if (tem_aresta_pra_c(instancia, v, c)) {
                // console.log('tem aresta', i, v)
                aux = v
                V.splice(V.indexOf(v), 1)
            }
            i += 1
        } else {
            // Escolhe o vértice de menor grau se nenhum outro vértice tem
            // aresta pro conjunto c
            v = V[V.length - 1] // vértice de V com menor grau
            // console.log('não tem aresta, retorna o de menor grau', i, v)
            aux = v
            V.splice(V.indexOf(v), 1)
        }
    }
    // console.log('*** depois ***')
    // console.log(list(map(lambda x: x['id'], V)))
    // console.log(c)
    return aux
}

function soma_peso_vertices(c) {
    //console.log('soma_peso_vertices',c)
    let somaArr = [...c]
    const soma = somaArr.map(x => x.peso).reduce((x, y) => x + y, 0)
    return soma
}

function verifica_restricao(instancia, candidato) {
    const soma = soma_peso_vertices(candidato);
    if (soma >= instancia.get_L() && soma <= instancia.get_U()) {
        return true
    }
    return false
}


function construtivo(instancia) {
    // lista de listas de nós
    let S = [] // Solução inicial (começa vazia)
    let c_parcial = [] // Cluster parcial
    let n = instancia.getNumClusters() // Número de clusters indicado na instância 
    let V = [] // Vetor ordenado pelo grau dos vértices, do maior para menor
    let c_espera = [] // Fila de espera

    // Constroi a lista de vertices candidatos
    V = [...instancia.getGrafo().nos]
    V.sort((a, b) => b.grau - a.grau)

    //it=0

    // Enquanto o conjunto de candidatos não for vazio continua no while
    while (V.length > 0 && S.length < n) {
        //console.log('iteração etapa 1:',it)
        let v = heuristica_local(instancia, V, c_parcial) // Seleciona melhor primeiro vértice
        c_linha = c_parcial.concat(v) // Constroi um cluster parcial
        //console.log('v', v)
        //console.log([...c_linha])
        if (verifica_restricao(instancia, c_linha)) {
            // Se o conjunto c atende pelo menos a restrição inferior
            // adiciona o cluster parcial a solução
            S.push([...c_linha])
            // Limpa o cluster parcial
            c_parcial = []
        } else if (soma_peso_vertices(c_linha) < instancia.get_L()) {
            // Se o conjunto c parcial não atende a restrição inferior
            // esse conjunto passa a ser o conjunto c
            c_parcial = [...c_linha]
        } else {

            c_espera.push(v)
            if (verifica_restricao(instancia, c_espera)) {
                // Se o conjunto c atende pelo menos a restrição inferior
                // adiciona o cluster parcial a solução
                S.push([...c_espera])
                // Limpa o cluster parcial
                c_espera = []
            }
        }
        //it+=1
    }

    // Etapa 1.1: Se ainda tiver alguma coisa no c_espera, coloca denovo no V
    // e recalcula a ordenação
    if (c_espera.length > 0) {
        V = V.concat(V, c_espera)
        V.sort((a, b) => b.grau - a.grau)
    }

    // console.log("--- Solução da etapa 1 ---")
    // printSolucao(instancia, S)

    // Na etapa 2, coloca os vértices restantes na melhor posição dentro
    // dos clusters já criados
    // V só será vazio se já formamos o número de clusters máximo
    //num_v = V.length
    while (V.length > 0) {
        //V.sort(reverse=True, key=lambda x: x['grau'])
        let v = V[0]// Seleciona o vértice de maior grau
        maior_soma = -1
        indice_do_cluster_pra_entrar = -1
        

        // Percorre os clusters de S
        for (const [j, s_j] of S.entries()) {
            // Faz a soma dos pesos das arestas de v_i para o cluster s_j
            // percorrendo todas as arestas de v_i e testando se existem
            soma_aresta = 0
            for (const v_j of s_j) {
                //console.log('-->',v_j,v,v_j)
                aresta_vj_v = instancia.getGrafo().getAresta(v_j.id, v.id)
                if (aresta_vj_v !== null) {
                    soma_aresta += aresta_vj_v.peso //peso da aresta v_j e v_i
                }
            }
            // Se a soma das arestas for maior que a soma já armazenada
            // indica o cluster j como o cluster que o v_i vai entrar
            if (soma_aresta > maior_soma) {
                if (soma_peso_vertices(s_j.concat(v)) <= instancia.get_U()) {
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
            //retira v_i da lista c
            V.splice(0, 1)
        } else {
            // O vértice v não tem aresta pra nenhum cluster, ou ele não
            // cabe nos clusters onde ele pode entrar. Nesse caso deve-se
            // incluir esse vértice em qualquer cluster onde ele possa entrar

            // Percorre os clusters de S
            entrou = false
            for (const s_j of S) {
                if (soma_peso_vertices(s_j.concat(v)) <= instancia.get_U()) {
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
        //console.log('etapa 2:', V.length, 'de', num_v)
    }
    return S
}


function getQualidade(instancia, S) {
    let qualidade = 0
    for (const s of S) {
        // Obtem o subgrafo dessa solução
        subgrafo_cluster = instancia.getGrafo().getSubgrafo(s)
        // Calcula a soma dos pesos das arestas e divide por dois, porque essa lista
        // de arestas tá com elas dobradas. Por exemplo, tem a 1-2 e 2-1 na lista.
        if (subgrafo_cluster.arestas.length > 0) {
            qualidade += (subgrafo_cluster.arestas.map(x => x.peso).reduce((a, b) => a + b) / 2.0)
        }
    }
    return qualidade
}


function printSolucao(instancia, S ) {
    console.log(`\nSolução para ${instancia.getNumClusters()} clusters`)
    for (const s of S) {
        console.log(s.map(x => x.id), `\tRestrição: ${instancia.get_L()} <= ${soma_peso_vertices(s)} <= ${instancia.get_U()}`)
    }
    console.log(`\nQualidade da solução: ${getQualidade(instancia, S)}`)
    console.log("Solução no formato pra planília de resultados")
    console.log(`S={${S.map(c => `{${c.map(x => x.id).join(',')}}`)}}`)
}

module.exports = {
    construtivo,
    getQualidade,
    printSolucao,
    verifica_restricao
}

// Teste, comentar quando terminar de desenvolver
// instancia = new RanRealSparse('instancias/Sparse82/Sparse82_02.txt')
// let inicio = new Date().getTime() / 1000;
// let resultado = construtivo(instancia)
// let fim = new Date().getTime() / 1000;
// printSolucao(instancia, resultado)
// console.log('Tempo de execução:',fim-inicio)

// const instancia = new RanRealSparse('instancias/RanReal480/RanReal480_12.txt')
// let inicio = new Date().getTime() / 1000;
// let resultado = construtivo(instancia)
// let fim = new Date().getTime() / 1000;
// printSolucao(instancia, resultado)
// console.log('Tempo de execução:',fim-inicio)

// const instancia = new Handover('instancias/handover/30_5_270003.txt')
// let inicio = new Date().getTime() / 1000;
// let resultado = construtivo(instancia)
// let fim = new Date().getTime() / 1000;
// printSolucao(instancia, resultado)
// console.log('Tempo de execução:', fim - inicio)


// Teste com a instância do enunciado
// instancia2 = new InstanciaTeste()
// printSolucao(instancia2, construtivo(instancia2))