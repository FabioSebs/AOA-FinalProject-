import React, { useState, useEffect, useRef } from "react";
import Node from './Node'
import '../styles/visualizer.css'

///////////////////////////***CONSTANTS***//////////////////////////////
const STARTNODEROW = 10
const STARTNODECOL = 3


////////////////////////***COMPONENT***//////////////////////////////
const Visualizer = () => {
    // (STATES/REFS/VARIABLES) //
    const Grid = useRef()

    let nodeGrid = []
    let [nodes, setNodes] = useState([]);
    // let [destination, setDestination] = useState(false);
    // let [start, setStart] = useState(false);


    //////////////////////////***DJIKSTRA ALGORITHM***///////////////////////////////
    const Djikstra = (grid, start = null, goal = null, neighbors = null) => {
        let startNode;
        let goalNode;


        //WHEN START AND GOAL NODE ISNT SET / AKA FIRST CALL OF FUNCTION
        if (start === null) {
            //ONLY RUNS WHEN START AND NODE NEED TO BE FOUND

            //FILTERING THE START AND GOAL NODE BY THEIR DISTANCE
            let importantNodes = [];
            grid.forEach(row => {
                row.forEach(node => {
                    if (node.distance === 0) {
                        importantNodes.push(node)
                    }
                })
            });

            //DECONSTRUCTING THE START NODE AND GAOL NODE
            try {
                [startNode, goalNode] = [...importantNodes]
            } catch (error) {
                console.log("NO DESTINATION NODE SET")
            }
            // console.log(startNode, goalNode) //WORKS!

            //GETTING NEIGHBORS    
            let right = startNode.right ? grid[startNode.row][startNode.right] : null;
            let left = startNode.left ? grid[startNode.row][startNode.left] : null
            let up = startNode.up ? grid[startNode.up][startNode.col] : null
            let down = startNode.down ? grid[startNode.down][startNode.col] : null
            // console.log(right, left, up, down) //WORKS!
            neighbors = [right, up, left, down]

            //FILTERING NULL VALUES
            neighbors = neighbors.filter(node => node)

            //CHECKING IF NEIGHBORS ARE GAOLS
            for (let x = 0; x < neighbors.length; x++) {
                if (neighbors[x].isGoal) {
                    return true
                }

                visited(neighbors[x], startNode)

            }

            //RECURSION CALLING DJIKSTRA
            return Djikstra(grid, startNode, goalNode, neighbors)

        } else {

            let uniqueNodes = []
            let nextNodes = []

            //FILTERING NULL VALUES
            neighbors = neighbors.filter(node => node)

            console.log(neighbors)
            // GETTING NEW NEIGHBORS OF THE LAST LAST NEIGHBORS

            for (let x = 0; x < neighbors.length; x++) { ////////

                console.log(neighbors[x])

                // GETTING NEIGHBORS OF NEW START

                if (neighbors[x].left > 0 && neighbors[x].up > 0 && neighbors[x].right < 48 && neighbors[x].down < 19) {
                    let right = neighbors[x].right ? grid[neighbors[x].row][neighbors[x].right] : null;
                    let left = neighbors[x].left ? grid[neighbors[x].row][neighbors[x].left] : null;
                    let up = neighbors[x].up ? grid[neighbors[x].up][neighbors[x].col] : null;
                    let down = neighbors[x].down ? grid[neighbors[x].down][neighbors[x].col] : null;
                    // console.log(right, left, up, down) //WORKS!
                    if (right) {
                        nextNodes.push(right)
                    }
                    if (left) {
                        nextNodes.push(left)
                    }
                    if (up) {
                        nextNodes.push(up)
                    }
                    if (down) {
                        nextNodes.push(down)
                    }
                }
            }
            // COMBINING NEW NEIGHBORS AND PREVIOUS NEIGHBORS
            nextNodes = neighbors.concat(nextNodes)

            //FILTERING NULL VALUES AND PUTTING INTO UNIQUE NODES
            nextNodes = nextNodes.filter(node => node)

            //FILTERING DUPLICATES
            nextNodes.forEach(node => {
                if (!uniqueNodes.includes(node)) {
                    uniqueNodes.push(node)
                }
            })

            console.log(uniqueNodes)

            // CHECKING IF NEIGHBORS ARE GOAL NODES
            for (let x = 0; x < uniqueNodes.length; x++) {
                if (uniqueNodes[x].isGoal) {
                    return true
                }
                setTimeout(() => {
                    visited(uniqueNodes[x], start)
                }, 10 * x)
            }

            //RECURSION CALLING DJIKSTRA
            return Djikstra(grid, start, goal, uniqueNodes)
        }////////
    }


    //////////////////////////***ASTAR ALGORITHM***///////////////////////////////
    const AStar = (grid, startNode = null, goalNode = null, animationTime = 0) => {

        //FIRST CALL OF FUNCTION WHEN GOAL AND START IS NULL
        if (startNode === null) {

            //FILTERING THE START AND GOAL NODE BY THEIR DISTANCE
            let importantNodes = [];
            grid.forEach(row => {
                row.forEach(node => {
                    if (node.distance === 0) {
                        importantNodes.push(node)
                    }
                })
            });

            //DECONSTRUCTING THE START NODE AND GAOL NODE
            try {
                [startNode, goalNode] = [...importantNodes]
            } catch (error) {
                console.log("NO DESTINATION NODE SET")
            }

            //SETS HEURISTICS RESPECTIVE TO THE GOAL NODE
            setHueristics(grid)
            calculateHueristics(goalNode, grid)

            //GET THE NEIGHBORS
            let right = startNode.right ? grid[startNode.row][startNode.right] : null;
            let left = startNode.left ? grid[startNode.row][startNode.left] : null
            let up = startNode.up ? grid[startNode.up][startNode.col] : null
            let down = startNode.down ? grid[startNode.down][startNode.col] : null
            // console.log(right, left, up, down) //WORKS!
            let neighbors = [right, up, left, down]

            //FILTERING NULL VALUES
            neighbors = neighbors.filter(node => node)

            //PRUNING THE NEIGHBORS THAT ARENT MOVING CLOSER TO GOAL NODE
            let closestNode = Infinity;
            neighbors.forEach(node => {
                if (node.hueristic < closestNode) {
                    closestNode = node.hueristic
                }
            })

            neighbors.forEach(node => {
                closestNode = closestNode === node.hueristic ? node : closestNode
            })


            if (closestNode.isGoal) {
                return true
            } else {
                setTimeout(() => {
                    visited(closestNode, startNode, goalNode)
                }, animationTime * 500)
            }

            return AStar(grid, closestNode, goalNode, ++animationTime)
        }
        else {
            //GET THE NEIGHBORS OF NEW START
            let right = startNode.right ? grid[startNode.row][startNode.right] : null;
            let left = startNode.left ? grid[startNode.row][startNode.left] : null
            let up = startNode.up ? grid[startNode.up][startNode.col] : null
            let down = startNode.down ? grid[startNode.down][startNode.col] : null
            // console.log(right, left, up, down) //WORKS!
            let neighbors = [right, up, left, down]

            //FILTERING NULL VALUES
            neighbors = neighbors.filter(node => node)

            neighbors.forEach(node => {
                if (node.isGoal) {
                    return true
                }
            })


            //PRUNING THE NEIGHBORS THAT ARENT MOVING CLOSER TO GOAL NODE
            let closestNode = Infinity;
            neighbors.forEach(node => {
                if (node.hueristic < closestNode) {
                    closestNode = node.hueristic
                }
            })

            neighbors.forEach(node => {
                closestNode = closestNode === node.hueristic ? node : closestNode
            })

            if (closestNode.isGoal) {
                return true
            } else {
                setTimeout(() => {
                    visited(closestNode, startNode, goalNode)
                }, animationTime * 100)

            }
            AStar(grid, closestNode, goalNode, ++animationTime)
        }

    }

    const setHueristics = (grid) => {
        let iterator = 0
        grid.forEach(row => {
            row.forEach(node => {
                node.hueristic = iterator++
            })
        })
    }

    const calculateHueristics = (goalNode, grid) => {
        grid.forEach(row => {
            row.forEach(node => {
                node.hueristic = Math.abs(node.hueristic - goalNode.hueristic)
            })
        })
    }

    /////////////////////////***CLASS***///////////////////////////////////
    class createNode {
        constructor(row, col) {
            this.row = row
            this.col = col
            this.left = getLeft(col) < 0 ? null : getLeft(col)
            this.up = getUp(row) < 0 ? null : getUp(row)
            this.right = getRight(col) > 49 ? null : getRight(col)
            this.down = getDown(row) > 49 ? null : getDown(row)
            this.isStart = isStartGoal(this.distance)
            this.isGoal = isStartGoal(this.distance)
            this.distance = Infinity
            this.hueristic = null
            this.visited = false
            this.previosNode = null
        }
    }

    const getLeft = (col) => {
        return (col-- < 0 ? null : col--)
    }

    const getRight = (col) => {
        return (col++ > 49 ? null : col++)
    }

    const getUp = (row) => {
        return (row-- < 0 ? null : row--)
    }

    const getDown = (row) => {
        return (row++ > 19 ? null : row++)
    }

    const isStartGoal = (distance) => {
        return (distance === 0)
    }



    // CHANGES CLASS OF GRID TO CHOOSING MODE TO CHOOSE DESTINATION
    const chooseMode = (el) => {
        const button = document.querySelector('.dest')
        el.current.classList.toggle('choosing')
        button.disabled = true // PREVENTS MULTIPLE DESTINATIONS
    }

    // CHANGE COLORS OF VISITED SQUARES

    const visited = (node, start = null, goal = null) => {
        let row = node.row
        let col = node.col
        let startRow = start.row
        let startCol = start.col

        let visitIdx = getIdx(row, col)
        let startIdx = getIdx(startRow, startCol)

        if (goal) {
            let goalRow = goal.row
            let goalCol = goal.col

            let goalIdx = getIdx(goalRow, goalCol)

            if (visitIdx === goalIdx) {
                return true
            }
        }

        if (visitIdx === startIdx) {
            return true
        }
        else {
            document.getElementById(`${visitIdx}`).style.background = 'blue'
        }

    }

    const getIdx = (row, col) => {
        return ((row * 50) + col)
    }

    // RENDERS THE GRID WHEN PAGE IS LAODED 
    useEffect(() => {
        // function that returns a 3D array with the rows and columns
        const getGrid = (x, y) => {
            const grid = []

            for (let rows = 0; rows < x; rows++) {
                const row = []
                for (let col = 0; col < y; col++) {
                    row.push([])
                }
                grid.push(row)
            }
            return grid
        }

        setNodes(getGrid(20, 50))

    }, [Grid])


    let iterator = 0
    // RENDER METHOD
    return (
        <div className="grid" ref={Grid}>
            {/* LOOPING THROUGH THE GRIDS ROWS */}
            {nodes.map((row, idx) => {
                //MAKING NEW GRID BUT WITH NODES IN IT, ALMOST LIKE A COPY \\ RETURNING ROW DIVS THAT ARE GONNA HOLD OUR NODE CELLS
                let nodeRow = []
                return (
                    <div className="row" key={idx}>
                        {/* LOOPING THROUGH THE ROWS COLUMNS */}
                        {row.map((_, idx2) => {
                            // CREATING NODE OBJ FOR EVERY COLUMN AND CONDITIONALS TO CHECK FOR START NODE
                            let nodeOBJ = new createNode(idx, idx2)
                            if (idx === STARTNODEROW && idx2 === STARTNODECOL) {
                                nodeOBJ.isStart = true
                                nodeOBJ.distance = 0
                                nodeRow.push(nodeOBJ)
                                return <Node type="start" node={nodeOBJ} key={idx2} idx={iterator++}> </Node>
                            } else {
                                nodeRow.push(nodeOBJ)
                                return <Node node={nodeOBJ} key={idx2} idx={iterator++}> </Node>
                            }
                        })}
                        <p className='hidden'>{nodeGrid.push(nodeRow)}</p>
                    </div>
                )
            })}
            {/* BUTTONS */}
            <div className="buttons">
                <button className="dest" onClick={(button) => chooseMode(Grid)}>Choose Destination</button>
                <button className="djikstra" onClick={() => Djikstra(nodeGrid)}>Djikstra Algorithm</button>
                <button className="astar" onClick={() => AStar(nodeGrid)}>A* Algorithm</button>
            </div>

        </div>
    )
}

export default Visualizer