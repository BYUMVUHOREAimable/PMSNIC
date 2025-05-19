import { CommonContext } from '@/context'
import { logout } from '@/redux/slices/userReducer'
import React, { useContext } from 'react'
import { BiLogOut } from 'react-icons/bi'
import { MdDashboard } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

const MobileSidebar: React.FC = () => {

    const { setShowSidebar } = useContext(CommonContext)
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logout())
    }
    return (
        <div className='fixed backdrop-blur-sm w-screen h-screen flex items-center flex-col z-10 bg-black/40'>
            <div className='w-full h-full absolute z-20' onClick={() => setShowSidebar(false)}></div>
            <div className='bg-white p-8 w-11/12 mmsm:w-10/12 sm:w-7/12 flex flex-col rounded-b-2xl'>
                <span className='font-bold text-xl text-center'>RCA LMS</span>
                <div className='my-4 flex flex-col'>
                    <Link to={"/"} className={`flex items-center rounded-lg p-3 hover:bg-slate-300/60 ${window.location.pathname && "bg-slate-300/60"}`}>
                        <MdDashboard size={23} className='text-slate-400' />
                        <span className='ml-2 text-lg text-slate-700'>Dashboard</span>
                    </Link>
                </div>
                <button onClick={handleLogout} className='flex items-center rounded-lg p-3 hover:bg-slate-300/60'>
                    <BiLogOut size={23} className='text-slate-400' />
                    <span className='ml-2 text-lg text-slate-700'>Logout</span>
                </button>
            </div>
        </div>
    )
}

export default MobileSidebar