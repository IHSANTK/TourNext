// import React from 'react';
// import { useForm } from 'react-hook-form';
// import Sidebar from './sidebar'

// export default function CategorieEdit() {
//   const { register, handleSubmit, formState: { errors } } = useForm();

//   const onSubmit = (data) => {
//     console.log(data);
 
//   };

//   return (
//     <div className="flex  h-screen bg-gray-100">

//         <Sidebar />
//       <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
//         <h2 className="text-lg font-bold mb-4">Add Category</h2>
        
//         <div className="mb-4">
//           <label htmlFor="categoryName" className="block text-gray-700 font-bold mb-2">
//             Category Name
//           </label>
//           <input 
//             type="text"
//             id="categoryName"
//             {...register('categoryName', { required: 'Category name is required' })}
//             className={`shadow appearance-none border ${errors.categoryName ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
//           />
//           {errors.categoryName && <p className="text-red-500 text-xs italic">{errors.categoryName.message}</p>}
//         </div>

//         <div className="flex items-center justify-between">
//           <button 
//             type="submit" 
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//           >
//             Add Category
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
