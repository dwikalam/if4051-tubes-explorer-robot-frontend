import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./layout/Navbar";
import Exploration from "./page/Exploration";
import Videostream from "./page/Videostream";

function App() {
  return (
    <Routes>
      <Route element={<Navbar />}>
        <Route path="/" element={<Navigate to={"/explorations"} />} />
        <Route path="/explorations">
          <Route index element={<Exploration />} />
        </Route>
        <Route path="/stream">
          <Route index element={<Videostream />} />
        </Route>
      </Route>
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
}

export default App;
