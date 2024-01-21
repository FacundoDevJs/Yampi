import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {AiOutlineLoading3Quarters} from 'react-icons/ai'

const PrivateRoute = ({children}) => {
    const { user, loading } = useAuth();

    const navigate = useNavigate()

    if (loading) return <div className="w-full h-[100vh] bg-red-500 flex text-white">
        <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin m-auto"/>
    </div>;
    else {
        if (user) {
            return <>{children}</>
        } else {
            navigate('/')
        }
    }
}

export default PrivateRoute