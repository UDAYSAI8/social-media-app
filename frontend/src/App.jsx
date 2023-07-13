import "./App.css"
import HomePage from "./Pages/HomePage/HomePage";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./Pages/LoginPage/LoginPage";

function App() {

  return (
    <Routes>
      <Route path="/" Component={() => {
            const token = localStorage.getItem("token");
            return token ? <HomePage /> : Navigate({ to: "/login" });
      }}/>
      <Route path="/login" Component={()=>{
          const token = localStorage.getItem("token");
          return token ? Navigate({ to: "/" }) : <Login />;
      }}/>
      <Route path="*" Component={() => {
            Navigate({ to: "/login" });
      }}/>
    </Routes>
    )
}

export default App;
