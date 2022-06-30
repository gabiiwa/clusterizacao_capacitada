const { construtivo, verificaRestricao, printSolucao, getQualidade } = require('./construtivo')
const SFCRandom = require('./SFCRandom')

/**
 * Ordena vértices de um cluster pelo somatório das arestas
 * de cada vértice
 * @param {RanRealSparse|Handover} instancia 
 * @param {array} s Cluster da solução
 * @returns {array}
 */
function ordenaVertices(instancia, s) {
    let subgrafo = instancia.getGrafo().getSubgrafo(s)
    let nos = [...subgrafo.nos]

    //vértices de s ordenados pela soma dos pesos das arestas, do menor pro maior
    nos.sort((a, b) => a.somaArestas - b.somaArestas)

    return nos
}

/**
 * Calcula o somatório dos pesos das arestas entrando no cluster pela inserção
 * do vértice 'v'
 * @param {RanRealSparse|Handover} instancia 
 * @param {{ id: integer, peso: float, grau: integer somaArestas: float }} v Vértice entrando no cluster
 * @param {array} s Cluster da solução
 * @returns {float}
 */
function calculaQualidadeEntrada(instancia, v, s) {
    let s_v = [...s]

    // Obtem da lista de adjacência os vizinhos de v
    let vizinhos_de_v = instancia.getGrafo().grafo[v.id];

    // Pega todos os vertices de s que são vizinhos de v
    s_v = s_v.filter(a => vizinhos_de_v.includes(a.id))
    let qualidade = 0

    // Percorre os vertices vizinhos de s
    for (let vizinho of s_v) {
        let aresta = instancia.getGrafo().getAresta(v.id, vizinho.id)
        if (aresta) {
            qualidade += aresta.peso
        }
    }

    return qualidade
}

/**
 * Calcula o somatório dos pesos das arestas saindo no cluster pela inserção
 * do vértice 'v'
 * @param {RanRealSparse|Handover} instancia 
 * @param {{ id: integer, peso: float, grau: integer somaArestas: float }} v Vértice entrando no cluster
 * @param {array} s Cluster da solução
 * @returns {float}
 */
function calculaQualidadeSaida(instancia, v, s) {
    let s_v = [...s]

    // Obtem da lista de adjacência os vizinhos de v
    let vizinhos_de_v = instancia.getGrafo().grafo[v.id];

    // Pega todos os vertices de s que são vizinhos de v
    s_v = s_v.filter(a => vizinhos_de_v.includes(a.id))
    let qualidade = 0

    // Percorre os vertices vizinhos de s
    for (let vizinho of s_v) {
        let aresta = instancia.getGrafo().getAresta(v.id, vizinho.id)
        if (aresta) {
            qualidade += aresta.peso
        }
    }

    return qualidade
}


/**
 * Procedimento de busca local VND, com escolha aleatória de duas vizinhanças
 * @param {RanRealSparse|Handover} instancia 
 * @param {float} tempo 
 * @param {integer} seed 
 * @returns {array[]} Solução melhorada
 */
function buscaLocal(instancia, tempo, seed) {
    // Inicia o gerador de números pseudoaleatórios
    SFCRandom.seed(seed);

    // Calcula a solução inicial
    S = construtivo(instancia)

    // Inicia o contador de tempo
    let inicio = new Date().getTime() / 1000
    let fim = new Date().getTime() / 1000

    while (fim - inicio < tempo) {

        let melhor_vizinho = null;

        // Escolhe aleatoriamente uma vizinhança
        if (SFCRandom.random() > 0.5) {
            // Executa o movimento one_move primeiro
            melhor_vizinho = primeiroVizinhoMelhor_OneMove(instancia, S)
            if (melhor_vizinho === null) {
                // Se o one_move atingir o otimo local, tenta a vizinhança por swap
                melhor_vizinho = primeiroVizinhoMelhor_Swap(instancia, S)
            }
        } else {
            // Executa o movimento swap primeiro
            melhor_vizinho = primeiroVizinhoMelhor_Swap(instancia, S)
            if (melhor_vizinho === null) {
                // Se o one_move atingir o otimo local, tenta a vizinhança por one_move
                melhor_vizinho = primeiroVizinhoMelhor_OneMove(instancia, S)
            }
        }

        if (melhor_vizinho == null) {
            // Se as duas vizinhanças atingirem o ótimo local, para o algoritmo
            break
        } else {
            // Se encontrar uma solução melhor, atualiza a solução S
            S = melhor_vizinho
        }

        // Atualiza o contador de tempo
        fim = new Date().getTime() / 1000
    }

    return S
}
 
