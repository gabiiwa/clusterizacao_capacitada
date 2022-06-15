

```python

guloso:
    #lista de listas de nós
    s = [] # Solução inicial (começa vazia)
    c = [] # Fila de espera, ou cluster parcial
    # i é o cluster atual sendo montado
    i = 0
    #vetor ordenado pelo peso dos vértices, do maior para menor 
    E = [] # Conjunto de candidatos
    while E diferente de vazio:
        e = heuristica_local(E, c) # Heuristica de seleção de elementos
        if e é null:
            s = c união s
            c = []
        else:
            s_linha = c união e
            if funcao_verificacao(s_linha) == True:
                s = s união s_linha
                c = []
            else:
                c = c união e

    if c diferente de vazio:
        s = c união s
    
    return s
```

```python
heuristica_local(E, c):
    #retira o primeiro elemento da lista
    i=0
    aux = primeiro elemento de E

    while aux união c não é conexo and i < len(E):
        i+=1
        aux = próximo elemento de E

    E = E - aux

    return aux

    
```

```python
funcao_verificacao(s_linha):
    #restrição inferior e restrição superior
    if soma(s_linha) >= L and soma(s_linha) <= U:
        return True
    
```

P = 3,2,1,1,1,1,1,1,1,1\
E = 3,2,1,8,4,7,5,0,6,9

#### 1ª iteração

P = 2,1,1,1,1,1,1,1,1\
E = 2,1,8,4,7,5,0,6,9\
c = []

s = [
    [3]
]

#### 2ª iteração

P = 1,1,1,1,1,1,1,1\
E = 1,8,4,7,5,0,6,9\
e = 2
c = [2]

s = [
    [3]
]

#### 3ª iteração

P = 1,1,1,1,1,1,1\
E = 8,4,7,5,0,6,9\
e = 1\
c = [2,1]

s = [
    [3],
    [2,1]
]

#### 4ª iteração

P = 1,1,1,1,1,1\
E = 4,7,5,0,6,9\
e = 8\
c = [8]

s = [
    [3],
    [2,1]
]

#### 5ª iteração

P = 1,1,1,1,1\
E = 4,5,0,6,9\
e = 7\
c = [8,7]

s = [
    [3],
    [2,1]
]

#### 6ª iteração

P = 1,1,1,1\
E = 4,0,6,9\
e = 5\
c = [8,7,5]

s = [
    [3],
    [2,1],
    [8,7,5]
]

#### 7ª iteração

P = 1,1,1\
E = 0,6,9\
e = null\
c = [4]

s = [
    [3,4],
    [2,1],
    [8,7,5]
]

#### 8ª iteração

P = 1,1\
E = 6,9\
e = 0\
c = [0]

s = [
    [3,4],
    [2,1],
    [8,7,5]
]

#### 9ª iteração

P = 1\
E = 9\
e = 6\
c = [0,6]

s = [
    [3,4],
    [2,1],
    [8,7,5]
]

#### 10ª iteração

P = 1\
E = 9\
e = null\
c = []

s = [
    [3,4],
    [2,1,0,6],
    [8,7,5]
]

#### 11ª iteração

P = \
E = \
e = 9\
c = [9]

s = [
    [3,4],
    [2,1,0,6],
    [8,7,5]
]

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