import Navbar from './Navbar';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import app from './Firebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';

export default function Login() {
    const nav = useNavigate();

    useEffect(() => {
        let un = localStorage.getItem("un");
        if (un !== null) {
            checkRole(un);
        }
    }, []);

    const rEmail = useRef();
    const rPass = useRef();

    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [msg, setMsg] = useState("");

    const hEmail = (event) => { setEmail(event.target.value); }
    const hPass = (event) => { setPass(event.target.value); }

    const login = (event) => {
        event.preventDefault();
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, pass)
            .then(res => {
                checkRole(email);
            })
            .catch(err => {
                setMsg("Issue " + err);
            });
    }

    const checkRole = async (email) => {
        const db = getDatabase(app);
        const emailKey = email.replace(/[.#$[\]]/g, '_');
        const userRef = ref(db, `userRoles/${emailKey}`);

        try {
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                const role = snapshot.val().role;
                if (role === 'user') {
                    localStorage.setItem("un", email);
                    nav("/userprofile");
                } else {
                    setMsg("Unauthorized access. Only users are allowed.");
                    localStorage.removeItem("un");
                }
            } else {
                setMsg("No role assigned for this user.");
                localStorage.removeItem("un");
            }
        } catch (err) {
            setMsg("Error checking user role: " + err);
        }
    }

    return (
        <>
            <center>
                <Navbar />
                <div className="card custom-border-card mt-5 rounded-5">
                    <div className="card-header">
                        <h3>User Login</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={login}>
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" onChange={hEmail} ref={rEmail} value={email} />
                                <label htmlFor="floatingInput">Email address</label>
                            </div>
                            <div className="form-floating">
                                <input type="password" className="form-control" id="floatingPassword" placeholder="Password" onChange={hPass} ref={rPass} value={pass} />
                                <label htmlFor="floatingPassword">Password</label>
                            </div>
                            <div>
                                <input type="submit" className='btn btn-lg btn-secondary mt-3 w-25' value="Login" />
                            </div>
                        </form>
                    </div>
                </div>
                <h2>{msg}</h2>
            </center>
        </>
    );
}