/**
 * Faz a diferença dos conjuntos de vértices do cluster com o vértice candidato
 * @param {array} lst1 
 * @param {array} lst2 
 * @returns {array}
 */
function diferenca(lst1, lst2) {
    let comp = lst1.filter(value => [...lst2].map(x => parseInt(x.id)).includes(parseInt(value.id)) === false)
    return comp;
}

/**
 * Faz a união dos conjuntos de vértices por concatenação
 * @param {array} lst1 
 * @param {array} lst2 
 * @returns {array}
 */
function union(lst1, lst2) {
    let uni = lst1.concat(lst2)
    return uni
}

/**
 * Remove um vértice de um cluster pelo id desse vértice
 * @param {array} s Cluster da solução
 * @param {{ id: integer, peso: float, grau: integer somaArestas: float }} v Vértice a remover
 * @returns Vértice removido
 */
function remover(s, v) {
    let i = 0
    for (i = 0; i < s.length; i++) {
        if (s[i].id === v.id) {
            break;
        }
    }
    return s.splice(i, 1)
}

/**
 * Vizinhança dada pelo movimento de tirar um vértice de um cluster e colocar em outro cluster
 * que traga um ganho de qualidade a solução usando Primeiro Aprimorante.
 * @param {RanRealSparse|Handover} instancia 
 * @param {array[]} S 
 * @returns {array[] | null}
 */
function primeiroVizinhoMelhor_OneMove(instancia, S) {

    // Percorre os clusters da solução
    for (let j = 0; j < S.length; j++) { 
        vertices_ordenados = ordenaVertices(instancia, S[j])
        if (vertices_ordenados.length === 0) {
            // Se um cluster não tiver vértices, continua o loop.
            // Essa condição pode acontecer nas instâncias Handover.
            continue
        }

        // Percorre os vértices ordenados pelos pesos das arestas do cluster S[j]
        for (let prox_ind = 0; prox_ind < S[j].length; prox_ind++) {
            v_i = vertices_ordenados[prox_ind]

            // Verifica se retirar o vértice do cluster S[j] viola as restrições
            if (verificaRestricao(instancia, diferenca(S[j], [v_i]))) {

                // Se puder ser retirado, calcula a qualidade de saída
                qualidade_saida = calculaQualidadeSaida(instancia, v_i, S[j])

                // Percorre a solução em s_k, como cluster de destino
                for (let k = j; k < S.length; k++) { 

                    // Garante que o cluster de destino (s_k) é diferente do cluster de origem (s_j)
                    if (k !== j) { 

                        // Verifica se inserir o vertice no cluster S[k] viola as restrições
                        if (verificaRestricao(instancia, union(S[k], [v_i]))) {

                            // Se puder ser inserido, calcula a qualidade de entrada
                            qualidade_entrada = calculaQualidadeEntrada(instancia, v_i, S[k])

                            // Se a qualidade de entrada for maior que a qualidade de saida
                            // significa que vai aumentar o valor da qualidade total da solução
                            // e o movimento é executado na vizinhança
                            if (qualidade_entrada > qualidade_saida) {
                                // retira v_i de s_j
                                remover(S[j], v_i)
                                // colocar v_i em s_k
                                S[k].push(v_i)

                                // Retorna direto a solução na política do primeiro aprimorante
                                return S
                            }
                        } 
                    }
                }
            }
        }
    }

    // Se não encontrar nenhuma solução melhor na vizinhança, 
    // ou seja, chegou no ótimo local, retorna null
    return null
}

