const API_BASE = '/api';

export async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('clevara_auth_token');
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({ success: false, error: 'Failed to parse response' }));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Public
  getProducts: (params?: { categoryId?: string; search?: string; sort?: string; isFeatured?: boolean }) => {
    const q = new URLSearchParams();
    if (params?.categoryId) q.set('categoryId', params.categoryId);
    if (params?.search) q.set('search', params.search);
    if (params?.sort) q.set('sort', params.sort);
    if (params?.isFeatured !== undefined) q.set('isFeatured', String(params.isFeatured));
    const qs = q.toString() ? `?${q.toString()}` : '';
    return apiFetch<{ success: boolean; products: any[] }>(`/products${qs}`);
  },
  getProduct: (idOrSlug: string) => apiFetch<{ success: boolean; product: any }>(`/products/${idOrSlug}`),
  getCategories: () => apiFetch<{ success: boolean; categories: any[] }>('/categories'),
  getDeliveryZones: () => apiFetch<{ success: boolean; zones: any[] }>('/delivery-zones'),
  getEvents: () => apiFetch<{ success: boolean; events: any[] }>('/events'),
  validateCoupon: (code: string, subtotal: number) =>
    apiFetch<{ valid: boolean; discount: number; message?: string }>('/promotions/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal })
    }),
  submitOrder: (payload: any) =>
    apiFetch<{ success: boolean; order: any }>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  trackOrder: (reference: string) =>
    apiFetch<{ success: boolean; order: any }>(`/orders/track/${reference}`),
  submitContact: (payload: any) =>
    apiFetch<{ success: boolean; message: string; ticket: any }>('/contact', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  submitCancellation: (payload: { order_number: string; reason: string }) =>
    apiFetch<{ success: boolean; request: any }>('/cancellations', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  submitReturn: (payload: { order_number: string; reason: string; photo_urls?: string[] }) =>
    apiFetch<{ success: boolean; request: any }>('/returns', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  getProductReviews: (productId: string) =>
    apiFetch<{ success: boolean; reviews: any[] }>(`/reviews/product/${productId}`),
  submitReview: (payload: any) =>
    apiFetch<{ success: boolean; review: any }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  getContent: (key?: string) =>
    apiFetch<{ success: boolean; content: any }>(`/content${key ? `/${key}` : ''}`),

  // Payments
  initiateEsewa: (orderId: string, clientSuccessUrl?: string, clientFailureUrl?: string) =>
    apiFetch<{ success: boolean; payment: any }>('/payments/esewa/initiate', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId, client_success_url: clientSuccessUrl, client_failure_url: clientFailureUrl })
    }),
  verifyEsewa: (encodedData: string, orderNumber?: string) =>
    apiFetch<{ success: boolean; verified: boolean; data: any }>('/payments/esewa/verify', {
      method: 'POST',
      body: JSON.stringify({ encoded_data: encodedData, order_number: orderNumber })
    }),

  // Auth & Admin
  adminLogin: (credentials: { email: string; password: string }) =>
    apiFetch<{ success: boolean; token: string; user: any }>('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
  getAdminMe: () => apiFetch<{ success: boolean; user: any }>('/auth/me'),
  getAdminOverview: () => apiFetch<{ success: boolean; overview: any }>('/admin/overview'),
  getAdminOrders: (params?: { status?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.status) q.set('status', params.status);
    if (params?.search) q.set('search', params.search);
    const qs = q.toString() ? `?${q.toString()}` : '';
    return apiFetch<{ success: boolean; orders: any[] }>(`/orders${qs}`);
  },
  updateOrderStatus: (orderId: string, status: string, payment_status?: string, notes?: string) =>
    apiFetch<{ success: boolean; order: any }>(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, payment_status, notes })
    }),
  adminCreateProduct: (data: any) =>
    apiFetch<{ success: boolean; product: any }>('/products', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  adminUpdateProduct: (id: string, data: any) =>
    apiFetch<{ success: boolean; product: any }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  adminDeleteProduct: (id: string) =>
    apiFetch<{ success: boolean; message: string }>(`/products/${id}`, {
      method: 'DELETE'
    }),
  adminCreateVariant: (productId: string, data: any) =>
    apiFetch<{ success: boolean; variant: any }>(`/products/${productId}/variants`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  adminUpdateVariant: (productId: string, variantId: string, data: any) =>
    apiFetch<{ success: boolean; variant: any }>(`/products/${productId}/variants/${variantId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  adminDeleteVariant: (productId: string, variantId: string) =>
    apiFetch<{ success: boolean; message: string }>(`/products/${productId}/variants/${variantId}`, {
      method: 'DELETE'
    }),
  adminCreateCategory: (data: any) =>
    apiFetch<{ success: boolean; category: any }>('/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  adminUpdateCategory: (id: string, data: any) =>
    apiFetch<{ success: boolean; category: any }>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  adminDeleteCategory: (id: string) =>
    apiFetch<{ success: boolean; message: string }>(`/categories/${id}`, {
      method: 'DELETE'
    }),
  getAdminInventoryMovements: () =>
    apiFetch<{ success: boolean; movements: any[] }>('/admin/inventory-movements'),
  getAdminCustomers: () =>
    apiFetch<{ success: boolean; customers: any[] }>('/admin/customers'),
  getAdminCancellations: () =>
    apiFetch<{ success: boolean; requests: any[] }>('/cancellations'),
  adminReviewCancellation: (id: string, action: 'approve' | 'reject', admin_notes?: string) =>
    apiFetch<{ success: boolean; request: any }>(`/cancellations/${id}/review`, {
      method: 'PATCH',
      body: JSON.stringify({ action, admin_notes })
    }),
  getAdminReturns: () =>
    apiFetch<{ success: boolean; requests: any[] }>('/returns'),
  getAdminRefunds: () =>
    apiFetch<{ success: boolean; requests: any[] }>('/refunds'),
  adminReviewRefund: (id: string, status: string, approved_amount?: number, admin_notes?: string) =>
    apiFetch<{ success: boolean; request: any }>(`/refunds/${id}/review`, {
      method: 'PATCH',
      body: JSON.stringify({ status, approved_amount, admin_notes })
    }),
  getAdminComplaints: () =>
    apiFetch<{ success: boolean; messages: any[] }>('/contact'),
  adminUpdateComplaintStatus: (id: string, status: string, admin_notes?: string) =>
    apiFetch<{ success: boolean; ticket: any }>(`/contact/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, admin_notes })
    }),
  getAdminReviews: () =>
    apiFetch<{ success: boolean; reviews: any[] }>('/reviews'),
  adminModerateReview: (id: string, is_approved: boolean) =>
    apiFetch<{ success: boolean; review: any }>(`/reviews/${id}/moderate`, {
      method: 'PATCH',
      body: JSON.stringify({ is_approved })
    }),
  adminUpdateContent: (sectionKey: string, data: any) =>
    apiFetch<{ success: boolean; content: any }>(`/content/${sectionKey}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  adminUpdateDeliveryZone: (id: string, data: any) =>
    apiFetch<{ success: boolean; zone: any }>(`/delivery-zones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  adminCreateDeliveryZone: (data: any) =>
    apiFetch<{ success: boolean; zone: any }>('/delivery-zones', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  adminCreatePromotion: (data: any) =>
    apiFetch<{ success: boolean; promotion: any }>('/promotions', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  adminCreateEvent: (data: any) =>
    apiFetch<{ success: boolean; event: any }>('/events', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  adminUpdateEvent: (id: string, data: any) =>
    apiFetch<{ success: boolean; event: any }>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  adminDeleteEvent: (id: string) =>
    apiFetch<{ success: boolean; message: string }>(`/events/${id}`, {
      method: 'DELETE'
    })
};
