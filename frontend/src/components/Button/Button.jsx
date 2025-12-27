import styled from 'styled-components';

const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => !['variant', 'fullWidth', 'minWidth'].includes(prop),
})`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: 1rem;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: ${({ minWidth }) => minWidth || '120px'};
  
  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background-color: ${theme.colors.primary};
          color: ${theme.colors.white};
          &:hover {
            background-color: ${theme.colors.primaryDark};
          }
        `;
      case 'danger':
        return `
          background-color: ${theme.colors.danger};
          color: ${theme.colors.white};
          &:hover {
            background-color: ${theme.colors.dangerDark};
          }
        `;
      case 'secondary':
        return `
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.white};
          &:hover {
            opacity: 0.9;
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: ${theme.colors.primary};
          border: 2px solid ${theme.colors.primary};
          &:hover {
            background-color: ${theme.colors.primary};
            color: ${theme.colors.white};
          }
        `;
      default:
        return `
          background-color: ${theme.colors.gray};
          color: ${theme.colors.white};
          &:hover {
            opacity: 0.9;
          }
        `;
    }
  }}

  ${({ fullWidth }) => fullWidth && 'width: 100%;'}
  
  ${({ disabled }) =>
    disabled &&
    `
    opacity: 0.6;
    cursor: not-allowed;
    &:hover {
      opacity: 0.6;
    }
  `}
`;

export default Button;

