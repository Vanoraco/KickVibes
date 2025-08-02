interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export function ViewToggle({viewMode, onViewModeChange}: ViewToggleProps) {
  return (
    <div className="view-toggle">
      <button
        className={`view-toggle-btn ${viewMode === 'grid' ? 'view-toggle-btn-active' : ''}`}
        onClick={() => onViewModeChange('grid')}
        aria-label="Grid view"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="1" y="1" width="6" height="6" rx="1"/>
          <rect x="9" y="1" width="6" height="6" rx="1"/>
          <rect x="1" y="9" width="6" height="6" rx="1"/>
          <rect x="9" y="9" width="6" height="6" rx="1"/>
        </svg>
      </button>
      <button
        className={`view-toggle-btn ${viewMode === 'list' ? 'view-toggle-btn-active' : ''}`}
        onClick={() => onViewModeChange('list')}
        aria-label="List view"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="1" y="2" width="4" height="3" rx="1"/>
          <rect x="7" y="2" width="8" height="1" rx="0.5"/>
          <rect x="7" y="4" width="6" height="1" rx="0.5"/>
          <rect x="1" y="7" width="4" height="3" rx="1"/>
          <rect x="7" y="7" width="8" height="1" rx="0.5"/>
          <rect x="7" y="9" width="6" height="1" rx="0.5"/>
          <rect x="1" y="12" width="4" height="3" rx="1"/>
          <rect x="7" y="12" width="8" height="1" rx="0.5"/>
          <rect x="7" y="14" width="6" height="1" rx="0.5"/>
        </svg>
      </button>
    </div>
  );
}
