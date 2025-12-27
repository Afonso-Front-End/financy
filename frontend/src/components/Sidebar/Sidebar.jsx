import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaChartLine, FaBriefcase, FaFileAlt, FaUser, FaPiggyBank } from 'react-icons/fa';

const SidebarContainer = styled.aside`
  width: 80px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing.md};
  height: calc(100vh - 80px);
  position: fixed;
  top: 80px;
  overflow-y: auto;
  left: 0;
  z-index: 10;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    height: auto;
    position: relative;
    top: 0;
    box-shadow: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: row;
    justify-content: space-around;
  }
`;

const NavItem = styled(NavLink)`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  position: relative;

  &:hover {
    background-color: ${({ theme }) => theme.colors.light};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 44px;
    height: 44px;
    font-size: 1.3rem;
  }
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <Nav>
        <NavItem to="/dashboard" title="Dashboard">
          <FaChartLine />
        </NavItem>
        <NavItem to="/investments" title="Investimentos">
          <FaBriefcase />
        </NavItem>
        <NavItem to="/piggybanks" title="Cofrinhos">
          <FaPiggyBank />
        </NavItem>
        <NavItem to="/reports" title="Relatórios">
          <FaFileAlt />
        </NavItem>
        <NavItem to="/profile" title="Perfil">
          <FaUser />
        </NavItem>
      </Nav>
    </SidebarContainer>
  );
};

export default Sidebar;

