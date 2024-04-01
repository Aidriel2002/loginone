import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import './ForgotPassword.css'

function ForgotPassword(){
    const history = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault()
        const emalVal = e.target.email.value;
        sendPasswordResetEmail(auth,emalVal).then(data=>{
            alert("Check your gmail")
            history("/")
        }).catch(err=>{
            alert(err.code)
        })
    }
    return(
        <div className="App">
            <h2>Account Recovery</h2>
            <div className="forgotForm">
            <form onSubmit={(e)=>handleSubmit(e)}>
            <div className="inputBox">
        <input
          className="email-box"
          name="email"
          required
        />
         <span>Enter email</span>
        </div>
                <button className="fbutton">Submit</button>
            </form>
            </div>
        </div>
    )
}
export default ForgotPassword;