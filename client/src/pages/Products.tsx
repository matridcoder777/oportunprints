import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../api/client';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';
import Filters from '../components/Filters';
import type { SelectedFilters } from '../components/Filters';

const EMPTY_FILTERS: SelectedFilters = {
  categories: [],
  campaigns: [],
  storeTypes: [],
  partners: [],
  languages: [],
  statuses: [],
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: '32px 40px',
    maxWidth: 1400,
    margin: '0 auto',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 700,
    margin: '0 0 4px',
  },
  count: {
    color: '#9ca3af',
    fontSize: 14,
    margin: 0,
  },
  searchBar: {
    marginBottom: 24,
  },
  searchInput: {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8,
    color: '#fff',
    padding: '10px 16px',
    fontSize: 14,
    outline: 'none',
    width: 360,
    fontFamily: 'inherit',
  },
  layout: {
    display: 'flex',
    gap: 28,
    alignItems: 'flex-start',
  },
  grid: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 20,
  },
  loading: {
    color: '#9ca3af',
    fontSize: 16,
    textAlign: 'center',
    padding: 60,
  },
  error: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 8,
    color: '#f87171',
    padding: '14px 18px',
    fontSize: 14,
  },
  empty: {
    color: '#6b7280',
    fontSize: 15,
    textAlign: 'center',
    padding: 60,
  },
};

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [filters, setFilters] = useState<SelectedFilters>(EMPTY_FILTERS);

  const [categories, setCategories] = useState<string[]>([]);
  const [campaigns, setCampaigns] = useState<string[]>([]);
  const [storeTypes, setStoreTypes] = useState<string[]>([]);
  const [partners, setPartners] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string> = {};
      if (search) params['search'] = search;
      if (filters.categories.length) params['category'] = filters.categories.join(',');
      if (filters.campaigns.length) params['campaign'] = filters.campaigns.join(',');
      if (filters.storeTypes.length) params['storeType'] = filters.storeTypes.join(',');
      if (filters.partners.length) params['partner'] = filters.partners.join(',');
      if (filters.languages.length) params['language'] = filters.languages.join(',');
      if (filters.statuses.length) params['status'] = filters.statuses.join(',');

      const res = await apiClient.get<Product[]>('/products', { params });
      const data = res.data ?? [];
      setProducts(data);

      setCategories([...new Set(data.map((p) => p.category).filter(Boolean))]);
      setCampaigns([...new Set(data.map((p) => p.campaign).filter(Boolean))]);
      setStoreTypes([...new Set(data.map((p) => p.storeType).filter(Boolean))]);
      setPartners([...new Set(data.map((p) => p.partner).filter(Boolean))]);
      setLanguages([...new Set(data.map((p) => p.language).filter(Boolean))]);
    } catch {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (search.trim()) {
        setSearchParams({ search: search.trim() });
      } else {
        setSearchParams({});
      }
    }
  };

  const handleFilterChange = (
    key: keyof SelectedFilters,
    value: string,
    checked: boolean
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: checked
        ? [...prev[key], value]
        : prev[key].filter((v) => v !== value),
    }));
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Products &amp; Projects</h1>
        {!loading && (
          <p style={styles.count}>{products.length} product(s) found</p>
        )}
      </div>

      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="Search products by name, SKU…"
          style={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKey}
        />
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.layout}>
        <Filters
          categories={categories}
          campaigns={campaigns}
          storeTypes={storeTypes}
          partners={partners}
          languages={languages}
          selectedFilters={filters}
          onChange={handleFilterChange}
        />

        {loading ? (
          <div style={{ ...styles.loading, flex: 1 }}>Loading products…</div>
        ) : products.length === 0 ? (
          <div style={{ ...styles.empty, flex: 1 }}>No products found.</div>
        ) : (
          <div style={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
