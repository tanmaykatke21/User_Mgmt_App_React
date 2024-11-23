import Navbar from './Navbar';
import { useState, useRef, useEffect } from 'react';
import app from './Firebase';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
    const nav = useNavigate();

    useEffect(() => {
        let un = localStorage.getItem("un");
        if (un !== null) {
            nav("/userprofile");
        }
    }, [nav]);

    const rEmail = useRef();

    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");

    const hEmail = (event) => { setEmail(event.target.value); }

    const sm = (event) => {
        event.preventDefault();
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
            .then(res => {
                setMsg("Password reset email sent.");
                nav("/");
            })
            .catch(err => { setMsg("Issue " + err) });
    }

    return (
        <>
            <center>
                <Navbar />
                <div className="card custom-border-card mt-5 rounded-5">
                    <div className="card-header">
                        <h3>Forgot Password</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={sm}>
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" onChange={hEmail} ref={rEmail} value={email} />
                                <label htmlFor="floatingInput">Email address</label>
                            </div>
                            <div>
                                <input type="submit" className='btn btn-lg btn-secondary mt-3 w-25' value="Send Mail" />
                            </div>
                        </form>
                    </div>
                </div>
                <h2>{msg}</h2>
            </center>
        </>
    );
}
