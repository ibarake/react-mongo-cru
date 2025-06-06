import React from 'react';
import styled, { css } from 'styled-components';

interface InputProps {
  type?: 'text' | 'email' | 'number' | 'password' | 'date' | 'datetime-local';
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
  label?: string;
  id?: string;
  name?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
}

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'small':
      return css`
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        min-height: 2rem;
      `;
    case 'large':
      return css`
        padding: 0.75rem 1rem;
        font-size: 1.125rem;
        min-height: 3rem;
      `;
    default:
      return css`
        padding: 0.625rem 0.875rem;
        font-size: 1rem;
        min-height: 2.5rem;
      `;
  }
};

const Container = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  ${props => props.$fullWidth && css`width: 100%;`}
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const StyledInput = styled.input.withConfig({
  shouldForwardProp: (prop) => ['fullWidth', 'size', 'error'].indexOf(prop) === -1,
})<InputProps>`
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  transition: all 0.2s ease-in-out;
  outline: none;
  font-family: inherit;
  
  ${props => getSizeStyles(props.size || 'medium')}
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &:disabled {
    background-color: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
  }
  
  ${props => props.error && css`
    border-color: #ef4444;
    
    &:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  `}
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const ErrorMessage = styled.span`
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
`;

/**
 * Input Atom Component
 * Reusable input field with validation and different states
 */
export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  defaultValue,
  disabled = false,
  required = false,
  error = false,
  errorMessage,
  fullWidth = false,
  size = 'medium',
  label,
  id,
  name,
  min,
  max,
  step,
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  className,
  ...props
}) => {
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <Container $fullWidth={fullWidth} className={className}>
      {label && (
        <Label htmlFor={inputId}>
          {label}
          {required && <span style={{ color: '#ef4444' }}> *</span>}
        </Label>
      )}
      <StyledInput
        id={inputId}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        error={error}
        fullWidth={fullWidth}
        size={size}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        {...props}
      />
      {error && errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </Container>
  );
};

export default Input; 