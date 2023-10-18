import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./normalize.css";
import { Auth } from "./pages/Auth";
import { Landing } from "./pages/Landing";
import { SharedData } from "./components/Auth/SharedData";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Landing />} path="/" />
        <Route
          element={
            <SharedData>
              <Auth />
            </SharedData>
          }
          path="/login"
        />
      </Routes>
    </>
  );
}

export default App;
