'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', label: 'Dashboard', icon: '🏠', testId: 'nav-dashboard' },
    { href: '/repository', label: 'Repository', icon: '📁', testId: 'nav-repository' },
    { href: '/workflow', label: 'Workflow', icon: '⚙️', testId: 'nav-workflow' },
    { href: '/workflow/builder', label: 'Workflow Builder', icon: '🔧', testId: 'nav-workflow-builder' },
    { href: '/sites', label: 'Sites', icon: '👥', testId: 'nav-sites' },
    { href: '/records', label: 'Records', icon: '📋', testId: 'nav-records' },
    { href: '/search', label: 'Search', icon: '🔍', testId: 'nav-search' },
    { href: '/admin', label: 'Admin', icon: '⚙️', testId: 'nav-admin' }
  ];
  
  return (
    <nav style={{
      backgroundColor: '#0052CC',
      padding: '1rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link 
            href="/" 
            data-testid="logo-link"
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}
          >
            🗂️ Alfresco ECM
          </Link>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                data-testid={item.testId}
                style={{
                  color: pathname === item.href ? '#FFEB3B' : 'white',
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  backgroundColor: pathname === item.href ? 'rgba(255,255,255,0.1)' : 'transparent',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  if (pathname !== item.href) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (pathname !== item.href) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            data-testid="search-button"
            onClick={() => window.location.href = '/search'}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'white',
              color: '#0052CC',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            🔍 Quick Search
          </button>
          
          <button
            data-testid="profile-button"
            onClick={() => alert('Opening user profile...')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              color: 'white',
              border: '1px solid white',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            👤 Profile
          </button>
          
          <button
            data-testid="logout-button"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#FF5630',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}