#include <iostream>
#include <list>
#include <map>

using namespace std;

class Vertex
{
private:
    string data;
    int cost;
    int huer;
    bool visited;

public:
    Vertex(string new_data, int new_cost, int new_huer, bool new_visited);
    void get_data();
};

class Graph
{
private:
    list<Vertex> vertices;
    map<Vertex, list<Vertex>> edges;

public:
    Graph(list<Vertex> new_vertices, map<Vertex, list<Vertex>> new_edges);
    void add_vertex(Vertex &vertex);
    void add_edges(Vertex &vertex1, Vertex &vertex2);
    Graph populate(Graph &graph, int vertices);
};