# Busca Local

Implementação do método Variable Neighborhood Descent (VND) com estratégia aleatória de mudança de vizinhança, com alpha fixo de 0.5
    
```python
def VND(instancia, tempo, semente):
    alpha = 0.5 # Define que a chance de cada vizinhança é de 50 %
    Random.seed(semente) # Inicia o algoritmo de números aleatórios com a semente
    S = construtivo(instancia) # Gera a solução inicial com o construtivo

    while não atingiu o tempo limite:
        if random() > alpha:
            melhor_vizinho = primeiroVizinhoMelhor_Inserção(S)
            if Inserção chegou no ótimo local:
                melhor_vizinho = primeiroVizinhoMelhor_Troca(S)
        else:
            melhor_vizinho = primeiroVizinhoMelhor_Troca(S)
            if Inserção chegou no ótimo local:
                melhor_vizinho = primeiroVizinhoMelhor_Inserção(S)

        if melhor_vizinho é diferente de None:
            S = melhor_vizinho
        else:
            Interrompe o loop # chegou no ótimo local das duas vizinhanças

    return S
```

```python
def primeiroVizinhoMelhor_Inserção(S):
    for s_j in S: # Percorre a solução em s_j, como cluster de origem
        # Ordena os vértices pela soma dos pesos das arestas, do menor para o maior
        vertices_ordenados = ordenaVertices(s_j)

        for v_i in vertices_ordenados: # Percorre os vértices que vão sair
            if verificaRestricao(v_i - s_j):
                qualidade_saida = calculaQualidadeSaida(v_i, s_j)
                for s_k in S: # Percorre a solução em s_k, como cluster de destino
                    if s_k != s_j: # Garante que o cluster de destino (s_k) é diferente do cluster de origem (s_j)
                        if verificaRestricao(v_i união s_k):
                            qualidade_entrada = calculaQualidadeEntrada(v_i, s_k)
                            if qualidade_entrada > qualidade_saida:
                                # Realiza o movimento na vizinhança
                                retira v_i de s_j
                                colocar v_i em s_k
                                # E sai do algoritmo, pela politica
                                # primeiro aprimorante
                                return S

    # Se não encontrar uma solução melhor, ele está no ótimo local
    return None

```

```python
def primeiroVizinhoMelhor_Troca(S):
    # Gera permutações aleatórias de clusters
    permutações = GeraPermutaçõesSemRepetição(S)

    for s_j, s_j in permutações: # Percorre as permutações de clusters
        vertices_ordenados_j = ordenaVertices(s_j)
        vertices_ordenados_k = ordenaVertices(s_k)

        # Percorre as listas ordenadas de vértices dos clusters
        for vj in vertices_ordenados_j:
            for vk in vertices_ordenados_k:
                # Verifica as condições de saida e entrada dos vértices
                if vj pode sair de s_j e entrar em s_k and vk pode sair de s_k e entrar em s_j:
                    qualidade_geral = qualidade de entrada - qualidade de saída
                    if qualidade_geral > 0:
                        # Realiza o movimento na vizinhança
                        retira vj de s_j
                        retira vk de s_k
                        colocar vj em s_k
                        colocar vk em s_j
                        # E sai do algoritmo, pela politica
                        # primeiro aprimorante
                        return S

    # Se não encontrar uma solução melhor, ele está no ótimo local
    return None
```
