# -*- coding: utf-8 -*-

class Grafo:
    def __init__(self):
        self.grafo = {} #dicionário de nós
        self.nos = [] # lista de dicionários, tendo o formato {id, peso}
        self.pesos_nos = []
        self.arestas = [] # lista de dicionários, tendo o formato {id, vizinho, peso}

    def add_no(self, id, peso):
        self.grafo[str(id)] = []
        self.nos.append({'id': str(id), 'peso': peso})
        self.pesos_nos.append(peso)

    def add_aresta(self, no, no_vizinho, peso):
        # print('Add aresta {}-{} com peso {}'.format(no, no_vizinho, peso))
        for x, y in [(no, no_vizinho), (no_vizinho, no)]:
            self.grafo[str(x)].append(y)
            self.arestas.append({'id': str(x), 'vizinho': str(y), 'peso': peso})
            
# Teste, comentar quando terminar de desenvolver
# g = Grafo()
# g.add_no(1, 6)
# g.add_no(2, 4)
# g.add_no(3, 8)
# print('nos', g.grafo, g.nos)
# g.add_aresta(1,2,3.5)
# g.add_aresta(1,3,4.5)

# print('completo', g.grafo)
# print('arestas', g.arestas)