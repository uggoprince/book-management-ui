import { gql } from '@apollo/client';

// Book fragment for reusable fields
export const BOOK_FIELDS = gql`
  fragment BookFields on Book {
    id
    name
    description
    createdAt
    updatedAt
  }
`;

// Query to get all books
export const GET_BOOKS = gql`
  ${BOOK_FIELDS}
  query GetBooks {
    books {
      ...BookFields
    }
  }
`;

// Query to get a single book
export const GET_BOOK = gql`
  ${BOOK_FIELDS}
  query GetBook($id: Int!) {
    book(id: $id) {
      ...BookFields
    }
  }
`;

// Mutation to create a new book
export const CREATE_BOOK = gql`
  ${BOOK_FIELDS}
  mutation CreateBook($createBookInput: CreateBookInput!) {
    createBook(createBookInput: $createBookInput) {
      ...BookFields
    }
  }
`;

// Mutation to update an existing book
export const UPDATE_BOOK = gql`
  ${BOOK_FIELDS}
  mutation UpdateBook($updateBookInput: UpdateBookInput!) {
    updateBook(updateBookInput: $updateBookInput) {
      ...BookFields
    }
  }
`;

// Mutation to delete a book
export const DELETE_BOOK = gql`
  mutation DeleteBook($id: Int!) {
    deleteBook(id: $id)
  }
`;
