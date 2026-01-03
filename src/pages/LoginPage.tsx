import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import { FiBook, FiLogIn, FiUserPlus } from 'react-icons/fi';

/**
 * LoginPage Component
 * Landing page for unauthenticated users
 * Provides sign in and sign up buttons using Auth0
 */
const LoginPage = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignIn = () => {
    loginWithRedirect();
  };

  const handleSignUp = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup',
      },
    });
  };

  return (
    <Container maxW="100vw" py={10} h="fit-content" minH={"100vh"}>
      <VStack gap={8} textAlign="center">
        {/* Hero Icon */}
        <Icon as={FiBook} boxSize={20} color="brand.500" />

        {/* Title */}
        <Heading size="2xl" color="gray.800">
          Books Management
        </Heading>

        {/* Description */}
        <Text fontSize="lg" color="gray.600" maxW="md">
          A simple dashboard for managing your book collection. Sign in to
          create, edit, and organize your books.
        </Text>

        {/* Auth Buttons */}
        <Box pt={4}>
          <VStack gap={4}>
            <Button
              size="lg"
              onClick={handleSignIn}
              w="200px"
              variant="solid"
              bg="brand.500"
              color="button.text"
              _hover={{ bg: 'brand.600' }}
            >
              <HStack gap={2}>
                <Box as={FiLogIn} />
                <Text>Sign In</Text>
              </HStack>
            </Button>
            <Button
              size="lg"
              variant="solid"
              onClick={handleSignUp}
              w="200px"
              bg="brand.500"
              color="button.text"
              _hover={{ bg: 'brand.600' }}
            >
              <HStack gap={2}>
                <Box as={FiUserPlus} />
                <Text>Sign Up</Text>
              </HStack>
            </Button>
          </VStack>
        </Box>

        {/* Features */}
        <Box pt={8}>
          <VStack gap={3} color="gray.500" fontSize="sm">
            <Text>✓ Create and manage your book collection</Text>
            <Text>✓ Secure authentication with Auth0</Text>
            <Text>✓ Real-time updates with GraphQL</Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default LoginPage;
