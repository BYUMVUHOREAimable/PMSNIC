import { CommonContext } from '@/context';
import Layout from '@/layout/Layout';

import React, { useContext } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
const Login = React.lazy(() => import('@/pages/auth/login/Login'))
const Signup = React.lazy(() => import('@/pages/auth/signup/Signup'))
const NotFound = React.lazy(() => import('@/pages/notFound/NotFound'))
const Home = React.lazy(() => import('@/pages/Vehicle/vehicles'))
const Profile = React.lazy(() => import('@/pages/profile/profile'))
const ParkingSlot = React.lazy(() => import('@/pages/parkingSlot/parkingSlot'))
const RequestSlot = React.lazy(() => import('@/pages/reservation/reservation'))

const PagesRouter: React.FC<{}> = () => {

    const { isLoggedIn } = useContext(CommonContext)

    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/auth/signup" element={<Signup />} />
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/profile" element={< Profile />} />
                    <Route path="/parkingSlot" element={< ParkingSlot />} />
                    <Route path="/requestSlot" element={< RequestSlot />} />
                    <Route path="/" element={ isLoggedIn ? <Home /> : <Navigate to={"/auth/signup"}/> } />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
};

export default PagesRouter;