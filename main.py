import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import vertex
import graph
import search

app = FastAPI()

class Travel(BaseModel):
    start: str
    goal:str

@app.post("/djikstra/")
async def getDjikstra(nodes: Travel):
    djik = graph.DjikstraGraph()
    djik.populateGraphDjikstra(500)
    start, goal = djik.mapify(nodes.start, nodes.goal)
    {distance} = search.DjikstraSearch(djik, start, goal)
    return sum(distance)

@app.post("/astar/")
async def getAStar(nodes: Travel):
    astar = graph.AStarGraph()
    astar.populateGraphAStar(500)
    start, goal = astar.mapify(nodes.start, nodes.goal)
    res = search.AStar(astar, start, goal)
    return res

origins = [ "http://localhost:3000", "http://localhost" ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
    # test1 = graph.AStarGraph()
    # test1.populateGraphAStar(20)
    # test1.printGraph()
    # test1.mapify()
    # test2 = graph.DjikstraGraph()
    # test2.populateGraphDjikstra(20)
    # test2.printGraph()
    # start, goal = test2.mapify()
    # res = search.DjikstraSearch(test2, start, goal)
    # print(res)
