import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { clearTokens } from '../../redux/adminauthSlice';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api';
import Sidebar from './sidebar';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Admindashbord = () => {
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [destinationCount, setDestinationCount] = useState(0);
  const [monthlyBookingCounts, setMonthlyBookingCounts] = useState({});

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/adminpanel');
        const { totalUsers, totalBookings, destinationCount, monthlyBookingCounts } = response.data;
        setTotalUsers(totalUsers);
        setTotalBookings(totalBookings);
        setDestinationCount(destinationCount);
        setMonthlyBookingCounts(monthlyBookingCounts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleProfileClick = () => {
    setShowLogout(!showLogout);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('/logout', {}, { withCredentials: true });
      if (response.status === 200) {
        dispatch(clearTokens());
        navigate('/admin/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('An error occurred during logout', error);
    }
  };

  const chartData = {
    labels: Object.keys(monthlyBookingCounts).flatMap(year => 
      Object.keys(monthlyBookingCounts[year]).map(month => `${month} ${year}`)
    ),
    datasets: [
      {
        label: 'Monthly Bookings',
        data: Object.keys(monthlyBookingCounts).flatMap(year => 
          Object.values(monthlyBookingCounts[year])
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat().format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month-Year'
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 12,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Bookings Count'
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar />
      <div className="flex-grow p-6 bg-gray-100 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <div className="relative">
            <FaUserCircle className="text-3xl cursor-pointer" onClick={handleProfileClick} />
            {showLogout && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold">Total Users</h2>
            <p className="text-2xl">{totalUsers}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold">Total Bookings</h2>
            <p className="text-2xl">{totalBookings}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold">Total Destinations</h2>
            <p className="text-2xl">{destinationCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-bold mb-4">Monthly Booking Data</h2>
          <div className="h-80">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Recent Bookings</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">B001</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">John Doe</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">2024-07-10</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">Confirmed</td>
                </tr>
               
              </tbody>
            </table>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Admindashbord;
