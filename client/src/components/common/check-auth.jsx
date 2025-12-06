import { Navigate, useLocation } from "react-router-dom";
import React from 'react'; // React is necessary for JSX syntax

// The component takes props { isAuthenticated, user, children }
export const CheckAuth = ({ isAuthenticated, user, children }) => {
    
    // CRITICAL FIX: Import and call the useLocation hook inside the function body
    const location = useLocation();

    // Utility function to check if the current path is a public auth route
    const isAuthRoute = location.pathname.includes('/login') || 
                        location.pathname.includes('/register'); // FIX: Corrected typo 'inclueds'

    // --- Scenario 1: Not Authenticated (Protecting Private Routes) ---
    // If NOT logged in AND NOT already on a login/register page, redirect to login.
    if (!isAuthenticated && !isAuthRoute) {
        return <Navigate to="/auth/login" replace />;
    }

    // --- Scenario 2: Already Authenticated (Protecting Auth Routes) ---
    // If logged in AND on a login/register page, redirect to the appropriate dashboard.
    if (isAuthenticated && isAuthRoute) {
        if (user?.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        } else {
            // Default user (e.g., customer)
            return <Navigate to="/shop/home" replace />;
        }
    }

    // --- Scenario 3: Unauthorized Access (Role Protection) ---
    // If logged in AND NOT an admin AND trying to access an /admin path, deny access.
    if (isAuthenticated && user?.role !== 'admin' && location.pathname.includes('/admin')) {
        return <Navigate to="/unauth-page" replace />;
    }

    // --- Scenario 4: Admin Access Misplaced ---
    // If logged in AND an admin AND trying to access a /shop path, redirect to admin dashboard.
    if (isAuthenticated && user?.role === 'admin' && location.pathname.includes('/shop')) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    // --- Scenario 5: Valid Access ---
    // If none of the above conditions were met, allow access to the requested route.
    return (
        <>{children}</>
    );
}