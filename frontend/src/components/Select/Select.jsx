import styled from 'styled-components';
import { FaChevronDown } from 'react-icons/fa';

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
  position: relative;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledSelect = styled.select.withConfig({
  shouldForwardProp: (prop) => prop !== 'error',
})`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  padding-right: 2.5rem;
  font-size: 1rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.3s ease;
  background-color: ${({ theme }) => theme.colors.white};
  appearance: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}22;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  ${({ error, theme }) =>
    error &&
    `
    border-color: ${theme.colors.danger};
  `}

  option {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${({ theme }) => theme.colors.textLight};
  display: flex;
  align-items: center;
`;

const ErrorMessage = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.danger};
`;

const Select = ({ label, error, ...props }) => {
  return (
    <SelectContainer>
      {label && <Label>{label}</Label>}
      <SelectWrapper>
        <StyledSelect error={error} {...props} />
        <IconWrapper>
          <FaChevronDown size={14} />
        </IconWrapper>
      </SelectWrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </SelectContainer>
  );
};

export default Select;

