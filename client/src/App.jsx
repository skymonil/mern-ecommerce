import { Route, Routes } from 'react-router-dom'
import './App.css'
import AuthLogin from './pages/auth/login'
import AuthRegister from './pages/auth/Register'
import { useEffect, useState } from 'react'
import AuthLayout from './components/auth/layout'
import AdminLayout from './components/admin-view/layout'
import { AdminDashboard } from './pages/admin-view/Dashboard'
import { AdminOrders } from './pages/admin-view/Orders'
import { Adminfeatures } from './pages/admin-view/features'
import { UserShoppingViewLayout } from './components/user-shopping-view/layout'
import { NotFoundPage } from './pages/not-found/index'
import { ShoppingHome } from './pages/user-shopping-view/Home'
import { ShoppingListing } from './pages/user-shopping-view/Listing'
import { ShoppingCheckout } from './pages/user-shopping-view/checkout'
import { UserAccount } from './pages/user-shopping-view/account'
import { CheckAuth } from './components/common/check-auth'
import { UnauthPage } from './pages/unauth-page'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from './store/auth-slice'
// Assuming Skeleton is a custom shadcn/ui component
import { Skeleton } from "@/components/ui/skeleton" 
import AdminProducts from './pages/admin-view/Products.jsx'

function App() {
  // HOOKS MUST BE CALLED UNCONDITIONALLY AT THE TOP
  const [count, setCount] = useState(0) // Note: This hook seems unused
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkAuth())
  } , [dispatch])

  console.log('Is Loading:', isLoading, 'User:', user);

  // 🛑 FIX 1: Corrected class syntax for w-[800px] and centered the loading skeleton
  if (isLoading) return (
    <div className="flex justify-center items-center h-screen w-full">
      <Skeleton className="w-[600px] h-[400px] bg-gray-200" />
    </div>
  );

  return (
    <div className='flex flex-col overflow-hidden bg-white'>
      
      <Routes>

        {/* --- AUTH ROUTES --- */}
        <Route path="/auth" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user} >
            <AuthLayout />
          </CheckAuth>
        } >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
         
        </Route>

        {/* --- ADMIN ROUTES --- */}
        <Route path='/admin' element={ 
          <CheckAuth isAuthenticated={isAuthenticated} user={user} >
            <AdminLayout/>
          </CheckAuth>
        } >
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='products' element={<AdminProducts />} />
          <Route path='orders' element={<AdminOrders />} />
          <Route path='features' element={<Adminfeatures />} />
        </Route>
        
        {/* --- SHOPPING ROUTES --- */}
        <Route path='/shop' element={ 
          <CheckAuth isAuthenticated={isAuthenticated} user={user} >
            <UserShoppingViewLayout />
          </CheckAuth>
        } >
          <Route index element={<ShoppingHome />} /> {/* Use index for default route */}
          <Route path='home' element={<ShoppingHome />} />
          <Route path='listing' element={<ShoppingListing/>} />
          <Route path='checkout' element={<ShoppingCheckout/>} />
          <Route path='account' element={<UserAccount/>} />
        
          {/* Note: Removed the nested catch-all route here */}
        </Route>

        {/* --- UTILITY ROUTES (Placed outside parent routes) --- */}
        <Route path='/unauth-page' element={<UnauthPage /> } />
        
        {/* 🛑 FIX 2: Global Catch-all Route for 404 (must be outside all nested routes) */}
        <Route path="*" element={<NotFoundPage />} /> 

      </Routes>
    </div>
  )
}

export default App