# -*- coding: utf-8 -*-

from monta_grafo import Grafo
import numpy as np

class handover:
    def __init__(self, caminho):
        self._caminho = caminho
        self.grafo_instancia = Grafo()
        self.num_arestas = 0
        #faz a leitura do arquivo da instancia
        with open(caminho) as instancia:
            #anda pelas linhas
            i=0
            for line in instancia.readlines():
                print("line:{}\n".format(line))
                ls = line.rstrip()
                print("ls:{}\n".format(ls))
                if i==0:
                    # Lendo a primeira linha
                    linha1 = ls
                    self.numero_elementos = int(linha1)
                elif i==1:
                    self.numero_clusters = int(ls)
                elif i==2:
                    #inicializando restrição superior
                    self.U = float(ls)
                elif i>2 and i<=self.numero_elementos+2:
                    self.grafo_instancia.add_no(i-3,float(ls))
                else:
                    #calculando restrição inferior
                    #média dos pesos de todos nós
                    self.L = sum(self.grafo_instancia.pesos_nos)/self.numero_elementos
                    #lendo o array de pesos da aresta,uma linha únic
                    array_pesos = np.array([float(peso) for peso in ls.split(" ")])
                    #matrix de interligação entre os nós, peso das arestas
                    matrix_pesos_aresta = np.split(array_pesos,int(self.numero_elementos))
                    for no_ind,no_linha in enumerate(matrix_pesos_aresta):
                        for viz_ind,valor_viz in enumerate(no_linha):
                            #0.0 é quando não tem ligação
                            if valor_viz != 0.0:
                                self.grafo_instancia.add_aresta(no_ind,viz_ind,valor_viz)
                                self.num_arestas+=1


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


inst = handover('instancias/handover/20_5_270001.txt')

print(inst)