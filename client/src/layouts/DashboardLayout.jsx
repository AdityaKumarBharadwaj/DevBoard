import { createContext, useContext, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast, { useToast } from '../components/ui/Toast';
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  LogOut,
} from 'lucide-react';
// 1. Import your logo here
import logo from '../assets/logo.png'; 

const navItems = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', to: '/projects', icon: FolderKanban },
  { name: 'Settings', to: '/settings', icon: Settings },
];

export const ToastContext = createContext(null);
export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastContext.Provider');
  }
  return context;
};

export default function DashboardLayout() {
  const { toasts, showToast, removeToast } = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
    : 'DB';

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className="flex h-screen w-screen overflow-hidden bg-dark-950 text-slate-100">
        <aside className="w-64 h-full flex-shrink-0 bg-dark-900 border-r border-surface-border flex flex-col">
          <div className="flex h-full flex-col px-5 py-6">
            
            {/* 2. Logo section updated here */}
            <div className="mb-10 flex items-center gap-3 text-white">
              <img src={logo} alt="devBoard logo" className="h-10 w-10 object-contain" />
              <span className="text-2xl font-bold">devBoard</span>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-3 transition ${
                        isActive
                          ? 'bg-brand-600 text-white'
                          : 'text-gray-400 hover:bg-surface-raised'
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="mt-auto rounded-2xl border border-surface-border bg-dark-850 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-white">{user?.name}</p>
                  <p className="text-sm text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-surface-raised px-3 py-2 text-sm text-gray-200 transition hover:bg-surface-raised/90"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="h-16 flex-shrink-0 border-b border-surface-border flex items-center px-6">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-gray-400">Welcome back</p>
                <h1 className="text-xl font-semibold text-white">Dashboard</h1>
              </div>
            </div>
            <div className="ml-auto hidden items-center gap-3 md:flex">
              <span className="text-sm text-gray-400">Hello,</span>
              <span className="font-medium text-white">{user?.name?.split(' ')[0]}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </div>
        </div>
      </div>

      <Toast toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}