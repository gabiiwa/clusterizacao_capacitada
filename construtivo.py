from ranreal_sparse import RanRealSparse

def is_conexo(s_linha):
    return False

def heuristica_local(E, c):
    return None

def funcao_verificacao(s_linha):
    return None

def funcao_add_na_solucao(c, s):
    return None

def construtivo(instancia):
    # lista de listas de nós
    s = [] # Solução inicial (começa vazia)
    c = [] # Fila de espera, ou cluster parcial

    # vetor ordenado pelo peso dos vértices, do maior para menor 
    E = [] # Conjunto de candidatos

    # Constroi a lista de vertices candidatos
    E = instancia.getGrafo().nos.copy()
    E.sort(reverse=True, key=lambda x: x['peso'])

    # Enquanto o conjunto de candidatos não for vazio continua no while
    while len(E) > 0:
        e = heuristica_local(E, c) # Heuristica de seleção de elementos
        if e == None:
            # Se 'e' voltar nulo, colocar os elementos do conjunto 'c' na solução 
            # incluindo eles nos clusters existentes
            s = funcao_add_na_solucao(c, s)
            c = []
        else:
            s_linha = c.copy().append(e) # c união e
            if funcao_verificacao(s_linha) == True:
                # Se o cluster s_linha for viável, adiciona na solução
                s.append(s_linha) #s união s_linha
                c = []
            else:
                # Se o cluster s_linha não for viável, adiciona
                # o elemento atual ao cluster temporário 'c'
                c = c.append(e) # c união e

    # Se ainda tiver sobrado alguma coisa no cluster temporário
    if len(c) > 0:
        # c diferente de vazio
        s = funcao_add_na_solucao(c, s)
    
    return s

# Teste, comentar quando terminar de desenvolver
instancia = RanRealSparse('instancias/Sparse82/Sparse82_01.txt')
print(construtivo(instancia))
