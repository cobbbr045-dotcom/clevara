import { Router } from 'express';
import { db } from '../db/database.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET /api/products
router.get('/', (req, res) => {
  const { categoryId, search, isFeatured, sort, status } = req.query;

  // Non-admins can only see active products
  let products = db.getProducts({
    categoryId: categoryId as string | undefined,
    search: search as string | undefined,
    status: (status as string) || 'active',
    isFeatured: isFeatured !== undefined ? isFeatured === 'true' : undefined
  });

  if (sort === 'price_asc') {
    products.sort((a, b) => a.selling_price - b.selling_price);
  } else if (sort === 'price_desc') {
    products.sort((a, b) => b.selling_price - a.selling_price);
  } else if (sort === 'newest') {
    products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return res.json({ success: true, products, count: products.length });
});

// GET /api/products/:idOrSlug
router.get('/:idOrSlug', (req, res) => {
  const product = db.getProductBySlugOrId(req.params.idOrSlug);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found.' });
  }
  return res.json({ success: true, product });
});

// POST /api/products (Admin only)
router.post('/', requireAdmin, (req, res) => {
  try {
    const { name, category_id, description, selling_price, original_price, sku, stock_quantity, status, is_featured, specifications, images, variants } = req.body;

    if (!name || !category_id || !description || selling_price == null || !sku) {
      return res.status(400).json({ success: false, error: 'Missing required product fields (name, category_id, description, selling_price, sku).' });
    }

    const created = db.createProduct({
      name,
      category_id,
      description,
      selling_price: Number(selling_price),
      original_price: original_price ? Number(original_price) : null,
      sku,
      stock_quantity: Number(stock_quantity || 0),
      status: status || 'active',
      is_featured: !!is_featured,
      specifications: specifications || {},
      images: images || [],
      slug: req.body.slug,
      variants
    });

    return res.status(201).json({ success: true, product: created });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message || 'Failed to create product.' });
  }
});

// PUT /api/products/:id (Admin only)
router.put('/:id', requireAdmin, (req, res) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Product not found.' });
  }
  return res.json({ success: true, product: updated });
});

// DELETE /api/products/:id (Admin only)
router.delete('/:id', requireAdmin, (req, res) => {
  const ok = db.deleteProduct(req.params.id);
  if (!ok) {
    return res.status(404).json({ success: false, error: 'Product not found.' });
  }
  return res.json({ success: true, message: 'Product deleted successfully.' });
});

// POST /api/products/:id/variants (Admin only)
router.post('/:id/variants', requireAdmin, (req, res) => {
  const { variant_name, sku, stock_quantity, price_override, image_url, is_active } = req.body;
  if (!variant_name || !sku) {
    return res.status(400).json({ success: false, error: 'Variant name and SKU are required.' });
  }

  const variant = db.addVariant(req.params.id, {
    variant_name,
    sku,
    stock_quantity: Number(stock_quantity || 0),
    price_override: price_override != null ? Number(price_override) : null,
    image_url,
    is_active: is_active ?? true
  });

  return res.status(201).json({ success: true, variant });
});

// PUT /api/products/:id/variants/:variantId (Admin only)
router.put('/:id/variants/:variantId', requireAdmin, (req, res) => {
  const updated = db.updateVariant(req.params.variantId, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Variant not found.' });
  }
  return res.json({ success: true, variant: updated });
});

// DELETE /api/products/:id/variants/:variantId (Admin only)
router.delete('/:id/variants/:variantId', requireAdmin, (req, res) => {
  const ok = db.deleteVariant(req.params.variantId);
  if (!ok) {
    return res.status(404).json({ success: false, error: 'Variant not found.' });
  }
  return res.json({ success: true, message: 'Variant deleted successfully.' });
});

export default router;
