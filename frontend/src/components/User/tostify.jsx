import React from 'react'
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export default function tostify(message) {
  

    console.log(message);
    if(message === 'Pls Login'){
    Toastify({
        text: message,
        duration: 2000, 
        gravity: 'top', 
        position: 'center',
        backgroundColor: 'red',
      }).showToast();
    }else{
      Toastify({
         text: message,
         duration: 2000, 
         gravity: 'top', 
         position: 'center',
         backgroundColor: 'green',
       }).showToast(); 
    }
         
}
