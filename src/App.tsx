import "./App.css";
import useAuth from "./hooks/useAuth";

function App() {
  useAuth();
  return <h1 className="h1">Flavory - home</h1>;
}

export default App;
