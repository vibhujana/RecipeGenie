
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profiles from "./pages/Profiles"
import Recipes from "./pages/Recipes"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"




function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/profiles" 
          element={
            <ProtectedRoute>
              <Profiles />
            </ProtectedRoute>
          } 
        />
        <Route path = "/"
          element={
            <ProtectedRoute>
              <Recipes />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
