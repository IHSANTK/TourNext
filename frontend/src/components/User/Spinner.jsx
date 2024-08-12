import React from 'react';
import { BounceLoader	} from 'react-spinners';

const Spinner = () => (
  <div className={`flex justify-center items-center h-screen text-emerald-500 `}>
    <BounceLoader	 color='#10b981 ' size={60} />
  </div>
);

export default Spinner;