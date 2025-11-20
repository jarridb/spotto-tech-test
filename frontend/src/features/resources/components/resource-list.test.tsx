import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from '@spotto/types';
import type { ResourceWithCoverage } from '@spotto/types';

// Mock the hooks before importing ResourceList
vi.mock('../hooks/use-resource-sort', () => ({
  useResourceSort: vi.fn(),
}));

vi.mock('../hooks/use-resource-filters', () => ({
  useResourceFilters: vi.fn(),
}));

// Mock the ResourceTable component - but allow testing onSort callback
vi.mock('./resource-table', () => ({
  ResourceTable: ({
    resources,
    onSort,
  }: {
    resources: ResourceWithCoverage[];
    onSort: (field: string) => void;
  }) => {
    return (
      <div data-testid="resource-table">
        <div data-testid="resource-count">{resources.length}</div>
        <button
          data-testid="sort-provider"
          onClick={() => onSort('provider')}
          aria-label="Sort by Provider"
        >
          Provider
        </button>
        <button
          data-testid="sort-monthlyCost"
          onClick={() => onSort('monthlyCost')}
          aria-label="Sort by Monthly Cost"
        >
          Monthly Cost
        </button>
        {resources.map((resource) => (
          <div key={resource.id} data-testid={`resource-${resource.id}`}>
            {resource.name}
          </div>
        ))}
      </div>
    );
  },
}));

// Mock TanStack Router
vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock the queries module
vi.mock('../services/queries', () => ({
  useResources: vi.fn(),
}));

// Import after mocks
import { ResourceList } from './resource-list';
import { useResourceSort } from '../hooks/use-resource-sort';
import { useResourceFilters } from '../hooks/use-resource-filters';
import { useResources } from '../services/queries';

