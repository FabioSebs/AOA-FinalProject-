#include <iostream>
#include "vertex.cpp"
#include <fstream>
#include <string>
#include "json/single_include/nlohmann/json.hpp"

using namespace std;
using json = nlohmann::json;

json getData()
{
    // Fstream package gets file in pointer variable
    ifstream file("./dataset/cities.json");
    json cities = json::parse(file);
    return cities
}

int main()
{
    Vertex test("NY", 10, 5);
    test.get_data();
    getData();
    return 0;
}
