import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Navigation from './components/organisms/Navigation';
import ProductsPage from './pages/ProductsPage';
import UploadPage from './pages/UploadPage';

// Global styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f9fafb;
    color: #111827;
    line-height: 1.5;
  }
  
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
  
  h1, h2, h3, h4, h5, h6 {
    color: #111827;
    line-height: 1.25;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  color: #1f2937;
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
`;

/**
 * Main App Component
 * Handles routing and global layout structure
 */
function App() {
  return (
    <Router>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <Title>Sistema de Gestión de Productos</Title>
          <Subtitle>Gestión de productos con precios especiales</Subtitle>
        </Header>
        
        <Navigation />
        
        <MainContent>
          <Routes>
            <Route path="/" element={<Navigate to="/articulos" replace />} />
            <Route path="/articulos" element={<ProductsPage />} />
            <Route path="/subida" element={<UploadPage />} />
            <Route path="*" element={<Navigate to="/articulos" replace />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App; 