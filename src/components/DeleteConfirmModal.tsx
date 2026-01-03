import {
  Dialog,
  Button,
  Text,
} from '@chakra-ui/react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  bookName: string;
}

/**
 * DeleteConfirmModal Component
 * Confirmation dialog for deleting a book
 */
const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  bookName,
}: DeleteConfirmModalProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => e.open ? undefined : onClose()} placement="center">
      <Dialog.Backdrop />
      <Dialog.Positioner>
      <Dialog.Content p={6}>
        <Dialog.Header>
          <Dialog.Title color={"AccentColor"}>Delete Book</Dialog.Title>
          <Dialog.CloseTrigger color="gray.600" _hover={{ color: 'gray.800' }} />
        </Dialog.Header>

        <Dialog.Body>
          <Text fontSize="md" color="gray.700">
            Are you sure you want to delete{' '}
            <Text as="span" fontWeight="bold">
              "{bookName}"
            </Text>
            ? This action cannot be undone.
          </Text>
        </Dialog.Body>

        <Dialog.Footer>
          <Button variant="ghost" mr={3} onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            onClick={onConfirm}
            loading={isLoading}
            bg="red.500"
            color="button.text"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default DeleteConfirmModal;
