import {
  BrowserRouter as Router
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Pages from './Pages/Pages';

function App() {
  return (
    <Router>
      <Pages />
    </Router>
  );
}

export default App
