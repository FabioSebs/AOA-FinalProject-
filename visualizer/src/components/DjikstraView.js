import React, {useState} from "react";
import axios from 'axios'

const DjikstraView = () => {
	let [startNode, setStart] = useState('')
	let [goalNode, setGoal] = useState('')
	let [results, setResults] = useState(false)
	const search = async (e) => {
		e.preventDefault()
		try{
			const response = await axios.post('http://localhost:5000/djikstra', {
				start: startNode,
				goal: goalNode
			})
			console.log(response)
			console.log(response.data)
			let distance = response.data.reduce((accumulator, iterator) => {
				return (accumulator += parseInt(iterator))
			})
			console.log(distance)
			setResults(distance)
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
				<input onChange={(e) => {setStart(e.target.value)}} required></input>
		
				<label for="start"> What is your Destination?</label>
				<input onChange={(e) => {setGoal(e.target.value)}}></input>
			
				<button className="submitDjikstra" type="submit" onClick={search}> Djikstra </button>
			</form>
			<h3>{results ? `Distance: ${results}` : undefined}</h3>
		</>
	)
}

export default DjikstraView;
