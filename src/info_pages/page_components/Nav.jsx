import React from 'react'
import { Link } from 'react-router-dom';

import { BsSun, BsMoon } from "react-icons/bs";

const Nav = () => {
    const [isMenuVisible, setIsMenuVisible] = React.useState(false);
    const [timeoutId, setTimeoutId] = React.useState(null);
        const showMenu = () => {
        if (timeoutId) {
        clearTimeout(timeoutId); 
        }
        setIsMenuVisible(true);
    };
    const hideMenu = () => {
        const id = setTimeout(() => {
        setIsMenuVisible(false); 
        }, 300); 
        setTimeoutId(id); 
    };



    return (
    <>
    <nav className='flex flex-row h-[75px] items-center justify-between ml-10 '>
        <div className='flex flex-row space-x-3'>
          <Link to="/" className='text-4xl text-glow-hover font-bold cursor-pointer '>Logo</Link>

        </div>
        <ul className='flex flex-row space-x-10 '>
          <li><Link to='/' className='text-glow-hover'>Home</Link></li>
          <li><Link to='/tournaments' className='text-glow-hover'>Tournaments</Link></li>
          <li><a href="#" className='text-glow-hover'>Community</a></li>
          <li>
            <div
              className="relative inline-block text-left"
              onMouseEnter={showMenu}
              onMouseLeave={hideMenu} 
            >
                <button className="text-glow-hover">
                  More games 
                </button>
                {isMenuVisible && (
                  <div className="absolute left-0 mt-2 w-[90px] bg-black rounded-md shadow-lg transition-opacity opacity-100 z-20">
                    <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-[#AB70FD] hover:text-gray-900 transition duration-300">Game 1</a>
                    <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-[#AB70FD] hover:text-gray-900 transition duration-300">Game 2</a>
                    <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-[#AB70FD] hover:text-gray-900 transition duration-300 hover:rounded-b-md">Game 3</a>
                  </div>
                )}
            </div>
          </li>
        </ul>
        <div className='flex space-x-10 mr-10 '>
        <Link to="/login">
          <button className='border-2 rounded-[10px] w-[80px] h-[40px]  button-violet-hover ' >Log in</button>
        </Link>
        <Link to="/register">
          <button className='border-2 rounded-[10px] w-[100px] h-[40px]  button-violet-hover' >Register</button>
        </Link>
        </div>
      </nav>
      <div className='w-[100%] bg-white h-[1px]'></div>
    
    </>
  )
}

export default Nav


{/* <button
onClick={toggleTheme}
className=" mt-2 font-bold"
>
{isLightTheme === "dark" ? <BsMoon size={24} /> : <BsSun size={24} />  }
</button> */}