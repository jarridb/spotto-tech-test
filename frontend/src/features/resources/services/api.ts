import { apiRequest } from '@/lib/api-client';
import type { ResourceListResponse, ResourceDetailResponse, Provider } from '@spotto/types';

export interface ResourceListQueryParams {
  provider?: Provider;
  type?: string;
  region?: string;
  sortBy?: 'name' | 'type' | 'provider' | 'region' | 'monthlyCost' | 'tagCoverage';
  sortOrder?: 'asc' | 'desc';
}

export async function getResources(params?: ResourceListQueryParams): Promise<ResourceListResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.provider) {
    searchParams.append('provider', params.provider);
  }
  if (params?.type) {
    searchParams.append('type', params.type);
  }
  if (params?.region) {
    searchParams.append('region', params.region);
  }
  if (params?.sortBy) {
    searchParams.append('sortBy', params.sortBy);
  }
  if (params?.sortOrder) {
    searchParams.append('sortOrder', params.sortOrder);
  }

  const queryString = searchParams.toString();
  const endpoint = `/resources${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest<ResourceListResponse>(endpoint);
}

export async function getResource(id: string): Promise<ResourceDetailResponse> {
  return apiRequest<ResourceDetailResponse>(`/resources/${id}`);
}

