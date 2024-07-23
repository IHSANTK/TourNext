import {useState,useEffect} from 'react';
import Sidebar from './sidebar';
import axios from '../../api'


const Bookings = () => {
  const [bookings,setbookings] = useState([])

  useEffect(()=>{
    const fetchbookings =async()=>{
      try{
        const response = await axios.get("/getallbookings");
        console.log(response);
        setbookings(response.data)
      }catch(error){
        console.log(error);
      }
    }
    fetchbookings()
  },[])

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-grow p-6 bg-gray-100 overflow-auto">
        
        <div className='flex justify-between'>
        <h2 className="text-lg font-bold mb-4">Bookings</h2> 
        
        <button className=' btn bg-gray-700 text-white h-9 '>Download</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal shadow-md rounded-lg overflow-hidden bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                   ID
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Package Name
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total Seats
                </th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>




            <tbody>
            {bookings.map((book,ind)=>(


                <tr key={ind} className="border-b border-gray-200">
                  <td className="px-4 py-3 whitespace-nowrap">
                   {book._id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                   {book.packageName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                   {book.username}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                   {book.email}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                  {book.phoneNumber}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                  {book.tripDate}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                  {book.seats}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                  {book.status}
                  </td>
                </tr>
             ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
