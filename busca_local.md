# Busca Local

busca_local usando First Improvement
    
```python
def busca_local():
    # Gera a solução inicial com o construtivo
    s = construtivo()
    while não chega no critério de parada:
        # gera lista de candidatos da vizinhança da solução
        melhor_vizinho = primeiro_vizinho_melhor(s)
        if melhor_vizinho é null:
            break
        else:
            s = melhor_vizinho
    return s
```

```python
def primeiro_vizinho_melhor(s):
    # Vizinhança de tirar um vertice de um cluster e colocar no outro
    for v_i in cluster da solução:
        for outros clusters:
            if cluster de origem e o cluster destino são conexos com a mudança e a restriçao L-U continua valendo:
                # testar se a aresta entrando é maior que a aresta saindo
                if mover v_i melhora a solução ?:
                    return s com v_i inserido no cluster que melhora a solução
    return null

```

s = [[3,4],[2,1,0,6],[8,7,5,9]]
s1 = [[3,4],[2,0,6],[1,8,7,5,9]]