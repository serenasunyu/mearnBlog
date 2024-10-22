import { Button, Navbar, TextInput, Dropdown, Avatar } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function Header() {
    const path = useLocation().pathname;
    const { currentUser } = useSelector(state => state.user);

    return (
        <div>
            <Navbar className="border-b-2 ml-2 py-2 flex-row justify-between">
                <Link
                    to="/"
                    className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
                >
                    <span className="px-2 py-1 mr-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                        Yu's
                    </span>
                    Blog
                </Link>

                {/* Search Bar */}
                <form>
                    <TextInput
                        type="text"
                        placeholder="Search..."
                        rightIcon={AiOutlineSearch}
                        className="hidden lg:inline"
                    />
                    {/* <AiOutlineSearch className="absolute right-2 top-1/3 text-gray-400" /> */}
                </form>

                {/* Search Icon for Small Screens */}
                <Button className='w-12 h-10 lg:hidden' color='gray' pill>
                    <AiOutlineSearch />
                </Button>

                {/* Right side: Buttons and Toggle */}
                <div className="flex gap-2 md:order-2 mt-1">
                    <Button className="w-12 h-10" color='grey' pill>
                        <FaMoon />
                    </Button>

                    { currentUser ? (
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <Avatar 
                                    alt='user'
                                    img={currentUser.profilePicture}
                                    rounded
                                />
                            }
                        >
                            <Dropdown.Header>
                                <span className='block text-sm'>@{currentUser.username}</span>
                                <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                            </Dropdown.Header>

                            <Link to={'/dashboard?tab=profile'}>
                                <Dropdown.Item>Profile</Dropdown.Item>
                            </Link>

                            <Dropdown.Divider />

                            <Dropdown.Item>Sign out</Dropdown.Item>

                        </Dropdown>
                    ) :
                    (
                        <Link to="/sign-in" className="mb-2">
                            <Button gradientDuoTone='purpleToBlue' outline>
                                Sign In
                            </Button>
                        </Link>
                    )

                    }

                    

                    {/* Toggle for Mobile */}
                    <Navbar.Toggle/>
                </div>

                {/* Collapsible Menu */}
                <Navbar.Collapse className="lg:flex lg:justify-evenly">
                    <Navbar.Link active={path === "/"} as="div">
                        <Link to="/" className="text-black hover:text-blue-500 mr-6">
                            Home
                        </Link>
                    </Navbar.Link>

                    <Navbar.Link active={path === "/about"} as="div">
                        <Link to="/about" className="text-black hover:text-blue-500 mr-6">
                            About
                        </Link>
                    </Navbar.Link>

                    <Navbar.Link active={path === "/articles"} as="div">
                        <Link to="/articles" className="text-black hover:text-blue-500">
                            Articles
                        </Link>
                    </Navbar.Link>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}
