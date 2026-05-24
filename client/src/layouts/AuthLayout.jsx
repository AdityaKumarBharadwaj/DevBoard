import { Outlet } from 'react-router-dom';
import { Check } from 'lucide-react';
// 1. Import your logo
import logo from '../assets/logo.png';

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex bg-dark-950">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-dark-900 to-dark-800 flex-col items-center justify-center p-12 border-r border-surface-border">
        <div className="max-w-lg space-y-10">
          
          {/* 2. Added the logo in this section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="devBoard logo" className="h-12 w-12 object-contain" />
              <p className="text-sm tracking-[0.4em] text-brand-200 mt-1">devBoard</p>
            </div>
            <h1 className="text-5xl font-bold tracking-tight">Your developer operating system</h1>
          </div>

          <div className="space-y-5">
            {[
              'Kanban boards for your projects',
              'Syntax highlighted code snippets',
              'Sprint planning for developers',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-brand-100">
                  <Check size={18} />
                </span>
                <p className="text-lg text-slate-100">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}