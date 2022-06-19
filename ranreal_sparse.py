# -*- coding: utf-8 -*-

from monta_grafo import Grafo

class RanRealSparse:
    def __init__(self, caminho):
        self._caminho = caminho
        self.grafo_instancia = Grafo()
        self.num_arestas = 0
        #faz a leitura do arquivo da instancia
        with open(caminho) as instancia:
            i=0
            for line in instancia.readlines():
                ls = line.rstrip()
                # print(ls)
                if i==0:
                    # Lendo a primeira linha
                    linha1 = ls.split(' ')
                    # print(linha1)
                    self.numero_elementos = linha1[0]
                    self.numero_clusters = linha1[1]
                    # Obtem limites inferior e superior da soma dos pesos dos nós
                    self.L = linha1[3]
                    self.U = linha1[4]
                    # Obtem os pesos dos nós
                    lista_pesos_nos = linha1[linha1.index('W')+1:]
                    # Cria os nós no grafo com os pesos
                    for i in range(len(lista_pesos_nos)):
                        self.grafo_instancia.add_no(i, lista_pesos_nos[i])
                else:
                    # Cria aresta com peso
                    no = ls.split(' ')[0]
                    no_vizinho = ls.split(' ')[1]
                    peso = ls.split(' ')[2]
                    self.grafo_instancia.add_aresta(no, no_vizinho, peso)
                    self.num_arestas += 1
                i+=1

    def getGrafo(self):
        return self.grafo_instancia

    def get_L(self):
        return self.L

    def get_U(self):
        return self.U

    def __str__(self) -> str:
        return '--Instância--\nnumero_elementos: {}\nnumero_clusters: {}\nnum_arestas: {}\nL: {}\nU: {}'.format(
            self.numero_elementos, self.numero_clusters, self.num_arestas, self.L, self.U
        )


# Teste, comentar quando terminar de desenvolver
# inst = RanRealSparse('instancias/Sparse82/Sparse82_01.txt')
# print(inst)