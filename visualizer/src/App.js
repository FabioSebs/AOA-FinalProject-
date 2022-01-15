import Visualizer from './components/Visualizer'
import DjikstraView from './components/DjikstraView'
import GraphView from './components/GraphView';

function App() {
  return (
    <div className="App" style={{ scrollSnapType: "mandatory" }}>
      <Visualizer />
      <GraphView />
      <DjikstraView />
    </div>
  );
}

export default App;
