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

public:
    Vertex(string new_data, int new_cost, int new_huer);
    void get_data();
};

class Graph
{
private:
    list<Vertex> vertices;
    map<Vertex, list<Vertex>> edges;
    int size;

public:
    Graph(list<Vertex> new_vertices, map<Vertex, list<Vertex>> new_edges);
    void add_vertex();
    void add_edges();
    Graph populate();
}