import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import app from './Firebase';
import { getDatabase, ref, get } from 'firebase/database';

export default function Navbar() {
    const nav = useNavigate();
    const [un, setUn] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        let u = localStorage.getItem("un");
        setUn(u);
        if (u) {
            checkRole(u);
        }
    }, []);

    const checkRole = async (email) => {
        const db = getDatabase(app);
        const emailKey = email.replace(/[.#$[\]]/g, '_');
        const userRef = ref(db, `userRoles/${emailKey}`);

        try {
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                const role = snapshot.val().role;
                setIsAdmin(role === 'admin');
            } else {
                setIsAdmin(false);
            }
        } catch (err) {
            console.error("Error checking user role: ", err);
        }
    }

    const logout = (event) => {
        event.preventDefault();
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                localStorage.removeItem('un');
                nav('/');
            })
            .catch((error) => {
                console.error('Sign out error', error);
            });
    }

    return (
        <>
            <center>
                <div className='nb' data-bs-theme="dark">
                    <nav className="navbar navbar-expand-lg bg-body-tertiary">
                        <div className="container-fluid">
                            <Link to="/" className='navbar-brand mb-0 h1'>
                                {isAdmin ? 'User Profile Management - Admin Access' : 'User Profile Management'}
                            </Link>
                            <div className="text-end">
                                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                                    <ul className="navbar-nav">
                                        {!un && (
                                            <>
                                                <li className="nav-item ms-5 fs-5">
                                                    <Link to="/">Login</Link>
                                                </li>
                                                <li className="nav-item ms-5 fs-5">
                                                    <Link to="/signup">Sign Up</Link>
                                                </li>
                                                <li className="nav-item ms-5 fs-5">
                                                    <Link to="/forgotpassword">Forgot Password</Link>
                                                </li>
                                            </>
                                        )}
                                        {un && !isAdmin && (
                                            <>
                                                <li className="nav-item ms-5 fs-5">
                                                    <Link to="/userprofile">My Profile</Link>
                                                </li>
                                                <li className="nav-item ms-5 fs-5">
                                                    <Link to="/datalog">Data Access Log</Link>
                                                </li>
                                                <li className="nav-item ms-5 fs-5">
                                                    <Link to="/changepassword">Change Password</Link>
                                                </li>
                                            </>
                                        )}
                                        {un && (
                                            <li className="nav-item ms-5 fs-5">
                                                <button className="rounded-pill px-3" onClick={logout}>Logout</button>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </center>
        </>
    );
}
