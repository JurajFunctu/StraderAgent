const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Sales Reps
  getSalesReps: () => fetchApi<any[]>('/sales-reps'),

  // Customers
  getCustomers: () => fetchApi<any[]>('/customers'),
  getCustomer: (id: number) => fetchApi<any>(`/customers/${id}`),

  // Emails
  getEmails: () => fetchApi<any[]>('/emails'),
  getEmail: (id: number) => fetchApi<any>(`/emails/${id}`),
  updateEmail: (id: number, data: any) => 
    fetchApi<any>(`/emails/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Products
  getProducts: (params?: { search?: string; category?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category) searchParams.append('category', params.category);
    const query = searchParams.toString();
    return fetchApi<any[]>(`/products${query ? '?' + query : ''}`);
  },
  getProduct: (id: number) => fetchApi<any>(`/products/${id}`),

  // Invoices
  getInvoices: (params?: { type?: string; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.append('type', params.type);
    if (params?.status) searchParams.append('status', params.status);
    const query = searchParams.toString();
    return fetchApi<any[]>(`/invoices${query ? '?' + query : ''}`);
  },
  getInvoice: (id: number) => fetchApi<any>(`/invoices/${id}`),
  updateInvoice: (id: number, data: any) =>
    fetchApi<any>(`/invoices/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Delivery Notes
  getDeliveryNotes: () => fetchApi<any[]>('/delivery-notes'),

  // Orders
  getOrders: () => fetchApi<any[]>('/orders'),
  createOrder: (data: any) =>
    fetchApi<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Dashboard
  getDashboardStats: () => fetchApi<any[]>('/dashboard/stats'),
  getDashboardSummary: () => fetchApi<any>('/dashboard/summary'),
};
