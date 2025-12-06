import React from 'react';
import { Outlet } from 'react-router-dom';

const Authlayout = () => {
    return (
        // Main wrapper: Full screen height and width, uses flex for side-by-side columns
        <div className='flex min-h-screen w-full'>
            
            {/* 1. LEFT PANEL: Black background, hides on small screens */}
            <div className='hidden lg:flex items-center justify-center bg-black w-1/2 px-12'>
                <div className='max-w-md space-y-6 text-center text-white'> 
                    {/* Using 'text-white' instead of 'text-primary-foreground' for clarity against black bg */}
                    <h1 className='text-4xl font-extrabold tracking-tight'>Welcome to Ecom</h1>
                    {/* Optional: Add an image or description here */}
                </div>
            </div>
            
            {/* 2. RIGHT PANEL: Form container, takes full width on small screens, 
                     and the remaining half width (w-1/2) on large screens (lg:) */}
            <div className='flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
                {/* flex-1 ensures this div takes up the remaining space. 
                   Since the left panel is w-1/2, this one will automatically take w-1/2 too. 
                */}
                <Outlet /> {/* <-- The content (Login/Signup form) goes here */}
            </div>

        </div>
    );
};

export default Authlayout;