# -*- coding: utf-8 -*-


from ranreal_sparse import RanRealSparse
#from handover import Handover
from instancia_teste import InstanciaTeste

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

def verifica_restricao(instancia, candidato):
    if soma_peso_vertices(candidato) >= instancia.get_L() and soma_peso_vertices(candidato) <= instancia.get_U():
        return True
    return False

def construtivo(instancia):
    # lista de listas de nós
    S = [] # Solução inicial (começa vazia)
    c_parcial = [] # Cluster parcial
    n = instancia.getNumClusters() # Número de clusters indicado na instância 
    V = [] # Vetor ordenado pelo grau dos vértices, do maior para menor
    c_espera = [] # Fila de espera

    # Constroi a lista de vertices candidatos
    V = instancia.getGrafo().nos.copy()
    V.sort(reverse=True, key=lambda x: x['grau'])

    #it=0

    # Enquanto o conjunto de candidatos não for vazio continua no while
    while len(V) > 0 and len(S) < n:
        #print('iteração etapa 1:',it)
        v = heuristica_local(instancia, V, c_parcial) # Seleciona melhor primeiro vértice
        c_linha = c_parcial + [v] # Constroi um cluster parcial
        #print('c_linha', c_linha)
        if verifica_restricao(instancia, c_linha):
            # Se o conjunto c atende pelo menos a restrição inferior
            # adiciona o cluster parcial a solução
            S.append(c_linha)
            # Limpa o cluster parcial
            c_parcial = []
        elif soma_peso_vertices(c_linha) < instancia.get_L():
            # Se o conjunto c parcial não atende a restrição inferior
            # esse conjunto passa a ser o conjunto c
            c_parcial = c_linha
        else:
            c_espera = c_espera.append(v)
            if verifica_restricao(instancia, c_espera):
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

    print("--- Solução da etapa 1 ---")
    printSolucao(instancia, S)

    # Na etapa 2, coloca os vértices restantes na melhor posição dentro
    # dos clusters já criados
    #V só será vazio se já formamos o número de clusters máximo
    print(V)
    while len(V) > 0:
        V.sort(reverse=True, key=lambda x: x['grau'])
        v = V[0]# Seleciona o vértice de maior grau
        maior_soma = -1
        indice_do_cluster_pra_entrar = -1
        soma_aresta = 0
        # Percorre os clusters de S
        for j,s_j in enumerate(S):
            # Faz a soma dos pesos das arestas de v_i para o cluster s_j
            # percorrendo todas as arestas de v_i e testando se existem
            for v_j in s_j:
                #print('-->',v_j,v,v_j)
                aresta_vj_v = instancia.getGrafo().get_aresta(v_j['id'], v['id'])
                if type(aresta_vj_v)!=type(None):
                    soma_aresta += aresta_vj_v['peso'] #peso da aresta v_j e v_i
            # Se a soma das arestas for maior que a soma já armazenada
            # indica o cluster j como o cluster que o v_i vai entrar
            if soma_aresta > maior_soma:
                if soma_peso_vertices(s_j + [v]) <= instancia.get_U():
                    # Se s_j união v_i atende a restrição superior
                    # marca esse cluster pro vértice entrar
                    indice_do_cluster_pra_entrar = j
                    maior_soma = soma_aresta

        if indice_do_cluster_pra_entrar != -1:
            # Coloca o v no cluster que deu a maior soma
            S[indice_do_cluster_pra_entrar]  = S[indice_do_cluster_pra_entrar] + [v]
            #retira v_i da lista c
            V = V[1:]
        else:
            # O vértice v não tem aresta pra nenhum cluster, ou ele não
            # cabe nos clusters onde ele pode entrar. Nesse caso deve-se
            # incluir esse vértice em qualquer cluster onde ele possa entrar
            
            # Percorre os clusters de S
            entrou=False
            for s_j in S:
                if soma_peso_vertices(s_j + [v]) <= instancia.get_U():
                    s_j = s_j + [v] 
                    V = V[1:]
                    entrou=True
                    break # Interrompe o loop quando achar um cluster pra colocar o vértice
            if entrou == False:
                # Não conseguiu colocar em nenhum cluster. Cria um novo mesmo q seja inválido
                S.append([v])
                V = V[1:]
    return S

def getQualidade(instancia, S):
    qualidade = 0
    for s in S:
        # Obtem o subgrafo dessa solução
        subgrafo_cluster = instancia.getGrafo().get_subgrafo(s)
        # Calcula a soma dos pesos das arestas e divide por dois, porque essa lista
        # de arestas tá com elas dobradas. Por exemplo, tem a 1-2 e 2-1 na lista.
        qualidade += sum(map(lambda x: x['peso'], subgrafo_cluster.arestas)) / 2.0
    return qualidade

def printSolucao(instancia, S, imprimir=False):
    print("\nSolução para {} clusters".format(instancia.getNumClusters()))
    for s in S:
        print(list(map(lambda x: x['id'], s)), 'Restrição: {} <= {} <= {}'.format(instancia.get_L(),soma_peso_vertices(s),instancia.get_U()))
    
    print('\nQualidade da solução: {}'.format(getQualidade(instancia, S)))

    # Gera um PNG do grafo, se imprimir=True
    if imprimir:
        k=0
        for s in S:
            subgrafo_cluster = instancia.getGrafo().get_subgrafo(s)
            instancia.getGrafo().imprime_grafo(subgrafo_cluster, 'cluster{}'.format(k))
            k+=1

# Teste, comentar quando terminar de desenvolver
# instancia = RanRealSparse('instancias/Sparse82/Sparse82_01.txt')
# printSolucao(instancia, construtivo(instancia))


# Teste com a instância do enunciado
instancia2 = InstanciaTeste()
printSolucao(instancia2, construtivo(instancia2), True)
