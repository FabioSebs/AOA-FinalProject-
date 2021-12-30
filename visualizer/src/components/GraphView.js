import React, { useState } from 'react'
import axios from 'axios'
import "../styles/cities.css"


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

    const changeGraph = async (e) => {
        e.preventDefault();
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
        <div className='countryContainer'>
            <h1> Country: {country} </h1>
            <div className="tableContainer">

                <h2 className='titleGraph'>Cities</h2>
                <div className='cities'>
                    {map.map(city => <h4 key={city}> {city} </h4>)}
                </div>

            </div>
            {/* <button onClick={!check ? getGraph : resetCities}> {buttonTxt} </button> */}

            <form className='webscrapeForm'>
                <label for="changeCountry"> Change Country </label>
                <input type="text" name="changeCountry" onChange={e => setCountry(e.target.value)} />
                <button type="button" onClick={e => changeGraph(e)}> Change </button>
            </form>


        </div>
    )
}

export default GraphView
