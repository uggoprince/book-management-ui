import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Button,
  Table,
  IconButton,
  HStack,
  Text,
  Spinner,
  useDisclosure,
  Badge,
  Tooltip,
  createToaster,
  Toaster,
} from '@chakra-ui/react';
import { Alert } from '@chakra-ui/react/alert';
import { useQuery, useMutation } from '@apollo/client/react';
import { FiEdit2, FiTrash2, FiPlus, FiRefreshCw } from 'react-icons/fi';
import { GET_BOOKS, DELETE_BOOK } from '../graphql/operations';
import type { Book, GetBooksData } from '../types/book';
import BookModal from '../components/BookModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

// Create toaster instance
const toaster = createToaster({
  placement: 'top-end',
  duration: 3000,
});

/**
 * Dashboard Page
 * Main page for managing books
 * Displays a table of books with CRUD operations
 */
const Dashboard = () => {
  const { open: isBookModalOpen, onOpen: onBookModalOpen, onClose: onBookModalClose } = useDisclosure();
  const { open: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
  
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  // Fetch all books
  const { loading, error, data, refetch } = useQuery<GetBooksData>(GET_BOOKS);

  // Delete mutation
  const [deleteBook, { loading: deleteLoading }] = useMutation(DELETE_BOOK, {
    onCompleted: () => {
      toaster.success({
        title: 'Book deleted',
        description: 'The book has been successfully deleted.',
      });
      refetch();
      onDeleteModalClose();
    },
    onError: (error) => {
      toaster.error({
        title: 'Error',
        description: error.message,
        duration: 5000,
      });
    },
  });

  // Open modal for creating a new book
  const handleCreateBook = () => {
    setSelectedBook(null);
    onBookModalOpen();
  };

  // Open modal for editing a book
  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    onBookModalOpen();
  };

  // Open delete confirmation modal
  const handleDeleteClick = (book: Book) => {
    setBookToDelete(book);
    onDeleteModalOpen();
  };

  // Confirm book deletion
  const handleConfirmDelete = () => {
    if (bookToDelete) {
      deleteBook({ variables: { id: bookToDelete.id } });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Container py={8} px={8} h={"full"} w="100%" maxW={"900px"} marginX={"auto"}>
      {/* Header */}
      <Box mb={8}>
        <HStack justify="space-between" align="center" mb={4}>
          <Heading size="lg" color="gray.800">
            My Books
          </Heading>
          <HStack gap={2}>
            <Tooltip.Root openDelay={300} closeDelay={100}>
              <Tooltip.Trigger asChild>
                <IconButton
                  aria-label="Refresh books"
                  variant="ghost"
                  onClick={() => refetch()}
                  disabled={loading}
                  bg="brand.500"
                  color="button.text"
                  _hover={{ bg: 'brand.600' }}
                >
                  <FiRefreshCw />
                </IconButton>
              </Tooltip.Trigger>
              <Tooltip.Positioner>
                <Tooltip.Content>Refresh</Tooltip.Content>
              </Tooltip.Positioner>
            </Tooltip.Root>
            
            <Button
              colorScheme="brand"
              bg="brand.500"
              color="button.text"
              _hover={{ bg: 'brand.600' }}
              onClick={handleCreateBook}
            >
              <HStack gap={2}>
                <Box as={FiPlus} />
                <Text>Add Book</Text>
              </HStack>
            </Button>
          </HStack>
        </HStack>
        <Text color="gray.600">
          Manage your book collection. Create, edit, or delete books.
        </Text>
      </Box>

      {/* Error State */}
      {error && (
        <Alert.Root status="error" mb={6} borderRadius="md">
          <Alert.Indicator />
          <Alert.Description>{error.message}</Alert.Description>
        </Alert.Root>
      )}

      {/* Loading State */}
      {loading && (
        <Box textAlign="center" py={20}>
          <Spinner size="xl" color="brand.500" />
          <Text mt={4} color="gray.600">
            Loading books...
          </Text>
        </Box>
      )}

      {/* Books Table */}
      {!loading && !error && (
        <Box p={2}
            bg="white" borderRadius="lg" boxShadow="sm"
            border="1px" borderColor="gray.200" overflow="auto">
          <Table.Root variant="line" maxH={"500px"} overflowY={"auto"}>
            <Table.Header bg="gray.50">
              <Table.Row>
                <Table.ColumnHeader>ID</Table.ColumnHeader>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>Description</Table.ColumnHeader>
                <Table.ColumnHeader>Created</Table.ColumnHeader>
                <Table.ColumnHeader>Updated</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.books?.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6} textAlign="center" py={10}>
                    <Text color="gray.500">
                      No books yet. Click "Add Book" to create your first book.
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ) : (
                data?.books?.map((book: Book) => (
                  <Table.Row key={book.id} _hover={{ bg: 'gray.50' }}>
                    <Table.Cell>
                      <Badge colorScheme="gray">{book.id}</Badge>
                    </Table.Cell>
                    <Table.Cell fontWeight="medium" color="gray.600">{book.name}</Table.Cell>
                    <Table.Cell color="gray.600">
                      <Text lineClamp={3} maxW="350px">
                        {book.description}
                      </Text>
                    </Table.Cell>
                    <Table.Cell fontSize="sm" color="gray.600">
                      {formatDate(book.createdAt)}
                    </Table.Cell>
                    <Table.Cell fontSize="sm" color="gray.600">
                      {formatDate(book.updatedAt)}
                    </Table.Cell>
                    <Table.Cell>
                      <HStack gap={0} justify="flex-end">
                        <Tooltip.Root openDelay={300} closeDelay={100}>
                          <Tooltip.Trigger asChild>
                            <IconButton
                              aria-label="Edit book"
                              size="sm"
                              variant="ghost"
                              colorScheme="blue"
                              onClick={() => handleEditBook(book)}
                            >
                              <FiEdit2 />
                            </IconButton>
                          </Tooltip.Trigger>
                          <Tooltip.Positioner>
                            <Tooltip.Content>Edit</Tooltip.Content>
                          </Tooltip.Positioner>
                        </Tooltip.Root>
                        <Tooltip.Root openDelay={300} closeDelay={100}>
                          <Tooltip.Trigger asChild>
                            <IconButton
                              aria-label="Delete book"
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => handleDeleteClick(book)}
                            >
                              <FiTrash2 />
                            </IconButton>
                          </Tooltip.Trigger>
                          <Tooltip.Positioner>
                            <Tooltip.Content>Delete</Tooltip.Content>
                          </Tooltip.Positioner>
                        </Tooltip.Root>
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Box>
      )}

      {/* Summary */}
      {!loading && !error && data?.books && data.books.length > 0 && (
        <Text mt={4} fontSize="sm" color="gray.500" textAlign="right">
          Total: {data.books.length} book{data.books.length === 1 ? '' : 's'}
        </Text>
      )}

      {/* Book Create/Edit Modal */}
      <BookModal
        isOpen={isBookModalOpen}
        onClose={onBookModalClose}
        book={selectedBook}
        onSuccess={() => {
          refetch();
          onBookModalClose();
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onConfirm={handleConfirmDelete}
        isLoading={deleteLoading}
        bookName={bookToDelete?.name || ''}
      />

      {/* Toaster for notifications */}
      <Toaster toaster={toaster}>
        {(toast) => (
          <Alert.Root status={toast.type === 'success' ? 'success' : 'error'}>
            <Alert.Indicator />
            <Box>
              {toast.title && <Alert.Title>{toast.title}</Alert.Title>}
              {toast.description && <Alert.Description>{toast.description}</Alert.Description>}
            </Box>
          </Alert.Root>
        )}
      </Toaster>
    </Container>
  );
};

export default Dashboard;
