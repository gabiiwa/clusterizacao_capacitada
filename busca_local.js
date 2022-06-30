const { construtivo, verifica_restricao, printSolucao, getQualidade } = require('./construtivo')
const SFCRandom = require('./SFCRandom')

/*
function compare(a, b) {
  if (a is less than b by some ordering criterion) {
    return -1;
  }
  if (a is greater than b by the ordering criterion) {
    return 1;
  }
  // a must be equal to b
  return 0;
}
array.sort(compare)
*/

/////Funções auxiliares//////////
function ordena_vertices(instancia, s) {
    // vertices_cluster = [...s]
    let subgrafo = instancia.getGrafo().getSubgrafo(s)
    let nos = [...subgrafo.nos]

    nos.sort((a, b) => a.somaArestas - b.somaArestas)

    return nos//vértices de s_j ordenados pela soma dos pesos das arestas, do menor pro maior
}


function calcula_qualidade_entrada(instancia, v, s) {
    // let s_v = [...s]
    // s_v.push(v)
    // let subgrafo = instancia.getGrafo().getSubgrafo(s_v)
    // let nos = subgrafo.nos
    // let qualidade = 0
    // for (let i = 0; i < nos.length; i++) {
    //     qualidade += nos[i].somaArestas
    // }
    // return qualidade//soma das arestas de v_i entrando em s_k

    let s_v = [...s]
    let vizinhos_de_v = instancia.getGrafo().grafo[v.id];
    s_v = s_v.filter(a => vizinhos_de_v.includes(a.id)) // Pega todos os vertices de s que são vizinhos de v
    let qualidade = 0
    for (let vizinho of s_v) {
        let aresta = instancia.getGrafo().getAresta(v.id, vizinho.id)
        if (aresta) {
            qualidade += aresta.peso
        }
    }
    return qualidade//soma das arestas de v_i entrando em s_k
}


function calcula_qualidade_saida(instancia, v, s) {
    // let s_v = [...s]
    // s_v.splice(s_v.indexOf(v), 1)
    // let subgrafo = instancia.getGrafo().getSubgrafo(s_v)
    // let nos = subgrafo.nos
    // let qualidade = 0
    // for (let i = 0; i < nos.length; i++) {
    //     qualidade += nos[i].somaArestas
    // }
    // return qualidade //soma das arestas de v_i saindo de s_j

    let s_v = [...s]
    let vizinhos_de_v = instancia.getGrafo().grafo[v.id];
    s_v = s_v.filter(a => vizinhos_de_v.includes(a.id)) // Pega todos os vertices de s que são vizinhos de v
    let qualidade = 0
    for (let vizinho of s_v) {
        let aresta = instancia.getGrafo().getAresta(v.id, vizinho.id)
        if (aresta) {
            qualidade += aresta.peso
        }
    }
    return qualidade //soma das arestas de v_i saindo de s_j
}


/////////Busca Local//////////////
function busca_local(instancia, tempo, seed) {
    //  Gera a solução inicial com o construtivo
    SFCRandom.seed(seed);
    S = construtivo(instancia)
    let conta_sol_viaveis = 0
    let consta_sol_inviaveis = 0
    let inicio = new Date().getTime() / 1000
    let fim = new Date().getTime() / 1000

    while (fim - inicio < tempo) {
        //gera lista de candidatos da vizinhança da solução
        let melhor_vizinho = null;
        if (SFCRandom.random() > 0.5) {
            //console.log('one move')
            melhor_vizinho = primeiro_vizinho_melhor_one_move(instancia, S)
            if (melhor_vizinho === null) {
                //console.log('swap')
                melhor_vizinho = primeiro_vizinho_melhor_swap(instancia, S)
            }
        } else {
            //console.log('swap')
            melhor_vizinho = primeiro_vizinho_melhor_swap(instancia, S)
            if (melhor_vizinho === null) {
                //console.log('one move')
                melhor_vizinho = primeiro_vizinho_melhor_one_move(instancia, S)
            }
        }
        //melhor_vizinho = primeiro_vizinho_melhor_one_move(instancia, S)
        //melhor_vizinho = primeiro_vizinho_melhor_swap(instancia, S)
        if (melhor_vizinho == null) {
            break
        }
        else {
            S = melhor_vizinho
        }
        fim = new Date().getTime() / 1000
        //console.log('tempo:', fim - inicio, tempo)
    }
    return S
}


// def busca_local(instancia):
//     # Gera a solução inicial com o construtivo
//     S = construtivo(instancia)
//     conta_sol_viaveis = 0
//     conta_sol_inviaveis = 0
//     while não chega no critério de parada:
//         # gera lista de candidatos da vizinhança da solução
//         melhor_vizinho = primeiro_vizinho_melhor(S)
//         if melhor_vizinho é None:
//             break
//         else:
//             S = melhor_vizinho
//     return S

// def ordena_vertices(s):
//     return #vértices de s_j ordenados pela soma dos pesos das arestas, do menor pro maior

// def calcula_qualidade_entrada(v, s):
//     return #soma das arestas de v_i entrando em s_k

// def calcula_qualidade_saida(v, s):
//     return #soma das arestas de v_i saindo de s_j

// #----------------
let conta_sol_inviaveis = 0;
let conta_sol_viaveis = 0;

