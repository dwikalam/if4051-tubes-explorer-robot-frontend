import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Controller from "./page/Controller";
import Exploration from "./page/Exploration";

function App() {
  return (
    <Routes>
      <Route element={<Navbar />}>
        <Route path="/" element={<Navigate to={"/exploration"} />} />
        <Route path="/explorations">
          <Route index element={<Exploration />} />
        </Route>
        <Route path="/controller">
          <Route index element={<Controller />} />
        </Route>
      </Route>
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
}

export default App;
