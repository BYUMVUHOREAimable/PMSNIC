
import { logout } from '@/redux/slices/userReducer'
import React, { useContext } from 'react'
import { BiLogOut } from 'react-icons/bi'
import { MdDashboard } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { CgProfile } from "react-icons/cg";
import { FaParking } from "react-icons/fa";
import { CommonContext } from '@/context'
import { MdRequestPage } from "react-icons/md";

const Sidebar: React.FC = () => {

    const navigate =  useNavigate()
    const dispatch = useDispatch()

      const { user } = useContext(CommonContext)

    const handleLogout = () => {
        dispatch(logout())
    }

    return (
        <div className='w-2/12 pt-10 pb-4  smlg:flex flex flex-col justify-between min-h-screen bg-sky-600 text-white p-2 md:px-4'>
            <div className='flex flex-col'>
    
            <span className='font-bold text-xl text-center'>PMS <span className='mlg:block hidden'
            > Dashboard </span></span>
            <div className='my-4 flex flex-col pt-14'>
                <Link to={"/"} className={`flex items-center rounded-lg p-3 hover:bg-slate-300/60`}>
                    <MdDashboard size={23} className='text-white min-h-6 min-w-6' />
                    <span className='ml-2 text-lg truncate whitespace-nowrap overflow-hidden hidden mlg:block text-neutral-200'>Vehicles</span>
                </Link>
            </div>
               <button onClick={() => navigate('/profile')} className='flex items-center rounded-lg p-3 hover:bg-slate-300/60'>
                
                 <CgProfile  size={23} className='text-white min-h-6 min-w-6' />
                <span className='ml-2 text-lg truncate whitespace-nowrap overflow-hidden hidden mlg:block text-neutral-200'>profile</span>
            </button>
     
    <button onClick={() => navigate('/parkingSlot')} className='flex items-center rounded-lg p-3 hover:bg-slate-300/60'>
                
                 <FaParking  size={23} className='text-white min-h-6 min-w-6' />
                <span className='ml-2 text-lg truncate whitespace-nowrap overflow-hidden hidden mlg:block text-neutral-200'>parkingSlot</span>
            </button> 

               <button onClick={() => navigate('/requestSlot')} className='flex items-center rounded-lg p-3 hover:bg-slate-300/60'>
                
                 <MdRequestPage   size={23} className='text-white min-h-6 min-w-6' />
                <span className='ml-2 truncate whitespace-nowrap overflow-hidden text-lg hidden mlg:block text-clip text-neutral-200'>requested Slots</span>
            </button> 

            </div>

             
             

            <button onClick={handleLogout} className='flex font-bold items-center rounded-lg p-3  hover:bg-slate-300/60'>
               <BiLogOut size={30} className='text-white font-extrabold min-h-4 min-w-4' />
                <span className='ml-2 text-lg hidden  truncate whitespace-nowrap overflow-hidden mlg:block  text-neutral-200'>Logout</span>
            </button>

        </div>
    )
}

export default Sidebar