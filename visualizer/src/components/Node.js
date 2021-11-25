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

    //RENDER METHOD
    return (
        <div className="node" id={idx} ref={nodeDiv} onClick={() => goalNodeChange(nodeDiv)}>
            {/* Using props to change color of nodes */}

            {type === 'start' ? startNodeChange(nodeDiv) : null}
            {/* {type === 'visited' ? visitNodeChange(nodeDiv) : null} */}

        </div>
    )
}

export default Node