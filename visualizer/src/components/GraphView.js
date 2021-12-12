import React, { useState } from 'react'
import axios from 'axios'

const GraphView = () => {
    let [map, setMap] = useState([])
    let [country, setCountry] = useState('Indonesia')
    let [check, setCheck] = useState(false)
    let [buttonTxt, setButtonTxt] = useState("Show Cities")
    const cities = []

    const getGraph = async () => {
        try {
            const res = await axios.get('http://localhost:3030/api/cities')
            res.data.forEach(element => {
                cities.push(element.name)
            });
            setMap(cities)
            setCheck(true)
            setButtonTxt("Hide Cities")
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const changeGraph = async () => {
        try {
            cities.length = 0
            const res = await axios.post('http://localhost:3030/api/change', {
                country: country,
            })
            res.data.forEach(element => {
                cities.push(element.name)
            });
            setMap(cities)
            setCheck(true)
            setButtonTxt("Hide Cities")
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    const resetCities = () => {
        setCheck(false)
        setMap([])
        setButtonTxt("Show Cities")
    }

    return (
        <div>
            <h2> Country: {country} </h2>
            <div className="tableContainer">
                <table>
                    <thead>
                        <tr><th>Cities</th></tr>
                    </thead>
                    <tbody>
                        {map.map(city => <tr> <td key={city}> {city} </td></tr>)}
                    </tbody>
                </table>
            </div>
            <button onClick={!check ? getGraph : resetCities}> {buttonTxt} </button>

            <form>
                <label for="changeCountry"> Change Country </label>
                <input type="text" name="changeCountry" onChange={e => setCountry(e.target.value)} />
            </form>
            <button onClick={changeGraph}> Change </button>

        </div>
    )
}

export default GraphView
