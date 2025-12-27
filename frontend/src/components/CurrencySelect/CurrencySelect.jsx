import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { currencies, getCurrencyByCode } from '../../data/currencies';

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SelectContainer = styled.div`
  position: relative;
`;

const SelectButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme, $error }) => ($error ? theme.colors.danger : theme.colors.border)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.white};
  font-size: 1rem;
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 0.25rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.9rem;
  outline: none;

  &:focus {
    border-bottom-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Option = styled.div`
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }

  ${({ $selected, theme }) =>
    $selected &&
    `
    background-color: ${theme.colors.primary}20;
    color: ${theme.colors.primary};
  `}
`;

const OptionText = styled.span`
  font-size: 0.9rem;
`;

const OptionCode = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 600;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
`;

const ChevronIcon = styled.span`
  transition: transform 0.2s ease;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const CurrencySelect = ({ label, value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedCurrency = getCurrencyByCode(value);

  const filteredCurrencies = currencies.filter((currency) => {
    if (!search) return true;
    const searchUpper = search.toUpperCase();
    const searchLower = search.toLowerCase();
    return (
      currency.code.toUpperCase().startsWith(searchUpper) ||
      currency.code.toUpperCase().includes(searchUpper) ||
      currency.name.toLowerCase().startsWith(searchLower) ||
      currency.name.toLowerCase().includes(searchLower) ||
      currency.symbol.toLowerCase().includes(searchLower) ||
      currency.country.toLowerCase().includes(searchLower)
    );
  }).sort((a, b) => {
    // Prioriza resultados que começam com a busca
    const searchUpper = search.toUpperCase();
    const searchLower = search.toLowerCase();
    
    const aCodeStarts = a.code.toUpperCase().startsWith(searchUpper);
    const bCodeStarts = b.code.toUpperCase().startsWith(searchUpper);
    const aNameStarts = a.name.toLowerCase().startsWith(searchLower);
    const bNameStarts = b.name.toLowerCase().startsWith(searchLower);
    
    if (aCodeStarts && !bCodeStarts) return -1;
    if (!aCodeStarts && bCodeStarts) return 1;
    if (aNameStarts && !bNameStarts) return -1;
    if (!aNameStarts && bNameStarts) return 1;
    return 0;
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch('');
        setSelectedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (currency) => {
    onChange({ target: { value: currency.code } });
    setIsOpen(false);
    setSearch('');
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      // Se digitar uma letra, abre o dropdown e filtra
      if (e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key)) {
        setSearch(e.key.toUpperCase());
        setIsOpen(true);
        setSelectedIndex(0);
        e.preventDefault();
        return;
      }
      // Enter ou Espaço abre o dropdown
      if (e.key === 'Enter' || e.key === ' ') {
        setIsOpen(true);
        e.preventDefault();
        return;
      }
    }

    if (isOpen) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredCurrencies.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && filteredCurrencies[selectedIndex]) {
            handleSelect(filteredCurrencies[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSearch('');
          setSelectedIndex(-1);
          break;
        case 'Backspace':
          // Permite apagar a busca
          setSearch((prev) => prev.slice(0, -1));
          setSelectedIndex(0);
          break;
        default:
          // Adiciona caracteres à busca
          if (e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key)) {
            setSearch((prev) => (prev + e.key).toUpperCase());
            setSelectedIndex(0);
          }
          break;
      }
    }
  };

  return (
    <SelectWrapper ref={wrapperRef}>
      {label && <Label>{label}</Label>}
      <SelectContainer>
        <SelectButton
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          $error={error}
        >
          <span>
            {selectedCurrency
              ? `${selectedCurrency.code} - ${selectedCurrency.name} (${selectedCurrency.symbol})`
              : 'Selecione uma moeda'}
          </span>
          <ChevronIcon $open={isOpen}>▼</ChevronIcon>
        </SelectButton>
        {isOpen && (
          <Dropdown>
            <SearchInput
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Digite para buscar (ex: D, U, B, BRL, USD)..."
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
                  handleKeyDown(e);
                }
              }}
            />
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((currency, index) => (
                <Option
                  key={currency.code}
                  $selected={index === selectedIndex || currency.code === value}
                  onClick={() => handleSelect(currency)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <OptionText>
                    {currency.name} ({currency.symbol})
                  </OptionText>
                  <OptionCode>{currency.code}</OptionCode>
                </Option>
              ))
            ) : (
              <Option style={{ cursor: 'default', color: '#7f8c8d' }}>
                Nenhuma moeda encontrada
              </Option>
            )}
          </Dropdown>
        )}
      </SelectContainer>
    </SelectWrapper>
  );
};

export default CurrencySelect;

