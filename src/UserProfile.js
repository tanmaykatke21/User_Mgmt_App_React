import Navbar from './Navbar';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import app from './Firebase';
import { getDatabase, set, ref, get } from 'firebase/database';

export default function UserProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    /* Getting variable names for storing in database */

    const [fname, setFname] = useState("");
    const [mname, setMname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [dob, setDob] = useState("");
    const [contact, setContact] = useState("");
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [addr1, setAddr1] = useState("");
    const [addr2, setAddr2] = useState("");
    const [landmark, setLandmark] = useState("");

    const navigate = useNavigate();

    const hFname = (event) => { setFname(event.target.value); }
    const hMname = (event) => { setMname(event.target.value); }
    const hLname = (event) => { setLname(event.target.value); }
    const hDob = (event) => { setDob(event.target.value); }
    const hContact = (event) => { setContact(event.target.value); }
    const hAddr1 = (event) => { setAddr1(event.target.value); }
    const hAddr2 = (event) => { setAddr2(event.target.value); }
    const hLandmark = (event) => { setLandmark(event.target.value); }

    useEffect(() => {
        const storedEmail = localStorage.getItem('un');
        if (!storedEmail) {
            navigate('/'); // Redirect to login if 'un' is not present in localStorage
            return;
        }

        setEmail(storedEmail);
        fetchData(storedEmail);

        axios.get('https://countriesnow.space/api/v0.1/countries/states')
            .then(response => {
                const sortedCountries = response.data.data.sort((a, b) => a.name.localeCompare(b.name));
                setCountries(sortedCountries);
                console.log('Countries:', sortedCountries);
            })
            .catch(error => console.error('Error fetching countries:', error));
    }, [navigate]);

    useEffect(() => {
        if (selectedCountry) {
            const country = countries.find(country => country.name === selectedCountry);
            if (country) {
                setStates(country.states);
                console.log('States:', country.states);
            } else {
                setStates([]);
                console.log('No states found for the selected country');
            }
        } else {
            setStates([]);
        }
        setSelectedState('');
        setSelectedCity('');
        setCities([]);
    }, [selectedCountry, countries]);

    useEffect(() => {
        if (selectedState) {
            axios.post('https://countriesnow.space/api/v0.1/countries/state/cities', {
                country: selectedCountry,
                state: selectedState
            })
                .then(response => {
                    const citiesData = response.data.data;
                    setCities(citiesData);
                    console.log('Cities:', citiesData);
                })
                .catch(error => console.error('Error fetching cities:', error));
        } else {
            setCities([]);
        }
        setSelectedCity('');
    }, [selectedState, selectedCountry]);

    const fetchData = async (email) => {
        const db = getDatabase(app);
        const emailKey = email.replace(/[.#$[\]]/g, '_');
        const userRef = ref(db, `customers/data/${emailKey}`);
        
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            const data = snapshot.val();
            setFname(data.first_name || "");
            setMname(data.middle_name || "");
            setLname(data.last_name || "");
            setDob(data.DOB || "");
            setContact(data.contact || "");
            setSelectedCountry(data.country || '');
            setSelectedState(data.state || '');
            setSelectedCity(data.city || '');
            setPincode(data.pincode || '');
            setAddr1(data.al1 || "");
            setAddr2(data.al2 || "");
            setLandmark(data.landmark || "");
        } else {
            alert("No data found for this email. Please set your profile data.");
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        const db = getDatabase(app);

        const emailKey = email.replace(/[.#$[\]]/g, '_');
        const userRef = ref(db, `customers/data/${emailKey}`);
        
        const snapshot = await get(userRef);
        
        let data = {
            email: email,
            first_name: fname,
            middle_name: mname,
            last_name: lname,
            DOB: dob,
            contact: contact,
            country: selectedCountry,
            state: selectedState,
            city: selectedCity,
            pincode: pincode,
            al1: addr1,
            al2: addr2,
            landmark: landmark
        };

        if (snapshot.exists()) {
            const confirmUpdate = window.confirm('Data for this email already exists. Do you want to update it?');
            if (!confirmUpdate) {
                return;
            }
        }

        set(userRef, data)
            .then(() => {
                alert("Data Saved successfully");
            })
            .catch(err => alert("Issue " + err));

        setIsEditing(false);
    };

    const handleCountryChange = (event) => {
        const selectedCountryName = event.target.value;
        setSelectedCountry(selectedCountryName);
        setSelectedState('');
        setSelectedCity('');
        setPincode('');
    };

    const handleStateChange = (event) => {
        setSelectedState(event.target.value);
        setSelectedCity('');
        setPincode('');
    };

    const handleCityChange = (event) => {
        setSelectedCity(event.target.value);
        setPincode('');
    };

    const handlePincodeChange = (event) => {
        setPincode(event.target.value);
    };

    return (
        <>
            <center>
                <Navbar />
                <h1>Profile Page</h1>
                <div className="w-75 user-profile-form">
                    <form>
                        <div className="row">
                            <div className="form-floating mb-3 col-md-4">
                                <input type="text" className="form-control" id="floatingFirstName" placeholder="First Name" disabled={!isEditing} onChange={hFname} value={fname} />
                                <label htmlFor="floatingFirstName" className="label-margin">First Name</label>
                            </div>
                            <div className="form-floating mb-3 col-md-4">
                                <input type="text" className="form-control" id="floatingMiddleName" placeholder="Middle Name" disabled={!isEditing} onChange={hMname} value={mname} />
                                <label htmlFor="floatingMiddleName" className="label-margin">Middle Name</label>
                            </div>
                            <div className="form-floating mb-3 col-md-4">
                                <input type="text" className="form-control" id="floatingLastName" placeholder="Last Name" disabled={!isEditing} onChange={hLname} value={lname} />
                                <label htmlFor="floatingLastName" className="label-margin">Last Name</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-floating mb-3 col-md-6">
                                <input type="email" className="form-control" id="floatingEmail" placeholder="abc@example.com" disabled value={email} />
                                <label htmlFor="floatingEmail" className="label-margin">Email</label>
                            </div>
                            <div className="form-floating mb-3 col-md-6">
                                <input type="date" className="form-control" id="floatingDOB" name="birthday" placeholder="DOB" disabled={!isEditing} onChange={hDob} value={dob} />
                                <label htmlFor="floatingDOB" className="label-margin">DOB</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-floating mb-3 col-md-6">
                                <input type="tel" className="form-control" id="floatingContact" placeholder="1234567890" disabled={!isEditing} onChange={hContact} value={contact} />
                                <label htmlFor="floatingContact" className="label-margin">Contact No.</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-floating mb-3 col-md-6">
                                <select className="form-select" id="floatingCountry" value={selectedCountry} onChange={handleCountryChange} disabled={!isEditing}>
                                    <option value="" disabled>Select Country</option>
                                    {countries.map(country => (
                                        <option key={country.name} value={country.name}>{country.name}</option>
                                    ))}
                                </select>
                                <label htmlFor="floatingCountry" className="label-margin">Country</label>
                            </div>
                            <div className="form-floating mb-3 col-md-6">
                                <select className="form-select" id="floatingState" value={selectedState} onChange={handleStateChange} disabled={!isEditing || !selectedCountry}>
                                    <option value="" disabled>Select State</option>
                                    {states.map(state => (
                                        <option key={state.name} value={state.name}>{state.name}</option>
                                    ))}
                                </select>
                                <label htmlFor="floatingState" className="label-margin">State</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-floating mb-3 col-md-6">
                                <select className="form-select" id="floatingCity" value={selectedCity} onChange={handleCityChange} disabled={!isEditing || !selectedState}>
                                    <option value="" disabled>Select City</option>
                                    {cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                                <label htmlFor="floatingCity" className="label-margin">City</label>
                            </div>
                            <div className="form-floating mb-3 col-md-6">
                                <input type="number" className="form-control" id="floatingPincode" placeholder="Pincode" value={pincode} onChange={handlePincodeChange} disabled={!isEditing || !selectedCity} />
                                <label htmlFor="floatingPincode" className="label-margin">Pincode</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-floating mb-3 col-md-12">
                                <input type="text" className="form-control" id="floatingAddress1" placeholder="Address Line 1" disabled={!isEditing} onChange={hAddr1} value={addr1} />
                                <label htmlFor="floatingAddress1" className="label-margin">Address Line 1</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-floating mb-3 col-md-12">
                                <input type="text" className="form-control" id="floatingAddress2" placeholder="Address Line 2" disabled={!isEditing} onChange={hAddr2} value={addr2} />
                                <label htmlFor="floatingAddress2" className="label-margin">Address Line 2</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-floating mb-3 col-md-12">
                                <input type="text" className="form-control" id="floatingLandmark" placeholder="Landmark" disabled={!isEditing} onChange={hLandmark} value={landmark} />
                                <label htmlFor="floatingLandmark" className="label-margin">Landmark</label>
                            </div>
                        </div>
                        <div className="text-center">
                            {isEditing ? (
                                <button type="button" className="btn btn-primary" onClick={handleSaveClick}>Save</button>
                            ) : (
                                <button type="button" className="btn btn-secondary" onClick={handleEditClick}>Edit Profile</button>
                            )}
                        </div>
                    </form>
                </div>
            </center>
        </>
    );
}
