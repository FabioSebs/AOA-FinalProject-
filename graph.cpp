#include <iostream>
#include <vector>
#include <map>
#include <fstream>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include "classes.hpp"
#include "json/single_include/nlohmann/json.hpp"

using json = nlohmann::json;

//Utility Function
json getData()
{
    // Fstream package gets file in pointer variable
    ifstream file("./dataset/cities.json");
    json cities = json::parse(file);
    return cities;
};

//Graph Constructor
Graph::Graph(vector<Vertex> new_vertices, map<Vertex, vector<Vertex>> new_edges) : vertices(new_vertices), edges(new_edges){};

// Adding Vertex
void Graph::add_vertex(Vertex vertex)
{
    vertices.push_back(vertex);
};

//Adding Edges
void Graph::add_edges(Vertex vertex1, Vertex vertex2)
{
    //Checks if Vertex has no Edges
    if (edges[vertex1].size() == 0)
    {
        //Create Vertex List that are the edges to &vertex1
        vector<Vertex> vertexlist = {vertex2};
        edges.insert({vertex1, vertexlist});
    }
    else
    {
        //Vertex already has Edges so append to Vertex List
        edges[vertex1].push_back(vertex2);
    }
};

//Prints Adjacency List
void Graph::adjacency_list()
{
    for (int i = 0; i < vertices.size() - 1; i++)
    {
        cout << "City: " << vertices[i] << endl;

        for (int j = 0; j < edges[vertices[i]].size() - 1; j++)
        {
            cout << "Connected to: " << edges[vertices[i]][j].get_data() << endl;
        };
        cout << "-----------------------------------------------------";
    };
};

//Populates the Graph
void Graph::populate(int vertices)
{
    json cities = getData();
    for (int i = 1; i < vertices; i++)
    {
        srand(time(0));
        Vertex vertex(cities[rand() % 500]["name"], 0, 0, false);
        add_vertex(vertex);
    };
};
