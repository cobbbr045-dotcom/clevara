export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  variant_name: string;
  sku: string;
  stock_quantity: number;
  price_override?: number | null;
  image_url?: string;
  is_active: boolean;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  selling_price: number;
  original_price?: number | null;
  sku: string;
  stock_quantity: number;
  status: 'active' | 'draft' | 'archived' | 'out_of_stock';
  is_featured: boolean;
  specifications: Record<string, string>;
  images: string[];
  variants?: ProductVariant[];
  category?: Category;
  created_at: string;
}

export interface CartItem {
  productId: string;
  variantId?: string | null;
  name: string;
  variantName?: string | null;
  sku: string;
  price: number;
  image: string;
  quantity: number;
  maxStock: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  description: string;
  estimated_delivery_time: string;
  fee: number;
  is_active: boolean;
}

export interface OrderItem {
  id: string;
  product_id: string;
  variant_id?: string | null;
  product_name: string;
  variant_name?: string | null;
  sku: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  province?: string;
  district?: string;
  municipality?: string;
  ward_number?: string | number;
  street_tole?: string;
  house_number?: string;
  landmark?: string;
  delivery_address: string;
  city: string;
  delivery_zone_id: string;
  delivery_zone?: DeliveryZone;
  delivery_instructions?: string;
  instagram_username?: string;
  facebook_messenger?: string;
  whatsapp_number?: string;
  viber_number?: string;
  promotional_code?: string;
  original_subtotal?: number;
  subtotal: number;
  delivery_fee: number;
  discount_amount: number;
  total_amount: number;
  payment_method: 'cod' | 'esewa';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned' | 'refunded';
  tracking_code: string;
  admin_notes?: string;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  is_verified_purchase: boolean;
  created_at: string;
}

export interface Promotion {
  id: string;
  code: string;
  title: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  times_used: number;
}

export interface PromotionalEvent {
  id: string;
  title: string;
  description: string;
  banner_url?: string;
  discount_percent: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_limited_time: boolean;
}

export interface CancellationRequest {
  id: string;
  order_id: string;
  order_number?: string;
  customer_name?: string;
  customer_email?: string;
  reason: string;
  status: 'requested' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
}

export interface ReturnRequest {
  id: string;
  order_id: string;
  order_number?: string;
  customer_name?: string;
  customer_email?: string;
  reason: string;
  photo_urls: string[];
  status: 'requested' | 'approved' | 'rejected' | 'inspecting' | 'completed';
  admin_notes?: string;
  created_at: string;
}

export interface RefundRequest {
  id: string;
  return_request_id?: string | null;
  order_id: string;
  order_number?: string;
  customer_id?: string | null;
  requested_amount: number;
  approved_refund_amount: number;
  refund_percentage: number;
  status: 'requested' | 'approved' | 'processed' | 'completed' | 'rejected';
  admin_notes?: string;
  processed_at?: string | null;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: 'inquiry' | 'complaint' | 'damaged_product' | 'order_status' | 'feedback';
  status: 'new' | 'under_review' | 'resolved' | 'closed';
  admin_notes?: string;
  created_at: string;
}
