import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RoleProvider } from '@/context/RoleContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { InvoiceList } from '@/pages/InvoiceList';
import { InvoiceDetails } from '@/pages/InvoiceDetails';

function App() {
  return (
    <RoleProvider>
      <Router>
        <SidebarProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="invoices" element={<InvoiceList />} />
              <Route path="invoices/:id" element={<InvoiceDetails />} />
            </Route>
          </Routes>
        </SidebarProvider>
      </Router>
    </RoleProvider>
  );
}

export default App;
