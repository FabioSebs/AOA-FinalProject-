#include <iostream>
#include "vertex.cpp"
#include <iostream>
#include <jsoncpp/json/value.h>
#include <jsoncpp/json/json.h>
#include <fstream>
#include <string>

using namespace std;

void jsonTest()
{
    // Fstream package gets file in pointer variable
    ifstream file("./dataset/cities.json")
        Json::Value jsonData;
    Json::Reader reader;

    // Using reader we are parsing the JSON
    reader.parse(file, jsonData);

    std::cout << "Test: " << jsonData;
}
int main()
{
    Vertex test("NY", 10, 5);
    test.get_data();
}