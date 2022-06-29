const {construtivo,verifica_restricao,printSolucao} = require('./construtivo')
const RanRealSparse = require('./ranreal_sparse')

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
function ordena_vertices(instancia,s){
    // vertices_cluster = [...s]
    let subgrafo = instancia.getGrafo().getSubgrafo(s)
    let nos = [...subgrafo.nos]
    
    nos.sort((a, b) => a.somaArestas - b.somaArestas)

    return nos//vértices de s_j ordenados pela soma dos pesos das arestas, do menor pro maior
}
    

function calcula_qualidade_entrada(instancia,v, s){
    let s_v = [...s]
    s_v.push(v)
    let subgrafo = instancia.getGrafo().getSubgrafo(s_v)
    let nos = subgrafo.nos
    let qualidade = 0
    for(let i=0; i<nos.length;i++){
        qualidade+=nos[i].somaArestas
    }
    return qualidade//soma das arestas de v_i entrando em s_k
}
    

function calcula_qualidade_saida(instancia,v, s){
    let s_v = [...s]
    s_v.pop(v)
    let subgrafo = instancia.getGrafo().getSubgrafo(s_v)
    let nos = subgrafo.nos
    let qualidade = 0
    for(let i=0; i<nos.length;i++){
        qualidade+=nos[i].somaArestas
    }
    return qualidade //soma das arestas de v_i saindo de s_j
}
    

/////////Busca Local//////////////
function busca_local(instancia, tempo) {
    //  Gera a solução inicial com o construtivo
    S = construtivo(instancia)
    let conta_sol_viaveis = 0
    let consta_sol_inviaveis = 0
    let inicio = new Date().getTime() / 1000
    let fim = new Date().getTime() / 1000
    
    while(fim - inicio < tempo){
        //gera lista de candidatos da vizinhança da solução
        let melhor_vizinho = primeiro_vizinho_melhor(instancia,S)
        if (melhor_vizinho==null){
            break
        }
        else{
            S = melhor_vizinho
        }
        fim = new Date().getTime() / 1000
    }
    return S
}

module.exports = busca_local; 

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

function complementar(lst1, lst2){
    return lst1.filter(value => lst2.includes(value) === false)
}

function union(lst1, lst2){
    return lst1.concat(lst2)
}

function primeiro_vizinho_melhor(instancia, S){
    // Vizinhança de tirar um vertice de um cluster e colocar no outro
    //console.log('teste3',S.length)
    for (let j=0; j < S.length; j++){ // lista os clusters da solução
        vertices_ordenados = ordena_vertices(instancia, S[j])
        v_i = vertices_ordenados[0]
        //console.log('teste2',v_i, S[j])
        //for v_i in vertices_ordenados: // Percorre a lista os vértices do cluster em (v_i) como vértice a mudar
        qualidade_saida = calcula_qualidade_saida(instancia,v_i, S[j])
        for (let k=j; k < S.length; k++){ // Percorre a solução em s_k, como cluster de destino
            if (k !== j){ // Garante que o cluster de destino (s_k) é diferente do cluster de origem (s_j)
                //console.log('teste c',complementar([v_i], S[j]))
                //console.log('teste u',union([v_i],S[k]))
                if (verifica_restricao(instancia, complementar(S[j],[v_i])) && verifica_restricao(instancia, union(S[k],[v_i]))){
                    qualidade_entrada = calcula_qualidade_entrada(instancia,v_i, S[k])
                    conta_sol_viaveis += 1
                    //console.log('qualidade_entrada',qualidade_entrada,'qualidade_saida',qualidade_saida)
                    if (qualidade_entrada > qualidade_saida){
                        // retira v_i de s_j
                        S[j].splice(S[j].indexOf(v_i), 1)
                        // colocar v_i em s_k
                        S[k].push(v_i)
                        return S
                    }
                }else{
                    conta_sol_inviaveis += 1
                }
            }
        }
    }
    return null
}


// Teste, comentar quando terminar de desenvolver
instancia = new RanRealSparse('instancias/Sparse82/Sparse82_02.txt')
let resultado_construtivo = construtivo(instancia, 300)
let resultado = busca_local(instancia, 300)
console.log('---- Construtivo ----')
printSolucao(instancia, resultado_construtivo)
console.log('\n---- Busca Local ----')
printSolucao(instancia, resultado)