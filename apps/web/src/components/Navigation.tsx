import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

interface NavigationProps {
  onLogout: () => void;
  userRole?: string | null;
}

const Navigation: React.FC<NavigationProps> = ({ onLogout, userRole }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navigationItems = [
    { label: 'Dashboard', path: '/', roles: ['CEO', 'MANAGING_DIRECTOR', 'NURSERY_MANAGER'] },
    { label: 'Nursery', path: '/nursery', roles: ['NURSERY_MANAGER', 'PRODUCTION_SUPERVISOR'] },
    { label: 'Agronomy', path: '/agronomy', roles: ['AGRONOMIST', 'PRODUCTION_SUPERVISOR'] },
    { label: 'Inventory', path: '/inventory', roles: ['INVENTORY_OFFICER', 'PROCUREMENT_OFFICER'] },
    { label: 'Procurement', path: '/procurement', roles: ['PROCUREMENT_OFFICER', 'NURSERY_MANAGER'] },
    { label: 'Sales', path: '/crm', roles: ['SALES_OFFICER', 'NURSERY_MANAGER'] },
    { label: 'Finance', path: '/finance', roles: ['FINANCE_OFFICER', 'CEO'] },
    { label: 'HR', path: '/hr', roles: ['HR_OFFICER', 'NURSERY_MANAGER'] },
    { label: 'Compliance', path: '/compliance', roles: ['COMPLIANCE_AUDITOR', 'CEO'] },
  ];

  const visibleItems = navigationItems.filter((item) =>
    !userRole || item.roles.includes(userRole)
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🌱 Fruit Nursery ERP
        </Link>
        <button
          className="menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
        <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          {visibleItems.map((item) => (
            <li key={item.path} className="navbar-item">
              <Link to={item.path} className="navbar-link">
                {item.label}
              </Link>
            </li>
          ))}
          <li className="navbar-item">
            <button className="navbar-link logout-btn" onClick={onLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
