import React from 'react'
import { LuBox } from "react-icons/lu";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link } from 'react-router-dom';
const HomeInfoTwo = () => {
  return (
    <div className='sm:w-full md:w-[85%] mx-auto my-40 '>
        <div className='sm:flex-col sm:space-y-10 flex md:flex-row justify-between items-center'>
          <h1 className='sm:w-[80%] sm:text-5xl md:w-1/2 text-7xl font-bold text-[#8A3CFA] '>Discover the Exciting Features of Ateuhen's Competitive Gaming Platform </h1>
          <p className='sm:w-[80%] sm:text-2xl md:w-1/2 text-3xl font-thin '>Ateuhen caters to gamers of all skill levels, ensuring everyone can compete. Our ELO-based ranking system pairs players with similar abilities, creating a balanced environment. Whether you're a novice or a pro, there's a place for you here.</p>
        </div>

        <div className='mt-20 flex sm:space-y-20 sm:flex-col md:flex-row justify-between mb-20'>
          
          {/* блок с инфо */}
          <div className='flex flex-col sm:mx-auto sm:w-[90%] sm:self-start  md:m-0 md:w-[405px] space-y-7 group '>
            <div className='w-[50px] h-[50px] group-hover:scale-110 transition duration-300'><LuBox className='w-full h-full'/></div>
            <h1 className='text-4xl font-bold text-glow-hover'>Join Thrilling Tournaments and Leagues for Exciting Prizes</h1>
            <p className='sm:text-xl'>Participate in both free and paid tournaments to win amazing rewards.</p>
            <div className="flex flex-row">
              <button className="flex items-center  rounded-lg  py-2 group scale-hover">
              <Link to="/login"><span>Sign in</span></Link>
              <MdKeyboardArrowRight className="ml-2 transform transition-transform duration-300 group-hover:translate-x-2" />
              </button>
            </div>

          </div>

          {/* блок с инфо 2 */}
          <div className='flex flex-col sm:mx-auto sm:w-[90%] sm:self-start  md:m-0 md:w-[405px] space-y-7 group '>
            <div className='w-[50px] h-[50px] group-hover:scale-110 transition duration-300'><LuBox className='w-full h-full'/></div>
            <h1 className='text-4xl font-bold text-glow-hover'>Experience Fair Play with Our Advanced Anti-Cheat System</h1>
            <p className='sm:text-xl'>Our proprietary anti-cheat software guarantees a level playing field for all.</p>
            <div className="flex flex-row">
              <button className="flex items-center  rounded-lg  py-2 group scale-hover">
              <Link to="/login"><span>Sign in</span></Link>
              <MdKeyboardArrowRight className="ml-2 transform transition-transform duration-300 group-hover:translate-x-2" />
              </button>
            </div>

          </div>

          {/* блок с инфо 3 */}
          <div className='flex flex-col sm:mx-auto sm:w-[90%] sm:self-start  md:m-0 md:w-[405px] space-y-7 group '>
            <div className='w-[50px] h-[50px] group-hover:scale-110 transition duration-300'><LuBox className='w-full h-full'/></div>
            <h1 className='text-4xl font-bold text-glow-hover'>Connect with Gamers and Build Your Community on Ateuhen</h1>
            <p className='sm:text-xl'>Our proprietary anti-cheat software guarantees a level playing field for all.</p>
            <div className="flex flex-row">
              <button className="flex items-center  rounded-lg  py-2 group scale-hover">
              <Link to="/login"><span>Sign in</span></Link>
              <MdKeyboardArrowRight className="ml-2 transform transition-transform duration-300 group-hover:translate-x-2" />
              </button>
            </div>

          </div>


        </div>

    </div>

  )
}

export default HomeInfoTwo