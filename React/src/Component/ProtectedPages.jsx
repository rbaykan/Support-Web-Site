import { Outlet, Navigate } from 'react-router-dom'

const ProtectedPages = ({ isLogin }) => {

     console.log("ProtectedPages - isLogin:", isLogin);
  

    return isLogin ? <Outlet/> : <Navigate to="/login"/>



}


export default ProtectedPages;
 