//faz a diferença dos conjuntos de nos do cluster com o nó candidato
function diferenca(lst1, lst2) {
    let comp = lst1.filter(value => [...lst2].map(x => parseInt(x.id)).includes(parseInt(value.id)) === false)
    return comp;
}

function union(lst1, lst2) {
    let uni = lst1.concat(lst2)
    return uni
}

function remover(s, v){
    let i = 0
    for(i=0; i<s.length;i++){
        if(s[i].id === v.id){
            break;
        }
    }
    return s.splice(i, 1)
}

function primeiro_vizinho_melhor_one_move(instancia, S) {
    // Vizinhança de tirar um vertice de um cluster e colocar no outro
    //console.log('teste3',S.length)
    for (let j = 0; j < S.length; j++) { // lista os clusters da solução
        vertices_ordenados = ordena_vertices(instancia, S[j])
        if (vertices_ordenados.length === 0) {
            continue
        }
        //proximo nó candidato dentro de um mesmo cluster
        for (let prox_ind = 0; prox_ind < S[j].length; prox_ind++) {
            //itera nos nós do cluster j, ordenados pelos pesos das arestas
            v_i = vertices_ordenados[prox_ind]
            if (verifica_restricao(instancia, diferenca(S[j], [v_i]))) {
                qualidade_saida = calcula_qualidade_saida(instancia, v_i, S[j])
                for (let k = j; k < S.length; k++) { // Percorre a solução em s_k, como cluster de destino
                    if (k !== j) { // Garante que o cluster de destino (s_k) é diferente do cluster de origem (s_j)
                        //console.log('teste c',v_i,S[j],diferenca([v_i], S[j]))
                        //console.log('teste u',v_i,S[k],union([v_i],S[k]))
                        if (verifica_restricao(instancia, union(S[k], [v_i]))) {
                            qualidade_entrada = calcula_qualidade_entrada(instancia, v_i, S[k])
                            conta_sol_viaveis += 1
                            //console.log('qualidade_entrada',qualidade_entrada,'qualidade_saida',qualidade_saida)
                            if (qualidade_entrada > qualidade_saida) {
                                // retira v_i de s_j
                                remover(S[j], v_i)
                                // colocar v_i em s_k
                                S[k].push(v_i)
                                return S
                            }
                        } else {
                            conta_sol_inviaveis += 1
                        }
                    }
                }
            }

        }

        //console.log('teste2',v_i, S[j])
        //for v_i in vertices_ordenados: // Percorre a lista os vértices do cluster em (v_i) como vértice a mudar

    }
    return null
}

function primeiro_vizinho_melhor_swap(instancia, S) {

    let permutacoes = []
    let p_temp = []
    let qe = getQualidade(instancia, S)

    // Gera permutações de clusters
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

    for (let p = 0; p < permutacoes.length; p++) {
        let s_j = S[permutacoes[p][0]]
        let s_k = S[permutacoes[p][1]]

        //console.log(s_j, s_k)

        let vertices_ordenados_j = ordena_vertices(instancia, s_j)
        let vertices_ordenados_k = ordena_vertices(instancia, s_k)

        for (let j = 0; j < vertices_ordenados_j.length; j++) {
            for (let k = 0; k < vertices_ordenados_k.length; k++) {
                let vj = vertices_ordenados_j[j]
                let vk = vertices_ordenados_k[k]

                // Verifica restrições
                let dif_s_j_vj = diferenca(s_j, [vj])
                let dif_s_k_vk = diferenca(s_k, [vk])

                let saida_vj_de_j = verifica_restricao(instancia, dif_s_j_vj)
                let saida_vk_de_k = verifica_restricao(instancia, dif_s_k_vk)
                let entrada_vj_em_k = verifica_restricao(instancia, union(dif_s_k_vk, [vj]))
                let entrada_vk_em_j = verifica_restricao(instancia, union(dif_s_j_vj, [vk]))

                if (saida_vj_de_j && entrada_vj_em_k && saida_vk_de_k && entrada_vk_em_j) {
                    let qualidade_saida_vj_de_j = calcula_qualidade_saida(instancia, vj, s_j) * -1
                    let qualidade_saida_vk_de_k = calcula_qualidade_saida(instancia, vk, s_k) * -1
                    let qualidade_entrada_vj_em_k = calcula_qualidade_entrada(instancia, vj, dif_s_k_vk)
                    let qualidade_entrada_vk_em_j = calcula_qualidade_entrada(instancia, vk, dif_s_j_vj)

                    let qualidade_geral = qualidade_saida_vj_de_j + qualidade_entrada_vj_em_k
                    qualidade_geral += qualidade_saida_vk_de_k + qualidade_entrada_vk_em_j
                
                    if (qualidade_geral > 0) {
                        //console.log( 'qualidade_geral:', qualidade_geral)
                        // retira vj de _s_j
                        remover(s_j, vj)
                        // retira vk de _s_k
                        remover(s_k, vk)
                        // colocar vj em s_k
                        s_k.push(vj)
                        // colocar vk em s_j
                        s_j.push(vk)
                        return S
                    }
                }
            }
        }
    }
    return null
}

module.exports = {
    busca_local,
    ordena_vertices,
    calcula_qualidade_entrada,
    calcula_qualidade_saida,
    diferenca,
    union,
    remover,
    primeiro_vizinho_melhor_one_move,
    primeiro_vizinho_melhor_swap
}

