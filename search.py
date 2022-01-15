import numpy as np
from queue import PriorityQueue
from astar import a_star_search


def DjikstraSearch(map, startNode, goalNode):
    # Variables
    weights = np.array([])
    pq = PriorityQueue()
    visited = []
    cities = [startNode]

    # Going Through Edges List
    for k, v in map.edges.items():
        # Start Node Conditional - Adds Starts Neighbors in PQ and Weights
        if k.data.upper() == startNode:
            k.weight = float('inf')
            for x in v:
                pq.put(x.weight)
                weights = np.append(weights, [x, x.weight])

    #  Traversing until Goal
    while (weight := pq.get()) != 0:
        # map.printGraph()
        visited.append(weight)

        # Getting Least Distance City
        leastDistance = None

        # Going into Neighbors
        for idx, val in enumerate(weights):
            # Comparing Neighbors to Visted to set Weight to Inf
            for visit in visited:
                if visit == val:
                    # Have to go into Graph to Change Weights
                    for _, val2 in map.edges.items():
                        # Going through every Value which is a list of DjikstraObjects to check for Visited Nodes
                        for z in val2:
                            if z.weight == visit:
                                cities.append(z.data)
                                z.weight = float('inf')
                                z.changeWeight(float('inf'))

            if val == weight:
                # Key
                leastDistance = weights[idx-1]

        # Finding more neighbors of PQ.get()
        for k, v in map.edges.items():
            # key has to match the neighbor with least weight - lets get neighbor with least weight
            if k == leastDistance:
                # print([y.getInfo() for y in v])
                for x in v:
                    pq.put(x.weight, x)
                    weights = np.append(weights, [x, x.weight])
    distance = sum(visited)
    return {"distance": distance, "visited": cities}


def AStar(map, startNode, goalNode):
    came_from, cost_so_far = a_star_search(map, startNode, goalNode)
    visitedList = []
    for key, val in came_from.items():
        print(f'Key: {key}\nValue: {val}')
        if key == startNode:
            continue
        if key.data.upper() == goalNode:
            visitedList.append(key.data)
            break
        visitedList.append(key.data)

    return {"distance": cost_so_far[goalNode.title()], "visited": visitedList}
