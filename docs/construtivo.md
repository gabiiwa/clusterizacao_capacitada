# Construtivo

```python

guloso (instancia):
    #lista de listas de nós
    s = [] # Solução inicial (começa vazia)
    c = [] # Fila de espera, ou cluster parcial
    # i é o cluster atual sendo montado
    i = 0
    #vetor ordenado pelo peso dos vértices, do maior para menor 
    V = ordena_nós(instancia) # Conjunto de candidatos

    while V diferente de vazio:
        v = heuristicaLocal(V, c) # Heuristica de seleção de elementos
        if v é null:
            s = funcao_add_na_solucao(c, s)
            c = []
        else:
            s_linha = c união v
            if funcao_verificacao(s_linha) == True:
                s = s união s_linha
                c = []
            else:
                c = c união v

    if c diferente de vazio:
        s = funcao_add_na_solucao(c, s)
    
    return s
```

```python
heuristicaLocal(V, c):
    #retira o primeiro elemento da lista
    i=0
    aux = primeiro elemento de V

    while aux união c não é conexo and i < len(V):
        i+=1
        aux = próximo elemento de V

    V = V - aux

    return aux

    
```

```python
funcao_verificacao(s_linha):
    #restrição inferior e restrição superior
    if somaPesoVertices(s_linha) >= L and somaPesoVertices(s_linha) <= U:
        return True
    return False
    
```

```python
funcao_add_na_solucao(c, s):
    while c é diferente de vazio:
        c_i = pega um elemento de c
        maior_soma = -1
        indice_do_cluster_pra_entrar = -1
        for s_j em s:
            # Faz a soma dos pesos das arestas de c_i para o cluster s_j
            for v_j em s_j:
                if existe aresta entre v_j e c_i:
                    soma_aresta += peso da aresta v_j e c_i
            # Se a soma das arestas for maior que a soma já armazenada
            # indica o cluster j como o cluster que o c_i vai entrar
            if soma_aresta > maior_soma and somaPesoVertices(s_j união c_i) <= U:
                indice_do_cluster_pra_entrar = j

        # Coloca o c_i no cluster que deu a maior soma
        s = c_i união s[indice_do_cluster_pra_entrar] 
        retira c_i da lista c

                    
    return s
    
```

## Iterações do construtivo para teste

V = [{3,3},{2,2},{1,1},{8,1},{4,1},{7,1},{5,1},{0,1},{6,1},{9,1}]

#### 1ª iteração

V = [{2,2},{1,1},{8,1},{4,1},{7,1},{5,1},{0,1},{6,1},{9,1}]
v = {3,3}
s_linha = [{3,3}]
c = []

s = [
    [{3,3}]
]

#### 2ª iteração

V = [{1,1},{8,1},{4,1},{7,1},{5,1},{0,1},{6,1},{9,1}]
v = {2,2}
s_linha = [{2,2}]
c = [{2,2}]

s = [
    [{3,3}]
]

#### 3ª iteração

V = [{8,1},{4,1},{7,1},{5,1},{0,1},{6,1},{9,1}]
v = {1,1}
s_linha = [{2,2},{1,1}]
c = []

s = [
    [{3,3}],
    [{2,2},{1,1}]
]

#### 4ª iteração

V = [{4,1},{7,1},{5,1},{0,1},{6,1},{9,1}]
v = {8,1}
s_linha = [{8,1}]
c = [{8,1}]

s = [
    [{3,3}],
    [{2,2},{1,1}]
]

#### 5ª iteração

V = [{4,1},{5,1},{0,1},{6,1},{9,1}]
v = {7,1}
s_linha = [{8,1},{7,1}]
c = [{8,1},{7,1}]

s = [
    [{3,3}],
    [{2,2},{1,1}]
]

#### 6ª iteração

V = [{4,1},{0,1},{6,1},{9,1}]
v = {5,1}
s_linha = [{8,1},{7,1},{5,1}]
c = []

s = [
    [{3,3}],
    [{2,2},{1,1}],
    [{8,1},{7,1},{5,1}]
]

#### 7ª iteração

V = [{0,1},{6,1},{9,1}]
v = None
s_linha = []
c = []

s = [
    [{3,3}], <!-- (4-3, 4) -->
    [{2,2},{1,1}], <!-- (4-2, 1) -->
    [{8,1},{7,1},{5,1},{4,1}] <!-- (4-5, 1),(4-8, 5) -->
]

#### 8ª iteração

V = [{6,1},{9,1}]
v = {0,1}
s_linha = [{0,1}]
c = [{0,1}]

s = [
    [{3,3}], 
    [{2,2},{1,1}], 
    [{8,1},{7,1},{5,1},{4,1}]
]

#### 9ª iteração

V = [{9,1}]
v = {6,1}
s_linha = [{0,1},{6,1}]
c = [{0,1},{6,1}]

s = [
    [{3,3}], 
    [{2,2},{1,1}], 
    [{8,1},{7,1},{5,1},{4,1}]
]

#### 10ª iteração

V = [{9,1}]
v = None
s_linha = []
c = [{0,1},{6,1}]

entrando 0\
s = [
    [{3,3}], <!-- nenhuma -->
    [{2,2},{1,1}], <!-- (0-1,2) -->
    [{8,1},{7,1},{5,1},{4,1}]<!--(0-7,2)-->
]

entrando 6\
s = [
    [{3,3}], <!-- nenhuma -->
    [{2,2},{1,1}], <!-- nenhuma -->
    [{8,1},{7,1},{5,1},{4,1},{0,1}]<!--(6-7,1), (6-5,1), (6-0,6)-->
]

#### 11ª iteração


Fim while

se c for vazio, ele entra no if pra inserir o 'c' na solução

c = []

s = [
    [3,4],
    [2,1,0,6],
    [8,7,5,9]
]

return s = [
    [3,4],
    [2,1,0,6],
    [8,7,5,9]
]

