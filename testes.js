const InstanciaTeste = require('./instancia_teste')
const RanRealSparse = require('./ranreal_sparse')
const { construtivo, verificaRestricao, printSolucao, getQualidade } = require('./construtivo')
const {
    buscaLocal,
    ordenaVertices,
    calculaQualidadeEntrada,
    calculaQualidadeSaida,
    diferenca,
    union
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

console.log("----- Teste da função 'ordenaVertices' pela soma das arestas -----")
let ordenado = ordenaVertices(instancia, clusterTeste);
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

console.log("\n----- Teste da função 'calculaQualidadeEntrada' -----")
let q_ent = calculaQualidadeEntrada(instancia, instancia.getGrafo().getNo(0), clusterTeste);
console.log('q_ent:', q_ent, 'deve ser q_ent=8')

console.log("\n----- Teste da função 'calculaQualidadeSaida' -----")
let q_saida = calculaQualidadeSaida(instancia, instancia.getGrafo().getNo(5), clusterTeste);
console.log('q_saida:', q_saida, 'deve ser q_saida=5')

console.log("\n----- Teste da função 'getQualidade' -----")
let q_qual = getQualidade(instancia, solucaoTeste);
console.log('q_qual:', q_qual, 'deve ser q_qual=29')

function testaRepeticao(S) {
    let teste = []
    let repetidos = []
    let repeticao = false
    for (const s of S) {
        for (const v of s) {
            if (teste.includes(parseInt(v.id))) {
                repeticao = true
                repetidos.push(parseInt(v.id))
            } else {
                teste.push(parseInt(v.id))
            }
        }
    }
    teste = teste.concat([...new Set(repetidos)]).sort((a, b) => a - b)
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
    let resultado = buscaLocal(instancia, 30, 1234)
    let fim = new Date().getTime() / 1000;
    console.log('---- Construtivo ----')
    //printSolucao(instancia, resultado_construtivo)
    console.log("Qualidade:", getQualidade(instancia, resultado_construtivo))
    console.log('\n---- Busca Local ----')
    console.log('Tempo de execução:', fim - inicio)
    console.log('Testes da solução:', testaRepeticao(resultado))
    //printSolucao(instancia, resultado)
    console.log("Qualidade:", getQualidade(instancia, resultado))
}