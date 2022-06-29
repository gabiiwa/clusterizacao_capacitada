const path = require("path");
const { getQualidade, construtivo } = require('./construtivo')

// Classes de leitura das instâncias
const RanRealSparse = require('./ranreal_sparse')
const Handover = require('./handover')
const busca_local = require('./busca_local')

const instanciasRodar = [
    // 'instancias/Sparse82/Sparse82_01.txt',
    // 'instancias/Sparse82/Sparse82_02.txt',
    // 'instancias/Sparse82/Sparse82_03.txt',

     'instancias/RanReal240/RanReal240_01.txt',
    // 'instancias/RanReal240/RanReal240_04.txt',
    // 'instancias/RanReal240/RanReal240_07.txt',
    
    // 'instancias/RanReal480/RanReal480_01.txt',
    // 'instancias/RanReal480/RanReal480_06.txt',
    // 'instancias/RanReal480/RanReal480_12.txt',

    'instancias/handover/20_5_270001.txt',
    'instancias/handover/20_10_270001.txt',
    'instancias/handover/30_5_270003.txt'
]
console.log("--- Trabalho 1 Inteligencia Computacional ---")
console.log("\nIniciando a execução das instâncias")

for (const caminho_instancia of instanciasRodar){

    // Leitura da instância
    let instancia = null;

    if(caminho_instancia.includes('handover')){
        instancia = new Handover(caminho_instancia)
    } else {
        instancia = new RanRealSparse(caminho_instancia)
    }

    console.log(`\nInstancia '${path.basename(caminho_instancia)}' carregada`)

    // Essa constante indica o quanto o Javascript é mais lento que o
    // c++, na nossa pesquisa no site https://www.beecrowd.com.br/ (Antigo Url Online Judge)
    // retornou que o tempo do Javascript é o dobro do c++
    const fator_diferenca = 2
    const tempo = (instancia.getNumElementos() / 4) * fator_diferenca
    const numExecucoes = 3

    let qualidades = []
    let melhor_qualidade = 0;
    let melhor_S = {};

    for(let i=0; i<numExecucoes; i++){
        console.log(`Execucao ${i+1} de ${numExecucoes}, com tempo de ${tempo}s`);
        S = busca_local(instancia, tempo);
        //S = construtivo(instancia)
        let qualidade = getQualidade(instancia, S)
        qualidades.push(qualidade)
        if(qualidade > melhor_qualidade){
            melhor_S = [...S]
            melhor_qualidade = qualidade
        }
    }

    console.log(`Melhor valor de qualidade: ${melhor_qualidade}`)
    console.log(`Melhor solução: S={${melhor_S.map(c => `{${c.map(x => x.id).join(',')}}`)}}`)
    console.log(`Media da qualidade: ${qualidades.reduce((x,y)=>x+y,0) / qualidades.length}`)
}