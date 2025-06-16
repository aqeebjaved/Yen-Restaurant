import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Dropdown, DropdownDivider } from "flowbite-react";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect } from "react";
import logo from "../assets/logomain.png";

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            // setSearchTerm(searchTermFromUrl); // removed unused
        }
    }, [location.search]);

    const handleSignout = async () => {
        try {
            // Get userId before clearing
            const userId = localStorage.getItem('userId');
    
            const res = await fetch('/api/user/signout', {
                method: 'POST',
            });
            const data = await res.json();
            
            if (!res.ok) {
                console.log(data.message);
            } else {
                // Clear cart data before clearing user data
                if (userId) {
                    localStorage.removeItem(`cart_${userId}`);
                }
                
                // Dispatch signout action and navigate
                dispatch(signoutSuccess());
                navigate(`/`);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <header className={`border-b-2 border-b-black shadow-md relative bg-gradient-to-r from-[#AC5180] to-[#160121]`}>
            <div className="flex items-center justify-between py-2 px-4 mx-auto max-w-7xl min-h-0">
                <div className="flex items-center gap-4">
                    <Link to="/">
                        <img src={logo} alt="logo" className="w-36 h-auto max-h-20 object-contain rounded-full" />
                    </Link>
                    <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-widest font-[cursive] italic drop-shadow-lg" style={{fontFamily: 'Playfair Display, serif'}}>YEN RESTAURANT</span>
                </div>

                <ul className="flex items-center gap-10"> {/* Aligning items in the center */}
                    <Link to="/">
                        <li className="hidden sm:inline text-[#D4D4D4] hover:underline hover:underline-offset-4 hover:text-white">
                            Home
                        </li>
                    </Link>
                    <Link to="/about">
                        <li className="hidden sm:inline text-[#D4D4D4] hover:underline hover:underline-offset-4 hover:text-white">
                            About
                        </li>
                    </Link>
                    {!(currentUser?.role === "Manager" || currentUser?.isAdmin) && (
        <Link to="/item">
            <li className="hidden sm:inline text-[#D4D4D4] hover:underline hover:underline-offset-4 hover:text-white">
                Item
            </li>
        </Link>
    )}
                </ul>

                <div className='flex gap-4'> {/* Sign-in dropdown or button */}
                    {currentUser ? (
                        <Dropdown
                            arrowIcon={false}
                            inline
                            label={
                                <Avatar alt='user' img={currentUser.profilePicture} rounded />
                            }
                        >
                            <Dropdown.Header>
                                <span className='block text-sm'>@{currentUser.username}</span>
                                <span className='block text-sm font-medium truncate'>
                                    {currentUser.email}
                                </span>
                            </Dropdown.Header>
                            <Link to={'/Dashboard?tab=profile'}>
                                <Dropdown.Item>Profile</Dropdown.Item>
                            </Link>
                            <DropdownDivider />
                            <Dropdown.Item onClick={handleSignout}> Signout</Dropdown.Item>
                        </Dropdown>
                    ) : (
                        <Link to='/signin'>
                            <button className='px-4 py-2 text-white bg-red-900 rounded'>
                                Sign In
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
