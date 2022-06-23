# Construtivo v2


```python

def construtivo2 (instancia):
    #lista de listas de nós
    S = [] # Solução inicial (começa vazia)
    c = [] # Fila de espera, ou cluster parcial
    n = instancia.num_clusters # Número de clusters indicado na instância     
    V = ordena_nós(instancia) # Vetor ordenado pelo grau dos vértices, do maior para menor

    # Na etapa 1, monta n clusters que atendem a restrição inferior
    while V diferente de vazio and len(S) < n:
        v = heuristica_local(V, c) # Seleciona melhor primeiro vértice
        c_linha = c união v # Constroi um cluster parcial
        if soma_peso_vertices(s_linha) >= L:
            # Se o conjunto c atende pelo menos a restrição inferior
            # adiciona o cluster parcial a solução
            s = s união c_linha
            # Limpa o cluster parcial
            c = []
        else:
            # Se o conjunto c parcial não atende a restrição inferior
            # esse conjunto passa a ser o conjunto c
            c = c_linha

    # Na etapa 2, coloca os vértices restantes na melhor posição dentro
    # dos clusters já criados
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
                if soma_peso_vertices(s_j união v_i) <= U:
                    # Se s_j união v_i atende a restrição superior
                    # marca esse cluster pro vértice entrar
                    indice_do_cluster_pra_entrar = j

        if indice_do_cluster_pra_entrar != -1:
            # Coloca o v_i no cluster que deu a maior soma
            s = v_i união s[indice_do_cluster_pra_entrar] 
            retira v_i da lista c
        else:
            # O vértice v não tem aresta pra nenhum cluster, ou ele não
            # cabe nos clusters onde ele pode entrar. Nesse caso deve-se
            # incluir esse vértice em qualquer cluster onde ele possa entrar
            
            # Percorre os clusters de S
            for s_j em S:
                if soma_peso_vertices(s_j união v_i) <= U:
                    s = v_i união s_j 
                    retira v_i da lista c
                    break # Interrompe o loop quando achar um cluster pra colocar o vértice
    return s
```

```python
def heuristica_local(V, c):
    i=0
    aux = None
    # Enquanto nenhum vértice foi escolhido
    while aux == None:

        if i >= len(V):
            # Escolhe o vértice de menor grau se nenhum outro vértice tem
            # aresta pro conjunto c
            v = vértice de V com menor grau
            aux = v
            remove v de V
        else:
            # Obtem o vértice no indice i
            v = V[i] 
            if v tem aresta com peso maior que 0 pra algum vértice de c:
                aux = v
                remove v de V
            i+=1

    return aux    
```

## Iterações do construtivo para teste

V = [{3,3},{2,2},{1,1},{8,1},{4,1},{7,1},{5,1},{0,1},{6,1},{9,1}]

#### 1ª iteração

#### 2ª iteração

#### 3ª iteração

#### 4ª iteração