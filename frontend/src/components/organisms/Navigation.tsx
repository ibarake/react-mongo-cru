import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NavItem = styled.li`
  display: flex;
`;

const StyledNavLink = styled(NavLink)`
  padding: 1rem 0;
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    color: #3b82f6;
  }
  
  &.active {
    color: #3b82f6;
    border-bottom-color: #3b82f6;
  }
  
  &:focus {
    outline: none;
    color: #3b82f6;
  }
`;

const IconSpan = styled.span`
  margin-right: 0.5rem;
  font-size: 1.125rem;
`;

/**
 * Navigation Organism Component
 * Main navigation menu with Artículos and Subida options
 */
const Navigation: React.FC = () => {
  return (
    <Nav>
      <NavList>
        <NavItem>
          <StyledNavLink to="/articulos">
            <IconSpan>📦</IconSpan>
            Artículos
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/subida">
            <IconSpan>⬆️</IconSpan>
            Subida
          </StyledNavLink>
        </NavItem>
      </NavList>
    </Nav>
  );
};

export default Navigation; 