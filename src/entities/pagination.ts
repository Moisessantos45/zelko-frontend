interface Pagination {
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  stateId?: number;
  userId?: number;
  roleId?: number;
  search?: string;
}

const initialPaginationState: Pagination = {
  total: 0,
  totalPages: 1,
  page: 1,
  pageSize: 9,
  stateId: 0,
  roleId: 0,
  search: "",
  userId: 0,
};

export type { Pagination };
export { initialPaginationState };
