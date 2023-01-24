import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout"
import Thanks from "./components/Thanks"
export const config = {
  endpoint: `https://qkart-frontend-rupb.onrender.com/api/v1`,
};

function App() {
  return (
    <div className="App">
      {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
          <Routes>
            <Route exact path="/" element={<Products/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            
            <Route path="/checkout" element={<Checkout/>}/>
            
            <Route path="/thanks" element={<Thanks/>}/>
           
          </Routes>
    </div>
  );
}

export default App;
