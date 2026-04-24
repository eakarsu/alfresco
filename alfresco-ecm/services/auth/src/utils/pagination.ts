import { Request } from 'express';

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
  search?: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * Parse pagination parameters from request query string.
 * Provides sensible defaults and validates input ranges.
 */
export function parsePaginationParams(
  req: Request,
  defaultSortBy: string = 'createdAt'
): PaginationParams {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 20));
  const offset = (page - 1) * limit;
  const search = (req.query.search as string) || undefined;
  const sortBy = (req.query.sortBy as string) || defaultSortBy;
  const sortOrderRaw = (req.query.sortOrder as string)?.toLowerCase();
  const sortOrder: 'asc' | 'desc' = sortOrderRaw === 'asc' ? 'asc' : 'desc';

  return { page, limit, offset, search, sortBy, sortOrder };
}

/**
 * Create a standardized paginated response object.
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / params.limit);

  return {
    data,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages,
      hasNextPage: params.page < totalPages,
      hasPrevPage: params.page > 1,
    },
  };
}
