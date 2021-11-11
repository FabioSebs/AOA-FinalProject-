#include <iostream>
#include <vector>
#include "vertex.cpp"
#include "graph.cpp"
#include <fstream>
#include <string>
#include "json/single_include/nlohmann/json.hpp"

using namespace std;
using json = nlohmann::json;

int main()
{
    //Testing The Vertex Class
    // Vertex test("NY", 10, 5, false);
    // test.get_data();

    // Printing the JSON
    // json cities = getData();
    // cout << "Test: " << cities[1]["name"];

    //Testing The Graph Class
    vector<Vertex> container = {};
    map<Vertex, vector<Vertex>> container2 = {};

    Graph test(container, container2);
    test.populate(20);
    test.adjacency_list();

    return 0;
};
