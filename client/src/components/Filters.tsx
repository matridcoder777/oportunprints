interface FilterGroup {
  label: string;
  key: string;
  options: string[];
}

export interface SelectedFilters {
  categories: string[];
  campaigns: string[];
  storeTypes: string[];
  partners: string[];
  languages: string[];
  statuses: string[];
}

interface FiltersProps {
  categories: string[];
  campaigns: string[];
  storeTypes: string[];
  partners: string[];
  languages: string[];
  selectedFilters: SelectedFilters;
  onChange: (key: keyof SelectedFilters, value: string, checked: boolean) => void;
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 20,
    minWidth: 200,
    width: 220,
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
  heading: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  group: {
    marginBottom: 20,
  },
  groupLabel: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  checkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
    cursor: 'pointer',
  },
  checkLabel: {
    color: '#d1d5db',
    fontSize: 13,
    cursor: 'pointer',
    userSelect: 'none',
  },
  checkbox: {
    accentColor: '#22c55e',
    width: 14,
    height: 14,
    cursor: 'pointer',
  },
  clearBtn: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 6,
    color: '#9ca3af',
    fontSize: 12,
    padding: '4px 10px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    marginTop: 8,
  },
};

export default function Filters({
  categories,
  campaigns,
  storeTypes,
  partners,
  languages,
  selectedFilters,
  onChange,
}: FiltersProps) {
  const groups: FilterGroup[] = [
    { label: 'Category', key: 'categories', options: categories },
    { label: 'Campaign', key: 'campaigns', options: campaigns },
    { label: 'Store Type', key: 'storeTypes', options: storeTypes },
    { label: 'Partner', key: 'partners', options: partners },
    { label: 'Language', key: 'languages', options: languages },
    {
      label: 'Status',
      key: 'statuses',
      options: ['active', 'disabled', 'retired'],
    },
  ];

  const allSelected = Object.values(selectedFilters).every(
    (arr) => arr.length === 0
  );

  return (
    <div style={styles.panel}>
      <div style={styles.heading}>Filters</div>

      {groups.map((group) => {
        const opts = group.options.filter(Boolean);
        if (opts.length === 0) return null;
        const key = group.key as keyof SelectedFilters;
        return (
          <div key={group.key} style={styles.group}>
            <div style={styles.groupLabel}>{group.label}</div>
            {opts.map((opt) => (
              <label key={opt} style={styles.checkRow}>
                <input
                  type="checkbox"
                  style={styles.checkbox}
                  checked={selectedFilters[key].includes(opt)}
                  onChange={(e) => onChange(key, opt, e.target.checked)}
                />
                <span style={styles.checkLabel}>{opt}</span>
              </label>
            ))}
          </div>
        );
      })}

      {!allSelected && (
        <button
          style={styles.clearBtn}
          onClick={() => {
            const keys: (keyof SelectedFilters)[] = [
              'categories',
              'campaigns',
              'storeTypes',
              'partners',
              'languages',
              'statuses',
            ];
            keys.forEach((k) => {
              selectedFilters[k].forEach((v) => onChange(k, v, false));
            });
          }}
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
