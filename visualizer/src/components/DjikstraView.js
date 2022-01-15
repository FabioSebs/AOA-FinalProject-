import React, { useState, useEffect } from "react";
import axios from 'axios'
import '../styles/djikstra.css'

const DjikstraView = () => {
	// SETTING STATES
	let [startNode, setStart] = useState('')
	let [goalNode, setGoal] = useState('')
	let [results, setResults] = useState(false)
	let [astarResults, setAstarResults] = useState(false)
	let [cities, setCities] = useState(false)
	let [citiesAstar, setCitiesAstar] = useState(false)
	let citiesList = []
	let astarCities = []

	// HANDLE POST REQUEST TO PYTHON API DJIKSTRA
	const search = async (e) => {
		e.preventDefault()
		try {
			const response = await axios.post('http://localhost:4000/djikstra', {
				start: startNode,
				goal: goalNode
			})
			// SETTING MY STATES BASED ON THE RESPONSE
			setResults(response.data.distance)
			citiesList = response.data.visited
			setCities(citiesList)
			console.log("Djikstra Search Complete!")
		}
		catch (err) {
			console.log(err)
		}
	}

	//HANDLE POST REQUEST TO PYTHON API ASTAR
	const astar = async (e) => {
		e.preventDefault()
		try {
			const response = await axios.post('http://localhost:4000/astar', {
				start: startNode,
				goal: goalNode
			})
			// SETTING MY STATES BASED ON RESPONSE
			setAstarResults(response.data.distance)
			astarCities = response.data.visited
			setCitiesAstar(astarCities)
			console.log("Astar Search Complete!")
		} catch (error) {
			console.log(error)
		}
	}

	//JSX FORMS FOR DJIKSTRA AND ASTAR
	return (
		<div className="finalContainer">

			<form className="djikstraContainer" method="POST">
				<h1>Djikstra Search on Graph</h1>
				<label for="start"> What is your Location?</label>
				<input onChange={(e) => { setStart(e.target.value) }} required></input>

				<label for="start"> What is your Destination?</label>
				<input onChange={(e) => { setGoal(e.target.value) }}></input>

				<button className="submitDjikstra" type="submit" onClick={search}> Djikstra </button>

				<div className="djikstraResults">
					<h3>{results ? `Distance: ${results} Miles` : undefined}</h3>
					<h3> {cities ? "Traveled Cities" : null} </h3>
					<ul className="cityList">
						{cities ? cities.map(city => <li>{city}</li>) : null}
						<li>{cities && goalNode}</li>
					</ul>
				</div>
			</form>



			<form className="astarContainer" method="POST">
				<h1>A Star Search on Graph</h1>
				<label for="start"> What is your Location?</label>
				<input onChange={(e) => { setStart(e.target.value) }} required></input>

				<label for="start"> What is your Destination?</label>
				<input onChange={(e) => { setGoal(e.target.value) }}></input>

				<button className="submitAstar" type="submit" onClick={astar}> Astar </button>
				<div className="aStarResults">
					<h3>{astarResults ? `Distance: ${astarResults} Miles` : undefined}</h3>
					<h3> {citiesAstar ? "Traveled Cities" : null} </h3>
					<ul className="cityList">
						{citiesAstar ? citiesAstar.map(city => <li>{city}</li>) : null}
					</ul>
				</div>
			</form>

		</div>
	)
}

export default DjikstraView;
