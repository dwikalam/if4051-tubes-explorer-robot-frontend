import { Route, Routes } from "react-router-dom";
import Navbar from "./layout/Navbar";

function App() {
  return (
    <Routes>
      <Route element={<Navbar />}>
      </Route>
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
}

export default App;
