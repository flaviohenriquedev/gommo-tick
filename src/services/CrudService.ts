import type { AxiosInstance } from "axios";

import { api } from "@/services/api";

import type { CrudFilters, PageableResponseDto } from "./crud.types";

export class CrudService<TResponse, TCreateDto = Partial<TResponse>, TUpdateDto = Partial<TResponse>> {
  constructor(
    protected readonly basePath: string,
    protected readonly client: AxiosInstance = api
  ) {}

  async getAll(): Promise<TResponse[]> {
    const response = await this.client.get<TResponse[]>(this.basePath);
    return response.data;
  }

  async getById(id: string): Promise<TResponse> {
    const response = await this.client.get<TResponse>(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(dto: TCreateDto): Promise<TResponse> {
    const response = await this.client.post<TResponse>(this.basePath, dto);
    return response.data;
  }

  async update(id: string, dto: TUpdateDto): Promise<TResponse> {
    const response = await this.client.put<TResponse>(`${this.basePath}/${id}`, dto);
    return response.data;
  }

  async remove(id: string): Promise<void> {
    await this.client.delete(`${this.basePath}/${id}`);
  }

  async getPage(page = 0, size = 20, filters: CrudFilters = {}): Promise<PageableResponseDto<TResponse>> {
    const params = new URLSearchParams({ page: String(page), size: String(size) });

    Object.entries(filters).forEach(([field, values]) => {
      values.forEach((value) => {
        if (value) {
          params.append(`filter.${field}`, value);
        }
      });
    });

    const response = await this.client.get<PageableResponseDto<TResponse>>(`${this.basePath}/page`, {
      params
    });
    return response.data;
  }
}