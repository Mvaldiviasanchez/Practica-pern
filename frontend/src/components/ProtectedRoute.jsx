import { Navigate, Outlet } from "react-router-dom"
import PropTypes from 'prop-types';

export const ProtectedRoute = ({ redirectTo, isAllowed, children }) => {


    if (!isAllowed) return <Navigate to={redirectTo} replace />

    return children ? children : <Outlet />
}

// Definición de PropTypes
ProtectedRoute.propTypes = {
    redirectTo: PropTypes.string.isRequired, // Asegúrate de que redirectTo sea una cadena
    isAllowed: PropTypes.bool.isRequired, // isAllowed debe ser un booleano
    children: PropTypes.node // children puede ser cualquier nodo de React
};