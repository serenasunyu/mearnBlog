import { Button, Navbar, TextInput, Dropdown, Avatar } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';


export default function Header() {
    const path = useLocation().pathname;
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { theme } = useSelector((state) => state.theme);
    const [searchTerm, setSearchTerm] = useState('');

    // Search bar
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');

        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }

    }, [location.search]);


    // handle submit for the search bar
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }


    // Sign out
    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST',
            });

            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                dispatch(signoutSuccess());
            }

        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div>
            <Navbar className="border-b-2">
                {/* logo */}
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
                <form onSubmit={handleSubmit}>
                    <TextInput
                        type="text"
                        placeholder="Search..."
                        rightIcon={AiOutlineSearch}
                        className="hidden lg:inline"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {/* <AiOutlineSearch className="absolute right-2 top-1/3 text-gray-400" /> */}
                </form>

                {/* Search Icon for Small Screens */}
                <Button className='w-12 h-10 lg:hidden' color='gray' pill>
                    <AiOutlineSearch />
                </Button>

                {/* Right side: Buttons and Toggle */}
                <div className="flex gap-2 md:order-2">
                    <Button 
                        className="w-12 h-10 sm:inline" 
                        color='gray' 
                        pill
                        onClick={() => dispatch(toggleTheme())}
                    >
                        {theme === 'light' ? <FaSun /> : <FaMoon />}
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

                            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>

                        </Dropdown>
                    ) :
                    (
                        <Link to="/sign-in">
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
                <Navbar.Collapse>
                    <Navbar.Link active={path === "/"} as="div">
                        <Link to="/">
                            Home
                        </Link>
                    </Navbar.Link>

                    <Navbar.Link active={path === "/about"} as="div">
                        <Link to="/about">
                            About
                        </Link>
                    </Navbar.Link>

                    <Navbar.Link active={path === "/articles"} as="div">
                        <Link to="/articles">
                            Articles
                        </Link>
                    </Navbar.Link>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}
