import React from 'react'
import { LuBox } from "react-icons/lu";
import { MdKeyboardArrowRight } from "react-icons/md";

const HomeInfoTwo = () => {
  return (
    <div className='w-[85%] mx-auto my-40 '>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='w-1/2 text-7xl font-bold '>Discover the Exciting Features of NeHueta's Competitive Gaming Platform Huesoss</h1>
          <p className='w-1/2 text-3xl font-thin '>NeHueta caters to gamers of all skill levels, ensuring everyone can compete. Our ELO-based ranking system pairs players with similar abilities, creating a balanced environment. Whether you're a novice or a pro, there's a place for you here.</p>
        </div>

        <div className='mt-20 flex flex-row justify-between mb-20'>
          
          {/* блок с инфо */}
          <div className='flex flex-col w-[405px] space-y-7 group '>
            <div className='w-[50px] h-[50px] group-hover:scale-110 transition duration-300'><LuBox className='w-full h-full'/></div>
            <h1 className='text-4xl font-bold'>Join Thrilling Tournaments and Leagues for Exciting Prizes</h1>
            <p>Participate in both free and paid tournaments to win amazing rewards.</p>
            <div className="flex flex-row">
              <button className="flex items-center  rounded-lg  py-2 group scale-hover">
              <span>Sign in</span>
              <MdKeyboardArrowRight className="ml-2 transform transition-transform duration-300 group-hover:translate-x-2" />
              </button>
            </div>

          </div>

          {/* блок с инфо 2 */}
          <div className='flex flex-col w-[405px] space-y-7 group'>
            <div className='w-[50px] h-[50px] group-hover:scale-110 transition duration-300'><LuBox className='w-full h-full'/></div>
            <h1 className='text-4xl font-bold'>Experience Fair Play with Our Advanced Anti-Cheat System</h1>
            <p>Our proprietary anti-cheat software guarantees a level playing field for all.</p>
            <div className="flex flex-row">
              <button className="flex items-center  rounded-lg  py-2 group scale-hover ">
              <span>Learn More</span>
              <MdKeyboardArrowRight className="ml-2 transform transition-transform duration-300 group-hover:translate-x-2" />
              </button>
            </div>

          </div>

          {/* блок с инфо 3 */}
          <div className='flex flex-col w-[405px] space-y-7 group'>
            <div className='w-[50px] h-[50px] group-hover:scale-110 transition duration-300'><LuBox className='w-full h-full'/></div>
            <h1 className='text-4xl font-bold'>Connect with Gamers and Build Your Community on NeHueta</h1>
            <p>Meet new friends, create teams, and engage with fellow gamers.</p>
            <div className="flex flex-row">
              <button className="flex items-center  rounded-lg  py-2 group scale-hover">
              <span>Sign Up</span>
              <MdKeyboardArrowRight className="ml-2 transform transition-transform duration-300 group-hover:translate-x-2" />
              </button>
            </div>

          </div>


        </div>

    </div>

  )
}

export default HomeInfoTwo