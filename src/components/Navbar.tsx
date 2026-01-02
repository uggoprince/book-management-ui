import {
  Box,
  Flex,
  Button,
  Text,
  HStack,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  Avatar,
} from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import { FiLogOut, FiBook } from 'react-icons/fi';

/**
 * Navbar Component
 * Displays the application header with Auth0 authentication controls
 * Shows user avatar and menu when logged in
 */
const Navbar = () => {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect();
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: globalThis.location.origin,
      },
    });
  };

  return (
    <Box
      as="nav"
      position="fixed"
      top={0}
      left={0}
      right={0}
      bg="white"
      borderBottom="1px"
      borderColor="gray.200"
      zIndex={100}
      boxShadow="sm"
    >
      <Flex
        maxW="container.xl"
        mx="auto"
        px={4}
        h="64px"
        align="center"
        justify="space-between"
      >
        {/* Logo / Brand */}
        <HStack gap={2}>
          <Box as={FiBook} fontSize="24px" color="brand.500" />
          <Text fontSize="xl" fontWeight="bold" color="brand.600">
            Books Management
          </Text>
        </HStack>

        {/* Auth Controls */}
        {isAuthenticated ? (
          <MenuRoot>
            <MenuTrigger>
              <HStack gap={3}>
                <Text fontSize="sm" color="gray.600" display={{ base: 'none', md: 'block' }}>
                  {user?.email}
                </Text>
                <Avatar.Root
                  size="sm"
                  cursor="pointer"
                >
                  <Avatar.Image src={user?.picture} />
                  <Avatar.Fallback>{user?.name?.[0] || user?.email?.[0]}</Avatar.Fallback>
                </Avatar.Root>
              </HStack>
            </MenuTrigger>
            <MenuContent>
              <MenuItem value="logout" onClick={handleLogout}>
                <Box as={FiLogOut} mr={2} />
                Sign Out
              </MenuItem>
            </MenuContent>
          </MenuRoot>
        ) : (
          <Button colorScheme="brand" variant={"surface"} onClick={handleLogin}>
            Sign In
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;
