import { createParkingSlot } from "@/services/parkingSlot";
import { IVehicle, IMeta, IParkingSlot } from "@/types";
import { Dispatch } from "@reduxjs/toolkit";
import { createContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const CommonContext = createContext<any>({})

export const CommonProvider = ({ children }: any) => {
    const [showSidebar, setShowSidebar] = useState(false)
    const [showCreateVehicle, setShowCreateVehicle] = useState(false) 
    const [showCreateParkingSlot, setShowCreateParkingSlot] = useState(false)
    const [showRequestParkingSlot, setShowRequestParkingSlot] = useState(false) // NEW state for modal visibility
    const [vehicles, setVehicles] = useState<IVehicle[]>([])
    const [parkingSlots,setParkingSlots]  = useState<IParkingSlot[]>([])
      const [reservations, setReservations] = useState<IReservation[]>([]);
    const [meta, setMeta] = useState<IMeta>({
        total: 0,
        lastPage: 0,
        currentPage: 0,
        perPage: 0,
        prev: 0,
        next: 0
    });

    const userSlice = useSelector((state: any) => state.userSlice)
    const dispatch: Dispatch = useDispatch();
    const isLoggedIn: boolean = userSlice.isLoggedIn;

    return (
        <CommonContext.Provider value={{
            showSidebar,
            setShowSidebar,
            showCreateVehicle,          // expose modal show state
            setShowCreateVehicle,
            setShowCreateParkingSlot, 
            setShowRequestParkingSlot,
            showCreateParkingSlot,
            showRequestParkingSlot,
            reservations,
            setReservations,
            parkingSlots,
            setParkingSlots,      // expose modal setter
            dispatch,
            isLoggedIn,
            user: userSlice.user,
            vehicles,
            setVehicles,
            meta,
            setMeta
        }}>
            {children}
        </CommonContext.Provider>
    )
}
