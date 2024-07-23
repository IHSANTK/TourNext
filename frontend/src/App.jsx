import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/User/Login/Login';
import Signup from './components/User/Signup/Siginup';
import Homepage from './components/User/LandingPage/Homepage';

import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './components/Admin/dasboard';
import CustomersList from './components/Admin/costomerlist';
import Adminlogin from './components/Admin/login';
import Categorylist from "./components/Admin/Categories";
import CategoryAdd from "./components/Admin/CategorieAdd";
// import CategoryEdit from "./components/Admin/CategorieEdit";
import Destinations from "./components/Admin/Destinations";
import DestinationAdd from "./components/Admin/DestinationsAdd";
import Bookings from './components/Admin/Bookings';
import States from './components/Admin/States';
import Places from './components/Admin/Places'; 
import StatesAdd from './components/Admin/StatesAdd';
import Tourpackaegeslist from './components/Admin/TourPackagesList'
import TourPackageAddForm from './components/Admin/TourPackageAddForm';
import BannerManagement from './components/Admin/BannerManagement';
import PlacesAdd from './components/Admin/PlacesAdd';

import Packages from './components/User/PackagesPage/Packages';
import Packagedetiels from './components/User/PackagesPage/Packagedetiels';
import BookingDetails from './components/User/PackagesPage/BookingDetails';



import ProtectedRoute from './components/adminProtectedRoute';
import userProtecterRoute from './components/userProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Homepage />} /> {/* Default route */}

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="login" element={<Adminlogin />} />
          <Route path="dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="userlist" element={<ProtectedRoute><CustomersList /></ProtectedRoute>} />
          <Route path="categories" element={<ProtectedRoute><Categorylist /></ProtectedRoute>} />
          <Route path="categorieAdd" element={<ProtectedRoute><CategoryAdd /></ProtectedRoute>} />
          {/* <Route path="categorieEdit/:id" element={<ProtectedRoute><CategoryEdit /></ProtectedRoute>} /> */}
          <Route path="destintions" element={<ProtectedRoute><Destinations /></ProtectedRoute>} />
          <Route path="destintionAdd" element={<ProtectedRoute><DestinationAdd /></ProtectedRoute>} />
          <Route path="bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
          <Route path="states" element={<ProtectedRoute><States /></ProtectedRoute>} />
          <Route path="statesAdd" element={<ProtectedRoute><StatesAdd /></ProtectedRoute>} />
          <Route path="states/:stateId/places" element={<ProtectedRoute><Places /></ProtectedRoute>} />
          <Route path="placesAdd/:stateId" element={<ProtectedRoute><PlacesAdd /></ProtectedRoute>} />
          <Route path="bannerManagement" element={<ProtectedRoute><BannerManagement /></ProtectedRoute>} />


          <Route path="tourPackagelist" element={<ProtectedRoute><Tourpackaegeslist /></ProtectedRoute>} />
          <Route path="tourPackageAdd" element={<ProtectedRoute><TourPackageAddForm /></ProtectedRoute>} />






        </Route>

        {/* User routes */}
        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" element={<Homepage />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path='Packages' element={<Packages/>} />
          <Route path='packagedetails/:pkgId' element={< Packagedetiels/>} />
          <Route path="bookingdetiles" element={<BookingDetails/>} />


          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
