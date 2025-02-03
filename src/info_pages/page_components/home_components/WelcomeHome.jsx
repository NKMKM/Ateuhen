import React from 'react'
import Slider from './Slider'


const WelcomeHome = () => {
  return (
    <>
    <div className='flex flex-row '>
        <div className='w-[50%] h-[915px] p-10 flex  flex-col justify-center '>
          <div className='w-[80%]'>
            <h1 className='font-bold text-6xl m-4'>Welcome to Ne Hueta:</h1>
            <h1 className='font-bold text-6xl m-4'>Game On!</h1>
          </div>
          <p className='w-[50%] m-4'>NeHueta is the premier platform for competitive gaming, catering to players of all skill levels. Join thrilling tournaments and matches in popular games like CS:GO, Dota 2, and Valorant.</p>
          <div className='w-[250px] m-4 flex justify-between'>
            <button className=' w-[79px] h-[48px] rounded-lg border-2 border-white scale-hover  hover:shadow-md hover:shadow-white'>Join</button>
            <button className=' w-[129px] h-[48px] rounded-lg border-2 border-white scale-hover hover:shadow-md hover:shadow-white '>Learn more</button>
          </div>
        </div>
        
        <Slider/>

        
    </div>
    
    </>
  )
}

export default WelcomeHome