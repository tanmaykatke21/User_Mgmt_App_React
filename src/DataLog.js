import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import app from './Firebase';
import { getDatabase, ref, get } from "firebase/database";

export default function DataLog() {
    const [logs, setLogs] = useState([]);
    const [selectedTimestamp, setSelectedTimestamp] = useState("");
    const [accessDetails, setAccessDetails] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = localStorage.getItem('un');
        if (!storedEmail) {
            navigate('/'); // Redirect to login if 'un' is not present in localStorage
            return;
        }

        const fetchDataLog = async () => {
            const db = getDatabase(app);
            const currentUser = storedEmail.replace(/\./g, '_');
            const logsRef = ref(db, `dataaccessrecord/${currentUser}`);

            try {
                const snapshot = await get(logsRef);
                if (snapshot.exists()) {
                    const logsData = snapshot.val();
                    const logsArray = Object.values(logsData).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    setLogs(logsArray);
                } else {
                    console.log("No data access records found.");
                }
            } catch (error) {
                console.error('Error fetching data access logs:', error);
            }
        };

        fetchDataLog();
    }, [navigate]);

    const handleTimestampChange = (event) => {
        const selectedTimestamp = event.target.value;
        setSelectedTimestamp(selectedTimestamp);

        const selectedLog = logs.find(log => log.timestamp === selectedTimestamp);
        setAccessDetails(selectedLog);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Navbar />
            <center>
                <h1>Data Access Log</h1>
                <div className="w-50">
                    <div className="mb-3">
                        <label htmlFor="selectTimestamp" className="form-label">Select Timestamp</label>
                        <select
                            id="selectTimestamp"
                            className="form-select"
                            value={selectedTimestamp}
                            onChange={handleTimestampChange}
                        >
                            <option value="" disabled>Select a timestamp</option>
                            {logs.map((log, index) => (
                                <option key={index} value={log.timestamp}>{log.timestamp}</option>
                            ))}
                        </select>
                    </div>
                    {accessDetails && (
                        <div className="card mt-3">
                            <div className="card-body">
                                <h5 className="card-title">Access Details</h5>
                                <p className="card-text"><strong>Admin:</strong> {accessDetails.admin}</p>
                                <p className="card-text"><strong>Reason:</strong> {accessDetails.reason}</p>
                                <p className="card-text"><strong>Timestamp:</strong> {accessDetails.timestamp}</p>
                            </div>
                        </div>
                    )}
                    <button className="btn btn-secondary mt-3" onClick={handlePrint}>Print Logs</button>
                    <div className="mt-4">
                        <h5>Latest Data Access Log</h5>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Admin</th>
                                    <th>Reason</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.slice(0, 5).map((log, index) => (
                                    <tr key={index}>
                                        <td>{log.timestamp}</td>
                                        <td>{log.admin}</td>
                                        <td>{log.reason}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </center>
        </>
    );
}
