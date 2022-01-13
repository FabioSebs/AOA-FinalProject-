package graph

import (
	"encoding/json"
	"io"
	"log"
	"math/rand"
	"os"

	"github.com/go-echarts/go-echarts/charts"
)

type Node struct {
	Value   string
	Visited bool
}

//Bidirectional Graph
type Graph struct {
	Nodes []*Node          //array of Nodes
	Edges map[Node][]*Node //Map of Node Keys and Node Array Values
}

//Adding Node to Graph
func (graph *Graph) AddNode(node *Node) {
	graph.Nodes = append(graph.Nodes, node)
}

//Adds Edges to Graph
func (graph *Graph) AddEdge(node1, node2 *Node) {
	//Empty Base Case
	if graph.Edges == nil {
		graph.Edges = make(map[Node][]*Node)
	}

	//Adding to edges property of Graph
	graph.Edges[*node1] = append(graph.Edges[*node1], node2)
	graph.Edges[*node2] = append(graph.Edges[*node2], node1)
}

//Utility Functions
func (graph *Graph) GetValue(val string) string {
	for _, v := range graph.Nodes {
		if val == v.Value {
			return v.Value
		}
	}
	log.Fatal("Not in Graph!")
	return "Not in Graph!"
}

func (graph *Graph) Populate(array []string, limit int) {
	fullSize := len(array)
	for i, _ := range array {
		//basecase
		if i == limit {
			break
		}

		if len(graph.Nodes) == 0 {
			i = fullSize % rand.Intn(fullSize)
			graph.AddNode(&Node{Value: array[i]})
		} else {
			i = fullSize % rand.Intn(fullSize)
			graph.AddNode(&Node{Value: array[i]})
			graph.AddEdge(graph.Nodes[len(graph.Nodes)-2], graph.Nodes[len(graph.Nodes)-1])
		}
	}
}

type City struct {
	Name     string `json:"name"`
	Position int    `json:"position"`
}

func getJson() []City {

	//Opening JSON
	byteValue, err := os.Open("./cities.json")
	if err != nil {
		panic(err)
	}

	var cities []City

	jsonParser := json.NewDecoder(byteValue)
	err = jsonParser.Decode(&cities)
	if err != nil {
		panic(err)
	}

	return cities
}

func GenerateGraphNodes(graph *Graph) []charts.GraphNode {
	var nodeArray = []charts.GraphNode{}

	for _, v := range graph.Nodes {
		nodeElement := charts.GraphNode{Name: graph.GetValue(v.Value)}
		nodeArray = append(nodeArray, nodeElement)
	}
	return nodeArray
}

func GenerateGraphLinks(graph *Graph) []charts.GraphLink {
	links := make([]charts.GraphLink, 0)
	nodeArray := GenerateGraphNodes(graph)

	for idx, val := range nodeArray {
		numTarget := graph.Edges[Node{Value: val.Name}]
		targets := []charts.GraphNode{}

		for _, v := range numTarget {
			targets = append(targets, charts.GraphNode{Name: v.Value})
		}

		for _, v := range targets {
			links = append(links, charts.GraphLink{Source: nodeArray[idx].Name, Target: v.Name})
		}
	}
	return links
}

func edgeGraph(graph *Graph) *charts.Graph {
	MyGraph := charts.NewGraph()
	MyGraph.SetGlobalOptions(charts.TitleOpts{Title: "Graph of Indonesian Cities"})
	MyGraph.Add("Nodes", GenerateGraphNodes(graph), GenerateGraphLinks(graph), charts.GraphOpts{Force: charts.GraphForce{Repulsion: 0}})
	return MyGraph
}

func GenerateGraph() {
	jsondata := getJson()
	var data []string

	for _, val := range jsondata {
		data = append(data, val.Name)
	}

	var testGraph Graph
	testGraph.Populate(data, 30)

	mygraph := edgeGraph(&testGraph)

	f1, err := os.Create("graph.html")
	if err != nil {
		panic(err)
	}

	mygraph.Render(io.MultiWriter(f1))
}
