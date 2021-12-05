# 🔥 AOA-FinalProject- 🔥

## Overview :writing_hand:

---

Our final project will choose the cheapest path to travel from one destination to another. The program will plan a navigational route for the user. Under the hood the program will implement two algorithms (A\* Search & Djikstra's Algorithm) to calculate the best path in the fastest and most efficient time. To compare the two algorithms we will time them and measure their execution time to see which one performs faster.

### Djikstra Algorithm :dash:

> Djikstra is an algorithm for finding the shortest path between vertices in a graph. Djikstra tracks the cost of every vertex from the root vertex and chooses the path with the least cost and unvisited vertices. Djikstra is implemented using a min-priority queue or can be also be implemented with an array given the right conditionals.

### A\* Search Algorithm :brain:

> A* Search is an algorithm that is used widely for path searching and graph traversing. A* is termed an "informed" search because it uses hueristics to have a sense of knowledge knowing it is going in the right direction. Hueristics can be calculated using the Euclydian distance from the vertex to the desired destination.

---

## Technologies and Libraries Used :technologist:

- Python
- Go
- [JSON Library](https://github.com/nlohmann/json)
- [Colly](https://github.com/gocolly/colly)

---

## Code :zap:

### Vertex Class

```python
# Base Vertex Class
class Vertex():
    def __init__(self, data):
        self.data = data

# Weighted Vertex
class DjikstraVertex(Vertex):
    def __init__(self, data, weight):
        super().__init__(data)
        self.weight = weight

    def getInfo(self):
        return (self.data, self.weight)

# Weighted and Hueristic Vertex
class AStarVertex(DjikstraVertex):
    def __init__(self, data, weight, hueristic):
        super().__init__(data, weight)
        self.hueristic = hueristic

    def getInfo(self):
        return (self.data, self.weight, self.hueristic)
```

Three different Vertex classes are needed since in the Djikstra Algorithm there is no hueristic involved.

---

### **Graph Class**

```python
class Graph():
    def __init__(self):
        print("Created Graph! \n")
        self.vertices = []
        self.edges = {}
```

The Graph is consisted of two properties. The _self.vertices_ is supposed to be a list of Vertices so it is initialized as an empty list.

The _self.edges_ is supposed to be a dictionary with the key/value pair as Vertex/[]Vertex, however we initialize it as an empty dictionary.

### **isEmpty()**

```python
def isEmpty(self):
        return True if not len(self.vertices) else False
```

Empty function that uses a ternary statement. Code Translated: True if list of vertices is not filled, else if filled return False.

### **addVertex() & addEdges()**

```python
def addVertex(self, vertex):
        if (self.isEmpty()):
            self.vertices.append(vertex)
            self.edges.update({vertex: []})
        else:
            self.vertices.append(vertex)
            self.edges.update({vertex: []})
            # Connecting last two vertexes in graph together
            self.addEdges(self.vertices[len(self.vertices)-1], self.vertices[len(self.vertices)-2])

def addEdges(self, vertex1, vertex2):
        self.edges[vertex1].append(vertex2)
        self.edges[vertex2].append(vertex1)
```

First we check if the graph is Empty. If so we add the vertex to _vertices_ list. Next we put in the Vertex in the _edges_ dictionary as a key and the value is an empty list since it would be the first Vertex in the Graph.

If the _vertices_ list isn't empty we still add the Vertex and insert it into the _edges_ dictionary as a key. However next we call the _self.addEdges()_ function that accepts two Vertices to connect eachother. We access the last two Vertices by subscripting the _vertices_ list with the length of the list and subtracting 2 and 1.

### **printGraph()**

> This function uses the library PrettyTable - [Link to Project](https://pypi.org/project/prettytable/)

```python
def printGraph(self):
        x = PrettyTable()
        x.field_names = [
            "Vertices (Cities)", "Edges (Cities/Distance)"]

        try:
            for v in self.vertices:
                x.add_row([v.data, [y.getInfo() for y in self.edges[v]]])
            print(x)
        except:
            print("Graph Vertices is not consisted of Cities from JSON file.")
```

We make a PrettyTable() object and then we set the field_names property. (These are the columns of the tables).

Next we do some error handling with try and except clauses. The try statement should loop through the _vertices_ list of our class. Then it should add a row to the table with the values corresponding to the columns of the table. Since the first column is Vertices/(Cities) we can just call the v.data property since it will return the name of the city. Next value of the column is the edges which should be the Vertices connected to the Vertex (v) so we can use v as the key to obtain the values from the dictionary. With list comprehension and a utility function called _getInfo()_ the second column of the table is a list of the vertices with each index containing the name, distance, and hueristic if there is any.

Lastly if the try throws an error we catch it with the except clause because the graph is meant to be only used with the vertex class

### **calculateDistance()**

```python
    # Converting Latitude and Longitude to Map Coordinates
    # Explained in the link below (Skip Step 4)
    # https://lweb.cfa.harvard.edu/space_geodesy/ATLAS/cme_convert.html
    # Note: All Indonesian Cities will have South Latitude and East Longitude
    def calculateDistance(self, position):
        Latdegrees, Latminutes = int(position[1:3]), int(position[3:5])
        Londegrees, Lonminutes = int(position[5:7]), int(position[7:9])

        Latdegrees *= 60
        Londegrees *= 60
        x = Latdegrees + Latminutes
        y = Londegrees + Lonminutes

        return (x+y)
```

Explaining this is a little tricky so to simplify it - position is a 9 digit number passed in as a string from our dataset.
However we need to parse the 9 digits into corresponding variables. We actually can exclude the first digit so that is why we start at an index of 1. Next we follow the formula on how to convert the numbers to map coordinates and we return the value.

### **readJson()**

> doesnt need much explanation

```python
def readJson(self):
        with open("./dataset/cities.json") as f:
            data = json.load(f)
        data = np.asarray(data)
        data = np.delete(data, 0, 0)  # dropping first row
        data = np.delete(data, -1, 0)  # dropping last row
        return np.asarray(data)  # format [{name:, position:}]
```

---

### **DjikstraGraph Class**

```python
class DjikstraGraph(Graph):
    def __init__(self):
        super().__init__()

    def populateGraphDjikstra(self, amount):
        data = self.readJson()

        for i in range(1, amount+1):
            city = vertex.DjikstraVertex(
                data[i]["name"], self.calculateDistance(data[i]["position"]))
            self.addVertex(city)

    def mapify(self):
        startNode = input("What is your destination?")
        for v in self.vertices:
            for i in range(len(self.edges[v])):
                self.edges[v][i].weight = abs(
                    self.edges[v][i].weight - v.weight)
            if startNode.upper() == v.data.upper():
                v.weight = 0

        self.printGraph()
```

Making a DjikstraGraph that extends the base Graph Class is needed because it adds the _Djikstra Vertex_ object into its _Vertices_ list. The implementation is slightly different to an A\* approach.

First we get the data from the _readJson()_ function and then check if the graph is empty. If it is we put the root vertex in the graph and with a weight of 0. Next since our function _populateGraphDjikstra()_ has a parameter named _amount_ we use that as our range for our foor loop and with each iteration we make a new Vertex object and add it to the graph

For _mapify()_ we ask for a start node and then we iterate through our _vertices_ list. Within the for loop we calculate the distance of cities that are connected to each other. We run a conditional for the start node to make the distance 0 since it is the beginning destination.

### **AStarGraph Class**

```python
class AStarGraph(Graph):
    def __init__(self):
        super().__init__()

    def populateGraphAStar(self, amount):
        data = self.readJson()

        for i in range(amount+1):
            city = vertex.AStarVertex(
                data[i]["name"], self.calculateDistance(data[i]["position"]), 0)
            self.addVertex(city)

    def mapify(self):
        startNode = input("What city are you in?\n")
        goalNode = input("Where do you want to go?\n")
        gaolNodeIndex = 0

        # Getting the Start Node Index
        for idx, val in enumerate(self.vertices):
            if goalNode.upper == val.data.upper():
                goalNodeIndex = idx

        # Changing the Weights and Hueristics
        for v in self.vertices:
            for i in range(len(self.edges[v])):
                self.edges[v][i].weight = abs(
                    self.edges[v][i].weight - v.weight)

                self.edges[v][i].hueristic = self.distanceFrom(
                    self.vertices[goalNodeIndex], self.edges[v][i])

            if startNode.upper() == v.data.upper():
                v.weight = 0

        self.printGraph()

    def distanceFrom(self, vertex1, vertex2):
        return abs(vertex1.weight - vertex2.weight)

    def printGraph(self):
        x = PrettyTable()
        x.field_names = [
            "Vertices (Cities)", "Edges (Cities/Distance/Hueristic)"]

        try:
            for v in self.vertices:
                x.add_row([v.data, [x.getInfo() for x in self.edges[v]]])
            print(x)
        except:
            print("Graph Vertices is not consisted of Cities from JSON file.")

```

This AStarGraph is similar to the Djikstra Graph just the only difference is that we account for hueristics which has yet to be implemented. We also overload the _printGraph()_ function so that the column has the right name and includes Hueristic.

This mapify function is similar however it accounts for a goal node since we want to have correct hueristics. We make a utility function _distanceFrom()_ to help us in the calculation of the hueristics.
