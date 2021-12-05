import vertex
import graph

if __name__ == "__main__":
    test1 = graph.AStarGraph()
    test1.populateGraphAStar(20)
    test1.printGraph()
    test1.mapify()
    # test2 = graph.DjikstraGraph()
    # test2.populateGraphDjikstra(20)
    # test2.printGraph()
    # test2.mapify()
