import { BrowserRouter, Route, Routes } from "react-router-dom";
import ForgotPassword from "./components/auth/ForgotPassword";
import AuthDetails from "./components/AuthDetails.jsx";
import HomePage from './HomePage';
import './App.css'
function App() {
 
  
  return (
    <>
    <BrowserRouter>
            <div>
                <Routes>
                    <Route path="/" element={<HomePage/>} />
                    <Route path="/home" element={<AuthDetails/>} />
                    <Route path="/reset" element={<ForgotPassword/>} />
                </Routes>
            </div>
    </BrowserRouter>


    </>
    
  );
}

export default App;
