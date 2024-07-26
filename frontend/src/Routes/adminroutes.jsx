
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../components/Admin/dasboard';
import CustomersList from '../components/Admin/costomerlist';
import Adminlogin from '../components/Admin/login';
import Categorylist from "../components/Admin/Categories";
import CategoryAdd from "../components/Admin/CategorieAdd";
// import CategoryEdit from "../components/Admin/CategorieEdit";
import Destinations from "../components/Admin/Destinations";
import DestinationAdd from "../components/Admin/DestinationsAdd";
import Bookings from '../components/Admin/Bookings';
import States from '../components/Admin/States';
import Places from '../components/Admin/Places'; 
import StatesAdd from '../components/Admin/StatesAdd';
import Tourpackaegeslist from '../components/Admin/TourPackagesList'
import TourPackageAddForm from '../components/Admin/TourPackageAddForm';
import BannerManagement from '../components/Admin/BannerManagement';
import PlacesAdd from '../components/Admin/PlacesAdd';


import ProtectedRoute from '../components/adminProtectedRoute';


export default function adminroutes() {
  return (
   


<Router>
    <Routes>
    <Route path="/admin" element={<AdminLayout />}>
    <Route path="login" element={<ProtectedRoute restricted={true}><Adminlogin /></ProtectedRoute>} />
    <Route path="dashboard" element={<ProtectedRoute restricted={false}><AdminDashboard /></ProtectedRoute>} />
    <Route path="userlist" element={<ProtectedRoute restricted={false}><CustomersList /></ProtectedRoute>} />
    <Route path="categories" element={<ProtectedRoute restricted={false}><Categorylist /></ProtectedRoute>} />
    <Route path="categorieAdd" element={<ProtectedRoute restricted={false}><CategoryAdd /></ProtectedRoute>} />
    {/* <Route path="categorieEdit/:id" element={<ProtectedRoute restricted={false}><CategoryEdit /></ProtectedRoute>} /> */}
    <Route path="destintions" element={<ProtectedRoute restricted={false}><Destinations /></ProtectedRoute>} />
    <Route path="destintionAdd" element={<ProtectedRoute restricted={false}><DestinationAdd /></ProtectedRoute>} />
    <Route path="bookings" element={<ProtectedRoute restricted={false}><Bookings /></ProtectedRoute>} />
    <Route path="states" element={<ProtectedRoute restricted={false}><States /></ProtectedRoute>} />
    <Route path="statesAdd" element={<ProtectedRoute restricted={false}><StatesAdd /></ProtectedRoute>} />
    <Route path="states/:stateId/places" element={<ProtectedRoute restricted={false}><Places /></ProtectedRoute>} />
    <Route path="placesAdd/:stateId" element={<ProtectedRoute restricted={false}><PlacesAdd /></ProtectedRoute>} />
    <Route path="bannerManagement" element={<ProtectedRoute restricted={false}><BannerManagement /></ProtectedRoute>} />
    <Route path="tourPackagelist" element={<ProtectedRoute restricted={false}><Tourpackaegeslist /></ProtectedRoute>} />
    <Route path="tourPackageAdd" element={<ProtectedRoute restricted={false}><TourPackageAddForm /></ProtectedRoute>} />
  </Route>
  
      </Routes> 
  </Router>
  
  )
}
