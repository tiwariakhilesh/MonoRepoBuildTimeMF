
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <nav style={{ padding: '10px', backgroundColor: '#282c34', color: 'white', width: "100vw", position: 'absolute', top: 0, left: 0 }}>
            <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', justifyContent: 'center' }}>
                <li style={{ marginRight: '20px' }}>
                    <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
                </li>
                <li style={{ marginRight: '20px' }}>
                    <Link to="/PolicyManagement" style={{ color: 'white', textDecoration: 'none' }}>Policy Management</Link>
                </li>
                <li style={{ marginRight: '20px' }}>
                    <Link to="/CaseManagement" style={{ color: 'white', textDecoration: 'none' }}>Case Management</Link>
                </li>
                <li style={{ marginRight: '20px' }}>
                    <Link to="/OldFeature" style={{ color: 'white', textDecoration: 'none' }}>Old Feature</Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
