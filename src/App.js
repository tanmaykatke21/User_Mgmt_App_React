import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';
import ChangePassword from './ChangePassword';
import UserProfile from './UserProfile';
import DataLog from './DataLog';
import AdminLogin from './AdminLogin';
import DataAccess from './DataAccess';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/forgotpassword" element={<ForgotPassword/>}></Route>
        <Route path="/changepassword" element={<ChangePassword/>}></Route>
        <Route path="/userprofile" element={<UserProfile/>}></Route>
        <Route path='/datalog' element={<DataLog/>}></Route>
        <Route path="/adminlogin" element={<AdminLogin/>}></Route>
        <Route path="/dataaccess" element={<DataAccess/>}></Route>
        <Route path="*" element={<Login/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
