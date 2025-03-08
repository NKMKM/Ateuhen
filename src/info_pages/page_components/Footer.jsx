import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='sm:flex sm:flex-col sm:h-auto md:h-[420px] w-full  p-20 space-y-10 '>
        <div className='sm:flex-col flex md:flex-row justify-between'>
            <div className='space-y-10'>
                <h1 className='text-4xl font-bold  cursor-pointer text-glow-hover'>Logo</h1>
                <ul className='flex flex-row space-x-10 '>
                    <li className='cursor-pointer animated-underline-violet'><Link to='/about_us'>About us</Link></li>
                    <li className='cursor-pointer animated-underline-violet'>Contact us</li>
                    <li className='cursor-pointer animated-underline-violet'>Support Center</li>
                    <li className='cursor-pointer animated-underline-violet'>Join Now</li>
                    <li className='cursor-pointer animated-underline-violet'>Game Library</li>
                </ul>
            </div>
            <div className='flex flex-col justify-between'>
                <form className='flex flex-col mb-4'>
                    <label className='my-4 font-bold text-glow-hover'>Subscribe</label>
                    <div className='flex flex-row space-x-4'>
                        <input type='email' placeholder='Enter your email' className='w-[260px] h-[50px] p-2 border-2 border-white'></input>
                        <button className='w-[120px] h-[50px] border-2 border-white scale-hover'>Subscribe</button>
                    </div>
                </form>
                <a href="#" className='underline'>By subscribing you agree to our Privacy Policy</a>
            </div>
        </div>          
        <div className='w-[100%] h-[2px] bg-white mx-auto '></div>
        <div className='flex flex-row justify-between'>
            <ul className='flex flex-row space-x-6'>
                <li className='underline cursor-pointer'><a>Privacy Policy</a></li>
                <li className='underline cursor-pointer'><a>Terms of Service</a></li>
                <li className='underline cursor-pointer'><a>Cookies Settings</a></li>
            </ul>
            <p>&copy; 2025 Ateuhen. All rights reserved.</p>
        </div>
    </footer>
  )
}

export default Footer