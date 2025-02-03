import React from 'react'
import { LuBox } from "react-icons/lu";
import { MdKeyboardArrowRight } from "react-icons/md";
import GrayPartHome from './GrayPartHome';
import { Link } from 'react-router-dom';

const HomeInfoThree = () => {
  return (
    <>
    <div className='w-[85%] mx-auto my-44'>
        <p className='mb-5 text-glow-hover font-bold'>Features</p>

        <div className='flex flex-row justify-between mb-24 items-center'>
            <h1 className='w-1/2 text-7xl font-bold'>Explore Our Unique Community and Premium Benefits</h1>
            <p className='w-1/2 text-3xl font-thin'>At NeHueta, we believe in the power of community. Our platform fosters connections among gamers, allowing you to form teams and make new friends. Join a vibrant network where collaboration and competition thrive.</p>
        </div>

        <div className='flex flex-row justify-between mb-20'>
        {/* блок с инфо */}
            <div className='flex flex-col w-[405px] space-y-7 scale-hover'>
                <div className='w-[50px] h-[50px]'><LuBox className='w-full h-full'/></div>
                <h1 className='text-4xl font-bold'>Unlock Exclusive Benefits with Premium Features</h1>
                <p className=''>Upgrade to <Link to='/premium' className='text-[#027a48] animated-underline ml-1 mr-1' >Ne Hueta Premium</Link> for unparalleled access.</p>
                

            </div>

            {/* блок с инфо 2*/}
            <div className='flex flex-col w-[405px] space-y-7 scale-hover'>
                <div className='w-[50px] h-[50px]'><LuBox className='w-full h-full'/></div>
                <h1 className='text-4xl font-bold'>Experience Priority Matchmaking and Exclusive Tournaments</h1>
                <p className='text-[#027a48] mb-0'>Enjoy benefits that elevate your gaming experience.</p>
                

            </div>

            {/* блок с инфо 2*/}
            <div className='flex flex-col w-[405px] space-y-7 scale-hover'>
                <div className='w-[50px] h-[50px]'><LuBox className='w-full h-full'/></div>
                <h1 className='text-4xl font-bold'>Join Our Community and Level Up Together</h1>
                <p className='text-[#027a48] mb-0'>Connect, compete, and grow with fellow gamers.</p>
                

            </div>

        </div>

        <div>
            <div className="flex flex-row justify-between w-[250px] mb-20">
                <button className="w-[130px] h-[50px] border-2 border-white rounded-lg scale-hover">
                    Learn More
                </button>
                <div className="flex flex-row">
                    <button className="flex items-center  rounded-lg px-4 py-2 group scale-hover">
                    <span>Sign in</span>
                    <MdKeyboardArrowRight className="ml-2 transform transition-transform duration-300 group-hover:translate-x-2" />
                    </button>
                </div>
            </div>

        </div>

    </div>

    <GrayPartHome/>
    </>
    

  
  )
}

export default HomeInfoThree