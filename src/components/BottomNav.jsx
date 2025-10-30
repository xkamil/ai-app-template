import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const BottomNav = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    {
      path: '/workouts',
      icon: '📅',
      labelKey: 'bottomNav.workouts',
      label: t('bottomNav.workouts')
    },
    {
      path: '/plans',
      icon: '📋',
      labelKey: 'bottomNav.plans',
      label: t('bottomNav.plans')
    },
    {
      path: '/exercises',
      icon: '💪',
      labelKey: 'bottomNav.exercises',
      label: t('bottomNav.exercises')
    },
    {
      path: '/stats',
      icon: '📊',
      labelKey: 'bottomNav.stats',
      label: t('bottomNav.stats')
    },
    {
      path: '/profile',
      icon: '👤',
      labelKey: 'bottomNav.profile',
      label: t('bottomNav.profile')
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`bottom-nav-item ${isActive(item.path) ? 'active' : ''}`}
        >
          <div className="bottom-nav-icon">{item.icon}</div>
          <div className="bottom-nav-label">{item.label}</div>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNav;
