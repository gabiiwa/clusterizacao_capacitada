from ranreal_sparse import RanRealSparse
#from handover import Handover

# v é do formato {'id': str, 'peso': float, 'grau': int}
# c é no formato [{'id': str, 'peso': float, 'grau': int}]

def tem_aresta_pra_c(instancia, v, c):
    for vertice in c:
        if instancia.get_aresta(v['id'], vertice['v']):
            return True
    return False

def heuristica_local(instancia, V, c):
    i=0
    aux=None
    # Enquanto nenhum vértice foi escolhido
    while aux == None:

        if i < len(V):
            # Obtem o vértice no indice i
            v = V[i] 
            #v tem aresta com pra algum vértice de c
            if tem_aresta_pra_c(instancia, v, c):
                aux = v
                remove v de V
            i+=1
        else:
            # Escolhe o vértice de menor grau se nenhum outro vértice tem
            # aresta pro conjunto c
            v = vértice de V com menor grau
            aux = v
            remove v de V
    return aux

def soma_peso_vertices(c):
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

    # Enquanto o conjunto de candidatos não for vazio continua no while
    while len(V) > 0 and len(S) < n:
        v = heuristica_local(instancia, V, c) # Seleciona melhor primeiro vértice
        c_linha = c.append(v) # Constroi um cluster parcial

        if soma_peso_vertices(c_linha) >= instancia.get_L() and soma_peso_vertices(c_linha) <= instancia.get_U():
            # Se o conjunto c atende pelo menos a restrição inferior
            # adiciona o cluster parcial a solução
            s = s.append(c_linha)
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
                s = s.append(c_espera)
                # Limpa o cluster parcial
                c_espera = []
                
    # Etapa 1.1: Se ainda tiver alguma coisa no c_espera, coloca denovo no V
    # e recalcula a ordenação
    if len(c_espera) > 0:
        for i in range(len(c_espera)):
            V = V.append(c_espera[i])
        V.sort(reverse=True, key=lambda x: x['grau'])

    # Na etapa 2, coloca os vértices restantes na melhor posição dentro
    # dos clusters já criados
    #V só será vazio se já formamos o número de clusters máximo
    # while len(V)>0:
        
    return s

# Teste, comentar quando terminar de desenvolver
instancia = RanRealSparse('instancias/Sparse82/Sparse82_01.txt')
print(construtivo(instancia))
