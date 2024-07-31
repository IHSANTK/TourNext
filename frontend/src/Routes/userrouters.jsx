import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from '../components/User/Login/Login';
import Signup from '../components/User/Signup/Siginup';
import Homepage from '../components/User/LandingPage/Homepage';

import UserLayout from '../layouts/UserLayout';


import Packages from '../components/User/PackagesPage/Packages';
import Packagedetiels from '../components/User/PackagesPage/Packagedetiels';
import BookingDetails from '../components/User/PackagesPage/BookingDetails';
import Alldestinations from '../components/User/Destinations/Alldestinations';
import DestinationDetails from '../components/User/Destinations/Destinationditeils';
import ChatList from '../components/User/Destinations/ChatList';
import UserProfile from '../components/User/profail/UserProfile';



import UserProtecterRoute from '../components/userProtectedRoute'


export default function userrouters() {
  return (
    <Router>
    <Routes>
      
      <Route path="/" element={<Homepage />} /> 


       <Route path="/user" element={<UserLayout />}>
        <Route path="dashboard" element={<Homepage />} />
        <Route path="login" element={<UserProtecterRoute restricted={true}><Login /></UserProtecterRoute>} />
        <Route path="signup" element={<Signup />} />
        <Route path='Packages' element={<UserProtecterRoute restricted={false}><Packages/></UserProtecterRoute>} />
        <Route path='packagedetails/:pkgId' element={<UserProtecterRoute restricted={false}>< Packagedetiels/></UserProtecterRoute>} />
        <Route path="bookingdetiles/:message" element={<UserProtecterRoute restricted={false}><BookingDetails/></UserProtecterRoute>} />
        <Route path='Alldestinations' element={<Alldestinations/>} />
        <Route path='chatlist' element={<ChatList/>} />
        <Route path='profialpage' element={<UserProtecterRoute restricted={false}><UserProfile/></UserProtecterRoute>}/>
       
        <Route path='destinationDetails/:destId' element={<DestinationDetails/>} />


 
      </Route>

    </Routes>
  </Router>
  )
}
