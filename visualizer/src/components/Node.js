import React, { useRef } from 'react';
import '../styles/node.css';


//////////////////COMPONENT/////////////////////////////
const Node = ({ type, node, idx }) => {
    // (STATES/REFS/VARIABLES) //
    const nodeDiv = useRef()

    // CHANGES THE CLASS OF THE CELL TO THE PERSPECTIVE VISITED CLASS
    // const visitNodeChange = (el) => {
    //     setTimeout(() => {
    //         el.current.classList.toggle('visited')
    //         console.log(el)
    //     }, 500)
    // }

    // CHANGES THE CLASS OF THE CELL TO THE PERSPECTIVE STARTNODE CLASS
    const startNodeChange = (el) => {
        setTimeout(() => {
            el.current.classList.toggle('startnode')
            node.isGoal = false
            node.isStart = true
        }, 500)
    }

    // CHANGES THE CLASS OF THE CELL BY CHECKING IF A CLASS IS TOGGLED AND UPDATING NODE OBJECT TO GOAL NODE
    const goalNodeChange = (el) => {
        setTimeout(() => {
            let gridElement = document.querySelector('.choosing')
            if (gridElement) {
                el.current.classList.toggle('goalnode')
                gridElement.classList.toggle('choosing')
            }
            node.isGoal = true
            node.isStart = false
            node.distance = 0
        }, 200)
    }

    //JSX FOR THE NODE , THE SQUARES ON THE GRID
    return (
        <div className="node" id={idx} ref={nodeDiv} onClick={() => goalNodeChange(nodeDiv)}>
            {/* Using props to change color of nodes */}

            {type === 'start' && startNodeChange(nodeDiv)}
            {/* {type === 'visited' ? visitNodeChange(nodeDiv) : null} */}

        </div>
    )
}

// THIS COMPONENT IS WHAT MAKES UP THE GRID THERES OVER 100 OF THESE IN THE GRID
// FROM THE GRID WE PASS PROPS TO THE NODE IN CASE ITS A START OR GOAL
// WE HAVE FUNCTIONS IN THIS COMPONENT TO HANDLE THEIR STATE BASED ON THE PROPS PASSED
// USING REFS AND VANILLA JS TO CHANGE THE CLAS NAME OF THE NODE TO HAVE DIFFERENT STYLES

export default Node