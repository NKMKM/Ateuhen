import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <>

        <div className=' min-h-screen flex flex-col items-center justify-around'>
            <h1 className='text-7xl font-bold '>404 NOT FOUND</h1>
            <Link to='/' className='text-glow-hover mx-auto  block text-3xl'>Return to main page</Link>

        </div>
    </>
  )
}

export default NotFound