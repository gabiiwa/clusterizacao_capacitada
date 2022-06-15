# -*- coding: utf-8 -*-

# class No:
#     def __init__(self, id, peso):
#         self.id = id
#         self.arestas=[]
#         self.peso_no = peso

#     def getPeso(self):
#         return self.peso_no            

# class Aresta:
#     def __init__(self, origem, destino, peso):
#         self.origem=origem
#         self.destino=destino
#         self.peso=peso
        
#     #retorna peso da Aresta
#     def getPeso(self):
#         return self.peso

#%%
class Grafo:
    def __init__(self):
        self.grafo = {} #dicionário de nós
        self.nos = [] # lista de dicionários, tendo o formato {id, peso}
        self.arestas = [] # lista de dicionários, tendo o formato {id, vizinho, peso}

    def add_no(self, id, peso):
        self.grafo[id] = []
        self.nos.append({'id': id, 'peso': peso})

    def add_aresta(self, no, no_vizinho, peso):
        for x, y in [(no, no_vizinho), (no_vizinho, no)]:
            self.grafo[x].append(y)
            self.arestas.append({'id': x, 'vizinho': y, 'peso': peso})
            
#%%
# {
#     '1': {'2','3'}
#     '2': {'1','3'}
# }
g = Grafo()
g.add_no(1, 6)
g.add_no(2, 4)
g.add_no(3, 8)
print('nos', g.grafo, g.nos)
g.add_aresta(1,2,3.5)
g.add_aresta(1,3,4.5)

print('completo', g.grafo)
print('arestas', g.arestas)