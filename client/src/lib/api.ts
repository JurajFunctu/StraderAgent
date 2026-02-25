const API_BASE = '/api';

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
  getSalesReps: () => fetchApi<any[]>('/sales-reps'),
  getCustomers: () => fetchApi<any[]>('/customers'),
  getCustomer: (id: number) => fetchApi<any>(`/customers/${id}`),
  getEmails: () => fetchApi<any[]>('/emails'),
  getEmail: (id: number) => fetchApi<any>(`/emails/${id}`),
  updateEmail: (id: number, data: any) => fetchApi<any>(`/emails/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getProducts: (params?: { search?: string; category?: string }) => {
    const sp = new URLSearchParams();
    if (params?.search) sp.append('search', params.search);
    if (params?.category) sp.append('category', params.category);
    const q = sp.toString();
    return fetchApi<any[]>(`/products${q ? '?' + q : ''}`);
  },
  getProduct: (id: number) => fetchApi<any>(`/products/${id}`),
  getInvoices: (params?: { type?: string; status?: string }) => {
    const sp = new URLSearchParams();
    if (params?.type) sp.append('type', params.type);
    if (params?.status) sp.append('status', params.status);
    const q = sp.toString();
    return fetchApi<any[]>(`/invoices${q ? '?' + q : ''}`);
  },
  getInvoice: (id: number) => fetchApi<any>(`/invoices/${id}`),
  updateInvoice: (id: number, data: any) => fetchApi<any>(`/invoices/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getDeliveryNotes: () => fetchApi<any[]>('/delivery-notes'),
  getOrders: () => fetchApi<any[]>('/orders'),
  createOrder: (data: any) => fetchApi<any>('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getDashboardStats: () => fetchApi<any[]>('/dashboard/stats'),
  getDashboardSummary: () => fetchApi<any>('/dashboard/summary'),
};
