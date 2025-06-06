import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Product, CreateSpecialPriceDto, LoadingState, PublicUser } from '@/types';
import { specialPriceService } from '@/services/specialPriceService';
import { productService } from '@/services/productService';
import { userService } from '@/services/userService';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
`;

const FormContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  max-width: 600px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Select = styled.select`
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  min-height: 2.5rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  min-height: 4rem;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const PriceCalculation = styled.div`
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.375rem;
  margin: 1rem 0;
`;

const SuccessMessage = styled.div`
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
  padding: 1rem;
  border-radius: 0.375rem;
  margin: 1rem 0;
`;

const ErrorMessage = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem;
  border-radius: 0.375rem;
  margin: 1rem 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const FlexButton = styled(Button)`
  flex: 1;
`;

/**
 * Interface for edit mode navigation state
 */
interface EditModeState {
  editMode: boolean;
  productId: string;
  productName: string;
  productPrice: number;
  userId: string;
  userName: string;
  userEmail: string;
  specialPrice: number;
  discount: number;
}

/**
 * Upload Page Component
 * Form to create or edit special price entries for users
 */
const UploadPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editState = location.state as EditModeState | null;
  const isEditMode = editState?.editMode || false;

  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CreateSpecialPriceDto>(() => {
    if (isEditMode && editState) {
      return {
        userId: editState.userId,
        userName: editState.userName,
        email: editState.userEmail,
        productId: editState.productId,
        productName: editState.productName,
        specialPrice: editState.specialPrice,
        discount: editState.discount,
        notes: ''
      };
    }
    return {
      userId: '',
      userName: '',
      email: '',
      productId: '',
      productName: '',
      specialPrice: 0,
      discount: 0,
      notes: ''
    };
  });

  // Load products and users for selection
  useEffect(() => {
    const loadData = async () => {
      setLoadingState(LoadingState.LOADING);
      try {
        const [productsData, usersData] = await Promise.all([
          productService.getAllProducts(),
          userService.getAllPublicUsers()
        ]);
        setProducts(productsData);
        setUsers(usersData);
        setLoadingState(LoadingState.SUCCESS);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading data');
        setLoadingState(LoadingState.ERROR);
      }
    };

    loadData();
  }, []);

  // Handle user selection
  const handleUserChange = (userId: string) => {
    const selectedUser = users.find(u => u._id === userId);
    if (selectedUser) {
      setFormData(prev => ({
        ...prev,
        userId: userId,
        userName: selectedUser.name,
        email: selectedUser.email
      }));
    }
  };

  // Handle product selection
  const handleProductChange = (productId: string) => {
    const selectedProduct = products.find(p => p._id === productId);
    if (selectedProduct) {
      const price = selectedProduct.price || 0;
      setFormData(prev => ({
        ...prev,
        productId: productId,
        productName: selectedProduct.name,
        specialPrice: price * 0.9, // Default 10% discount
        discount: 10
      }));
    }
  };

  // Calculate discount percentage
  const calculateDiscount = (originalPrice: number, specialPrice: number) => {
    if (originalPrice <= 0) return 0;
    return Math.round(((originalPrice - specialPrice) / originalPrice) * 100);
  };

  // Handle special price change
  const handleSpecialPriceChange = (value: number) => {
    const selectedProduct = products.find(p => p._id === formData.productId);
    if (selectedProduct) {
      const price = selectedProduct.price || 0;
      const discount = calculateDiscount(price, value);
      setFormData(prev => ({
        ...prev,
        specialPrice: value,
        discount: discount
      }));
    }
  };

  // Handle discount change
  const handleDiscountChange = (discount: number) => {
    const selectedProduct = products.find(p => p._id === formData.productId);
    if (selectedProduct) {
      const price = selectedProduct.price || 0;
      const specialPrice = price * (1 - discount / 100);
      setFormData(prev => ({
        ...prev,
        specialPrice: Math.round(specialPrice * 100) / 100,
        discount: discount
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSuccess(null);
    setError(null);

    try {
      if (isEditMode) {
        // Get the existing special price ID
        const existingSpecialPrice = await specialPriceService.getSpecialPriceByUserAndProduct(
          formData.userId,
          formData.productId
        );
        
        if (existingSpecialPrice._id) {
          await specialPriceService.updateSpecialPrice(existingSpecialPrice._id, formData);
          setSuccess('Precio especial actualizado exitosamente');
          
          // Navigate back to products page
          setTimeout(() => {
            navigate('/articulos');
          }, 2000);
        } else {
          throw new Error('No se pudo encontrar el precio especial para actualizar');
        }
      } else {
        await specialPriceService.createSpecialPrice(formData);
        setSuccess('Precio especial creado exitosamente');
        
        // Reset form
        setFormData({
          userId: '',
          userName: '',
          email: '',
          productId: '',
          productName: '',
          specialPrice: 0,
          discount: 0,
          notes: ''
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Error ${isEditMode ? 'updating' : 'creating'} special price`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const selectedProduct = products.find(p => p._id === formData.productId);
  const savings = selectedProduct ? (selectedProduct.price || 0) - formData.specialPrice : 0;

  return (
    <PageContainer>
      <Title>{isEditMode ? 'Editar Precio Especial' : 'Subida de Precios Especiales'}</Title>
      
      <FormContainer>
        <Form onSubmit={handleSubmit}>
          <h2>{isEditMode ? 'Editar Precio Especial' : 'Agregar Precio Especial'}</h2>
          
          {success && <SuccessMessage>{success}</SuccessMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <FormField>
            <label>Usuario</label>
            <Select
              value={formData.userId}
              onChange={(e) => handleUserChange(e.target.value)}
              required
            >
              <option value="">Seleccionar usuario...</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email}) - {user.rol}
                </option>
              ))}
            </Select>
          </FormField>

          {formData.userId && (
            <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.375rem', marginBottom: '1rem' }}>
              <h4>Usuario Seleccionado:</h4>
              <p><strong>Nombre:</strong> {formData.userName}</p>
              <p><strong>Email:</strong> {formData.email}</p>
            </div>
          )}

          <FormField>
            <label>Producto</label>
            <Select
              value={formData.productId}
              onChange={(e) => handleProductChange(e.target.value)}
              required
            >
              <option value="">Seleccionar producto...</option>
              {products.map(product => (
                <option key={product._id} value={product._id}>
                  {product.name} - ${(product.price || 0).toFixed(2)}
                </option>
              ))}
            </Select>
          </FormField>

          {selectedProduct && (
            <PriceCalculation>
              <h3>Cálculo de Precio</h3>
              <p><strong>Precio Original:</strong> ${(selectedProduct.price || 0).toFixed(2)}</p>
              <FormRow>
                <FormField>
                  <Input
                    label="Precio Especial"
                    type="number"
                    step="0.01"
                    min="0"
                    max={selectedProduct.price || 0}
                    value={formData.specialPrice}
                    onChange={(e) => handleSpecialPriceChange(Number(e.target.value))}
                  />
                </FormField>
                <FormField>
                  <Input
                    label="Descuento (%)"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => handleDiscountChange(Number(e.target.value))}
                  />
                </FormField>
              </FormRow>
              <p><strong>Ahorro:</strong> ${(savings || 0).toFixed(2)} ({formData.discount}%)</p>
            </PriceCalculation>
          )}



          <FormField>
            <label>Notas (Opcional)</label>
            <TextArea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Información adicional sobre este precio especial..."
            />
          </FormField>

          <ButtonContainer>
            {isEditMode && (
              <FlexButton
                type="button"
                variant="outline"
                onClick={() => navigate('/articulos')}
              >
                Cancelar
              </FlexButton>
            )}
            <FlexButton
              type="submit"
              loading={submitLoading}
              disabled={!formData.userId || !formData.productId}
              fullWidth={!isEditMode}
            >
              {isEditMode ? 'Actualizar Precio Especial' : 'Crear Precio Especial'}
            </FlexButton>
          </ButtonContainer>
        </Form>
      </FormContainer>
    </PageContainer>
  );
};

export default UploadPage; 