from ranreal_sparse import RanRealSparse
#from handover import Handover

# v é do formato {'id': str, 'peso': float, 'grau': int}
# c é no formato [{'id': str, 'peso': float, 'grau': int}]

def tem_aresta_pra_c(instancia, v, c):

    # Se o conjunto c estiver vazio, considerar que é conexo
    if len(c) == 0:
        return True

    for vertice in c:
        if instancia.getGrafo().get_aresta(v['id'], vertice['id']):
            return True
    return False

def heuristica_local(instancia, V, c):
    i=0
    aux=None
    # print('------------- heuristica_local --------------')
    # print(list(map(lambda x: x['id'], V)))
    # print(c)
    # Enquanto nenhum vértice foi escolhido
    while aux == None:
        if i < len(V):
            # Obtem o vértice no indice i
            v = V[i] 
            #v tem aresta com pra algum vértice de c
            if tem_aresta_pra_c(instancia, v, c):
                # print('tem aresta', i, v)
                aux = v
                V.remove(v)
            i+=1
        else:
            # Escolhe o vértice de menor grau se nenhum outro vértice tem
            # aresta pro conjunto c
            v = V[-1] # vértice de V com menor grau
            # print('não tem aresta, retorna o de menor grau', i, v)
            aux = v
            V.remove(v)
    # print('*** depois ***')
    # print(list(map(lambda x: x['id'], V)))
    # print(c)
    return aux

def soma_peso_vertices(c):
    #print('soma_peso_vertices',c)
    return sum(map(lambda x: x['peso'], c))

def construtivo(instancia):
    # lista de listas de nós
    S = [] # Solução inicial (começa vazia)
    c = [] # Fila de espera, ou cluster parcial
    n = instancia.getNumClusters() # Número de clusters indicado na instância 
    V = [] # Vetor ordenado pelo grau dos vértices, do maior para menor
    c_espera = []

    # Constroi a lista de vertices candidatos
    V = instancia.getGrafo().nos.copy()
    V.sort(reverse=True, key=lambda x: x['grau'])

    #it=0

    # Enquanto o conjunto de candidatos não for vazio continua no while
    while len(V) > 0 and len(S) < n:
        #print('iteração etapa 1:',it)
        v = heuristica_local(instancia, V, c) # Seleciona melhor primeiro vértice
        c_linha = c + [v] # Constroi um cluster parcial
        #print('c_linha', c_linha)
        if soma_peso_vertices(c_linha) >= instancia.get_L() and soma_peso_vertices(c_linha) <= instancia.get_U():
            # Se o conjunto c atende pelo menos a restrição inferior
            # adiciona o cluster parcial a solução
            S.append(c_linha)
            # Limpa o cluster parcial
            c = []
        elif soma_peso_vertices(c_linha) < instancia.get_L():
            # Se o conjunto c parcial não atende a restrição inferior
            # esse conjunto passa a ser o conjunto c
            c = c_linha
        else:
            c_espera = c_espera.append(v)
            if soma_peso_vertices(c_linha) >= instancia.get_L() and soma_peso_vertices(c_linha) <= instancia.get_U():
                # Se o conjunto c atende pelo menos a restrição inferior
                # adiciona o cluster parcial a solução
                S.append(c_espera)
                # Limpa o cluster parcial
                c_espera = []
        #it+=1
                
    # Etapa 1.1: Se ainda tiver alguma coisa no c_espera, coloca denovo no V
    # e recalcula a ordenação
    if len(c_espera) > 0:
        for i in range(len(c_espera)):
            V.append(c_espera[i])
        V.sort(reverse=True, key=lambda x: x['grau'])

    # Na etapa 2, coloca os vértices restantes na melhor posição dentro
    # dos clusters já criados
    #V só será vazio se já formamos o número de clusters máximo
    # while len(V)>0:
        
    return S

def printSolucao(instancia, S, imprimir=False):
    print("\nSolução para {} clusters".format(instancia.getNumClusters()))
    nos = []
    for s in S:
        nos += s
        print(list(map(lambda x: x['id'], s)), 'Restrição: {} <= {} <= {}'.format(instancia.get_L(),soma_peso_vertices(s),instancia.get_U()))
    
    # Obtem o subgrafo dessa solução
    subgrafo_solucao = instancia.getGrafo().get_subgrafo(nos)

    # Calcula a soma dos pesos das arestas e divide por dois, porque essa lista
    # de arestas tá com elas dobradas. Por exemplo, tem a 1-2 e 2-1 na lista.
    funcao_objetivo = sum(map(lambda x: x['peso'], subgrafo_solucao.arestas)) / 2.0
    print('\nFunção Objetivo: {}'.format(funcao_objetivo))

    # Gera um PNG do grafo, se imprimir=True
    if imprimir:
        instancia.getGrafo().imprime_grafo(subgrafo_solucao)

# Teste, comentar quando terminar de desenvolver
instancia = RanRealSparse('instancias/Sparse82/Sparse82_01.txt')
#print(heuristica_local(instancia, instancia.getGrafo().nos[3:], instancia.getGrafo().nos[0:3]))
printSolucao(instancia, construtivo(instancia))
