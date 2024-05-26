import { BrowserRouter, Route, Routes } from "react-router-dom";
import ForgotPassword from "./components/auth/ForgotPassword";
import AuthDetails from "./components/AuthDetails.jsx";
import StudentDetails from "./components/StudentDetails.jsx";
import HomePage from './HomePage';
import './App.css'
import StudentList from "./components/StudentList.jsx";
import Messages from "./components/Messages.jsx";
import MessageStud from "./components/MessageStud.jsx";
function App() {
 
  
  return (
    <>
    <BrowserRouter>
            <div>
                <Routes>
                    <Route path="/" element={<HomePage/>} />
                    <Route path="/admin" element={<AuthDetails/>} />
                    <Route path="/student" element={<StudentDetails/>} />
                    <Route path="/studentList" element={<StudentList/>} />
                    <Route path="/messages" element={<Messages/>} />
                    <Route path="/messagestud" element={<MessageStud/>} />
                    <Route path="/reset" element={<ForgotPassword/>} />
                </Routes>
            </div>
    </BrowserRouter>


    </>
    
  );
}

export default App;
