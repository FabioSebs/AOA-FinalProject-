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
- [FastAPI](https://fastapi.tiangolo.com/) - Python Web Framework
- [Uvicorn](https://www.uvicorn.org/) - Python Web Server Framework
- [Pydantic](https://pydantic-docs.helpmanual.io/) - Data Validation Framework
- Go
- [GoColly](http://go-colly.org/) - Go Scraping Framework
- [GoFiber](http://go-colly.org/) - Go Web Framework
- JavaScript
- [ReactJS](https://reactjs.org/) - JavaScript UI Library
- [Axios](https://axios-http.com/) - HTTP Client for JS
- Docker

---

## Code :zap:

This project like most data driven projects begin in the search of the data. The solution was _webscraping_ so we use GoColly in order to webscrape this [website](https://www.mapsofworld.com/lat_long/indonesia-lat-long.html). GoColly is probably one of the fastest Scraping Frameworks out there so the data is written and exported to our proect directory blazing fast. The speed of the framework actually wasn't important at all since we were planning to only work with Indonesian Cities for our project but our Professor asked us to implement _Dynamic Webscraping_ during runtime, so the speed of GoColly actually became crucial. It is also a slick way of replacing a database to hold all of the city data we will use in our graph.

### Webscraping

This is a webscraping function that follows the documentation found on the GoColly website and even on their github repo. The OnHTML function uses Regular Expressions to clean the records of unwanted leading and trailing whitespace. We also use GoQuery which mimics JQuery to find DOM elements within the website we are webscraping. Lastly the function depends on the _country_ parameter given to it, since we are doing dynamic webscraping this parameter is needed.

```go
func Webscraper(country string) []City {
	cities := []City{}
	country = strings.ToLower(country)

    // Collector Object
	c := colly.NewCollector(
		colly.AllowedDomains("mapsofworld.com", "www.mapsofworld.com"),
	)

    // OnHTML Event Listener
	c.OnHTML("table.tableizer-table", func(element *colly.HTMLElement) {
		info := element.DOM
        //REGEX
		name := regexp.MustCompile(`\W*\d*`)
		numbers := regexp.MustCompile(`\D*`)
		entry := info.Find("tbody").Find("tr").Find("td").Text()
		entries := strings.SplitAfter(entry, "E")
		// fmt.Println(entries)

		for _, v := range entries {
			var name_entry string

			if len(name.ReplaceAllString(v, "${1}")) < 2 {
				name_entry = name.ReplaceAllString(v, "${1}")
			} else {
				name_entry = name.ReplaceAllString(v, "${1}")[:len(name.ReplaceAllString(v, "${1}"))-2]
			}

			positionStr := numbers.ReplaceAllString(v, "${1}")

			if len([]rune(positionStr)) >= 8 {
				position, _ := strconv.Atoi(positionStr)

				city := City{
					Name:     name_entry,
					Position: position,
				}
				cities = append(cities, city)
			}

		}

	})

    // Middleware Function to Print URL
	c.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting: ", r.URL)
	})

    // Fires the OnHTML Function
	c.Visit("https://www.mapsofworld.com/lat_long/" + country + "-lat-long.html")

    // Util Function to write cities into JSON
	writeJSON(cities)

	return cities
}
```

---

### Go Fiber / Dynamic Webscraping

Go Fiber is a Web Framework that is inspired by ExpressJS and has similar syntax to Express as well. This allows us to have an API that determines what cities we will have in our JSON file based on country. When someone initially does a GET Request on our API the cities in the JSON file will be Indonesia. Indonesia is the default. However when someone makes a POST request on our endpoint to change cities, the Webscraping logic will be launched and a new JSON file will be created. We will only have 2 primary endpoints. Here are our Routes/Endpoints.

```go
func Setup(app *fiber.App) {
	app.Get("/api/cities", getCities)
	app.Post("/api/change", changeCity)
}
```

getCities() is just a function that defaults in exporting the JSON file as Indoenesian cities.

```go
func getCities(c *fiber.Ctx) error {
	city := Webscraper("indonesia")
	return c.JSON(city)
}
```

changeCity() is self explanatory, but it uses Go Fiber's BodyParser() to parse the data the client sends in to our API and just gets the country. The incoming data is sent in as \*fiber.Ctx or known as context data that can be parsed or sent back to the client as a response. However the country is sent to the Webscraper() function and then the JSON file is successfully rewritten for our Python program to use.

```go
func changeCity(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	city := Webscraper(data["country"])
	return c.JSON(city)
}
```

---

## Graph Data Structure

The following program has been structured to follow an OOP methodology. There will be basic principles like abstraction, inheritance, modularizing. There is no polymorphism, method overriding, and encapsulation.

### Vertex Class

The Vertex Class acts a base class to inherit from for our two types Verteices we will need. Every vertex has data inside of it so the Vertex Class just has a data attribute. The Djikstra Vertex adds a weight to the factor and the AStarVertex inherits from the DjikstraVertex but adds in a hueristic attribute.

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

---

The Graph is consisted of two properties. The _self.vertices_ is supposed to be a list of Vertices so it is initialized as an empty list. This is where the objects that inherit from Vertex Class will go in.

The _self.edges_ is supposed to be a dictionary with the key/value pair as Vertex/[]Vertex, so we initialize it as an empty dictionary for later appending. To clarify the edges key will have a Vertex as the key and the value will be a list of their neighbors.

### **Graph Class**

```python
class Graph():
    def __init__(self):
        print("Created Graph! \n")
        self.vertices = []
        self.edges = {}
```

Empty function that uses a ternary statement. Code Translated: True if list of vertices is not filled, else if filled return False.

### **isEmpty()**

```python
def isEmpty(self):
        return True if not len(self.vertices) else False
```

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

---

### Python FastAPI / Uvicorn

Python's FastAPI is a web framework for building APIs similar to Go Fiber. Very minimalistic syntax with this framework so the code is quite easy to digest.

_!Question!_ - Why use 2 seperate APIs??? - The API made in Go is solely made to webscrape and the Python API is to accept requests and send back the _algorithm_ results since we coded the algorithms in Python.

```python
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
```

These are the imports that should be used along FastAPI. Uvicorn is an Asynchronous HTTP server that is lightwieght and very fast. Pydantic is a way to validate data coming from the client and also sending data to the client.

```python
app = FastAPI()


class Travel(BaseModel):
    start: str
    goal: str

```

Here we instantiate a FastAPI() object and then make a BaseModel. This is what the user will send us! Basically this model is what will be validated on the User's request and the body of the reqeust has to have a start property of string and a goal property of string. I hope that is clear :D

```python
@app.post("/djikstra/")
async def getDjikstra(nodes: Travel):
    djik = graph.DjikstraGraph()
    djik.populateGraphDjikstra(500)
    start, goal = djik.mapify(nodes.start, nodes.goal)
    print(start, goal)
    return (search.DjikstraSearch(djik, start, goal))

@app.post("/astar/")
async def getAStar(nodes: Travel):
    astar = graph.AStarGraph()
    astar.populateGraphAStar(500)
    start, goal = astar.mapify(nodes.start, nodes.goal)
    res = search.AStar(astar, start, goal)
    return res
```

These are our endpoints. Only 2 is needed since we have 2 algorithms we need results from. The Djikstra and AStar endpoint both run the algorithms and return the result as a python dictionary.

```python
origins = ["http://localhost:3000", "http://localhost"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
```

Here we tell FastAPI what IPV4's are allowed to make request to the server. Since we are running this locally we can just use localhost. This is done to avoid a violation of CORS policy. Next we run the Uvicorn HTTP Server for our API to live in.

### Frontend
