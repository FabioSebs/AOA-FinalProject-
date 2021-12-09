import React, { useState, useEffect } from "react";
import axios from 'axios'
import '../styles/djikstra.css'

const DjikstraView = () => {
	let [startNode, setStart] = useState('')
	let [goalNode, setGoal] = useState('')
	let [results, setResults] = useState(false)
	let [cities, setCities] = useState(false)
	let citiesList = []

	const search = async (e) => {
		e.preventDefault()
		try {
			const response = await axios.post('http://localhost:5000/djikstra', {
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
		<>
			<h1>Djikstra Search on Graph</h1>
			<form className="djikstraContainer" method="POST">

				<label for="start"> What is your Location?</label>
				<input onChange={(e) => { setStart(e.target.value) }} required></input>

				<label for="start"> What is your Destination?</label>
				<input onChange={(e) => { setGoal(e.target.value) }}></input>

				<button className="submitDjikstra" type="submit" onClick={search}> Djikstra </button>
			</form>
			<h3>{results ? `Distance: ${results} Miles` : undefined}</h3>
			<h3> {cities ? "Traveled Cities" : null} </h3>
			<ul>
				{cities ? cities.map(city => <li>{city}</li>) : null}
			</ul>
		</>
	)
}

export default DjikstraView;
