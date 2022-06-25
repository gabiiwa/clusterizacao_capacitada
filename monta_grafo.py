# -*- coding: utf-8 -*-

class Grafo:
    def __init__(self):
        self.grafo = {} #dicionário de nós
        self.nos = [] # lista de dicionários, tendo o formato {id, peso}
        self.pesos_nos = []
        self.arestas = [] # lista de dicionários, tendo o formato {id, vizinho, peso}

    def add_no(self, id, peso):
        self.grafo[str(id)] = []
        self.nos.append({'id': str(id), 'peso': peso, 'grau': 0})
        self.pesos_nos.append(peso)

    def get_no(self, id):
        # Filtra os itens da lista de nós pela chave 'id'
        res = filter(lambda x: x['id'] == str(id), self.nos)
        if len(list(res)) == 0:
            # Se não retornar nenhum vértice na lista de retorno
            return None
        else:
            # Se encontrar algum vértice com 'id' igual, vai ser somente um, e retorna ele
            return list(res)[0]
    
    def get_aresta(self, id, vizinho):
        # Filtra a lista de arestas por id e vizinho
        res = filter(lambda x: x['id'] == str(id) and x['vizinho'] == str(vizinho), self.nos)
        if len(list(res)) == 0:
            # Se não retornar nenhuma aresta na lista de retorno
            return None
        else:
            # Se encontrar alguma aresta com 'id' e 'vizinho' igual, vai ser somente um, e retorna ele
            return list(res)[0]

    def add_aresta(self, no, no_vizinho, peso):
        # print('Add aresta {}-{} com peso {}'.format(no, no_vizinho, peso))
        for x, y in [(no, no_vizinho), (no_vizinho, no)]:
            self.grafo[str(x)].append(y)
            # Acrescenta o grau de cada nó
            no_aux = self.get_no(x)
            no_aux['grau'] = no_aux['grau'] + 1
            # Cria a aresta
            self.arestas.append({'id': str(x), 'vizinho': str(y), 'peso': peso})

# Teste, comentar quando terminar de desenvolver
g = Grafo()
g.add_no(1, 6)
g.add_no(2, 4)
g.add_no(3, 8)
g.add_aresta(1,2,3.5)
g.add_aresta(1,3,4.5)

print('grafo', g.grafo)
print('arestas', g.arestas)
print('nos', g.nos)

# https://igraph.org/python/tutorial/latest/tutorial.html
# from igraph import *
# g = Graph()
# g.add_vertices(3)

# # Colocando o peso nos vertices
# g.vs[0]["peso"] = 6
# g.vs[1]["peso"] = 4
# g.vs[2]["peso"] = 1

# g.add_edges([(0,1)])
# g.es[0]["peso"] = 2.5

# g.add_edges([(0,2)])
# g.es[1]["peso"] = 3.1


# print('lista de arestas:', g.get_edgelist())
# print('id da aresta:', g.get_eid(0, 2))

# print('lista adj', g.get_adjlist())


# Colocando o peso nas arestas
# g.es[0]["peso"] = 2.5
# g.es[1]["peso"] = 3.1

# # Imprimindo arestas especificas
# print(g.es[0])
# print(g.es[1])

# # Imprimindo vertices especificos
# print(g.vs[0])
# print(g.vs[1])



# print(g)
#layout = g.layout("kamada_kawai")
#plot(g, layout=layout)

# print('grafo', g.grafo)
# print('arestas', g.arestas)
# print('nos', g.nos)

# # Sem filter
# lista = [{'id': '1'}, {'id': '2'}, {'id': '3'}]
# for x in lista:
#     if x['id'] == '1':
#         print('sem filter', x)

# # Com filter
# def teste(x):
#     if x['id'] == '1':
#         return True
#     return False

# res = filter(teste, lista)
# print('filter', res)

# # Com filter e lambda
# res = filter(lambda x: x['id'] == '1', lista)
# print('filter com lambda', res)

# # Direto na lista
# res = lista[lista.id == '1']
# print('direto na lista', res)