# -*- coding: utf-8 -*-

from monta_grafo import Grafo

class InstanciaTeste:
    def __init__(self):
        self.grafo_instancia = Grafo()
        self.num_arestas = 18
        
        # Teste com o grafo do enunciado do trabalho
        self.grafo_instancia.add_no(0, 1)
        self.grafo_instancia.add_no(1, 1)
        self.grafo_instancia.add_no(2, 2)
        self.grafo_instancia.add_no(3, 3)
        self.grafo_instancia.add_no(4, 1)
        self.grafo_instancia.add_no(5, 1)
        self.grafo_instancia.add_no(6, 1)
        self.grafo_instancia.add_no(7, 1)
        self.grafo_instancia.add_no(8, 1)
        self.grafo_instancia.add_no(9, 1)

        self.grafo_instancia.add_aresta(0,1,2.0)
        self.grafo_instancia.add_aresta(0,7,2.0)
        self.grafo_instancia.add_aresta(0,6,6.0)

        self.grafo_instancia.add_aresta(1,2,5.0)
        self.grafo_instancia.add_aresta(1,8,2.0)

        self.grafo_instancia.add_aresta(2,3,6.0)
        self.grafo_instancia.add_aresta(2,4,1.0)
        self.grafo_instancia.add_aresta(2,7,1.0)

        self.grafo_instancia.add_aresta(3,8,2.0)
        self.grafo_instancia.add_aresta(3,4,4.0)

        self.grafo_instancia.add_aresta(4,5,1.0)
        self.grafo_instancia.add_aresta(4,8,5.0)

        self.grafo_instancia.add_aresta(5,6,1.0)
        self.grafo_instancia.add_aresta(5,7,1.0)
        self.grafo_instancia.add_aresta(5,8,3.0)
        self.grafo_instancia.add_aresta(5,9,1.0)

        self.grafo_instancia.add_aresta(6,7,1.0)
        self.grafo_instancia.add_aresta(6,8,3.0)

        self.grafo_instancia.add_aresta(7,8,4.0)
        self.grafo_instancia.add_aresta(7,9,5.0)

    def getNumClusters(self):
        return 3

    def getNumElementos(self):
        return 10
        
    def getGrafo(self):
        return self.grafo_instancia

    def get_L(self):
        return 3.0

    def get_U(self):
        return 5.0


instancia = InstanciaTeste()
instancia.getGrafo().imprime_grafo(instancia.getGrafo(), 'instancia_teste')