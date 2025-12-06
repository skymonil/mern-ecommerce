import { Outlet } from 'react-router-dom'
import { UserShoppingHeader } from './Header'

export const UserShoppingViewLayout = () => {
  return (
    <div className='flex flex-col bg-white overflow-hidden'>
        {/* Common Header */}
        <UserShoppingHeader />
        <main className='flex flex-col w-full'>
    <Outlet/>
    </main>
        </div>

  )
}