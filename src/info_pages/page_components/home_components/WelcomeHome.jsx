import React from 'react'
import Slider from './Slider'
import { Link } from 'react-router-dom'


const WelcomeHome = () => {
  return (
    <>
    <div className='flex flex-row '>
        <div className='w-[50%] h-[915px] p-10 flex  flex-col justify-center '>
          <div className='w-[80%] text-white'>
            <h1 className='font-bold text-6xl m-4'>Welcome to Ateuhen:</h1>
            <h1 className='font-bold text-6xl m-4'>Game On!</h1>
          </div>
          <p className='w-[50%] m-4'>Ateuhen is the premier platform for competitive gaming, catering to players of all skill levels. Join thrilling tournaments and matches in popular games like CS:GO, Dota 2, and Valorant.</p>
          <div className='w-[250px] m-4 flex space-x-6'>
            <Link to="/register" className='flex items-center justify-center w-[79px] h-[48px] rounded-lg border-2 border-white scale-hover  button-violet-hover'>Join</Link>
            <button className=' w-[129px] h-[48px] rounded-lg border-2 border-white scale-hover button-violet-hover '>Learn more</button>
          </div>
        </div>
        
        <Slider/>

        
    </div>
    
    </>
  )
}

export default WelcomeHome