package graph

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
)

type City struct {
	name     string `json:"name"`
	position string `json:"position"`
}

func getJson() {
	f, err := os.Open("./cities.json")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	values, _ := ioutil.ReadAll(f)

	fmt.Println(values)
	cities := []City{}

	json.Unmarshal(values, &cities)

	for _, val := range cities {
		fmt.Println(val)
	}

}

func GenerateGraphNodes() {
	getJson()
	// var nodeArray = []charts.GraphNode{}
	// for _, v := range graph.Nodes {
	// 	nodeElement := charts.GraphNode{Name: graph.GetValue(v.Value)}
	// 	nodeArray = append(nodeArray, nodeElement)
	// }
	// return nodeArray
}
