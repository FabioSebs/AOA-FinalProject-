import vertex
import graph
import search

if __name__ == "__main__":
    # test1 = graph.AStarGraph()
    # test1.populateGraphAStar(20)
    # test1.printGraph()
    # test1.mapify()
    test2 = graph.DjikstraGraph()
    test2.populateGraphDjikstra(20)
    test2.printGraph()
    start, goal = test2.mapify()
    res = search.DjikstraSearch(test2, start, goal)
    print(res)
