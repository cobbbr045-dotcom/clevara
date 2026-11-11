import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  Category,
  Product,
  ProductVariant,
  InventoryMovement,
  Customer,
  AdminProfile,
  DeliveryZone,
  Order,
  OrderItem,
  Promotion,
  PromotionalEvent,
  CancellationRequest,
  ReturnRequest,
  RefundRequest,
  Review,
  ContactMessage,
  WebsiteContent,
  OrderStatus,
  PaymentStatus
} from '../types/index.js';
import {
  validateCustomerName,
  validateNepalMobile,
  validateDeliveryAddress,
  CLEVARA_FIXED_PROMOS
} from '../utils/validation.js';

interface DatabaseStore {
  categories: Category[];
  products: Product[];
  variants: ProductVariant[];
  inventory_movements: InventoryMovement[];
  customers: Customer[];
  admin_profiles: AdminProfile[];
  delivery_zones: DeliveryZone[];
  orders: Order[];
  promotions: Promotion[];
  events: PromotionalEvent[];
  cancellation_requests: CancellationRequest[];
  return_requests: ReturnRequest[];
  refund_requests: RefundRequest[];
  reviews: Review[];
  contact_messages: ContactMessage[];
  website_content: WebsiteContent[];
}

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

class DatabaseService {
  private data: DatabaseStore;
  private isPersisting = false;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadFromDisk();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadFromDisk(): DatabaseStore {
    if (fs.existsSync(DATA_FILE)) {
      try {
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(content);
      } catch (e) {
        console.error('Failed to parse existing data file, initializing fresh store:', e);
      }
    }
    const initial = this.getInitialSeed();
    this.saveToDisk(initial);
    return initial;
  }

  private saveToDisk(store?: DatabaseStore) {
    if (this.isPersisting) return;
    this.isPersisting = true;
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(store || this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist database to disk:', e);
    } finally {
      this.isPersisting = false;
    }
  }

