# -*- coding: utf-8 -*-

def busca_local(instancia):
    # Gera a solução inicial com o construtivo
    S = construtivo(instancia)
    conta_sol_viaveis = 0
    conta_sol_inviaveis = 0
    while não chega no critério de parada:
        # gera lista de candidatos da vizinhança da solução
        melhor_vizinho = primeiro_vizinho_melhor(S)
        if melhor_vizinho é None:
            break
        else:
            S = melhor_vizinho
    return S

def ordena_vertices(s):
    return #vértices de s_j ordenados pela soma dos pesos das arestas, do menor pro maior

def calcula_qualidade_entrada(v, s):
    return #soma das arestas de v_i entrando em s_k

def calcula_qualidade_saida(v, s):
    return #soma das arestas de v_i saindo de s_j

#----------------

def intersection(lst1, lst2):
    return list(set(lst1).intersection(lst2))

def union(lst1, lst2):
    return list(set(lst1).union(lst2))

def primeiro_vizinho_melhor(S):
    # Vizinhança de tirar um vertice de um cluster e colocar no outro

    for j in range(len(S)): # lista os clusters da solução
        vertices_ordenados = ordena_vertices(S[j])
        v_i = vertices_ordenados[0]
        #for v_i in vertices_ordenados: # Percorre a lista os vértices do cluster em (v_i) como vértice a mudar
        qualidade_saida = calcula_qualidade_saida(v_i, S[j])
        for k in range(j, len(S)): # Percorre a solução em s_k, como cluster de destino
            if k != j: # Garante que o cluster de destino (s_k) é diferente do cluster de origem (s_j)
                qualidade_entrada = calcula_qualidade_entrada(v_i, S[k])
                if verifica_restricao(intersection([v_i], S[j])) and verifica_restricao(union([v_i],S[k])): 
                    conta_sol_viaveis += 1
                    if qualidade_entrada > qualidade_saida:
                        # retira v_i de s_j
                        S[j].remove(v_i)
                        # colocar v_i em s_k
                        S[k].append(v_i)
                        return S
                else:
                    conta_sol_inviaveis += 1
    return None