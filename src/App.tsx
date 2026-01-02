import { useAuth0 } from '@auth0/auth0-react';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { Box, Spinner, Center, Text, VStack } from '@chakra-ui/react';
import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';

function App() {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Fetch the access token when authenticated
  useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          setAccessToken(token);
        } catch (error) {
          console.error('Error getting access token:', error);
        }
      }
    };
    getToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  // Create Apollo Client with authentication header
  const apolloClient = useMemo(() => {
    const httpLink = new HttpLink({
      uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql',
    });

    const authLink = new ApolloLink((operation, forward) => {
      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      }));
      return forward(operation);
    });

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });
  }, [accessToken]);

  // Show loading spinner while Auth0 is initializing
  if (isLoading) {
    return (
      <Center h="100vh">
        <VStack gap={4}>
          <Spinner size="xl" color="brand.500" />
          <Text color="gray.600">Loading...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        <Box minH="100vh">
          <Navbar />
          <Box as="main" pt="80px" px={4}>
            <Routes>
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <div>Dashboard</div>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/login"
                element={
                  isAuthenticated ? (
                    <Navigate to="/" replace />
                  ) : (
                    <LoginPage />
                  )
                }
              />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ApolloProvider>
  )
}

export default App