/**
 * Vizinhança dada pelo movimento de escolher dois clusters em uma lista 
 * de permutações 2 a 2 aleatórias e trocar um vértice entre eles de forma que
 * que traga um ganho de qualidade a solução usando Primeiro Aprimorante.
 * @param {RanRealSparse|Handover} instancia 
 * @param {array[]} S 
 * @returns {array[] | null}
 */
function primeiroVizinhoMelhor_Swap(instancia, S) {

    let permutacoes = []
    let p_temp = []

    // Gera permutações sem repetição de clusters
    for (let j = 0; j < S.length; j++) {
        for (let k = j; k < S.length; k++) {
            if (j !== k) {
                p_temp.push([j, k])
            }
        }
    }

    // Randomiza as permutações
    while (p_temp.length > 0) {
        let i = parseInt(SFCRandom.random() * p_temp.length)
        if (permutacoes.includes(p_temp[i]) === false) {
            permutacoes.push(p_temp[i])
            p_temp.splice(i, 1);
        }
    }

    // Percorre as permutações de clusters
    for (let p = 0; p < permutacoes.length; p++) {
        let s_j = S[permutacoes[p][0]]
        let s_k = S[permutacoes[p][1]]

        // Ordena os vértices dos clusters
        let vertices_ordenados_j = ordenaVertices(instancia, s_j)
        let vertices_ordenados_k = ordenaVertices(instancia, s_k)

        // Percorre todas as combinações de vértices dos clusters 
        for (let j = 0; j < vertices_ordenados_j.length; j++) {
            for (let k = 0; k < vertices_ordenados_k.length; k++) {
                let vj = vertices_ordenados_j[j]
                let vk = vertices_ordenados_k[k]

                let dif_s_j_vj = diferenca(s_j, [vj])
                let dif_s_k_vk = diferenca(s_k, [vk])
                
                // Verifica restrições de saida e entrada dos vértices dos clusters
                let saida_vj_de_j = verificaRestricao(instancia, dif_s_j_vj)
                let saida_vk_de_k = verificaRestricao(instancia, dif_s_k_vk)
                let entrada_vj_em_k = verificaRestricao(instancia, union(dif_s_k_vk, [vj]))
                let entrada_vk_em_j = verificaRestricao(instancia, union(dif_s_j_vj, [vk]))

                if (saida_vj_de_j && entrada_vj_em_k && saida_vk_de_k && entrada_vk_em_j) {
                    // Se for possível trocar os vértices, calcula as qualidades de saida e entrada
                    // para cada vértice de cada cluster
                    let qualidade_saida_vj_de_j = calculaQualidadeSaida(instancia, vj, s_j) * -1
                    let qualidade_saida_vk_de_k = calculaQualidadeSaida(instancia, vk, s_k) * -1
                    let qualidade_entrada_vj_em_k = calculaQualidadeEntrada(instancia, vj, dif_s_k_vk)
                    let qualidade_entrada_vk_em_j = calculaQualidadeEntrada(instancia, vk, dif_s_j_vj)

                    // A qualidade geral é o somatório das qualidades
                    let qualidade_geral = qualidade_saida_vj_de_j + qualidade_entrada_vj_em_k
                    qualidade_geral += qualidade_saida_vk_de_k + qualidade_entrada_vk_em_j

                    if (qualidade_geral > 0) {
                        // Se o somatório das qualidades for maior que 0, significa um ganho de 
                        // qualidade na solução, executar o movimento

                        // retira vj de _s_j
                        remover(s_j, vj)
                        // retira vk de _s_k
                        remover(s_k, vk)
                        // colocar vj em s_k
                        s_k.push(vj)
                        // colocar vk em s_j
                        s_j.push(vk)

                        // Retorna direto a solução na política do primeiro aprimorante
                        return S
                    }
                }
            }
        }
    }

    // Se não encontrar nenhuma solução melhor na vizinhança, 
    // ou seja, chegou no ótimo local, retorna null
    return null
}

module.exports = {
    buscaLocal,
    ordenaVertices,
    calculaQualidadeEntrada,
    calculaQualidadeSaida,
    diferenca,
    union,
    remover,
    primeiroVizinhoMelhor_OneMove,
    primeiroVizinhoMelhor_Swap
}