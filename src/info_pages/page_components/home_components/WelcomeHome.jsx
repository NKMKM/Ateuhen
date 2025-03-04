import React from 'react'
import Slider from './Slider'
import { Link } from 'react-router-dom'


const WelcomeHome = () => {
  return (
    <>
    <div className=' w-full flex sm:flex-col md:flex-row '>
        <div className='sm:h-[800px] w-full md:h-[915px] p-10 flex flex-col justify-center '>
          <div className='w-[80%] text-white'>
            <h1 className='font-bold sm:text-7xl md:text-6xl m-4'>Welcome to Ateuhen</h1>
            <h1 className='font-bold sm:text-7xl md:text-6xl m-4'>Game On!</h1>
          </div>
          <p className='sm:text-2xl md:text-xl md:w-[50%] m-4'>Ateuhen is the premier platform for competitive gaming, catering to players of all skill levels. Join thrilling tournaments and matches in popular games like CS:GO, Dota 2, and Valorant.</p>
          <div className='sm:w-auto  md:w-[250px] m-4 flex space-x-6'>
            <Link to="/register" className='flex items-center justify-center sm:w-[100px] sm:h-[60px] sm:text-2xl md:w-[79px] md:h-[48px] md:text-[1em] rounded-lg border-2 border-white scale-hover  button-violet-hover'>Join</Link>
            <button className='sm:w-[180px] sm:h-[60px] sm:text-2xl md:w-[129px] md:h-[48px] md:text-[1em] rounded-lg border-2 border-white scale-hover button-violet-hover '>Learn more</button>
          </div>
        </div>
        
        <Slider/>

        
    </div>
    
    </>
  )
}

export default WelcomeHome