  private getInitialSeed(): DatabaseStore {
    const adminHash = bcrypt.hashSync('ClevaraAdmin2026!', 10);
    const now = new Date().toISOString();

    const categories: Category[] = [
      {
        id: 'c1000000-0000-0000-0000-000000000001',
        name: 'Home Cleaning',
        slug: 'home-cleaning',
        description: 'Meticulously formulated household, kitchen, and bathroom essentials engineered for effortless cleanliness.',
        image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
        display_order: 1,
        created_at: now,
        updated_at: now
      },
      {
        id: 'c2000000-0000-0000-0000-000000000002',
        name: 'Body Cleaning',
        slug: 'body-cleaning',
        description: 'Pure, skin-friendly personal hygiene essentials and accessories crafted for everyday wellbeing.',
        image_url: 'https://images.unsplash.com/photo-1608248597359-009139268d87?auto=format&fit=crop&w=800&q=80',
        display_order: 2,
        created_at: now,
        updated_at: now
      },
      {
        id: 'c3000000-0000-0000-0000-000000000003',
        name: 'Car Cleaning',
        slug: 'car-cleaning',
        description: 'Professional-grade vehicle exterior wash, interior detailing, and maintenance essentials.',
        image_url: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80',
        display_order: 3,
        created_at: now,
        updated_at: now
      }
    ];

    const delivery_zones: DeliveryZone[] = [
      {
        id: 'd1000000-0000-0000-0000-000000000001',
        name: 'Kathmandu Valley (Inside Ring Road)',
        description: 'Standard door-to-door delivery inside Ring Road, Kathmandu',
        estimated_delivery_time: '1 - 2 Business Days',
        fee: 100,
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: 'd2000000-0000-0000-0000-000000000002',
        name: 'Kathmandu Valley (Outside Ring Road / Lalitpur / Bhaktapur)',
        description: 'Doorstep delivery for suburban areas, Lalitpur & Bhaktapur',
        estimated_delivery_time: '1 - 2 Business Days',
        fee: 150,
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: 'd3000000-0000-0000-0000-000000000003',
        name: 'Major Regional Hubs (Pokhara, Chitwan, Biratnagar, Butwal)',
        description: 'Express courier delivery to major municipal areas outside Kathmandu Valley',
        estimated_delivery_time: '2 - 4 Business Days',
        fee: 200,
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: 'd4000000-0000-0000-0000-000000000004',
        name: 'Rest of Nepal (Nationwide Courier)',
        description: 'Comprehensive provincial delivery across reachable road & courier networks',
        estimated_delivery_time: '3 - 6 Business Days',
        fee: 250,
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ];

    const products: Product[] = [
      {
        id: 'p1000000-0000-0000-0000-000000000001',
        category_id: 'c1000000-0000-0000-0000-000000000001',
        name: 'CLEVARA Multi-Surface Botanical Surface Spray',
        slug: 'clevara-multi-surface-botanical-spray',
        description: 'High-efficiency, plant-derived multi-surface cleaning spray designed to dissolve grime, grease, and dust without harsh chemical fumes. Leaves surfaces streak-free and subtly fragrant.',
        selling_price: 650,
        original_price: 750,
        sku: 'CLV-HC-MS-001',
        stock_quantity: 45,
        status: 'active',
        is_featured: true,
        specifications: {
          'Volume': '500 ml',
          'Form': 'Liquid Spray',
          'Surfaces': 'Countertops, tiles, sealed marble, porcelain, wood',
          'Origin': 'Formulated for CLEVARA',
          'Packaging': 'Recyclable PET bottle with adjustable mist nozzle'
        },
        images: [
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80'
        ],
        created_at: now,
        updated_at: now
      },
      {
        id: 'p1000000-0000-0000-0000-000000000002',
        category_id: 'c1000000-0000-0000-0000-000000000001',
        name: 'CLEVARA Kitchen Heavy-Duty Degreaser Concentrate',
        slug: 'clevara-kitchen-degreaser-concentrate',
        description: 'Formulated to penetrate baked-on stove grease, exhaust filter buildup, and kitchen tile residue. Dilutable concentrate provides up to 5 spray bottles of heavy-duty cleaning solution.',
        selling_price: 890,
        original_price: 990,
        sku: 'CLV-HC-DG-002',
        stock_quantity: 30,
        status: 'active',
        is_featured: true,
        specifications: {
          'Volume': '1000 ml (Concentrated)',
          'Application': 'Stovetops, chimneys, oven trays, fryer surroundings',
          'Dilution Ratio': '1:4 for standard cleaning, neat for heavy grease',
          'Safety': 'Non-corrosive on stainless steel'
        },
        images: [
          'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=800&q=80'
        ],
        created_at: now,
        updated_at: now
      },
      {
        id: 'p1000000-0000-0000-0000-000000000003',
        category_id: 'c1000000-0000-0000-0000-000000000001',
        name: 'CLEVARA Ultra-Dense Microfiber Cleaning Towels (Pack of 4)',
        slug: 'clevara-ultra-dense-microfiber-pack-of-4',
        description: 'Lint-free 400 GSM dual-woven microfiber cloths designed for scratch-free cleaning, dusting, and polishing on delicate finishes and electronics.',
        selling_price: 550,
        original_price: 650,
        sku: 'CLV-HC-MF-003',
        stock_quantity: 60,
        status: 'active',
        is_featured: false,
        specifications: {
          'GSM': '400',
          'Dimensions': '40 cm x 40 cm',
          'Pack Quantity': '4 Towels',
          'Material': '80% Polyester, 20% Polyamide',
          'Care': 'Machine washable up to 300 cycles'
        },
        images: [
          'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=80'
        ],
        created_at: now,
        updated_at: now
      },
      {
        id: 'p2000000-0000-0000-0000-000000000001',
        category_id: 'c2000000-0000-0000-0000-000000000002',
        name: 'CLEVARA Clarifying Botanical Hand & Body Wash',
        slug: 'clevara-clarifying-botanical-hand-body-wash',
        description: 'pH-balanced cleansing wash enriched with soothing plant glycerine and mild surfactants. Cleanses deeply while preserving the skin barrier without tightness.',
        selling_price: 750,
        original_price: 850,
        sku: 'CLV-BC-BW-001',
        stock_quantity: 40,
        status: 'active',
        is_featured: true,
        specifications: {
          'Volume': '400 ml',
          'pH Level': '5.5 balanced',
          'Skin Type': 'Suitable for all skin types, including sensitive',
          'Dispenser': 'Lockable heavy-duty amber pump',
          'Formulation': 'Sulfate-conscious, paraben-free'
        },
        images: [
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80'
        ],
        created_at: now,
        updated_at: now
      },
      {
        id: 'p2000000-0000-0000-0000-000000000002',
        category_id: 'c2000000-0000-0000-0000-000000000002',
        name: 'CLEVARA Dual-Texture Exfoliating Loofah & Sisal Pad',
        slug: 'clevara-dual-texture-exfoliating-loofah-pad',
        description: 'Handcrafted natural fiber cleansing accessory with an exfoliating sisal side for deep pore stimulation and a soft terry-cloth backing for gentle daily use.',
        selling_price: 380,
        original_price: 450,
        sku: 'CLV-BC-LF-002',
        stock_quantity: 50,
        status: 'active',
        is_featured: false,
        specifications: {
          'Materials': '100% Natural Sisal and Organic Cotton Terry',
          'Dimensions': '15 cm x 10 cm',
          'Features': 'Elastic hand strap for comfortable grip',
          'Durability': 'Resistant to fraying'
        },
        images: [
          'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
        ],
        created_at: now,
        updated_at: now
      },
      {
        id: 'p3000000-0000-0000-0000-000000000001',
        category_id: 'c3000000-0000-0000-0000-000000000003',
        name: 'CLEVARA Ceramic-Infused High-Foam Vehicle Shampoo',
        slug: 'clevara-ceramic-infused-high-foam-vehicle-shampoo',
        description: 'High-lubricity pH-neutral auto shampoo designed for both bucket wash and foam cannon. Safely lifts abrasive road dust and mud without stripping waxes or ceramic coatings.',
        selling_price: 980,
        original_price: 1150,
        sku: 'CLV-CC-CS-001',
        stock_quantity: 35,
        status: 'active',
        is_featured: true,
        specifications: {
          'Volume': '1000 ml',
          'pH Level': '7.0 (Neutral)',
          'Concentration': '1:250 bucket wash / 1:9 foam lance',
          'Coating Safe': 'Safe for clear coats, vinyl wraps, and PPF',
          'Lubrication': 'High slip polymers to prevent swirl marks'
        },
        images: [
          'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80'
        ],
        created_at: now,
        updated_at: now
      },
      {
        id: 'p3000000-0000-0000-0000-000000000002',
        category_id: 'c3000000-0000-0000-0000-000000000003',
        name: 'CLEVARA Satin Finish Car Interior Detailer & UV Shield',
        slug: 'clevara-satin-finish-car-interior-detailer',
        description: 'Non-greasy interior dressing for vehicle dashboards, consoles, steering wheels, and door trims. Repels dust while offering UV inhibitors against sun fading in Nepal conditions.',
        selling_price: 820,
        original_price: 950,
        sku: 'CLV-CC-ID-002',
        stock_quantity: 28,
        status: 'active',
        is_featured: true,
        specifications: {
          'Volume': '500 ml',
          'Finish': 'Original OEM Satin / Matte (Zero oily shine)',
          'Surfaces': 'Vinyl, plastic, treated leather, rubber, touchscreens',
          'UV Protection': 'Active UV blocking agents'
        },
        images: [
          'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'
        ],
        created_at: now,
        updated_at: now
      },
      {
        id: 'p3000000-0000-0000-0000-000000000003',
        category_id: 'c3000000-0000-0000-0000-000000000003',
        name: 'CLEVARA 1200 GSM Twisted-Loop Vehicle Drying Towel',
        slug: 'clevara-1200-gsm-vehicle-drying-towel',
        description: 'Enormous 60x90cm luxury drying towel with Korean twisted-loop fibers that absorb up to 2.5 liters of water in a single continuous glide across vehicle body panels.',
        selling_price: 1250,
        original_price: 1450,
        sku: 'CLV-CC-DT-003',
        stock_quantity: 20,
        status: 'active',
        is_featured: false,
        specifications: {
          'GSM': '1200 GSM Heavyweight',
          'Dimensions': '60 cm x 90 cm',
          'Weave': 'Twisted loop microfiber with hidden silk edge',
          'Water Capacity': 'Up to 2.5 Litres'
        },
        images: [
          'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=800&q=80'
        ],
        created_at: now,
        updated_at: now
      }
    ];

    const variants: ProductVariant[] = [
      {
        id: 'v1000000-0000-0000-0000-000000000001',
        product_id: 'p1000000-0000-0000-0000-000000000001',
        variant_name: 'Eucalyptus Mist',
        sku: 'CLV-HC-MS-001-EUC',
        stock_quantity: 25,
        price_override: 650,
        image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: 'v1000000-0000-0000-0000-000000000002',
        product_id: 'p1000000-0000-0000-0000-000000000001',
        variant_name: 'Citrus Blossom',
        sku: 'CLV-HC-MS-001-CIT',
        stock_quantity: 20,
        price_override: 650,
        image_url: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: 'v1000000-0000-0000-0000-000000000003',
        product_id: 'p1000000-0000-0000-0000-000000000003',
        variant_name: 'Slate Grey',
        sku: 'CLV-HC-MF-003-GRY',
        stock_quantity: 35,
        price_override: 550,
        image_url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=80',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: 'v1000000-0000-0000-0000-000000000004',
        product_id: 'p1000000-0000-0000-0000-000000000003',
        variant_name: 'Arctic Blue',
        sku: 'CLV-HC-MF-003-BLU',
        stock_quantity: 25,
        price_override: 550,
        image_url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=80',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: 'v2000000-0000-0000-0000-000000000001',
        product_id: 'p2000000-0000-0000-0000-000000000001',
        variant_name: 'Bergamot & Cedar',
        sku: 'CLV-BC-BW-001-BER',
        stock_quantity: 22,
        price_override: 750,
        image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: 'v2000000-0000-0000-0000-000000000002',
        product_id: 'p2000000-0000-0000-0000-000000000001',
        variant_name: 'Lavender Herbal',
        sku: 'CLV-BC-BW-001-LAV',
        stock_quantity: 18,
        price_override: 750,
        image_url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: 'v3000000-0000-0000-0000-000000000001',
        product_id: 'p3000000-0000-0000-0000-000000000003',
        variant_name: 'Stealth Graphite (60x90cm)',
        sku: 'CLV-CC-DT-003-GRP',
        stock_quantity: 12,
        price_override: 1250,
        image_url: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=800&q=80',
        is_active: true,
        created_at: now,
        updated_at: now
      },
      {
        id: 'v3000000-0000-0000-0000-000000000002',
        product_id: 'p3000000-0000-0000-0000-000000000003',
        variant_name: 'Royal Cobalt (60x90cm)',
        sku: 'CLV-CC-DT-003-CBL',
        stock_quantity: 8,
        price_override: 1250,
        image_url: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=800&q=80',
        is_active: true,
        created_at: now,
        updated_at: now
      }
    ];

    const admin_profiles: AdminProfile[] = [
      {
        id: 'a1000000-0000-0000-0000-000000000001',
        email: 'admin@clevara.com',
        full_name: 'CLEVARA Head of Operations',
        role: 'super_admin',
        password_hash: adminHash,
        created_at: now
      }
    ];

    const promotions: Promotion[] = [
      {
        id: 'pr100000-0000-0000-0000-000000000001',
        code: 'CLEVARA10',
        title: 'Welcome to CLEVARA Nepal',
        description: 'Get 10% off your initial order above Rs. 1,000 across all cleaning categories.',
        discount_type: 'percentage',
        discount_value: 10,
        min_order_amount: 1000,
        start_date: new Date(Date.now() - 86400000).toISOString(),
        end_date: new Date(Date.now() + 86400000 * 120).toISOString(),
        is_active: true,
        usage_limit: 500,
        times_used: 12,
        created_at: now
      },
      {
        id: 'pr200000-0000-0000-0000-000000000002',
        code: 'CLEANHOME',
        title: 'Home Care Seasonal Discount',
        description: 'Flat Rs. 150 off on essential home care collections.',
        discount_type: 'fixed',
        discount_value: 150,
        min_order_amount: 1500,
        start_date: new Date(Date.now() - 86400000).toISOString(),
        end_date: new Date(Date.now() + 86400000 * 60).toISOString(),
        is_active: true,
        usage_limit: 200,
        times_used: 4,
        created_at: now
      }
    ];

    const events: PromotionalEvent[] = [
      {
        id: 'ev100000-0000-0000-0000-000000000001',
        title: 'CLEVARA Spring Clean Festival',
        description: 'Exclusive seasonal introductory discount on our highest rated multi-surface and auto maintenance essentials.',
        banner_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
        discount_percent: 15,
        start_date: new Date(Date.now() - 86400000 * 2).toISOString(),
        end_date: new Date(Date.now() + 86400000 * 20).toISOString(),
        is_active: true,
        is_limited_time: true,
        created_at: now
      }
    ];

    const website_content: WebsiteContent[] = [
      {
        id: 'wc100000-0000-0000-0000-000000000001',
        section_key: 'announcement_bar',
        title: 'Free delivery across Kathmandu Valley on orders over Rs. 2,000 | Authentic CLEVARA Formulations',
        subtitle: 'Nationwide delivery available across Nepal',
        content_json: { badge: 'OFFICIAL STORE', link: '/shop' },
        is_active: true,
        updated_at: now
      },
      {
        id: 'wc200000-0000-0000-0000-000000000002',
        section_key: 'homepage_hero',
        title: 'Purity in Formulation. Precision in Cleanliness.',
        subtitle: 'Engineered consumer care essentials for your home, your body, and your vehicle. Delivered directly to your doorstep in Nepal.',
        content_json: {
          cta_primary: { text: 'Explore Collection', url: '/shop' },
          cta_secondary: { text: 'Our Standards', url: '/about' },
          banner_image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80'
        },
        is_active: true,
        updated_at: now
      },
      {
        id: 'wc300000-0000-0000-0000-000000000003',
        section_key: 'why_choose_clevara',
        title: 'Why Discerning Households Trust CLEVARA',
        subtitle: 'We do not white-label generic products. We engineer high-performance formulas tailored for Nepali living conditions.',
        content_json: {
          pillars: [
            { title: 'Strict Quality Control', desc: 'Every batch is inspected for consistency, pH stability, and performance safety.' },
            { title: 'Transparent Deliveries', desc: 'Fixed, fair delivery pricing throughout Nepal with zero surprise markups.' },
            { title: 'Customer-First Protections', desc: 'Clear return workflows and a 50% refund policy on verified claims.' }
          ]
        },
        is_active: true,
        updated_at: now
      }
    ];

    return {
      categories,
      products,
      variants,
      inventory_movements: [],
      customers: [],
      admin_profiles,
      delivery_zones,
      orders: [],
      promotions,
      events,
      cancellation_requests: [],
      return_requests: [],
      refund_requests: [],
      reviews: [],
      contact_messages: [],
      website_content
    };
  }

  // --- CATEGORIES ---
  public getCategories(): Category[] {
    return [...this.data.categories].sort((a, b) => a.display_order - b.display_order);
  }

  public getCategoryBySlug(slug: string): Category | undefined {
    return this.data.categories.find(c => c.slug === slug);
  }

  public createCategory(cat: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Category {
    const newCat: Category = {
      ...cat,
      id: `c-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.categories.push(newCat);
    this.saveToDisk();
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = {
      ...this.data.categories[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.saveToDisk();
    return this.data.categories[idx];
  }

  public deleteCategory(id: string): boolean {
    const prevLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    if (this.data.categories.length !== prevLen) {
      this.saveToDisk();
      return true;
    }
    return false;
  }

  // --- PRODUCTS ---
  public getProducts(filters?: { categoryId?: string; search?: string; status?: string; isFeatured?: boolean }): Product[] {
    let result = this.data.products.map(p => ({
      ...p,
      variants: this.data.variants.filter(v => v.product_id === p.id && v.is_active),
      category: this.data.categories.find(c => c.id === p.category_id)
    }));

    if (filters?.status) {
      result = result.filter(p => p.status === filters.status);
    }
    if (filters?.categoryId) {
      result = result.filter(p => p.category_id === filters.categoryId);
    }
    if (filters?.isFeatured !== undefined) {
      result = result.filter(p => p.is_featured === filters.isFeatured);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }
    return result;
  }

  public getProductBySlugOrId(idOrSlug: string): Product | undefined {
    const product = this.data.products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    if (!product) return undefined;
    return {
      ...product,
      variants: this.data.variants.filter(v => v.product_id === product.id && v.is_active),
      category: this.data.categories.find(c => c.id === product.category_id)
    };
  }

  public createProduct(data: Omit<Product, 'id' | 'created_at' | 'updated_at'> & { variants?: Array<Omit<ProductVariant, 'id' | 'product_id' | 'created_at' | 'updated_at'>> }): Product {
    const productId = `p-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date().toISOString();

    const createdVariants: ProductVariant[] = [];
    if (data.variants && data.variants.length > 0) {
      data.variants.forEach(v => {
        const variantObj: ProductVariant = {
          ...v,
          id: `v-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          product_id: productId,
          is_active: v.is_active ?? true,
          created_at: now,
          updated_at: now
        };
        this.data.variants.push(variantObj);
        createdVariants.push(variantObj);
      });
    }

    const newProduct: Product = {
      id: productId,
      category_id: data.category_id,
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      description: data.description,
      selling_price: Number(data.selling_price),
      original_price: data.original_price ? Number(data.original_price) : null,
      sku: data.sku,
      stock_quantity: Number(data.stock_quantity),
      status: data.status || 'active',
      is_featured: !!data.is_featured,
      specifications: data.specifications || {},
      images: data.images || [],
      created_at: now,
      updated_at: now
    };

    this.data.products.push(newProduct);
    this.saveToDisk();

    return {
      ...newProduct,
      variants: createdVariants,
      category: this.data.categories.find(c => c.id === newProduct.category_id)
    };
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;

    this.data.products[idx] = {
      ...this.data.products[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.saveToDisk();
    return this.getProductBySlugOrId(id) || null;
  }

  public deleteProduct(id: string): boolean {
    const prevLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    this.data.variants = this.data.variants.filter(v => v.product_id !== id);
    if (this.data.products.length !== prevLen) {
      this.saveToDisk();
      return true;
    }
    return false;
  }

  // --- VARIANTS ---
  public getVariantsByProductId(productId: string): ProductVariant[] {
    return this.data.variants.filter(v => v.product_id === productId);
  }

  public addVariant(productId: string, variantData: Omit<ProductVariant, 'id' | 'product_id' | 'created_at' | 'updated_at'>): ProductVariant {
    const now = new Date().toISOString();
    const newVariant: ProductVariant = {
      ...variantData,
      id: `v-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      product_id: productId,
      is_active: variantData.is_active ?? true,
      created_at: now,
      updated_at: now
    };
    this.data.variants.push(newVariant);
    this.saveToDisk();
    return newVariant;
  }

  public updateVariant(id: string, updates: Partial<ProductVariant>): ProductVariant | null {
    const idx = this.data.variants.findIndex(v => v.id === id);
    if (idx === -1) return null;
    this.data.variants[idx] = {
      ...this.data.variants[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.saveToDisk();
    return this.data.variants[idx];
  }

  public deleteVariant(id: string): boolean {
    const prevLen = this.data.variants.length;
    this.data.variants = this.data.variants.filter(v => v.id !== id);
    if (this.data.variants.length !== prevLen) {
      this.saveToDisk();
      return true;
    }
    return false;
  }

  // --- DELIVERY ZONES ---
  public getDeliveryZones(activeOnly = true): DeliveryZone[] {
    return activeOnly ? this.data.delivery_zones.filter(z => z.is_active) : [...this.data.delivery_zones];
  }

  public getDeliveryZoneById(id: string): DeliveryZone | undefined {
    return this.data.delivery_zones.find(z => z.id === id);
  }

  public createDeliveryZone(zone: Omit<DeliveryZone, 'id' | 'created_at' | 'updated_at'>): DeliveryZone {
    const newZone: DeliveryZone = {
      ...zone,
      id: `d-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.delivery_zones.push(newZone);
    this.saveToDisk();
    return newZone;
  }

  public updateDeliveryZone(id: string, updates: Partial<DeliveryZone>): DeliveryZone | null {
    const idx = this.data.delivery_zones.findIndex(z => z.id === id);
    if (idx === -1) return null;
    this.data.delivery_zones[idx] = {
      ...this.data.delivery_zones[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.saveToDisk();
    return this.data.delivery_zones[idx];
  }

  public deleteDeliveryZone(id: string): boolean {
    const prevLen = this.data.delivery_zones.length;
    this.data.delivery_zones = this.data.delivery_zones.filter(z => z.id !== id);
    if (this.data.delivery_zones.length !== prevLen) {
      this.saveToDisk();
      return true;
    }
    return false;
  }

  // --- PROMOTIONS ---
  public getPromotions(activeOnly = true): Promotion[] {
    const now = new Date();
    if (!activeOnly) return [...this.data.promotions];
    return this.data.promotions.filter(p =>
      p.is_active &&
      new Date(p.start_date) <= now &&
      new Date(p.end_date) >= now &&
      (p.usage_limit === 0 || p.times_used < p.usage_limit)
    );
  }

  public validatePromotion(code: string, subtotal: number): { valid: boolean; discount: number; message?: string; promotion?: Promotion } {
    const promo = this.data.promotions.find(p => p.code.toUpperCase() === code.trim().toUpperCase());
    if (!promo || !promo.is_active) {
      return { valid: false, discount: 0, message: 'Invalid or expired coupon code.' };
    }
    const now = new Date();
    if (new Date(promo.start_date) > now || new Date(promo.end_date) < now) {
      return { valid: false, discount: 0, message: 'Coupon code has expired.' };
    }
    if (promo.usage_limit > 0 && promo.times_used >= promo.usage_limit) {
      return { valid: false, discount: 0, message: 'Coupon usage limit has been reached.' };
    }
    if (subtotal < promo.min_order_amount) {
      return { valid: false, discount: 0, message: `Minimum order of Rs. ${promo.min_order_amount} required for this coupon.` };
    }

    let discount = 0;
    if (promo.discount_type === 'percentage') {
      discount = (subtotal * promo.discount_value) / 100;
      if (promo.max_discount_amount && discount > promo.max_discount_amount) {
        discount = promo.max_discount_amount;
      }
    } else {
      discount = promo.discount_value;
    }
    discount = Math.min(discount, subtotal);
    return { valid: true, discount, promotion: promo };
  }

  public createPromotion(data: Omit<Promotion, 'id' | 'times_used' | 'created_at'>): Promotion {
    const newPromo: Promotion = {
      ...data,
      id: `pr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      code: data.code.toUpperCase(),
      times_used: 0,
      created_at: new Date().toISOString()
    };
    this.data.promotions.push(newPromo);
    this.saveToDisk();
    return newPromo;
  }

  public updatePromotion(id: string, updates: Partial<Promotion>): Promotion | null {
    const idx = this.data.promotions.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.promotions[idx] = {
      ...this.data.promotions[idx],
      ...updates
    };
    this.saveToDisk();
    return this.data.promotions[idx];
  }

  // --- EVENTS ---
  public getEvents(activeOnly = true): PromotionalEvent[] {
    const now = new Date();
    if (!activeOnly) return [...this.data.events];
    return this.data.events.filter(e =>
      e.is_active &&
      new Date(e.start_date) <= now &&
      new Date(e.end_date) >= now
    );
  }

  public createEvent(data: Omit<PromotionalEvent, 'id' | 'created_at'>): PromotionalEvent {
    const newEvent: PromotionalEvent = {
      ...data,
      id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      created_at: new Date().toISOString()
    };
    this.data.events.push(newEvent);
    this.saveToDisk();
    return newEvent;
  }

  public updateEvent(id: string, updates: Partial<PromotionalEvent>): PromotionalEvent | null {
    const idx = this.data.events.findIndex(e => e.id === id);
    if (idx === -1) return null;
    this.data.events[idx] = { ...this.data.events[idx], ...updates };
    this.saveToDisk();
    return this.data.events[idx];
  }

  public deleteEvent(id: string): boolean {
    const prevLen = this.data.events.length;
    this.data.events = this.data.events.filter(e => e.id !== id);
    if (this.data.events.length !== prevLen) {
      this.saveToDisk();
      return true;
    }
    return false;
  }

  // --- ORDER MANAGEMENT & ATOMIC INVENTORY DEDUCTION (TEST 6, 7, 8, 15) ---
  public createOrder(orderPayload: {
    customer_id?: string | null;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    delivery_address: string;
    city: string;
    delivery_zone_id: string;
    delivery_instructions?: string;
    instagram_username?: string;
    whatsapp_number?: string;
    viber_number?: string;
    payment_method: 'cod' | 'esewa';
    coupon_code?: string;
    items: Array<{
      product_id: string;
      variant_id?: string | null;
      quantity: number;
    }>;
  }): { success: boolean; order?: Order; error?: string } {
    // 1. Validate delivery zone
    const zone = this.getDeliveryZoneById(orderPayload.delivery_zone_id);
    if (!zone || !zone.is_active) {
      return { success: false, error: 'Selected delivery location is not currently serviceable.' };
    }

    if (!orderPayload.items || orderPayload.items.length === 0) {
      return { success: false, error: 'Cart is empty. Please select products to order.' };
    }

    // 2. Validate inventory availability ATOMICALLY before committing
    const resolvedItems: OrderItem[] = [];
    let calculatedSubtotal = 0;

    for (const item of orderPayload.items) {
      if (item.quantity <= 0) {
        return { success: false, error: 'Invalid product quantity specified.' };
      }

      const product = this.data.products.find(p => p.id === item.product_id);
      if (!product || product.status !== 'active') {
        return { success: false, error: `Product "${product?.name || item.product_id}" is currently unavailable.` };
      }

      let unitPrice = product.selling_price;
      let sku = product.sku;
      let variantName: string | null = null;

      if (item.variant_id) {
        const variant = this.data.variants.find(v => v.id === item.variant_id && v.product_id === product.id);
        if (!variant || !variant.is_active) {
          return { success: false, error: `Selected variant is no longer active for "${product.name}".` };
        }
        if (variant.stock_quantity < item.quantity) {
          return {
            success: false,
            error: `Insufficient stock for "${product.name} (${variant.variant_name})". Available: ${variant.stock_quantity}, Requested: ${item.quantity}.`
          };
        }
        if (variant.price_override != null) {
          unitPrice = variant.price_override;
        }
        sku = variant.sku;
        variantName = variant.variant_name;
      } else {
        if (product.stock_quantity < item.quantity) {
          return {
            success: false,
            error: `Insufficient stock for "${product.name}". Available: ${product.stock_quantity}, Requested: ${item.quantity}.`
          };
        }
      }

      const itemSubtotal = unitPrice * item.quantity;
      calculatedSubtotal += itemSubtotal;

      resolvedItems.push({
        id: `oi-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        order_id: '', // Will be assigned
        product_id: product.id,
        variant_id: item.variant_id || null,
        product_name: product.name,
        variant_name: variantName,
        sku: sku,
        unit_price: unitPrice,
        quantity: item.quantity,
        subtotal: itemSubtotal,
        created_at: new Date().toISOString()
      });
    }

    // 3. Apply promotional discounts if present
    let discountAmount = 0;
    if (orderPayload.coupon_code) {
      const promoResult = this.validatePromotion(orderPayload.coupon_code, calculatedSubtotal);
      if (promoResult.valid) {
        discountAmount = promoResult.discount;
        if (promoResult.promotion) {
          promoResult.promotion.times_used += 1;
        }
      }
    }

    const deliveryFee = Number(zone.fee);
    const totalAmount = Math.max(0, calculatedSubtotal + deliveryFee - discountAmount);

    // 4. ATOMIC STOCK DEDUCTION & INVENTORY MOVEMENT LOGGING
    const orderNumber = `CLV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const trackingCode = `NP-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = `ord-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const now = new Date().toISOString();

    for (const item of resolvedItems) {
      item.order_id = orderId;
      const product = this.data.products.find(p => p.id === item.product_id)!;

      if (item.variant_id) {
        const variant = this.data.variants.find(v => v.id === item.variant_id)!;
        const prevStock = variant.stock_quantity;
        variant.stock_quantity -= item.quantity;
        variant.updated_at = now;

        // Log movement
        this.data.inventory_movements.push({
          id: `im-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          product_id: product.id,
          variant_id: variant.id,
          change_type: 'order_deduction',
          quantity: item.quantity,
          previous_stock: prevStock,
          new_stock: variant.stock_quantity,
          reason: `Customer Order ${orderNumber}`,
          reference_id: orderId,
          created_at: now
        });
      } else {
        const prevStock = product.stock_quantity;
        product.stock_quantity -= item.quantity;
        product.updated_at = now;

        this.data.inventory_movements.push({
          id: `im-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          product_id: product.id,
          variant_id: null,
          change_type: 'order_deduction',
          quantity: item.quantity,
          previous_stock: prevStock,
          new_stock: product.stock_quantity,
          reason: `Customer Order ${orderNumber}`,
          reference_id: orderId,
          created_at: now
        });
      }
    }

    // 5. Store customer record if not exists
    let customerId = orderPayload.customer_id;
    if (!customerId) {
      const existingCust = this.data.customers.find(c => c.email.toLowerCase() === orderPayload.customer_email.toLowerCase());
      if (existingCust) {
        customerId = existingCust.id;
      } else {
        customerId = `cust-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
        this.data.customers.push({
          id: customerId,
          full_name: orderPayload.customer_name,
          email: orderPayload.customer_email,
          phone: orderPayload.customer_phone,
          city: orderPayload.city,
          address: orderPayload.delivery_address,
          instagram_handle: orderPayload.instagram_username,
          whatsapp_number: orderPayload.whatsapp_number,
          viber_number: orderPayload.viber_number,
          created_at: now,
          updated_at: now
        });
      }
    }

    const newOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      customer_id: customerId,
      customer_name: orderPayload.customer_name,
      customer_email: orderPayload.customer_email,
      customer_phone: orderPayload.customer_phone,
      delivery_address: orderPayload.delivery_address,
      city: orderPayload.city,
      delivery_zone_id: orderPayload.delivery_zone_id,
      delivery_zone: zone,
      delivery_instructions: orderPayload.delivery_instructions,
      instagram_username: orderPayload.instagram_username,
      whatsapp_number: orderPayload.whatsapp_number,
      viber_number: orderPayload.viber_number,
      subtotal: calculatedSubtotal,
      delivery_fee: deliveryFee,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      payment_method: orderPayload.payment_method,
      payment_status: orderPayload.payment_method === 'cod' ? 'pending' : 'pending',
      order_status: 'pending',
      tracking_code: trackingCode,
      items: resolvedItems,
      created_at: now,
      updated_at: now
    };

    this.data.orders.push(newOrder);
    this.saveToDisk();

    return { success: true, order: newOrder };
  }

  public getOrders(filters?: { status?: string; search?: string; customerEmail?: string }): Order[] {
    let list = [...this.data.orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    if (filters?.status) {
      list = list.filter(o => o.order_status === filters.status);
    }
    if (filters?.customerEmail) {
      list = list.filter(o => o.customer_email.toLowerCase() === filters.customerEmail?.toLowerCase());
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(o =>
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.includes(q) ||
        o.tracking_code.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public getOrderByIdOrNumber(idOrNum: string): Order | undefined {
    return this.data.orders.find(o =>
      o.id === idOrNum ||
      o.order_number.toUpperCase() === idOrNum.trim().toUpperCase() ||
      o.tracking_code.toUpperCase() === idOrNum.trim().toUpperCase()
    );
  }

  public updateOrderStatus(orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus, notes?: string): Order | null {
    const order = this.data.orders.find(o => o.id === orderId);
    if (!order) return null;

    const previousStatus = order.order_status;
    order.order_status = status;
    if (paymentStatus) {
      order.payment_status = paymentStatus;
    }
    if (notes) {
      order.admin_notes = notes;
    }
    order.updated_at = new Date().toISOString();

    // If order was cancelled and previous wasn't cancelled, restock items!
    if (status === 'cancelled' && previousStatus !== 'cancelled' && order.items) {
      const now = new Date().toISOString();
      for (const item of order.items) {
        if (item.variant_id) {
          const variant = this.data.variants.find(v => v.id === item.variant_id);
          if (variant) {
            const prev = variant.stock_quantity;
            variant.stock_quantity += item.quantity;
            this.data.inventory_movements.push({
              id: `im-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
              product_id: item.product_id,
              variant_id: variant.id,
              change_type: 'cancellation_restock',
              quantity: item.quantity,
              previous_stock: prev,
              new_stock: variant.stock_quantity,
              reason: `Restock on Cancellation of Order ${order.order_number}`,
              reference_id: order.id,
              created_at: now
            });
          }
        } else {
          const prod = this.data.products.find(p => p.id === item.product_id);
          if (prod) {
            const prev = prod.stock_quantity;
            prod.stock_quantity += item.quantity;
            this.data.inventory_movements.push({
              id: `im-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
              product_id: prod.id,
              variant_id: null,
              change_type: 'cancellation_restock',
              quantity: item.quantity,
              previous_stock: prev,
              new_stock: prod.stock_quantity,
              reason: `Restock on Cancellation of Order ${order.order_number}`,
              reference_id: order.id,
              created_at: now
            });
          }
        }
      }
    }

    this.saveToDisk();
    return order;
  }

  // --- CANCELLATIONS, RETURNS & 50% REFUNDS (SECTION 14) ---
  public requestCancellation(orderNumber: string, reason: string): { success: boolean; request?: CancellationRequest; error?: string } {
    const order = this.getOrderByIdOrNumber(orderNumber);
    if (!order) {
      return { success: false, error: 'Order not found with provided reference.' };
    }
    if (['shipped', 'out_for_delivery', 'delivered', 'cancelled'].includes(order.order_status)) {
      return { success: false, error: `Order cannot be cancelled at status "${order.order_status}". Returns must be requested after delivery.` };
    }

    const existing = this.data.cancellation_requests.find(c => c.order_id === order.id && c.status === 'requested');
    if (existing) {
      return { success: false, error: 'A cancellation request is already pending review for this order.' };
    }

    const newReq: CancellationRequest = {
      id: `can-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      order_id: order.id,
      order_number: order.order_number,
      customer_id: order.customer_id,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      reason,
      status: 'requested',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.data.cancellation_requests.push(newReq);
    this.saveToDisk();
    return { success: true, request: newReq };
  }

  public getCancellationRequests(): CancellationRequest[] {
    return [...this.data.cancellation_requests].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public reviewCancellation(requestId: string, action: 'approve' | 'reject', adminNotes?: string): CancellationRequest | null {
    const req = this.data.cancellation_requests.find(r => r.id === requestId);
    if (!req) return null;

    req.status = action === 'approve' ? 'approved' : 'rejected';
    req.admin_notes = adminNotes;
    req.updated_at = new Date().toISOString();

    if (action === 'approve') {
      this.updateOrderStatus(req.order_id, 'cancelled', undefined, `Cancellation approved: ${adminNotes || 'Customer requested'}`);
    }

    this.saveToDisk();
    return req;
  }

  public requestReturn(orderNumber: string, reason: string, photoUrls: string[]): { success: boolean; request?: ReturnRequest; error?: string } {
    const order = this.getOrderByIdOrNumber(orderNumber);
    if (!order) {
      return { success: false, error: 'Order not found with specified reference.' };
    }

    const newReq: ReturnRequest = {
      id: `ret-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      order_id: order.id,
      order_number: order.order_number,
      customer_id: order.customer_id,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      reason,
      photo_urls: photoUrls || [],
      status: 'requested',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.data.return_requests.push(newReq);

    // Auto-create corresponding 50% refund evaluation record as per CLEVARA policy
    // Refund is 50% of eligible product subtotal (excluding delivery fee)
    const productSubtotal = order.subtotal;
    const standard50PercentAmount = Math.round((productSubtotal * 0.5) * 100) / 100;

    const refundReq: RefundRequest = {
      id: `ref-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      return_request_id: newReq.id,
      order_id: order.id,
      order_number: order.order_number,
      customer_id: order.customer_id,
      requested_amount: standard50PercentAmount,
      approved_refund_amount: 0,
      refund_percentage: 50,
      status: 'requested',
      admin_notes: 'Initial claim registered under CLEVARA 50% standard policy. Awaiting physical condition review.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.data.refund_requests.push(refundReq);
    this.saveToDisk();

    return { success: true, request: newReq };
  }

  public getReturnRequests(): ReturnRequest[] {
    return [...this.data.return_requests].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getRefundRequests(): RefundRequest[] {
    return [...this.data.refund_requests].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public reviewRefund(refundId: string, status: 'approved' | 'processed' | 'completed' | 'rejected', approvedAmount?: number, adminNotes?: string): RefundRequest | null {
    const refund = this.data.refund_requests.find(r => r.id === refundId);
    if (!refund) return null;

    refund.status = status;
    if (approvedAmount !== undefined) {
      refund.approved_refund_amount = approvedAmount;
    }
    if (adminNotes) {
      refund.admin_notes = adminNotes;
    }
    if (status === 'completed' || status === 'processed') {
      refund.processed_at = new Date().toISOString();
      const order = this.data.orders.find(o => o.id === refund.order_id);
      if (order) {
        order.payment_status = 'partially_refunded';
        order.order_status = 'refunded';
      }
    }
    refund.updated_at = new Date().toISOString();
    this.saveToDisk();
    return refund;
  }

  // --- REVIEWS ---
  public getReviewsByProduct(productId: string): Review[] {
    return this.data.reviews.filter(r => r.product_id === productId && r.is_approved);
  }

  public getAllReviews(): Review[] {
    return [...this.data.reviews].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public createReview(data: Omit<Review, 'id' | 'is_approved' | 'created_at'>): Review {
    const newRev: Review = {
      ...data,
      id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      is_approved: true, // Auto-approve or admin moderation toggle
      created_at: new Date().toISOString()
    };
    this.data.reviews.push(newRev);
    this.saveToDisk();
    return newRev;
  }

  public moderateReview(id: string, isApproved: boolean): Review | null {
    const rev = this.data.reviews.find(r => r.id === id);
    if (!rev) return null;
    rev.is_approved = isApproved;
    this.saveToDisk();
    return rev;
  }

  // --- CONTACT MESSAGES & COMPLAINTS (SECTION 16) ---
  public createContactMessage(msg: Omit<ContactMessage, 'id' | 'status' | 'created_at'>): ContactMessage {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'new',
      created_at: new Date().toISOString()
    };
    this.data.contact_messages.push(newMsg);
    this.saveToDisk();
    return newMsg;
  }

  public getContactMessages(): ContactMessage[] {
    return [...this.data.contact_messages].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public updateContactMessageStatus(id: string, status: ContactMessage['status'], adminNotes?: string): ContactMessage | null {
    const msg = this.data.contact_messages.find(m => m.id === id);
    if (!msg) return null;
    msg.status = status;
    if (adminNotes) msg.admin_notes = adminNotes;
    this.saveToDisk();
    return msg;
  }

  // --- WEBSITE CONTENT ---
  public getWebsiteContent(key?: string): WebsiteContent[] | WebsiteContent | null {
    if (key) {
      return this.data.website_content.find(w => w.section_key === key && w.is_active) || null;
    }
    return [...this.data.website_content];
  }

  public updateWebsiteContent(sectionKey: string, updates: Partial<WebsiteContent>): WebsiteContent {
    const idx = this.data.website_content.findIndex(w => w.section_key === sectionKey);
    const now = new Date().toISOString();
    if (idx !== -1) {
      this.data.website_content[idx] = {
        ...this.data.website_content[idx],
        ...updates,
        updated_at: now
      };
      this.saveToDisk();
      return this.data.website_content[idx];
    } else {
      const newEntry: WebsiteContent = {
        id: `wc-${Date.now()}`,
        section_key: sectionKey,
        title: updates.title || sectionKey,
        subtitle: updates.subtitle,
        content_json: updates.content_json || {},
        is_active: updates.is_active ?? true,
        updated_at: now
      };
      this.data.website_content.push(newEntry);
      this.saveToDisk();
      return newEntry;
    }
  }

  // --- CUSTOMERS & ADMIN PROFILE ---
  public getCustomers(): Customer[] {
    return [...this.data.customers];
  }

  public getAdminByEmail(email: string): AdminProfile | undefined {
    return this.data.admin_profiles.find(a => a.email.toLowerCase() === email.trim().toLowerCase());
  }

  public getInventoryMovements(): InventoryMovement[] {
    return [...this.data.inventory_movements].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getDashboardOverview() {
    const totalOrders = this.data.orders.length;
    const totalSalesRevenue = this.data.orders
      .filter(o => o.order_status !== 'cancelled')
      .reduce((sum, o) => sum + o.total_amount, 0);

    const pendingOrders = this.data.orders.filter(o => o.order_status === 'pending').length;
    const deliveredOrders = this.data.orders.filter(o => o.order_status === 'delivered').length;
    const cancelledOrders = this.data.orders.filter(o => o.order_status === 'cancelled').length;

    // Calculate approximate inventory valuation & identify low stock items
    let inventoryValuation = 0;
    const lowStockAlerts: Array<{ id: string; name: string; sku: string; stock: number; threshold: number }> = [];

    for (const p of this.data.products) {
      inventoryValuation += p.selling_price * p.stock_quantity;
      if (p.stock_quantity <= 5) {
        lowStockAlerts.push({
          id: p.id,
          name: p.name,
          sku: p.sku,
          stock: p.stock_quantity,
          threshold: 5
        });
      }
    }

    for (const v of this.data.variants) {
      const parent = this.data.products.find(p => p.id === v.product_id);
      const price = v.price_override || parent?.selling_price || 0;
      inventoryValuation += price * v.stock_quantity;
      if (v.stock_quantity <= 5) {
        lowStockAlerts.push({
          id: v.id,
          name: `${parent?.name || 'Product'} (${v.variant_name})`,
          sku: v.sku,
          stock: v.stock_quantity,
          threshold: 5
        });
      }
    }

    return {
      totalOrders,
      totalSalesRevenue,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      inventoryValuation,
      lowStockAlerts,
      recentOrders: this.getOrders().slice(0, 5)
    };
  }
}

export const db = new DatabaseService();
