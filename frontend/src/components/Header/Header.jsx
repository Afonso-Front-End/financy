import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  FaWallet,
  FaUser,
  FaSignOutAlt,
  FaChevronDown,
  FaCog,
} from 'react-icons/fa';
import Button from '../Button/Button';

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 80px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const LogoIcon = styled.div`
  width: 45px;
  height: 45px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryDark} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  margin: 0;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  position: relative;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryDark} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  flex-shrink: 0;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const UserName = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  font-size: 0.95rem;
`;

const UserRole = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.8rem;
`;

const DropdownIcon = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  transition: transform 0.3s ease;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  min-width: 200px;
  overflow: hidden;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transform: ${({ $isOpen }) =>
    $isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.3s ease;
  z-index: 1001;
`;

const DropdownItem = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }

  &:last-child {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.danger};
  }
`;

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <HeaderContainer>
      <Logo onClick={() => navigate('/dashboard')}>
        <LogoIcon>
          <FaWallet />
        </LogoIcon>
        <LogoText>Controle de Investimentos</LogoText>
      </Logo>

      <UserSection ref={dropdownRef}>
        <UserInfo onClick={() => setDropdownOpen(!dropdownOpen)}>
          <Avatar>{getInitials(user?.name)}</Avatar>
          <UserDetails>
            <UserName>{user?.name}</UserName>
            <UserRole>Usuário</UserRole>
          </UserDetails>
          <DropdownIcon $isOpen={dropdownOpen}>
            <FaChevronDown size={12} />
          </DropdownIcon>
        </UserInfo>

        <DropdownMenu $isOpen={dropdownOpen}>
          <DropdownItem onClick={() => {
            navigate('/profile');
            setDropdownOpen(false);
          }}>
            <FaUser />
            Meu Perfil
          </DropdownItem>
          <DropdownItem onClick={() => {
            navigate('/profile');
            setDropdownOpen(false);
          }}>
            <FaCog />
            Configurações
          </DropdownItem>
          <DropdownItem onClick={handleLogout}>
            <FaSignOutAlt />
            Sair
          </DropdownItem>
        </DropdownMenu>
      </UserSection>
    </HeaderContainer>
  );
};

export default Header;
