import styled from 'styled-components';
import { FaCalendarAlt } from 'react-icons/fa';

const DateContainer = styled.div`
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

const DateWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledDateInput = styled.input.withConfig({
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
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.primary};

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
    box-shadow: 0 0 0 3px ${theme.colors.danger}22;
  `}

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0;
    position: absolute;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }

  &::-webkit-datetime-edit {
    padding: 0;
  }

  &::-webkit-datetime-edit-fields-wrapper {
    padding: 0;
  }

  &::-webkit-datetime-edit-text {
    color: ${({ theme }) => theme.colors.textLight};
    padding: 0 0.25rem;
  }

  &::-webkit-datetime-edit-month-field,
  &::-webkit-datetime-edit-day-field,
  &::-webkit-datetime-edit-year-field {
    color: ${({ theme }) => theme.colors.text};
    padding: 0 0.25rem;
  }

  &::-webkit-datetime-edit-month-field:focus,
  &::-webkit-datetime-edit-day-field:focus,
  &::-webkit-datetime-edit-year-field:focus {
    background-color: ${({ theme }) => theme.colors.primary}22;
    color: ${({ theme }) => theme.colors.primary};
    border-radius: 4px;
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
  z-index: 1;
`;

const ErrorMessage = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.danger};
`;

const DateInput = ({ label, error, ...props }) => {
  return (
    <DateContainer>
      {label && <Label>{label}</Label>}
      <DateWrapper>
        <StyledDateInput type="date" error={error} {...props} />
        <IconWrapper>
          <FaCalendarAlt size={16} />
        </IconWrapper>
      </DateWrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </DateContainer>
  );
};

export default DateInput;

