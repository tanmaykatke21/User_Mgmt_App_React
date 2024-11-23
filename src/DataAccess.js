import Navbar from './Navbar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import app from './Firebase';
import { getDatabase, ref, get, set, push } from 'firebase/database';

export default function DataAccess() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [userData, setUserData] = useState(null);
    const [reason, setReason] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Check if admin's email is present in localStorage
        const adminEmail = localStorage.getItem("un");
        if (!adminEmail) {
            navigate('/adminlogin'); // Redirect to admin login if not present
        } else {
            setAdminEmail(adminEmail);
            fetchUsers();
        }
    }, [navigate]);

    const fetchUsers = async () => {
        const db = getDatabase(app);
        const usersRef = ref(db, 'userRoles');

        try {
            const snapshot = await get(usersRef);
            if (snapshot.exists()) {
                const usersData = snapshot.val();
                const userEmails = Object.keys(usersData)
                    .filter(key => usersData[key].role === 'user')
                    .map(key => key.replace(/_/g, '.')); // Replacing underscores with dots to revert to original email format
                setUsers(userEmails);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (selectedUser && reason) {
            const db = getDatabase(app);
            const userRef = ref(db, `customers/data/${selectedUser.replace(/\./g, '_')}`); // Assuming user data is stored under 'customers/data' node

            try {
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    setUserData(userData);

                    // Log access information
                    const accessRef = ref(db, `dataaccessrecord/${selectedUser.replace(/\./g, '_')}`);
                    const newAccessRef = push(accessRef);
                    const timestamp = new Date().toLocaleString();

                    const accessData = {
                        admin: adminEmail,
                        reason: reason,
                        timestamp: timestamp,
                    };

                    await set(newAccessRef, accessData);
                    console.log('Access recorded:', accessData);

                    // Show success alert and clear inputs except userData
                    alert('Data accessed successfully.');
                    setSelectedUser("");
                    setReason("");

                } else {
                    console.error("No data available for the selected user.");
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        } else {
            alert("Please select a user and a reason.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-6">
                        <div className="card custom-border-card rounded-5">
                            <div className="card-header">
                                <h3>Data Access</h3>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="selectUser" className="form-label">Select User</label>
                                        <select
                                            id="selectUser"
                                            className="form-select"
                                            style={{ width: '70%' }}
                                            value={selectedUser}
                                            onChange={(e) => setSelectedUser(e.target.value)}
                                        >
                                            <option value="" disabled>Select a user</option>
                                            {users.map(userEmail => (
                                                <option key={userEmail} value={userEmail}>{userEmail}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="selectReason" className="form-label">Select Reason</label>
                                        <select
                                            id="selectReason"
                                            className="form-select"
                                            style={{ width: '70%' }}
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                        >
                                            <option value="" disabled>Select a reason</option>
                                            <option>Product Delivery</option>
                                            <option>Scrutiny</option>
                                            <option>Research & Data Analytics</option>
                                            <option>Customer Support</option>
                                            <option>Marketing</option>
                                        </select>
                                    </div>
                                    <div>
                                        <input type="submit" className="btn btn-lg btn-secondary mt-3 w-50" value="Submit" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card custom-border-card rounded-5">
                            <div className="card-header">
                                <h3>User Data</h3>
                            </div>
                            <div className="card-body">
                                {userData ? (
                                    <div>
                                        <h4>Details:</h4>
                                        <pre>{JSON.stringify(userData, null, 2)}</pre>
                                    </div>
                                ) : (
                                    <p>No user data to display. Please select a user and submit.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
