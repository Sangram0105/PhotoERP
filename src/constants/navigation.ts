import {
  Home,

  FileText,
  Users,
  Settings,

} from 'lucide-react';

import { ROUTES } from './routes';

export const navigationItems = [
  {
    title: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: Home,
  },
  {
    title: 'Quotations',
    path: ROUTES.QUOTATIONS,
    icon: FileText,
  },
  {
    title: 'Clients',
    path: ROUTES.CLIENTS,
    icon: Users,
  },
  // {
  //   title: 'New Quotation',
  //   path: ROUTES.NEW_QUOTATION,
  //   icon: FilePlus,
  // },
  {
    title: 'Settings',
    path: ROUTES.SETTINGS,
    icon: Settings,
  },
];