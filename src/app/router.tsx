import { createBrowserRouter } from 'react-router-dom';

import AppLayout from '../components/layout/AppLayout';

import DashboardPage from '../features/dashboard/pages/DashboardPage';
import QuotationListPage from '../features/quotations/pages/QuotationListPage';

import { ROUTES } from '../constants/routes';
import NewQuotationPage from '../features/quotations/pages/NewQuotationPage';
import EditQuotationPage from '../features/quotations/pages/EditQuotationPage';
import ViewQuotationPage from '../features/quotations/pages/ViewQuotationPage';
import PdfPreviewPage from '../features/quotations/pages/PdfPreviewPage';

export const router = createBrowserRouter([
  {
    path: ROUTES.DASHBOARD,
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: ROUTES.QUOTATIONS.substring(1),
        element: <QuotationListPage />,
      },
      {
        path: ROUTES.NEW_QUOTATION.substring(1),
        element: <NewQuotationPage />,
      },

      {
       path: 'quotations/:id',
       element: <ViewQuotationPage />,
     },
      {
       path: 'quotations/edit/:id',
       element: <EditQuotationPage />,
      },

      {
    path: '/quotation/:id/pdf',
    element: <PdfPreviewPage />,
       }

    ],
  },
]);