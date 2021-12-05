// Include Guards
#ifndef CLASSES_H
#define CLASSES_H

#include <iostream>
#include <vector>
#include <map>

using namespace std;
//Vertex Class (data, cost, hueristic, visited)
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

//Graph Class (vertices, edges)
class Graph
{
private:
    vector<Vertex> vertices;
    map<Vertex, vector<Vertex>> edges;

public:
    Graph(vector<Vertex> new_vertices, map<Vertex, vector<Vertex>> new_edges);
    void add_vertex(Vertex vertex);
    void add_edges(Vertex vertex1, Vertex vertex2);
    void adjacency_list();
    void populate(int vertices);
};

#endif