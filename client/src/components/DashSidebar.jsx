import { Sidebar } from 'flowbite-react';
import { HiUser, HiArrowSmRight} from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function DashSidebar() {
    const location = useLocation();
    const [tab, setTab] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
        setTab(tabFromUrl);
        }
    }, [location.search]);

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
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup>

                    <Sidebar.Item 
                        as={Link} 
                        to='/dashboard?tab=profile' 
                        active={tab === 'profile'} 
                        icon={HiUser} 
                        label={'User'} 
                        labelColor='dark' 
                    >
                        Profile
                    </Sidebar.Item>

                    <Sidebar.Item 
                        icon={HiArrowSmRight} 
                        className='cursor-pointer' 
                        onClick={handleSignout}
                    >
                        Sign Out
                    </Sidebar.Item>

                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}
