package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"regexp"
	"strconv"
	"strings"

	"github.com/gocolly/colly/v2"
)

type City struct {
	Name     string `json:"name"`
	Position int    `json:"position"`
}

func Webscraper() {
	cities := []City{}

	c := colly.NewCollector(
		colly.AllowedDomains("mapsofworld.com", "www.mapsofworld.com"),
	)

	c.OnHTML("table.tableizer-table", func(element *colly.HTMLElement) {
		info := element.DOM
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

	c.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting: ", r.URL)
	})

	c.Visit("https://www.mapsofworld.com/lat_long/indonesia-lat-long.html")

	writeJSON(cities)
}

func writeJSON(data []City) {
	f, err := json.MarshalIndent(data, "", " ")

	if err != nil {
		log.Fatal(err)
		return
	}

	_ = ioutil.WriteFile("cities.json", f, 0644)
}

func main() {
	Webscraper()
}