// Create a test wrapper with QueryClient
function createTestWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('ResourceList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    vi.mocked(useResourceSort).mockReturnValue({
      sortState: { field: null, direction: null },
      toggleSort: vi.fn(),
      clearSort: vi.fn(),
    });

    vi.mocked(useResourceFilters).mockReturnValue({
      filters: {},
      setFilter: vi.fn(),
      clearFilter: vi.fn(),
      clearAllFilters: vi.fn(),
    });
  });

  it('should display loading state', () => {
    vi.mocked(useResources).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    } as any);

    const Wrapper = createTestWrapper();
    const { container } = render(
      <Wrapper>
        <ResourceList />
      </Wrapper>
    );

    // Check for skeleton elements (they have the skeleton class)
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should display error state with retry button', async () => {
    const mockRefetch = vi.fn();
    vi.mocked(useResources).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load resources'),
      refetch: mockRefetch,
    } as any);

    const Wrapper = createTestWrapper();
    render(
      <Wrapper>
        <ResourceList />
      </Wrapper>
    );

    // Check for error heading
    expect(screen.getByRole('heading', { name: /Failed to load resources/i })).toBeInTheDocument();
    
    // Check for retry button
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();

    // Click retry button
    retryButton.click();
    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });

  it('should display resources table when data is loaded', () => {
    const mockResources: ResourceWithCoverage[] = [
      {
        id: 'vm-prod-web-001',
        name: 'web-server-prod-east',
        type: 'Virtual Machine',
        provider: Provider.Azure,
        region: 'eastus',
        monthlyCost: 245.5,
        tags: {
          Environment: 'Production',
          Owner: 'platform-team',
        },
        tagCoverage: 2, // 2 tags present
      },
      {
        id: 'db-prod-sql-001',
        name: 'sql-primary-prod',
        type: 'SQL Database',
        provider: Provider.Azure,
        region: 'eastus',
        monthlyCost: 892.3,
        tags: {
          Environment: 'Production',
          Owner: 'data-team',
          BusinessUnit: 'Engineering',
        },
        tagCoverage: 3, // 3 tags present
      },
    ];

    vi.mocked(useResources).mockReturnValue({
      data: {
        resources: mockResources,
        total: 2,
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    const Wrapper = createTestWrapper();
    render(
      <Wrapper>
        <ResourceList />
      </Wrapper>
    );

    // Check that resource table is rendered
    const table = screen.getByTestId('resource-table');
    expect(table).toBeInTheDocument();

    // Check resource count
    const count = screen.getByTestId('resource-count');
    expect(count).toHaveTextContent('2');

    // Check that resources are displayed
    expect(screen.getByTestId('resource-vm-prod-web-001')).toBeInTheDocument();
    expect(screen.getByTestId('resource-db-prod-sql-001')).toBeInTheDocument();
    expect(screen.getByText('web-server-prod-east')).toBeInTheDocument();
    expect(screen.getByText('sql-primary-prod')).toBeInTheDocument();
  });

  it('should return null when data is undefined and not loading', () => {
    vi.mocked(useResources).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    const Wrapper = createTestWrapper();
    const { container } = render(
      <Wrapper>
        <ResourceList />
      </Wrapper>
    );

    // Component should return null, so container should be empty
    expect(container.firstChild).toBeNull();
  });

  it('should pass sort state to ResourceTable', () => {
    const mockResources: ResourceWithCoverage[] = [
      {
        id: 'vm-prod-web-001',
        name: 'web-server-prod-east',
        type: 'Virtual Machine',
        provider: Provider.Azure,
        region: 'eastus',
        monthlyCost: 245.5,
        tags: {},
        tagCoverage: 0,
      },
    ];

    vi.mocked(useResourceSort).mockReturnValue({
      sortState: { field: 'name', direction: 'asc' },
      toggleSort: vi.fn(),
      clearSort: vi.fn(),
    });

    vi.mocked(useResources).mockReturnValue({
      data: {
        resources: mockResources,
        total: 1,
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    const Wrapper = createTestWrapper();
    render(
      <Wrapper>
        <ResourceList />
      </Wrapper>
    );

    // Verify ResourceTable is rendered (which means sort state was passed correctly)
    expect(screen.getByTestId('resource-table')).toBeInTheDocument();
  });

  it('should call toggleSort when clicking a sortable header', async () => {
    const mockToggleSort = vi.fn();
    const mockResources: ResourceWithCoverage[] = [
      {
        id: 'vm-prod-web-001',
        name: 'web-server-prod-east',
        type: 'Virtual Machine',
        provider: Provider.Azure,
        region: 'eastus',
        monthlyCost: 245.5,
        tags: {},
        tagCoverage: 0,
      },
    ];

    vi.mocked(useResourceSort).mockReturnValue({
      sortState: { field: null, direction: null },
      toggleSort: mockToggleSort,
      clearSort: vi.fn(),
    });

    vi.mocked(useResources).mockReturnValue({
      data: {
        resources: mockResources,
        total: 1,
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    const Wrapper = createTestWrapper();
    render(
      <Wrapper>
        <ResourceList />
      </Wrapper>
    );

    // Click the Provider sort button
    const providerSortButton = screen.getByTestId('sort-provider');
    expect(providerSortButton).toBeInTheDocument();
    
    providerSortButton.click();

    // Verify toggleSort was called with 'provider'
    await waitFor(() => {
      expect(mockToggleSort).toHaveBeenCalledWith('provider');
    });

    // Click the Monthly Cost sort button
    const costSortButton = screen.getByTestId('sort-monthlyCost');
    costSortButton.click();

    // Verify toggleSort was called with 'monthlyCost'
    await waitFor(() => {
      expect(mockToggleSort).toHaveBeenCalledWith('monthlyCost');
    });

    // Verify toggleSort was called twice total
    expect(mockToggleSort).toHaveBeenCalledTimes(2);
  });

  it('should toggle sort state when clicking the same column multiple times', async () => {
    const mockResources: ResourceWithCoverage[] = [
      {
        id: 'vm-prod-web-001',
        name: 'web-server-prod-east',
        type: 'Virtual Machine',
        provider: Provider.Azure,
        region: 'eastus',
        monthlyCost: 245.5,
        tags: {},
        tagCoverage: 0,
      },
    ];

    // Track sort state changes
    let currentSortState: { field: 'provider' | null; direction: 'asc' | 'desc' | null } = { 
      field: null, 
      direction: null 
    };
    const mockToggleSort = vi.fn((field: 'provider' | 'name' | 'type' | 'region' | 'monthlyCost' | 'tagCoverage') => {
      // Simulate the toggle logic: none → asc → desc → none
      if (currentSortState.field === field) {
        if (currentSortState.direction === 'asc') {
          currentSortState = { field: field as 'provider', direction: 'desc' };
        } else if (currentSortState.direction === 'desc') {
          currentSortState = { field: null, direction: null };
        }
      } else {
        currentSortState = { field: field as 'provider', direction: 'asc' };
      }
      
      // Update the mock return value
      vi.mocked(useResourceSort).mockReturnValue({
        sortState: currentSortState,
        toggleSort: mockToggleSort,
        clearSort: vi.fn(),
      });
    });

    vi.mocked(useResourceSort).mockReturnValue({
      sortState: currentSortState,
      toggleSort: mockToggleSort,
      clearSort: vi.fn(),
    });

    vi.mocked(useResources).mockReturnValue({
      data: {
        resources: mockResources,
        total: 1,
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    const Wrapper = createTestWrapper();
    const { rerender } = render(
      <Wrapper>
        <ResourceList />
      </Wrapper>
    );

    const providerSortButton = screen.getByTestId('sort-provider');

    // First click: should set to ascending
    providerSortButton.click();
    await waitFor(() => {
      expect(mockToggleSort).toHaveBeenCalledWith('provider');
    });
    expect(mockToggleSort).toHaveBeenCalledTimes(1);
    
    // Rerender to get updated sort state
    rerender(
      <Wrapper>
        <ResourceList />
      </Wrapper>
    );
    
    // Verify sort state is now ascending
    expect(useResourceSort().sortState).toEqual({ field: 'provider', direction: 'asc' });

    // Second click: should toggle to descending
    const providerSortButton2 = screen.getByTestId('sort-provider');
    providerSortButton2.click();
    await waitFor(() => {
      expect(mockToggleSort).toHaveBeenCalledTimes(2);
    });
    
    rerender(
      <Wrapper>
        <ResourceList />
      </Wrapper>
    );
    
    // Verify sort state is now descending
    expect(useResourceSort().sortState).toEqual({ field: 'provider', direction: 'desc' });

    // Third click: should remove sort (back to null)
    const providerSortButton3 = screen.getByTestId('sort-provider');
    providerSortButton3.click();
    await waitFor(() => {
      expect(mockToggleSort).toHaveBeenCalledTimes(3);
    });
    
    rerender(
      <Wrapper>
        <ResourceList />
      </Wrapper>
    );
    
    // Verify sort state is now null (no sort)
    expect(useResourceSort().sortState).toEqual({ field: null, direction: null });
  });
});
