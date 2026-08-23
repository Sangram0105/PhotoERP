import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

import { navigationItems } from '../../constants/navigation';

const Sidebar = () => {
  return (
    <aside className="w-64 border-r bg-white">
      <div className="border-b p-6">
        <h1 className="text-xl font-bold">
          📸 Photo Studio
        </h1>
      </div>

      <nav className="space-y-2 p-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-lg px-4 py-3 transition-all',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100',
                )
              }
            >
              <Icon size={20} />
              {item.title}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;