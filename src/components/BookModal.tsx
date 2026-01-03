import { useEffect } from 'react';
import {
  Dialog,
  Button,
  Input,
  Textarea,
  VStack,
  createToaster,
  Field,
} from '@chakra-ui/react';
import { useMutation } from '@apollo/client/react';
import { useForm } from '../hooks/useForm';
import { CREATE_BOOK, UPDATE_BOOK } from '../graphql/operations';
import type { Book, CreateBookInput, UpdateBookInput } from '../types/book';

// Create toaster instance
const toaster = createToaster({
  placement: 'top-end',
  duration: 3000,
});

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null; // null for create, Book object for edit
  onSuccess: () => void;
}

/**
 * BookModal Component
 * Modal dialog for creating and editing books
 * Uses controlled form inputs with validation
 */
const BookModal = ({ isOpen, onClose, book, onSuccess }: BookModalProps) => {
  const isEditMode = !!book;

  // Form state management
  const { values, errors, handleChange, setValues, validate, reset } = useForm({
    name: '',
    description: '',
  });

  // Reset form when modal opens/closes or book changes
  useEffect(() => {
    if (isOpen) {
      if (book) {
        setValues({
          name: book.name,
          description: book.description,
        });
      } else {
        reset();
      }
    }
    // setValues and reset are now stable thanks to useCallback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, book]);

  // Create mutation
  const [createBook, { loading: createLoading }] = useMutation(CREATE_BOOK, {
    onCompleted: () => {
      toaster.success({
        title: 'Book created',
        description: 'The book has been successfully created.',
      });
      onSuccess();
    },
    onError: (error) => {
      toaster.error({
        title: 'Error',
        description: error.message,
        duration: 5000,
      });
    },
  });

  // Update mutation
  const [updateBook, { loading: updateLoading }] = useMutation(UPDATE_BOOK, {
    onCompleted: () => {
      toaster.success({
        title: 'Book updated',
        description: 'The book has been successfully updated.',
      });
      onSuccess();
    },
    onError: (error) => {
      toaster.error({
        title: 'Error',
        description: error.message,
        duration: 5000,
      });
    },
  });

  const isLoading = createLoading || updateLoading;

  // Determine button text based on loading and edit mode
  let buttonText: string;
  if (isLoading) {
    buttonText = isEditMode ? 'Updating...' : 'Creating...';
  } else {
    buttonText = isEditMode ? 'Update' : 'Create';
  }

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    const validationRules = {
      name: (value: string) => (value.trim() ? '' : 'Name is required'),
      description: (value: string) => (value.trim() ? '' : 'Description is required'),
    };

    if (!validate(validationRules)) {
      return;
    }

    if (isEditMode && book) {
      // Update existing book
      const input: UpdateBookInput = {
        id: book.id,
        name: values.name.trim(),
        description: values.description.trim(),
      };
      updateBook({ variables: { updateBookInput: input } });
    } else {
      // Create new book
      const input: CreateBookInput = {
        name: values.name.trim(),
        description: values.description.trim(),
      };
      createBook({ variables: { createBookInput: input } });
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => e.open ? undefined : onClose()}
      size="lg" placement="center">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content p={6}>
        <Dialog.Header>
          <Dialog.Title color={"AccentColor"}>{isEditMode ? 'Edit Book' : 'Add New Book'}</Dialog.Title>
          <Dialog.CloseTrigger color="gray.600" _hover={{ color: 'gray.800' }} />
        </Dialog.Header>

        <Dialog.Body>
          <VStack gap={4}>
            {/* Name Input */}
            <Field.Root invalid={!!errors.name}>
              <Field.Label>Name</Field.Label>
              <Input
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Enter book name"
                autoFocus
                color="gray.900"
                p={4}
              />
              <Field.ErrorText>{errors.name}</Field.ErrorText>
            </Field.Root>

            {/* Description Input */}
            <Field.Root invalid={!!errors.description}>
              <Field.Label>Description</Field.Label>
              <Textarea
                name="description"
                value={values.description}
                onChange={handleChange}
                placeholder="Enter book description"
                rows={4}
                color="gray.900"
                resize="vertical"
                maxH="120px"
                p={4}
              />
              <Field.ErrorText>{errors.description}</Field.ErrorText>
            </Field.Root>
          </VStack>
        </Dialog.Body>

        <Dialog.Footer py={4}>
          <Button
            variant="ghost"
            mr={3}
            onClick={onClose}
            disabled={isLoading}
            // bg="red.500"
            // color="white"
          >
            Cancel
          </Button>
          <Button
            colorScheme="brand"
            onClick={handleSubmit}
            loading={isLoading}
            bg="brand.500"
            color="button.text"
            _hover={{ bg: 'brand.600' }}
          >
            {buttonText}
          </Button>
        </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default BookModal;
