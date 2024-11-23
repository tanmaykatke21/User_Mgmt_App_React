import Navbar from './Navbar';
import { useState, useRef, useEffect } from 'react';
import app from './Firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const nav = useNavigate();

    useEffect(() => {
        let un = localStorage.getItem("un");
        if (un !== null) {
            nav("/userprofile");
        }
    }, [nav]);

    const rEmail = useRef();
    const rPass1 = useRef();
    const rPass2 = useRef();

    const [email, setEmail] = useState("");
    const [pass1, setPass1] = useState("");
    const [pass2, setPass2] = useState("");
    const [msg, setMsg] = useState("");

    const hEmail = (event) => { setEmail(event.target.value); }
    const hPass1 = (event) => { setPass1(event.target.value); }
    const hPass2 = (event) => { setPass2(event.target.value); }

    const register = (event) => {
        event.preventDefault();

        if (email === "") {
            alert("Email field is empty");
            rEmail.current.focus();
            return;
        }
        if (pass1 === "") {
            alert("Password field is empty");
            setPass1("");
            setPass2("");
            rPass1.current.focus();
            return;
        }
        if (pass2 === "") {
            alert("Confirm Password field is empty");
            setPass2("");
            rPass2.current.focus();
            return;
        }
        if (pass1 !== pass2) {
            alert("Passwords did not match");
            setPass1("");
            setPass2("");
            rPass1.current.focus();
            return;
        } else {
            const auth = getAuth();
            createUserWithEmailAndPassword(auth, email, pass1)
                .then(res => {
                    const user = res.user;
                    // Store the user's role in the database
                    const db = getDatabase(app);
                    const emailKey = email.replace(/[.#$[\]]/g, '_');
                    set(ref(db, 'userRoles/' + emailKey), {
                        role: 'user'
                    }).then(() => {
                        nav("/");
                    }).catch(err => setMsg("Issue " + err));
                })
                .catch(err => setMsg("Issue " + err));
        }
    }

    return (
        <>
            <center>
                <Navbar />
                <div className="card custom-border-card mt-5 rounded-5">
                    <div className="card-header">
                        <h3>New User Signup</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={register}>
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" onChange={hEmail} ref={rEmail} value={email} />
                                <label htmlFor="floatingInput">Email address</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="floatingPassword1" placeholder="Password" onChange={hPass1} ref={rPass1} value={pass1} />
                                <label htmlFor="floatingPassword">Enter Password</label>
                            </div>
                            <div className="form-floating">
                                <input type="password" className="form-control" id="floatingPassword2" placeholder="Confirm Password" onChange={hPass2} ref={rPass2} value={pass2} />
                                <label htmlFor="floatingPassword">Confirm Password</label>
                            </div>
                            <div>
                                <input type="submit" className='btn btn-lg btn-secondary mt-3 w-25' value="Sign Up" />
                            </div>
                        </form>
                    </div>
                </div>
                <h2>{msg}</h2>
            </center>
        </>
    );
}
