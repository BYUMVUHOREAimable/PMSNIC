import CreateParkingSlot from '@/components/CreateParkingSlot';
import CreateVehicle from '@/components/CreateVehicle';
import CreateRequestSlot from '@/components/CreateRequestSlot';
import { CommonContext } from '@/context';
import React, { useContext } from 'react';

const Layout: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {

    const { showCreateVehicle , showCreateParkingSlot , showRequestParkingSlot  } = useContext(CommonContext)

    return (
        <div className="w-full flex flex-col min-h-screen justify-between bg-[#f3f6fa]">
            {showCreateVehicle && <CreateVehicle />}
            {showCreateParkingSlot && <CreateParkingSlot />}
            {showRequestParkingSlot && <CreateRequestSlot />}
            {children}
        </div>
    )
}

export default Layout