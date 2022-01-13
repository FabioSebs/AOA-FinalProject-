package main

import (
	"aoa/graph"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"regexp"
	"strconv"
	"strings"

	"github.com/gocolly/colly/v2"
	fiber "github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type City struct {
	Name     string `json:"name"`
	Position int    `json:"position"`
}

func Setup(app *fiber.App) {
	app.Get("/api/cities", getCities)
	app.Post("/api/change", changeCity)
}

func getCities(c *fiber.Ctx) error {
	city := Webscraper("indonesia")
	return c.JSON(city)
}

func changeCity(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	city := Webscraper(data["country"])
	return c.JSON(city)
}

func Webscraper(country string) []City {
	cities := []City{}
	country = strings.ToLower(country)
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

				if len(name_entry) < 8 {

					city := City{
						Name:     name_entry,
						Position: position,
					}
					cities = append(cities, city)
				}
			}

		}

	})

	c.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting: ", r.URL)
	})

	c.Visit("https://www.mapsofworld.com/lat_long/" + country + "-lat-long.html")

	writeJSON(cities)

	return cities
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
	graph.GenerateGraph()
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
	}))
	Setup(app)
	app.Listen(":3030")
}
