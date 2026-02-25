import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { CustomerAgent } from './components/customer/CustomerAgent';
import { InvoiceAgent } from './components/invoice/InvoiceAgent';
import { ProductAgent } from './components/product/ProductAgent';
import { Dashboard } from './components/dashboard/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<CustomerAgent />} />
          <Route path="/invoices" element={<InvoiceAgent />} />
          <Route path="/products" element={<ProductAgent />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
