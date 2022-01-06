import React, { useState, useEffect } from "react";
import axios from 'axios'
import '../styles/djikstra.css'

const DjikstraView = () => {
	let [startNode, setStart] = useState('')
	let [goalNode, setGoal] = useState('')
	let [results, setResults] = useState(false)
	let [cities, setCities] = useState(false)
	let [citiesAstar, setCitiesAstar] = useState(false)
	let citiesList = []

	const search = async (e) => {
		e.preventDefault()
		try {
			const response = await axios.post('http://localhost:4000/djikstra', {
				start: startNode,
				goal: goalNode
			})
			console.log(response)
			console.log(response.data)
			console.log(response.data.visited)
			setResults(response.data.distance)
			citiesList = response.data.visited
			setCities(citiesList)
			console.log(citiesList)
			console.log("Search Complete!")
		}
		catch (err) {
			console.log(err)
		}
	}

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

				<button className="submitAstar" type="submit" onClick={search}> Astar </button>
				<div className="aStarResults">
					<h3>{results ? `Distance: ${results} Miles` : undefined}</h3>
					<h3> {cities ? "Traveled Cities" : null} </h3>
					<ul className="cityList">
						{citiesAstar ? cities.map(city => <li>{city}</li>) : null}
					</ul>
				</div>
			</form>

		</div>
	)
}

export default DjikstraView;
