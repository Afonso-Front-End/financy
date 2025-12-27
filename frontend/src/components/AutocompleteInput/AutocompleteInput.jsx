import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const AutocompleteContainer = styled.div`
  position: relative;
  width: 100%;
`;

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

const InputWrapper = styled.div`
  position: relative;
`;

const StyledInput = styled.input.withConfig({
  shouldForwardProp: (prop) => prop !== 'error',
})`
  width: 100%;
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

  ${({ error, theme }) =>
    error &&
    `
    border-color: ${theme.colors.danger};
  `}
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top: none;
  border-radius: 0 0 ${({ theme }) => theme.borderRadius.md} ${({ theme }) => theme.borderRadius.md};
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: ${({ theme }) => theme.shadows.md};
  margin: 0;
  padding: 0;
  list-style: none;
`;

const SuggestionItem = styled.li`
  padding: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.light};
  }

  ${({ $selected, theme }) =>
    $selected &&
    `
    background-color: ${theme.colors.primary}22;
  `}
`;

const ErrorMessage = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.danger};
`;

const AutocompleteInput = ({
  label,
  value,
  onChange,
  onSearch,
  placeholder,
  error,
  required,
  minChars = 2,
  ...props
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const search = async () => {
      // Se não há valor ou não atingiu o mínimo de caracteres
      if (!value || value.length < minChars) {
        // Se está focado e não há valor, mostra sugestões iniciais
        if (isFocused && !value && onSearch) {
          setLoading(true);
          try {
            const results = await onSearch('');
            setSuggestions(results);
            setShowSuggestions(results.length > 0);
            setSelectedIndex(-1);
          } catch (error) {
            console.error('Erro ao buscar sugestões:', error);
            setSuggestions([]);
            setShowSuggestions(false);
          } finally {
            setLoading(false);
          }
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
        return;
      }

      setLoading(true);
      try {
        const results = onSearch ? await onSearch(value) : [];
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(search, 300);
    return () => clearTimeout(timeoutId);
  }, [value, onSearch, minChars, isFocused]);

  const handleInputChange = (e) => {
    onChange(e);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (suggestion) => {
    onChange({ target: { value: suggestion } });
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  return (
    <AutocompleteContainer ref={containerRef}>
      <InputContainer>
        {label && <Label>{label}</Label>}
        <InputWrapper>
          <StyledInput
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsFocused(true);
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              } else if (!value && onSearch) {
                // Busca sugestões iniciais quando foca no campo vazio
                onSearch('').then(results => {
                  setSuggestions(results);
                  setShowSuggestions(results.length > 0);
                });
              }
            }}
            onBlur={() => {
              setIsFocused(false);
            }}
            placeholder={placeholder}
            error={error}
            required={required}
            {...props}
          />
          {showSuggestions && suggestions.length > 0 && (
            <SuggestionsList>
              {suggestions.map((suggestion, index) => (
                <SuggestionItem
                  key={index}
                  $selected={index === selectedIndex}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {suggestion}
                </SuggestionItem>
              ))}
            </SuggestionsList>
          )}
        </InputWrapper>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </InputContainer>
    </AutocompleteContainer>
  );
};

export default AutocompleteInput;

