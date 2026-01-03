import { useAuth0 } from '@auth0/auth0-react';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { Box, Spinner, Center } from '@chakra-ui/react';
import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/DashBoard';

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

  // Determine what to render for home route
  const getHomeElement = () => {
    if (isLoading) {
      return (
        <Center h="calc(100vh - 80px)">
          <Spinner size="xl" color="brand.500" />
        </Center>
      );
    }
    if (isAuthenticated) {
      return <Dashboard />;
    }
    return <Navigate to="/login" replace />;
  };

  // Determine what to render for login route
  const getLoginElement = () => {
    if (isLoading) {
      return (
        <Center h="calc(100vh - 80px)">
          <Spinner size="xl" color="brand.500" />
        </Center>
      );
    }
    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return <LoginPage />;
  };

  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        <Box minH="100vh" w="100vw">
          <Navbar />
          <Box as="main" pt="80px" w="100%" minH="100vh" px={5}>
            <Routes>
              <Route path="/" element={getHomeElement()} />
              <Route path="/login" element={getLoginElement()} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ApolloProvider>
  )
}

export default App
