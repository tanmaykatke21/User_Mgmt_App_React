import Navbar from './Navbar';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import app from './Firebase';
import { getAuth, updatePassword, onAuthStateChanged } from 'firebase/auth';

export default function ChangePassword() {
    const nav = useNavigate();

    useEffect(() => {
        const un = localStorage.getItem("un");
        if (un === null) {
            nav("/");
        }
    }, [nav]);

    const rPw1 = useRef();
    const rPw2 = useRef();

    const [pw1, setPw1] = useState("");
    const [pw2, setPw2] = useState("");
    const [msg, setMsg] = useState("");

    const hPw1 = (event) => { setPw1(event.target.value); }
    const hPw2 = (event) => { setPw2(event.target.value); }

    const cp = (event) => {
        event.preventDefault();
        if (pw1 === pw2) {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    updatePassword(user, pw1)
                        .then(res => {
                            localStorage.removeItem("un");
                            nav("/");
                        })
                        .catch(err => setMsg("Issue " + err));
                } else {
                    setMsg("No user is signed in.");
                }
            });
        } else {
            setMsg("Passwords did not match");
            setPw1("");
            setPw2("");
            rPw1.current.focus();
        }
    }

    return (
        <>
            <center>
                <Navbar />
                <div className="card custom-border-card mt-5 rounded-5">
                    <div className="card-header">
                        <h3>Change Password</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={cp}>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="floatingNewPassword" placeholder="Enter new password" onChange={hPw1} ref={rPw1} value={pw1} />
                                <label htmlFor="floatingNewPassword">Enter new password</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="floatingConfirmPassword" placeholder="Confirm new password" onChange={hPw2} ref={rPw2} value={pw2} />
                                <label htmlFor="floatingConfirmPassword">Confirm new password</label>
                            </div>
                            <div>
                                <input type="submit" className='btn btn-lg btn-secondary mt-3 w-50' value="Change Password" />
                            </div>
                        </form>
                    </div>
                </div>
                <h2>{msg}</h2>
            </center>
        </>
    );
}
