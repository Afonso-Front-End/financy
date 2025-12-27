import styled from 'styled-components';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const StyledInput = styled.input.withConfig({
  shouldForwardProp: (prop) => prop !== 'error',
})`
  padding: ${({ theme }) => theme.spacing.sm};
  font-size: 1rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.3s ease;
  background-color: ${({ theme }) => theme.colors.white};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray};
  }

  /* Remove setas dos inputs numéricos */
  &[type="number"] {
    -moz-appearance: textfield;
    
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  ${({ error, theme }) =>
    error &&
    `
    border-color: ${theme.colors.danger};
  `}
`;

const StyledSelect = styled.select.withConfig({
  shouldForwardProp: (prop) => prop !== 'error',
})`
  padding: ${({ theme }) => theme.spacing.sm};
  font-size: 1rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.3s ease;
  background-color: ${({ theme }) => theme.colors.white};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }

  ${({ error, theme }) =>
    error &&
    `
    border-color: ${theme.colors.danger};
  `}
`;

const ErrorMessage = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.danger};
`;

const Input = ({ label, error, type, ...props }) => {
  return (
    <InputContainer>
      {label && <Label>{label}</Label>}
      {type === 'select' ? (
        <StyledSelect error={error} {...props} />
      ) : (
        <StyledInput type={type} error={error} {...props} />
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};

export default Input;

