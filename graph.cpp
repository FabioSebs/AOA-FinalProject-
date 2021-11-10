#include <iostream>
#include <list>
#include <map>
#include "classes.hpp"

Graph::Graph(list<Vertex> new_vertices, map<Vertex, list<Vertex>> new_edges, int new_size = 0) : vertices(new_vertices), edges(new_edges), size(new_size){};

void Graph::add_vertex(Vertex &vertex)
{
    if (vertices.size() == 0)
    {
        vertices.push_back(&vertex);
    }
    else
    {
        vertices.push_back(&vertex);
        add_edges(vertices[vertices.size() - 2], &vertex);
    }
    size++;
}

void Graph::add_edges(Vertex &vertex1, Vertex &vertex2)
{
    if (edges[&vertex1].size() == 0)
    {
        list<Vertex> edgelist = {&vertex2};
        edges.insert({&vertex1, edgelist});
    }
    else
    {
        edges[&vertex1].push_back(&vertex2);
    }
}

Graph Graph::populate(Graph &graph, int vertices)
{
}

/*
#include <iostream>
#include "classes.hpp"

Vertex::Vertex(string new_data, int new_cost, int new_huer) : data(new_data), cost(new_cost), huer(new_huer){};

void Vertex::get_data()
{
    std::cout << data << " " << cost << " " << huer;
};


class Graph
{
private:
    list<Vertex> vertices;
    map<Vertex, list<Vertex>> edges;

public:
    Graph(list<Vertex> new_vertices, map<Vertex, list<Vertex>> new_edges);
    void populate();
}
*/