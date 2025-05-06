import { Knex } from 'knex';
import { PaginatedResult, PaginationOptions } from '../types/shared.types';

export async function paginateQuery<T>(
  baseQuery: Knex.QueryBuilder,
  {
    page = 1,
    limit = 10,
    sortBy = "created_at",
    order = "desc",
  }: PaginationOptions
): Promise<PaginatedResult<T>> {
  const offset = (page - 1) * limit;

  const countQuery = baseQuery.clone().clearSelect().count("* as total");

  const results = await baseQuery
    .offset(offset)
    .limit(limit)
    .orderBy(sortBy, order);

  const countResult = await countQuery;
  const total = parseInt(String(countResult[0].total), 10);

  return {
    data: results as T[],
    total,
    page,
    limit,
  };
}
