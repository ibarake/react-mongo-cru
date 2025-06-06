import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ProductWithSpecialPrice, LoadingState, PublicUser } from '@/types';
import { productService } from '@/services/productService';
import { userService } from '@/services/userService';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
`;

const UserSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const ProductsTable = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: #f9fafb;
`;

const TableHeaderCell = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:hover {
    background-color: #f9fafb;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #e5e7eb;
  }
`;

const TableCell = styled.td`
  padding: 0.75rem 1rem;
  color: #374151;
`;

const PriceCell = styled(TableCell).withConfig({
  shouldForwardProp: (prop) => prop !== 'hasSpecialPrice',
})<{ hasSpecialPrice?: boolean }>`
  font-weight: 600;
  color: ${props => props.hasSpecialPrice ? '#dc2626' : '#374151'};
`;

const SpecialPriceBadge = styled.span`
  background-color: #fef2f2;
  color: #dc2626;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #fee2e2;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;

const ErrorMessage = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem;
  border-radius: 0.375rem;
  margin: 1rem 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`;

/**
 * Products Page Component
 * Displays products table with special pricing for authenticated users
 */
const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductWithSpecialPrice[]>([]);
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserId, setCurrentUserId] = useState(''); // Selected user ID

  // Load products with special pricing
  const loadProductsWithSpecialPricing = async () => {
    if (!currentUserId) {
      // Load regular products if no user selected
      setLoadingState(LoadingState.LOADING);
      try {
        const regularProducts = await productService.getAllProducts();
        const productsWithPricing = regularProducts.map(product => ({
          ...product,
          hasSpecialPrice: false
        }));
        setProducts(productsWithPricing);
        setLoadingState(LoadingState.SUCCESS);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading products');
        setLoadingState(LoadingState.ERROR);
      }
      return;
    }

    setLoadingState(LoadingState.LOADING);
    setError(null);
    
    try {
      const productsWithSpecialPricing = await productService.getProductsWithSpecialPricing(currentUserId);
      setProducts(productsWithSpecialPricing);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading products');
      setLoadingState(LoadingState.ERROR);
    }
  };

  // Search products
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadProductsWithSpecialPricing();
      return;
    }

    setLoadingState(LoadingState.LOADING);
    try {
      const searchResults = await productService.searchProducts(searchQuery);
      const productsWithPricing = searchResults.map(product => ({
        ...product,
        hasSpecialPrice: false
      }));
      setProducts(productsWithPricing);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error searching products');
      setLoadingState(LoadingState.ERROR);
    }
  };

  // Handle special price edit click
  const handleSpecialPriceEdit = (product: ProductWithSpecialPrice) => {
    if (!currentUserId || !product.hasSpecialPrice) return;
    
    const selectedUser = users.find(u => u._id === currentUserId);
    if (!selectedUser) return;

    // Navigate to edit mode with product and user data
    navigate('/subida', {
      state: {
        editMode: true,
        productId: product._id,
        productName: product.name,
        productPrice: product.price,
        userId: currentUserId,
        userName: selectedUser.name,
        userEmail: selectedUser.email,
        specialPrice: product.specialPrice,
        discount: product.specialPrice ? Math.round(((product.price - product.specialPrice) / product.price) * 100) : 0
      }
    });
  };

  // Format price with special pricing indicator
  const formatPrice = (product: ProductWithSpecialPrice) => {
    if (product.hasSpecialPrice && product.specialPrice && typeof product.specialPrice === 'number') {
      return (
        <>
          ${product.specialPrice.toFixed(2)}
          <SpecialPriceBadge 
            onClick={() => handleSpecialPriceEdit(product)}
            title="Haz clic para editar este precio especial"
          >
            Precio Especial
          </SpecialPriceBadge>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', textDecoration: 'line-through' }}>
            ${(product.price || 0).toFixed(2)}
          </div>
        </>
      );
    }
    return `$${(product.price || 0).toFixed(2)}`;
  };

  // Load users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await userService.getAllPublicUsers();
        setUsers(usersData);
      } catch (err) {
        console.error('Error loading users:', err);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    loadProductsWithSpecialPricing();
  }, [currentUserId]);

  return (
    <PageContainer>
      <PageHeader>
        <Title>Artículos</Title>
      </PageHeader>

      <UserSelector>
        <label>Usuario actual:</label>
        <select 
          value={currentUserId} 
          onChange={(e) => setCurrentUserId(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #d1d5db' }}
        >
          <option value="">Sin usuario (precios normales)</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.email}) - {user.rol}
            </option>
          ))}
        </select>
      </UserSelector>

      <Controls>
        <Input
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch}>Buscar</Button>
        <Button variant="outline" onClick={loadProductsWithSpecialPricing}>
          Actualizar
        </Button>
      </Controls>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <ProductsTable>
        {loadingState === LoadingState.LOADING ? (
          <LoadingMessage>Cargando productos...</LoadingMessage>
        ) : products.length === 0 ? (
          <EmptyState>
            <h3>No se encontraron productos</h3>
            <p>No hay productos disponibles en este momento.</p>
          </EmptyState>
        ) : (
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>Nombre</TableHeaderCell>
                <TableHeaderCell>Descripción</TableHeaderCell>
                <TableHeaderCell>Categoría</TableHeaderCell>
                <TableHeaderCell>Precio</TableHeaderCell>
                <TableHeaderCell>Stock</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <PriceCell hasSpecialPrice={product.hasSpecialPrice}>
                    {formatPrice(product)}
                  </PriceCell>
                  <TableCell>{product.stock}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </ProductsTable>
    </PageContainer>
  );
};

export default ProductsPage; 