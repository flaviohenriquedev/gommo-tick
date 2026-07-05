export type PageableResponseDto<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type CrudFilters = Record<string, string[]>;

export type CrudEntity = {
  id: string;
};