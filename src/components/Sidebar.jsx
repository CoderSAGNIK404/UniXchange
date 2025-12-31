import React from 'react';
import { Home, Film, Settings, Heart, Info, Package, ShoppingBag, BarChart2, DollarSign } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ userType }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const MenuItem = ({ icon: Icon, label, path }) => (
        <div
            onClick={() => navigate(path)}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                cursor: 'pointer',
                borderRadius: '12px',
                background: isActive(path) ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                color: isActive(path) ? 'var(--primary-color)' : 'var(--text-secondary)',
                marginBottom: '0.5rem',
                transition: 'all 0.2s ease'
            }}
        >
            <Icon size={20} />
            <span style={{ fontWeight: 500 }}>{label}</span>
        </div>
    );

    const buyerMenuItems = [
        { icon: Home, label: "Home", path: "/app" },
        { icon: Film, label: "Reels", path: "/app/reels" },
        { icon: Heart, label: "Favorites", path: "/app/favorites" },
        { icon: Info, label: "About Us", path: "/app/about" },
    ];

    const sellerMenuItems = [
        { icon: Home, label: "Dashboard", path: "/app" },
        { icon: Package, label: "My Products", path: "/app/products" },
        { icon: ShoppingBag, label: "Orders", path: "/app/orders" },
        { icon: BarChart2, label: "Analytics", path: "/app/analytics" },
        { icon: DollarSign, label: "Earnings", path: "/app/earnings" },
        { icon: Film, label: "Reel Studio", path: "/app/reel-studio" },
    ];

    const items = userType === 'seller' ? sellerMenuItems : buyerMenuItems;

    return (
        <aside style={{
            width: '250px',
            height: 'calc(100vh - 73px)', // Subtract navbar height
            borderRight: '1px solid var(--border-color)',
            padding: '2rem 1rem',
            background: 'var(--sidebar-bg)',
            position: 'sticky',
            top: '73px'
        }}>
            {items.map((item, index) => (
                <MenuItem key={index} icon={item.icon} label={item.label} path={item.path} />
            ))}

            <div style={{ margin: '1rem 0', height: '1px', background: 'var(--border-color)' }} />
            <MenuItem icon={Settings} label="Settings" path="/app/settings" />
        </aside>
    );
};

export default Sidebar;
