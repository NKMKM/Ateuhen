import React from 'react'
import { Link } from 'react-router-dom'

const GrayPartHome = () => {
  return (
    <div className='w-full h-[480px] bg-gradient-to-br from-black  via-[#3a3a3a6b] via-30% to-black  p-7 flex items-center mb-4'>
        <div className='w-[50%] h-[90%]  z-10 flex flex-col justify-around p-5 '>
            <h1 className='font-bold text-6xl text-[#8A3CFA]'>Join the Competitive Gaming Revolution</h1>
            <p className='text-2xl font-thin'>Sign up now and compete against players of all skill levels for exciting prizes! </p>
            <div className='w-[230px] flex flex-row justify-between'>
                <Link to="/register"><button className='bg-[#666666] w-[80px] h-[50px] border-2 border-white rounded-xl button-violet-hover'>Join</button></Link>
                <button className='w-[130px] h-[50px] border-2 border-white rounded-xl scale-hover button-violet-hover'>Learn more</button>
            </div>
        </div>
    </div>
  )
}

export default GrayPartHome