import { House, User2, WholeWord } from "lucide-react";
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom"

import './NavBar.css';

const navItems: {
    name: string;
    location: string;
    icon: ReactNode;
}[] = [
    {
        name: 'home',
        location: '/',
        icon: <House />,
    },
    {
        name: 'game',
        location: '/game',
        icon: <WholeWord />,
    },
    // {
    //     name: 'profile',
    //     location: '/profile',
    //     icon: <User2 />
    // }
]

const NavBar = () => {
    const currentLocation = useLocation();

    return (
        <nav className="nav-bar">
            <ul className="nav-list">
                {navItems.map(({ name, location, icon }) => (
                    <li 
                        key={name} 
                        className={`nav-item ${currentLocation.pathname === location ? 'active' : ''}`}
                    >
                        <Link to={location} className="nav-link">
                            <span className="nav-icon">{icon}</span>
                            <span className="nav-name">{name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default NavBar;
