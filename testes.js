const InstanciaTeste = require('./instancia_teste')
const RanRealSparse = require('./ranreal_sparse')
const SFCRandom = require('./SFCRandom')
const { construtivo, verifica_restricao, printSolucao, getQualidade } = require('./construtivo')
const {
    busca_local,
    ordena_vertices,
    calcula_qualidade_entrada,
    calcula_qualidade_saida,
    diferenca,
    union,
    primeiro_vizinho_melhor_one_move,
    primeiro_vizinho_melhor_swap
} = require('./busca_local')

let instancia = new InstanciaTeste();
let clusterTeste = [
    instancia.getGrafo().getNo(5),
    instancia.getGrafo().getNo(8),
    instancia.getGrafo().getNo(7),
    instancia.getGrafo().getNo(6)
]
let solucaoTeste = [
    [
        instancia.getGrafo().getNo(0),
        instancia.getGrafo().getNo(6),
        instancia.getGrafo().getNo(5),
    ],
    [
        instancia.getGrafo().getNo(1),
        instancia.getGrafo().getNo(2),
        instancia.getGrafo().getNo(7),
        instancia.getGrafo().getNo(9)
    ],
    [
        instancia.getGrafo().getNo(3),
        instancia.getGrafo().getNo(8),
        instancia.getGrafo().getNo(4),
    ]
]

console.log(instancia.getGrafo().getSubgrafo(clusterTeste))

console.log("----- Teste da função 'ordena_vertices' pela soma das arestas -----")
let ordenado = ordena_vertices(instancia, clusterTeste);
console.log('clusterTeste:', clusterTeste)
console.log('ordenado:', ordenado)

console.log("\n----- Teste da função 'diferenca' -----")
let q_div = diferenca(clusterTeste, [instancia.getGrafo().getNo(5)]);
console.log('clusterTeste:', clusterTeste)
console.log('q_div:', q_div)

console.log("\n----- Teste da função 'union' -----")
let q_uni = union(clusterTeste, [instancia.getGrafo().getNo(0)]);
console.log('clusterTeste:', clusterTeste)
console.log('q_uni:', q_uni)

console.log("\n----- Teste da função 'calcula_qualidade_entrada' -----")
let q_ent = calcula_qualidade_entrada(instancia, instancia.getGrafo().getNo(0), clusterTeste);
console.log('q_ent:', q_ent, 'deve ser q_ent=8')

console.log("\n----- Teste da função 'calcula_qualidade_saida' -----")
let q_saida = calcula_qualidade_saida(instancia, instancia.getGrafo().getNo(5), clusterTeste);
console.log('q_saida:', q_saida, 'deve ser q_saida=5')

console.log("\n----- Teste da função 'getQualidade' -----")
let q_qual = getQualidade(instancia, solucaoTeste);
console.log('q_qual:', q_qual, 'deve ser q_qual=29')

function testaRepeticao(S){
    let teste = []
    let repetidos = []
    let repeticao = false
    for(const s of S){
        for (const v of s){
            if(teste.includes(parseInt(v.id))){
                repeticao= true
                repetidos.push(parseInt(v.id))
            } else {
                teste.push(parseInt(v.id))
            }
        }
    }
    teste = teste.concat([...new Set(repetidos)]).sort((a,b)=>a-b)
    return `Repetição de nós ${repeticao}\ncontagem de vértices: ${teste.length}\nvértices repetidos: ${[...new Set(repetidos)]}\nvértices ordenados: ${teste}`
}

// Teste, comentar quando terminar de desenvolver
const testeBusca = true;
if (testeBusca) {
    //caminho = 'instancias/Sparse82/Sparse82_01.txt'
    caminho = 'instancias/RanReal240/RanReal240_01.txt'
    instancia = new RanRealSparse(caminho)
    let resultado_construtivo = construtivo(instancia)
    let inicio = new Date().getTime() / 1000;
    let resultado = busca_local(instancia, 30, 1234)
    let fim = new Date().getTime() / 1000;
    //console.log("Rodando", caminho)
    console.log('---- Construtivo ----')
    //printSolucao(instancia, resultado_construtivo)
    console.log("Qualidade:", getQualidade(instancia, resultado_construtivo))
    console.log('\n---- Busca Local ----')
    console.log('Tempo de execução:', fim - inicio)
    console.log('Testes da solução:',testaRepeticao(resultado))
    //printSolucao(instancia, resultado)
    console.log("Qualidade:", getQualidade(instancia, resultado))
    //Qualidade: 130645.86100000002 Melhor nosso: 130900.515, Stênio: 224.593,61
}