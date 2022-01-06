import React, { useState } from 'react'
import axios from 'axios'
import "../styles/cities.css"


const GraphView = () => {
    let [map, setMap] = useState([])
    let [country, setCountry] = useState('Indonesia')
    let [initialLoad, setInitialLoad] = useState(true)
    let cities = []

    const getGraph = async () => {
        cities = []
        setMap([])
        setInitialLoad(false)
        try {
            const res = await axios.get('http://localhost:3030/api/cities')
            res.data.forEach(element => {
                cities.push(element.name)
            });
            setMap(cities)

            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const changeGraph = async (e) => {
        e.preventDefault();
        cities = []
        setMap([])
        try {
            cities.length = 0
            const res = await axios.post('http://localhost:3030/api/change', {
                country: country,
            })
            res.data.forEach(element => {
                cities.push(element.name)
            });
            setMap(cities)
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className='countryContainer'>
            {initialLoad && getGraph()}

            <h1> Country: {country} </h1>
            <div className="tableContainer">

                <h2 className='titleGraph'>Cities</h2>
                <div className='cities'>
                    {map.map(city => <h4 key={city}> {city} </h4>)}
                </div>

            </div>

            <form className='webscrapeForm'>
                <label for="changeCountry"> Change Country </label>
                <input type="text" name="changeCountry" onChange={e => setCountry(e.target.value)} />
                <button type="button" onClick={e => changeGraph(e)}> Change </button>
            </form>


        </div>
    )
}

export default GraphView
