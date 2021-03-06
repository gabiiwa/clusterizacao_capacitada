# Construtivo v2


```python

def construtivo2 (instancia):
    #lista de listas de nós
    S = [] # Solução inicial (começa vazia)
    c = [] # Fila de espera, ou cluster parcial
    n = instancia.num_clusters # Número de clusters indicado na instância     
    V = ordenaVertices(instancia) # Vetor ordenado pelo grau dos vértices, do maior para menor

    # Na etapa 1, monta n clusters que atendem a restrição inferior
    while V diferente de vazio and len(S) < n:
        v = heuristicaLocal(V, c) # Seleciona melhor primeiro vértice
        c_linha = c união v # Constroi um cluster parcial
        if somaPesoVertices(c_linha) >= L and somaPesoVertices(c_linha) <= U:
            # Se o conjunto c atende pelo menos a restrição inferior
            # adiciona o cluster parcial a solução
            s = s união c_linha
            # Limpa o cluster parcial
            c = []
        elif somaPesoVertices(c_linha) < L:
            # Se o conjunto c parcial não atende a restrição inferior
            # esse conjunto passa a ser o conjunto c
            c = c_linha
        else:
            c_espera = c_espera união v
            if somaPesoVertices(c_espera) >= L and somaPesoVertices(c_espera) <= U:
                # Se o conjunto c atende pelo menos a restrição inferior
                # adiciona o cluster parcial a solução
                s = s união c_espera
                # Limpa o cluster parcial
                c_espera = []

    # Etapa 1.1: Se ainda tiver alguma coisa no c_espera, coloca denovo no V
    # e recalcula a ordenação
    if c_espera não for vazio:
        V = V união c_espera
        V = ordenaVertices(V)

    # Na etapa 2, coloca os vértices restantes na melhor posição dentro
    # dos clusters já criados
    #V só será vazio se já formamos o número de clusters máximo
    while V diferente de vazio:
        v = seleciona o primeiro vértice de V # Seleciona o vértice de maior grau
        maior_soma = -1
        indice_do_cluster_pra_entrar = -1

        # Percorre os clusters de S
        for s_j em S:
            # Faz a soma dos pesos das arestas de v_i para o cluster s_j
            # percorrendo todas as arestas de v_i e testando se existem
            for v_j em s_j:
                if existe aresta entre v_j e v_i:
                    soma_aresta += peso da aresta v_j e v_i
            # Se a soma das arestas for maior que a soma já armazenada
            # indica o cluster j como o cluster que o v_i vai entrar
            if soma_aresta > maior_soma:
                if somaPesoVertices(s_j união v_i) <= U:
                    # Se s_j união v_i atende a restrição superior
                    # marca esse cluster pro vértice entrar
                    indice_do_cluster_pra_entrar = j

        if indice_do_cluster_pra_entrar != -1:
            # Coloca o v_i no cluster que deu a maior soma
            S = v_i união S[indice_do_cluster_pra_entrar] 
            retira v_i da lista c
        else:
            # O vértice v não tem aresta pra nenhum cluster, ou ele não
            # cabe nos clusters onde ele pode entrar. Nesse caso deve-se
            # incluir esse vértice em qualquer cluster onde ele possa entrar
            
            # Percorre os clusters de S
            entrou = False
            for s_j em S:
                if somaPesoVertices(s_j união v_i) <= U:
                    s_j = v_i união s_j 
                    retira v_i da lista c
                    entrou = True
                    break # Interrompe o loop quando achar um cluster pra colocar o vértice
            if entrou==False:
                # Não conseguiu colocar em nenhum cluster. Cria um novo mesmo q seja inválido
                S = S união [v_i]
                retira v_i de V
    return S
```

```python
def heuristicaLocal(V, c):
    i=0
    aux = None
    # Enquanto nenhum vértice foi escolhido
    while aux == None:

        if i < len(V):
            # Obtem o vértice no indice i
            v = V[i] 
            if v tem aresta pra algum vértice de c:
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
```

## Iterações do construtivo para teste

V = [{7,1},{8,1},{5,1},{2,2},{6,1},{4,1},{3,3},{1,1},{0,1},{9,1}]
n = 3

#### 1ª iteração

S = []
v = {7,1}
c_linha = [{7,1}]
c = []

#### 2ª iteração

#### 3ª iteração

#### 4ª iteração