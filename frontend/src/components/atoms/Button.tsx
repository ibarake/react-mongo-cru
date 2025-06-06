import React from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: #3b82f6;
        color: white;
        border: 1px solid #3b82f6;
        
        &:hover:not(:disabled) {
          background-color: #2563eb;
          border-color: #2563eb;
        }
      `;
    case 'secondary':
      return css`
        background-color: #6b7280;
        color: white;
        border: 1px solid #6b7280;
        
        &:hover:not(:disabled) {
          background-color: #4b5563;
          border-color: #4b5563;
        }
      `;
    case 'danger':
      return css`
        background-color: #ef4444;
        color: white;
        border: 1px solid #ef4444;
        
        &:hover:not(:disabled) {
          background-color: #dc2626;
          border-color: #dc2626;
        }
      `;
    case 'outline':
      return css`
        background-color: transparent;
        color: #3b82f6;
        border: 1px solid #3b82f6;
        
        &:hover:not(:disabled) {
          background-color: #3b82f6;
          color: white;
        }
      `;
    default:
      return css`
        background-color: #3b82f6;
        color: white;
        border: 1px solid #3b82f6;
      `;
  }
};

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'small':
      return css`
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        min-height: 2rem;
      `;
    case 'large':
      return css`
        padding: 0.75rem 2rem;
        font-size: 1.125rem;
        min-height: 3rem;
      `;
    default:
      return css`
        padding: 0.625rem 1.5rem;
        font-size: 1rem;
        min-height: 2.5rem;
      `;
  }
};

const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => ['variant', 'size', 'fullWidth', 'loading'].indexOf(prop) === -1,
})<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  text-decoration: none;
  line-height: 1.5;
  
  ${props => getVariantStyles(props.variant || 'primary')}
  ${props => getSizeStyles(props.size || 'medium')}
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  ${props => props.loading && css`
    opacity: 0.7;
    cursor: not-allowed;
  `}
`;

const LoadingSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

/**
 * Button Atom Component
 * Reusable button with multiple variants and states
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  onClick,
  className,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      type={type}
      onClick={onClick}
      className={className}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </StyledButton>
  );
};

export default Button; 