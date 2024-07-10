import React from 'react';
import { Button, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon } from 'react-icons/fa';

export default function Header() {

    const path = useLocation().pathname;

  return (
    <div>
        <Navbar className='border-b-2 ml-2 py-2 flex-row justify-between'>
            <Link
                to="/"
                className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
            >
                <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white"> 
                Yu's 
                </span>
                Blog
            </Link>

            <form className='relative'>
                <TextInput
                    type="text"
                    placeholder="Search..."
                    // rightIcon={ AiOutlineSearch }
                    className="hidden lg:inline"
                />    
                <AiOutlineSearch className='absolute right-2 top-1/3 text-gray-400 hidden lg:inline' />
            </form>

            <Button className='w-12 h-10 lg:hidden rounded-full' pill>
                <AiOutlineSearch className='text-gray-400 transform translate-y-1.5'/>
            </Button>
            
            <div className='flex gap-2 md:order-2 mt-1'>
                <Button
                    className='w-12 h-10 hidden sm:inline mt-1' pill
                >
                    <FaMoon className='text-black' />
                </Button>

                <Link to="/sign-in" className='mb-2'>
                    <Button className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-3 text-center py-1 me-2">
                    
                        Sign In 
                    </Button>
                </Link>
                <Navbar.Toggle className='lg:hidden'/>

            </div>

            <Navbar.Collapse>
                <Navbar.Link active={path == "/"} as={"div"}>
                    <Link to="/" className='text-black hover:text-blue-500'> Home </Link>
                </Navbar.Link>

                <Navbar.Link active={path == "/about"} as={"div"}>
                    <Link to="/about" className='text-black hover:text-blue-500'> About </Link>
                </Navbar.Link>

                <Navbar.Link active={path == "/articles"} as={"div"}>
                    <Link to="/articles" className='text-black hover:text-blue-500'> Articles </Link>
                </Navbar.Link>
            </Navbar.Collapse>
            
        </Navbar>

    </div>
  )
}
