import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from "react";
import { HiMenu } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";

const Nav = () => {
    const [isBurgerOpen, setIsBurgerOpen] = useState(false);
    const [isBurgerDropdownVisible, setIsBurgerDropdownVisible] = useState(false);

    const toggleBurger = () => setIsBurgerOpen(!isBurgerOpen);
    const showBurgerDropdown = () => setIsBurgerDropdownVisible(true);
    const hideBurgerDropdown = () => setIsBurgerDropdownVisible(false);

    return (
        <>
            <nav className="flex z-50 flex-row items-center justify-between h-[75px] px-4 md:px-10">
                {/* Логотип */}
                <div>
                    <Link to="/" className="sm:text-[#8A3CFA] md:text-white sm:text-5xl md:text-4xl font-bold cursor-pointer">
                        Logo
                    </Link>
                </div>

                {/* Бургер-меню для sm */}
                <div className="sm:flex sm:justify-center md:hidden">
                    <button onClick={toggleBurger} className="text-white text-3xl">
                        {isBurgerOpen ? <IoCloseOutline /> : <HiMenu />}
                    </button>
                </div>

                {/* Ссылки (Desktop) */}
                <ul className="hidden md:flex flex-row space-x-10">
                    <li><Link to="/" className="text-glow-hover">Home</Link></li>
                    <li><Link to="/tournaments" className="text-glow-hover">Tournaments</Link></li>
                    <li><a href="#" className="text-glow-hover">Community</a></li>
                    <li>
                        <div
                            className="relative inline-block text-left"
                            onMouseEnter={showBurgerDropdown}
                            onMouseLeave={hideBurgerDropdown}
                        >
                            <button className="text-glow-hover">More games</button>
                            {isBurgerDropdownVisible && (
                                <div className="absolute left-0 mt-2 w-[90px] bg-black rounded-md shadow-lg transition-opacity opacity-100 z-20">
                                    <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-[#AB70FD]">Game 1</a>
                                    <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-[#AB70FD]">Game 2</a>
                                    <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-[#AB70FD]">Game 3</a>
                                </div>
                            )}
                        </div>
                    </li>
                </ul>

                {/* Кнопки Log in / Register (всегда на месте) */}
                <div className="flex space-x-4">
                    <Link to="/login">
                        <button className="border-2 rounded-[10px] w-[80px] h-[40px] button-violet-hover">Log in</button>
                    </Link>
                    <Link to="/register">
                        <button className="border-2 rounded-[10px] w-[100px] h-[40px] button-violet-hover">Register</button>
                    </Link>
                </div>
            </nav>

            {/* Плавное меню */}
            <div
                className={`absolute top-[75px] left-0 w-full bg-black/30 font-bold text-white text-4xl items-start flex flex-col border-b-2 backdrop-blur-xl px-4 space-y-6 py-6 transition-all duration-1000 md:hidden justify-between transform overflow-hidden`}
                style={{
                    maxHeight: isBurgerOpen ? '500px' : '0', // Анимация раскрытия
                    opacity: isBurgerOpen ? '1' : '0', // Убираем прозрачность при закрытии
                }}
            >
                <Link to="/" className="text-glow-hover" onClick={toggleBurger}>Home</Link>
                <Link to="/tournaments" className="text-glow-hover" onClick={toggleBurger}>Tournaments</Link>
                <a href="#" className="text-glow-hover" onClick={toggleBurger}>Community</a>
                {/* More Games Dropdown */}
                <div>
                    <button className="text-glow-hover" onClick={() => setIsBurgerDropdownVisible(!isBurgerDropdownVisible)}>
                        More games
                    </button>
                    {isBurgerDropdownVisible && (
                        <div className="mt-2 w-[90px] bg-black rounded-md shadow-lg">
                            <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-[#AB70FD]" onClick={toggleBurger}>Game 1</a>
                            <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-[#AB70FD]" onClick={toggleBurger}>Game 2</a>
                            <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-[#AB70FD]" onClick={toggleBurger}>Game 3</a>
                        </div>
                    )}
                </div>
            </div>
            <div className='sm:max-w-auto bg-white h-[1px]'></div>
        </>
    );
};

export default Nav;
