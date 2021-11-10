#include <iostream>
#include "classes.hpp"

Vertex::Vertex(string new_data, int new_cost, int new_huer) : data(new_data), cost(new_cost), huer(new_huer){};

void Vertex::get_data()
{
    std::cout << data << " " << cost << " " << huer;
};