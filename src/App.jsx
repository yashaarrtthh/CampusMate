import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddResource from "./pages/AddResource";
import EditResource from "./pages/EditResource";
import ResourceDetails from "./pages/ResourceDetails";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />
        <Route
          path="/edit-resource/:id"
          element={<EditResource />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="/add-resource"
          element={<AddResource />}
        />
        <Route
  path="/resource/:id"
  element={<ResourceDetails />}
/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;