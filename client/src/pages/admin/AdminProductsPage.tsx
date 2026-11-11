import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Layers,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { api } from '../../api/client.js';
import { formatNPR } from '../../utils/format.js';
import { Product, Category, ProductVariant } from '../../types/index.js';
import { useToast } from '../../context/ToastContext.js';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formSellingPrice, setFormSellingPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formStock, setFormStock] = useState('20');
  const [formStatus, setFormStatus] = useState<'active' | 'draft' | 'archived'>('active');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formImages, setFormImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Variants in Form
  const [formVariants, setFormVariants] = useState<Array<{
    variant_name: string;
    sku: string;
    stock_quantity: number;
    price_override?: number;
    image_url?: string;
  }>>([]);
  const [varName, setVarName] = useState('');
  const [varSku, setVarSku] = useState('');
  const [varStock, setVarStock] = useState('10');
  const [varPrice, setVarPrice] = useState('');

  // Specifications in Form
  const [formSpecs, setFormSpecs] = useState<Array<{ key: string; val: string }>>([
    { key: 'Volume', val: '500 ml' },
    { key: 'Packaging', val: 'Recyclable Container' }
  ]);
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');

  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.getProducts({ search: search || undefined }),
      api.getCategories()
    ])
      .then(([pRes, cRes]) => {
        if (pRes.success) setProducts(pRes.products);
        if (cRes.success) {
          setCategories(cRes.categories);
          if (!formCategory && cRes.categories.length > 0) {
            setFormCategory(cRes.categories[0].id);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [search]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory(categories[0]?.id || '');
    setFormSlug('');
    setFormDesc('');
    setFormSellingPrice('650');
    setFormOriginalPrice('');
    setFormSku(`CLV-${Date.now().toString().slice(-4)}`);
    setFormStock('25');
    setFormStatus('active');
    setFormFeatured(false);
    setFormImages(['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80']);
    setFormVariants([]);
    setFormSpecs([{ key: 'Volume', val: '500 ml' }]);
    setIsModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category_id);
    setFormSlug(prod.slug);
    setFormDesc(prod.description);
    setFormSellingPrice(String(prod.selling_price));
    setFormOriginalPrice(prod.original_price ? String(prod.original_price) : '');
    setFormSku(prod.sku);
    setFormStock(String(prod.stock_quantity));
    setFormStatus(prod.status as any);
    setFormFeatured(prod.is_featured);
    setFormImages(prod.images || []);
    setFormVariants((prod.variants || []).map(v => ({
      variant_name: v.variant_name,
      sku: v.sku,
      stock_quantity: v.stock_quantity,
      price_override: v.price_override || undefined,
      image_url: v.image_url
    })));
    const specsArray = Object.entries(prod.specifications || {}).map(([key, val]) => ({ key, val }));
    setFormSpecs(specsArray);
    setIsModalOpen(true);
  };

  const handleAddImage = () => {
    if (newImageUrl.trim() && newImageUrl.startsWith('http')) {
      setFormImages(prev => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleAddVariant = () => {
    if (!varName || !varSku) {
      error('Variant Name and SKU are required.');
      return;
    }
    setFormVariants(prev => [
      ...prev,
      {
        variant_name: varName.trim(),
        sku: varSku.trim(),
        stock_quantity: Number(varStock || 0),
        price_override: varPrice ? Number(varPrice) : undefined
      }
    ]);
    setVarName('');
    setVarSku('');
    setVarStock('10');
    setVarPrice('');
  };

  const handleAddSpec = () => {
    if (newSpecKey.trim() && newSpecVal.trim()) {
      setFormSpecs(prev => [...prev, { key: newSpecKey.trim(), val: newSpecVal.trim() }]);
      setNewSpecKey('');
      setNewSpecVal('');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCategory || !formDesc || !formSellingPrice || !formSku) {
      error('Please complete required fields.');
      return;
    }

    setSaving(true);
    const specsObject = formSpecs.reduce((acc, curr) => {
      if (curr.key) acc[curr.key] = curr.val;
      return acc;
    }, {} as Record<string, string>);

    try {
      const payload = {
        name: formName,
        category_id: formCategory,
        slug: formSlug || formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        description: formDesc,
        selling_price: Number(formSellingPrice),
        original_price: formOriginalPrice ? Number(formOriginalPrice) : null,
        sku: formSku,
        stock_quantity: Number(formStock),
        status: formStatus,
        is_featured: formFeatured,
        specifications: specsObject,
        images: formImages.length > 0 ? formImages : ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'],
        variants: formVariants
      };

      if (editingProduct) {
        const res = await api.adminUpdateProduct(editingProduct.id, payload);
        if (res.success) {
          success(`Product "${res.product.name}" updated successfully.`);
          setIsModalOpen(false);
          loadData();
        }
      } else {
        const res = await api.adminCreateProduct(payload);
        if (res.success) {
          success(`Product "${res.product.name}" created and published!`);
          setIsModalOpen(false);
          loadData();
        }
      }
    } catch (err: any) {
      error(err.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently remove "${name}" from CLEVARA catalogue?`)) {
      return;
    }

    try {
      const res = await api.adminDeleteProduct(id);
      if (res.success) {
        success(`Product removed.`);
        loadData();
      }
    } catch (err: any) {
      error(err.message || 'Failed to delete product.');
    }
  };

  const filteredProducts = selectedCat
    ? products.filter(p => p.category_id === selectedCat)
    : products;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl text-slate-900">
              Product Catalogue Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Create, update, set prices, manage variants, and audit stock levels in real time.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors shadow-soft"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search product by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
              {filteredProducts.length} Items Total
            </span>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-2 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              No products found. Click "+ Add Product" above to create an item.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4 font-semibold">Product</th>
                    <th className="py-3.5 px-4 font-semibold">Category</th>
                    <th className="py-3.5 px-4 font-semibold">SKU</th>
                    <th className="py-3.5 px-4 font-semibold">Price (NPR)</th>
                    <th className="py-3.5 px-4 font-semibold">Stock</th>
                    <th className="py-3.5 px-4 font-semibold">Variants</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map(p => {
                    const variantCount = p.variants ? p.variants.length : 0;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'}
                              alt={p.name}
                              className="w-10 h-10 rounded-xl object-cover bg-slate-100 shrink-0"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block max-w-xs truncate">{p.name}</span>
                              {p.is_featured && (
                                <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {p.category?.name || 'Unassigned'}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                          {p.sku}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900">{formatNPR(p.selling_price)}</span>
                          {p.original_price && (
                            <span className="text-[10px] text-slate-400 line-through block">
                              {formatNPR(p.original_price)}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.stock_quantity <= 5
                              ? 'bg-red-100 text-red-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {p.stock_quantity} units
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {variantCount > 0 ? (
                            <span className="font-semibold text-slate-900">{variantCount} options</span>
                          ) : (
                            <span className="text-slate-400">Standard</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            p.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                              title="Edit Product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Add / Edit Product */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h2 className="font-display font-bold text-lg text-slate-900">
                    {editingProduct ? 'Edit CLEVARA Product' : 'Add New CLEVARA Product'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Configure base specs, pricing, and variant items.
                  </p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                
                {/* Name & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CLEVARA Ceramic Shampoo"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* SKU, Stock & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">SKU *</label>
                    <input
                      type="text"
                      required
                      placeholder="CLV-XX-001"
                      value={formSku}
                      onChange={(e) => setFormSku(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Selling Price (Rs.) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formSellingPrice}
                      onChange={(e) => setFormSellingPrice(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Original Price (Rs.)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="Optional strikethrough"
                      value={formOriginalPrice}
                      onChange={(e) => setFormOriginalPrice(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Base Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formStock}
                      onChange={(e) => setFormStock(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700 cursor-pointer"
                    >
                      <option value="active">Active (Visible in Shop)</option>
                      <option value="draft">Draft (Hidden)</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="featCheck"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-800 focus:ring-emerald-700"
                    />
                    <label htmlFor="featCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                      Featured on Homepage
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide professional description..."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                {/* Image URLs */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Product Images</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                    >
                      Add Image
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formImages.map((img, i) => (
                      <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200">
                        <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormImages(formImages.filter((_, idx) => idx !== i))}
                          className="absolute inset-0 bg-red-900/60 text-white text-[9px] font-bold flex items-center justify-center opacity-0 hover:opacity-100"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Variants Builder (Section 6) */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="font-bold text-xs text-slate-900 block">
                    Product Variants (e.g. Scents, Volumes, Colors)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <input
                      type="text"
                      placeholder="Variant (e.g. Citrus)"
                      value={varName}
                      onChange={(e) => setVarName(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="SKU"
                      value={varSku}
                      onChange={(e) => setVarSku(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono uppercase"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={varStock}
                      onChange={(e) => setVarStock(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-emerald-800"
                    >
                      + Add Option
                    </button>
                  </div>

                  {formVariants.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      {formVariants.map((v, i) => (
                        <div key={i} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-slate-200">
                          <div>
                            <span className="font-bold text-slate-900">{v.variant_name}</span>
                            <span className="text-[10px] text-slate-500 font-mono ml-2">SKU: {v.sku}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-slate-600">Stock: {v.stock_quantity}</span>
                            <button
                              type="button"
                              onClick={() => setFormVariants(formVariants.filter((_, idx) => idx !== i))}
                              className="text-red-600 hover:text-red-800 text-[11px]"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-slate-950 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors shadow-soft disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Publish Product'}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
