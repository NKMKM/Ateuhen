import React from 'react'
import { Link } from 'react-router-dom';

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
        <Link to="/" className='text-4xl text-glow-hover font-bold cursor-pointer '>Logo</Link>
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
                    <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-100 hover:text-gray-900 transition duration-300">Game 1</a>
                    <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-100 hover:text-gray-900 transition duration-300">Game 2</a>
                    <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-100 hover:text-gray-900 transition duration-300">Game 3</a>
                  </div>
                )}
            </div>
          </li>
        </ul>
        <div className='flex space-x-10 mr-10 '>
        <Link to="/login">
          <button className='border-2 rounded-[10px] w-[80px] h-[40px]  hover:bg-gray-300 hover:text-black  hover:scale-105 transition duration-300 ' >Log in</button>
        </Link>
        <Link to="/register">
          <button className='border-2 rounded-[10px] w-[100px] h-[40px]  hover:bg-gray-300 hover:text-black hover:scale-105 transition duration-300' >Register</button>
        </Link>
        </div>
      </nav>
      <div className='w-[100%] bg-white h-[1px]'></div>
    
    </>
  )
}

export default Nav