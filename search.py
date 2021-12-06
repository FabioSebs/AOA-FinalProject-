import numpy as np
from queue import PriorityQueue


def DjikstraSearch(map, startNode, goalNode):
    # Variables
    weights = np.array([])
    pq = PriorityQueue()
    visited = []

    # Going Through Edges List
    for k, v in map.edges.items():
        # Start Node Conditional - Adds Starts Neighbors in PQ and Weights
        if k.data.upper() == startNode:
            k.weight = float('inf')
            for x in v:
                pq.put(x.weight, x)
                weights = np.append(weights, [x, x.weight])

    #  Traversing until Goal
    while (weight := pq.get()) != 0:
        print(weight)
        map.printGraph()
        visited.append(weight)

        # Getting Least Distance City
        leastDistance = None

        for idx, val in enumerate(weights):
            for visit in visited:
                if visit == val:
                    for _, val2 in map.edges.items():
                        for z in val2:
                            if z.weight == visit:
                                z.weight = float('inf')
                                z.changeWeight(float('inf'))

            if val == weight:
                leastDistance = weights[idx-1]

        # Finding more neighbors of PQ.get()
        for k, v in map.edges.items():
            # key has to match the neighbor with least weight - lets get neighbor with least weight
            if k == leastDistance:
                for x in v:
                    pq.put(x.weight, x)
                    weights = np.append(weights, [x, x.weight])

    return visited


def AStarSearch(map, startNode, goalNode):
    pass
