// Book type matching the GraphQL schema
export interface Book {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Input type for creating a book
export interface CreateBookInput {
  name: string;
  description: string;
}

// Input type for updating a book
export interface UpdateBookInput {
  id: number;
  name?: string;
  description?: string;
}

// Query response types
export interface GetBooksData {
  books: Book[];
}

export interface GetBookData {
  book: Book;
}
