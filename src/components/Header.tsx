import React from 'react'
import moment from 'moment'
import DefaultProfile from '../assets/images/default.png'
import { Bell } from 'lucide-react'
const Header = () => {
    
  return (
    <div className='h-20 flex items-center justify-between'>
        <div className='flex items-center gap-5'>
            <div className='border-2 h-10 w-64 flex px-3 items-center rounded-lg border-gray-200 shadow-md'>
                <div className='h-6 w-6 me-3 rounded-full bg-gradient-to-tr from-gray-500 to-70% to-gray-300'></div>
                <p>Jerome Perona</p>
            </div>
            <p>{moment().format("MMMM D, YYYY")}</p>
        </div>
        <div className='flex items-center w-24 justify-between'>
            <Bell />
            <div className='h-10 w-10 bg-gray-300 rounded-full items-center justify-center flex'>
                <img src={DefaultProfile} width={"25px"} alt="Profile Picture"/>
            </div>
        </div>
    </div>
  )
}

export default Header