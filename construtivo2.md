# Construtivo v2

```python

guloso2 (instancia):
    #lista de listas de nós
    s = [] # Solução inicial (começa vazia)
    n = instancia.num_clusters
    # Vetor ordenado pelo peso dos vértices, do maior para menor 
    V = ordena_nós(instancia) # Conjunto de candidatos

    # Monta n clusters com um vértice
    for i in range(n):
        v = vértice de V # seleciona o primeiro vertice, ou outro critério
        s = cluster unitário com o vértice 'v'
        remove v de V

    # Insere os vertices nos clusters um a um de forma que cada inserção
    # seja a que vai aumentar o valor da função objetivo
    while V diferente de vazio:
        v_i = pega um elemento de V
        maior_soma = -1
        indice_do_cluster_pra_entrar = -1
        for s_j em s:
            # Faz a soma dos pesos das arestas de v_i para o cluster s_j
            for v_j em s_j:
                if existe aresta entre v_j e v_i:
                    soma_aresta += peso da aresta v_j e v_i
            # Se a soma das arestas for maior que a soma já armazenada
            # indica o cluster j como o cluster que o v_i vai entrar
            if soma_aresta > maior_soma:
                if soma_peso_vertices(s_j união v_i) <= U:
                    indice_do_cluster_pra_entrar = j

        # Coloca o v_i no cluster que deu a maior soma
        s = v_i união s[indice_do_cluster_pra_entrar] 
        retira v_i da lista V
```