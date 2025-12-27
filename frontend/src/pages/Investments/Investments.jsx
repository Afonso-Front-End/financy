import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { toast } from 'react-toastify';
import {
  FaBriefcase,
  FaPlus,
  FaArrowDown,
  FaArrowUp,
  FaRedo,
  FaMoneyBillWave,
  FaTrash,
  FaEdit,
  FaFilter,
  FaTimes,
  FaInfoCircle,
  FaSync,
  FaCalendarDay,
  FaPiggyBank,
} from 'react-icons/fa';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatCurrency';
import { currencies, getCurrencyByCode, formatCurrency as formatCurrencyWithCode } from '../../data/currencies';
import { suggestRateByType, getCDIRate, detectInvestmentType } from '../../services/financialApi';
import { searchInvestmentSuggestions, searchInvestmentTypes, getInvestmentFromSuggestion } from '../../services/investmentsApi';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import DateInput from '../../components/DateInput/DateInput';
import AutocompleteInput from '../../components/AutocompleteInput/AutocompleteInput';
import CurrencySelect from '../../components/CurrencySelect/CurrencySelect';
import Modal from '../../components/Modal/Modal';

const InvestmentsContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const InputWithButtonWrapper = styled.div`
  position: relative;
  overflow: hidden;
  
  input[type="number"] {
    padding-right: 2.5rem;
  }
  
  button {
    position: absolute;
    top: 52%;
    right: 10px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    transition: all 0.3s ease;
    
    &:disabled {
      cursor: not-allowed;
      color: #ccc;
    }
    
    &:not(:disabled) {
      color: #2ecc71;
      
      &:hover {
        opacity: 0.8;
      }
    }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FiltersSection = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FiltersTitle = styled.h3`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const InvestmentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const InvestmentCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border-left: 4px solid
    ${({ $status, theme }) =>
      $status === 'ativo' ? theme.colors.primary : theme.colors.gray};
`;

const InvestmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const InvestmentName = styled.h3`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const InvestmentType = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textLight};
  background-color: ${({ theme }) => theme.colors.light};
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const InvestmentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
`;

const InfoLabel = styled.span`
  color: ${({ theme }) => theme.colors.textLight};
`;

const InfoValue = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== '$profit',
})`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  ${({ $profit }) => $profit && `color: #2ecc71;`}
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const DeleteButtonContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CardActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const IconButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== '$danger',
})`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: none;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
  }

  ${({ $danger, theme }) =>
    $danger &&
    `
    &:hover {
      background-color: ${theme.colors.danger};
    }
  `}
`;

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [filteredInvestments, setFilteredInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRate, setLoadingRate] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [actionType, setActionType] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    sortBy: 'createdAt',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    investedAmount: '',
    monthlyRate: '',
    dailyLiquidity: false,
    currency: 'BRL',
    quantity: '',
    startDate: '',
  });
  const [actionData, setActionData] = useState({
    value: '',
    quantity: '',
    description: '',
  });

  useEffect(() => {
    fetchInvestments();
  }, []);

  useEffect(() => {
    filterAndSortInvestments();
  }, [investments, filters]);

  const fetchInvestments = async () => {
    try {
      const response = await api.get('/investments');
      setInvestments(response.data.data);
    } catch (error) {
      toast.error('Erro ao carregar investimentos');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortInvestments = () => {
    let filtered = [...investments];

    if (filters.search) {
      filtered = filtered.filter(
        (inv) =>
          inv.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          inv.type.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter((inv) => inv.type === filters.type);
    }

    if (filters.status) {
      filtered = filtered.filter((inv) => inv.status === filters.status);
    }

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'investedAmount':
          return b.investedAmount - a.investedAmount;
        case 'totalProfit':
          return b.totalProfit - a.totalProfit;
        case 'monthlyRate':
          return b.monthlyRate - a.monthlyRate;
        case 'createdAt':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredInvestments(filtered);
  };

  const handleCreateInvestment = async (e) => {
    e.preventDefault();
    try {
      await api.post('/investments', {
        ...formData,
        investedAmount: parseFloat(formData.investedAmount) || 0,
        monthlyRate: parseFloat(formData.monthlyRate) || 0,
        currency: formData.currency || 'BRL',
        quantity: parseFloat(formData.quantity) || 0,
        startDate: formData.startDate || new Date(),
      });
      toast.success('Investimento criado com sucesso!');
      setModalOpen(false);
      setFormData({
        name: '',
        type: '',
        investedAmount: '',
        monthlyRate: '',
        dailyLiquidity: false,
        currency: 'BRL',
        startDate: '',
      });
      fetchInvestments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao criar investimento');
    }
  };

  const handleUpdateInvestment = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/investments/${selectedInvestment._id}`, {
        ...formData,
        investedAmount: parseFloat(formData.investedAmount) || 0,
        monthlyRate: parseFloat(formData.monthlyRate) || 0,
        currency: formData.currency || 'BRL',
        status: selectedInvestment?.status || 'ativo',
      });
      toast.success('Investimento atualizado com sucesso!');
      setEditModalOpen(false);
      setSelectedInvestment(null);
      fetchInvestments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar investimento');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await api.put(`/investments/${selectedInvestment._id}`, {
        status: newStatus,
      });
      toast.success('Status atualizado com sucesso!');
      fetchInvestments();
      setSelectedInvestment({
        ...selectedInvestment,
        status: newStatus,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar status');
    }
  };

  const handleAction = async (e) => {
    e.preventDefault();
    const value = parseFloat(actionData.value);
    if (!value || value <= 0) {
      toast.error('Valor inválido');
      return;
    }

    try {
      // Se for rendimento diário, usa o endpoint de profit
      const endpoint = actionType === 'dailyProfit' 
        ? `/investments/${selectedInvestment._id}/profit`
        : `/investments/${selectedInvestment._id}/${actionType}`;
      
      // Se for rendimento diário, adiciona descrição automática com data se não tiver descrição
      let description = actionData.description;
      if (actionType === 'dailyProfit' && !description) {
        const today = format(new Date(), 'dd/MM/yyyy', { locale: ptBR });
        description = `Rendimento diário - ${today}`;
      }
      
      const quantity = actionData.quantity ? parseFloat(actionData.quantity) : 0;
      
      await api.post(endpoint, {
        value: actionType === 'reinvest' ? value : value,
        quantity: (actionType === 'contribution' || actionType === 'withdrawal') ? quantity : undefined,
        description: description,
      });
      toast.success('Operação realizada com sucesso!');
      setActionModalOpen(false);
      setActionData({ value: '', quantity: '', description: '' });
      setSelectedInvestment(null);
      fetchInvestments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao realizar operação');
    }
  };


  const handleDeleteInvestment = async () => {
    try {
      // Se for cofrinho, deleta via API de cofrinhos
      if (selectedInvestment.isPiggyBank) {
        await api.delete(`/piggybanks/${selectedInvestment._id}`);
        toast.success('Cofrinho excluído com sucesso!');
      } else {
        await api.delete(`/investments/${selectedInvestment._id}`);
        toast.success('Investimento excluído com sucesso!');
      }
      setDeleteModalOpen(false);
      setSelectedInvestment(null);
      fetchInvestments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao excluir');
    }
  };

  const openActionModal = (investment, type) => {
    // Se for cofrinho, redireciona para página de cofrinhos
    if (investment.isPiggyBank) {
      window.location.href = '/piggybanks';
      return;
    }
    
    setSelectedInvestment(investment);
    setActionType(type);
    setActionModalOpen(true);
  };

  const openEditModal = (investment) => {
    // Se for cofrinho, redireciona para página de cofrinhos
    if (investment.isPiggyBank) {
      window.location.href = '/piggybanks';
      return;
    }
    
    setSelectedInvestment(investment);
    setFormData({
      name: investment.name,
      type: investment.type,
      investedAmount: investment.investedAmount.toString(),
      monthlyRate: investment.monthlyRate.toString(),
      dailyLiquidity: investment.dailyLiquidity,
      currency: investment.currency || 'BRL',
      quantity: (investment.quantity || 0).toString(),
      startDate: investment.startDate
        ? format(new Date(investment.startDate), 'yyyy-MM-dd')
        : '',
    });
    setEditModalOpen(true);
  };

  const openDetailModal = (investment) => {
    setSelectedInvestment(investment);
    setDetailModalOpen(true);
  };

  const openDeleteModal = (investment) => {
    setSelectedInvestment(investment);
    setDeleteModalOpen(true);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      status: '',
      sortBy: 'createdAt',
    });
  };

  const handleFetchRate = async () => {
    setLoadingRate(true);
    try {
      // Tenta sugerir taxa baseada no tipo
      let rate = await suggestRateByType(formData.type);
      
      // Se não encontrou pelo tipo, busca CDI genérico
      if (!rate) {
        rate = await getCDIRate();
      }
      
      if (rate) {
        const rateNumber = parseFloat(rate);
        setFormData({ ...formData, monthlyRate: rateNumber });
        toast.success(`Taxa atualizada: ${rateNumber}% ao mês`);
      } else {
        toast.warning('Não foi possível buscar a taxa. Preencha manualmente.');
      }
    } catch (error) {
      toast.error('Erro ao buscar taxa. Tente novamente.');
    } finally {
      setLoadingRate(false);
    }
  };

  const uniqueTypes = [...new Set(investments.map((inv) => inv.type))];

  if (loading) {
    return <InvestmentsContainer>Carregando...</InvestmentsContainer>;
  }

  return (
    <InvestmentsContainer>
      <Header>
        <Title>
          <FaBriefcase />
          Meus Investimentos
        </Title>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />
            {showFilters ? 'Ocultar' : 'Filtros'}
          </Button>
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            <FaPlus />
            Novo Investimento
          </Button>
        </div>
      </Header>

      {showFilters && (
        <FiltersSection>
          <FiltersHeader>
            <FiltersTitle>
              <FaFilter />
              Filtros e Ordenação
            </FiltersTitle>
            <Button variant="outline" onClick={clearFilters}>
              <FaTimes />
              Limpar
            </Button>
          </FiltersHeader>
          <FiltersGrid>
            <Input
              label="Buscar"
              placeholder="Nome ou tipo..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
            <Select
              label="Tipo"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">Todos os tipos</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
            <Select
              label="Status"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="encerrado">Encerrado</option>
            </Select>
            <Select
              label="Ordenar por"
              value={filters.sortBy}
              onChange={(e) =>
                setFilters({ ...filters, sortBy: e.target.value })
              }
            >
              <option value="createdAt">Mais recente</option>
              <option value="name">Nome</option>
              <option value="investedAmount">Valor investido</option>
              <option value="totalProfit">Lucro total</option>
              <option value="monthlyRate">Taxa mensal</option>
            </Select>
          </FiltersGrid>
        </FiltersSection>
      )}

      <InvestmentsGrid>
        {filteredInvestments.map((investment) => (
          <InvestmentCard key={investment._id} $status={investment.status}>
            <InvestmentHeader>
              <div>
                <InvestmentName>
                  {investment.isPiggyBank && <FaPiggyBank style={{ marginRight: '8px', color: '#f39c12' }} />}
                  {investment.name}
                </InvestmentName>
                <InvestmentType>
                  {investment.type}
                  {investment.isPiggyBank && (
                    <span style={{ 
                      marginLeft: '8px', 
                      padding: '2px 8px', 
                      backgroundColor: '#fff3cd', 
                      color: '#856404',
                      borderRadius: '4px',
                      fontSize: '0.75rem'
                    }}>
                      Cofrinho
                    </span>
                  )}
                </InvestmentType>
              </div>
              <CardActions>
                <IconButton
                  onClick={() => openDetailModal(investment)}
                  title="Ver detalhes"
                >
                  <FaInfoCircle />
                </IconButton>
                {!investment.isPiggyBank && (
                  <>
                    <IconButton
                      onClick={() => openEditModal(investment)}
                      title="Editar"
                    >
                      <FaEdit />
                    </IconButton>
                    <IconButton
                      $danger
                      onClick={() => openDeleteModal(investment)}
                      title="Excluir"
                    >
                      <FaTrash />
                    </IconButton>
                  </>
                )}
                {investment.isPiggyBank && (
                  <IconButton
                    onClick={() => window.location.href = '/piggybanks'}
                    title="Gerenciar Cofrinho"
                    style={{ color: '#f39c12' }}
                  >
                    <FaPiggyBank />
                  </IconButton>
                )}
              </CardActions>
            </InvestmentHeader>
            <InvestmentInfo>
              <InfoRow>
                <InfoLabel>Valor {investment.isPiggyBank ? 'Guardado' : 'Investido'}:</InfoLabel>
                <InfoValue>{formatCurrencyWithCode(investment.investedAmount, investment.currency || 'BRL')}</InfoValue>
              </InfoRow>
              {investment.isPiggyBank && investment.piggyBankData && (
                <>
                  <InfoRow>
                    <InfoLabel>Meta:</InfoLabel>
                    <InfoValue>{formatCurrencyWithCode(investment.piggyBankData.targetAmount, investment.currency || 'BRL')}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>Progresso:</InfoLabel>
                    <InfoValue>
                      {((investment.investedAmount / investment.piggyBankData.targetAmount) * 100).toFixed(1)}%
                    </InfoValue>
                  </InfoRow>
                </>
              )}
              {!investment.isPiggyBank && (
                <>
                  <InfoRow>
                    <InfoLabel>Lucro Total:</InfoLabel>
                    <InfoValue $profit>{formatCurrencyWithCode(investment.totalProfit, investment.currency || 'BRL')}</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>Taxa Mensal:</InfoLabel>
                    <InfoValue>{investment.monthlyRate}%</InfoValue>
                  </InfoRow>
                  <InfoRow>
                    <InfoLabel>Liquidez:</InfoLabel>
                    <InfoValue>
                      {investment.dailyLiquidity ? 'Diária' : 'Vencimento'}
                    </InfoValue>
                  </InfoRow>
                </>
              )}
              <InfoRow>
                <InfoLabel>Status:</InfoLabel>
                <InfoValue>{investment.status}</InfoValue>
              </InfoRow>
            </InvestmentInfo>
            {!investment.isPiggyBank && (
              <ActionsGrid>
                <Button
                  variant="secondary"
                  onClick={() => openActionModal(investment, 'contribution')}
                >
                  <FaArrowDown />
                  Aporte
                </Button>
                <Button
                  variant="primary"
                  onClick={() => openActionModal(investment, 'profit')}
                >
                  <FaArrowUp />
                  Rendimento
                </Button>
                {investment.hasDailyProfit && (
                  <Button
                    variant="primary"
                    onClick={() => openActionModal(investment, 'dailyProfit')}
                    style={{ backgroundColor: '#27ae60' }}
                  >
                    <FaCalendarDay />
                    Rend. Diário
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => openActionModal(investment, 'reinvest')}
                  disabled={investment.totalProfit <= 0}
                >
                  <FaRedo />
                  Reinvestir
                </Button>
                <Button
                  variant="danger"
                  onClick={() => openActionModal(investment, 'withdrawal')}
                  disabled={investment.totalProfit <= 0}
                >
                  <FaMoneyBillWave />
                  Sacar
                </Button>
              </ActionsGrid>
            )}
            {investment.isPiggyBank && (
              <ActionsGrid>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => window.location.href = '/piggybanks'}
                >
                  <FaPiggyBank /> Gerenciar Cofrinho
                </Button>
              </ActionsGrid>
            )}
            <DeleteButtonContainer>
              <Button
                variant="danger"
                fullWidth
                onClick={() => openDeleteModal(investment)}
              >
                <FaTrash />
                Excluir Investimento
              </Button>
            </DeleteButtonContainer>
          </InvestmentCard>
        ))}
      </InvestmentsGrid>

      {filteredInvestments.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
          {investments.length === 0
            ? 'Nenhum investimento cadastrado ainda.'
            : 'Nenhum investimento corresponde aos filtros selecionados.'}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Novo Investimento"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreateInvestment}>
              Criar
            </Button>
          </>
        }
      >
        <Form onSubmit={handleCreateInvestment}>
          <AutocompleteInput
            label="Nome do Investimento"
            value={formData.name}
            onChange={async (e) => {
              const newName = e.target.value;
              setFormData({ ...formData, name: newName });
              
              // Se o nome parece ser uma sugestão do backend (formato: "TICKER - Nome")
              if (newName.includes(' - ')) {
                const investment = await getInvestmentFromSuggestion(newName);
                if (investment) {
                  // Usa o tipo do backend mapeado
                  setFormData(prev => ({
                    ...prev,
                    name: newName,
                    type: investment.tipo || prev.type,
                  }));
                  
                  // Busca taxa sugerida baseada no tipo
                  if (investment.tipo) {
                    const suggestedRate = await suggestRateByType(investment.tipo);
                    if (suggestedRate && !formData.monthlyRate) {
                      setFormData(prev => ({ ...prev, monthlyRate: parseFloat(suggestedRate) }));
                    }
                  }
                  return;
                }
              }
              
              // Detecta e preenche tipo automaticamente (fallback)
              if (newName) {
                const detectedType = detectInvestmentType(newName);
                if (detectedType && !formData.type) {
                  setFormData(prev => ({ ...prev, type: detectedType }));
                }
                
                // Busca taxa sugerida baseada no tipo
                if (detectedType) {
                  const suggestedRate = await suggestRateByType(detectedType);
                  if (suggestedRate && !formData.monthlyRate) {
                    setFormData(prev => ({ ...prev, monthlyRate: parseFloat(suggestedRate) }));
                  }
                }
              }
            }}
            onSearch={searchInvestmentSuggestions}
            required
            placeholder="Digite para buscar investimentos..."
          />
          <AutocompleteInput
            label="Tipo (opcional)"
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value })
            }
            onSearch={searchInvestmentTypes}
            minChars={1}
            placeholder="Digite o tipo de investimento..."
          />
          <CurrencySelect
            label="Moeda"
            value={formData.currency}
            onChange={(e) =>
              setFormData({ ...formData, currency: e.target.value })
            }
          />
          <Input
            type="number"
            step="0.01"
            label={`Valor Investido (${getCurrencyByCode(formData.currency).symbol})`}
            value={formData.investedAmount}
            onChange={(e) =>
              setFormData({ ...formData, investedAmount: e.target.value })
            }
            required
          />
          <InputWithButtonWrapper>
            <Input
              type="number"
              step="0.01"
              label="Taxa Mensal (%) (opcional)"
              value={formData.monthlyRate}
              onChange={(e) =>
                setFormData({ ...formData, monthlyRate: e.target.value })
              }
              placeholder="Ex: 1.5"
            />
            <button
              type="button"
              onClick={handleFetchRate}
              disabled={loadingRate}
              title="Buscar taxa CDI atual"
            >
              <FaSync
                style={{
                  animation: loadingRate ? 'spin 1s linear infinite' : 'none',
                }}
              />
            </button>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </InputWithButtonWrapper>
          <Input
            type="number"
            step="0.01"
            label="Quantidade de Cotas (opcional)"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
            placeholder="Ex: 10 (para FIIs, ações, etc.)"
          />
          <DateInput
            label="Data de Início"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
          />
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={formData.dailyLiquidity}
              onChange={(e) =>
                setFormData({ ...formData, dailyLiquidity: e.target.checked })
              }
            />
            <span>Liquidez Diária</span>
          </label>
        </Form>
      </Modal>

      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedInvestment(null);
        }}
        title="Editar Investimento"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setEditModalOpen(false);
                setSelectedInvestment(null);
              }}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleUpdateInvestment}>
              Salvar
            </Button>
          </>
        }
      >
        <Form onSubmit={handleUpdateInvestment}>
          <Input
            label="Nome do Investimento"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
          <AutocompleteInput
            label="Tipo (opcional)"
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value })
            }
            onSearch={searchInvestmentTypes}
            minChars={1}
            placeholder="Digite o tipo de investimento..."
          />
          <CurrencySelect
            label="Moeda"
            value={formData.currency}
            onChange={(e) =>
              setFormData({ ...formData, currency: e.target.value })
            }
          />
          <Input
            type="number"
            step="0.01"
            label={`Valor Investido (${getCurrencyByCode(formData.currency).symbol})`}
            value={formData.investedAmount}
            onChange={(e) =>
              setFormData({ ...formData, investedAmount: e.target.value })
            }
            required
          />
          <Input
            type="number"
            step="0.01"
            label="Taxa Mensal (%) (opcional)"
            value={formData.monthlyRate}
            onChange={(e) =>
              setFormData({ ...formData, monthlyRate: e.target.value })
            }
            placeholder="Ex: 1.5"
          />
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={formData.dailyLiquidity}
              onChange={(e) =>
                setFormData({ ...formData, dailyLiquidity: e.target.checked })
              }
            />
            <span>Liquidez Diária</span>
          </label>
          <Select
            label="Status"
            value={selectedInvestment?.status || 'ativo'}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            <option value="ativo">Ativo</option>
            <option value="encerrado">Encerrado</option>
          </Select>
        </Form>
      </Modal>

      <Modal
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedInvestment(null);
        }}
        title={`Detalhes - ${selectedInvestment?.name}`}
        maxWidth="800px"
        footer={
          <Button
            variant="outline"
            onClick={() => {
              setDetailModalOpen(false);
              setSelectedInvestment(null);
            }}
          >
            Fechar
          </Button>
        }
      >
        {selectedInvestment && (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <strong>Tipo:</strong> {selectedInvestment.type}
              </div>
              <div>
                <strong>Status:</strong> {selectedInvestment.status}
              </div>
              <div>
                <strong>Valor Investido:</strong>{' '}
                {formatCurrencyWithCode(selectedInvestment.investedAmount, selectedInvestment.currency || 'BRL')}
              </div>
              <div>
                <strong>Lucro Total:</strong>{' '}
                <span style={{ color: '#2ecc71', fontWeight: 600 }}>
                  {formatCurrencyWithCode(selectedInvestment.totalProfit, selectedInvestment.currency || 'BRL')}
                </span>
              </div>
              <div>
                <strong>Taxa Mensal:</strong> {selectedInvestment.monthlyRate}%
              </div>
              <div>
                <strong>Liquidez:</strong>{' '}
                {selectedInvestment.dailyLiquidity ? 'Diária' : 'Vencimento'}
              </div>
              <div>
                <strong>Data de Início:</strong>{' '}
                {format(new Date(selectedInvestment.startDate), 'dd/MM/yyyy', {
                  locale: ptBR,
                })}
              </div>
              <div>
                <strong>ROI:</strong>{' '}
                <span style={{ color: '#2ecc71', fontWeight: 600 }}>
                  {(
                    (selectedInvestment.totalProfit /
                      selectedInvestment.investedAmount) *
                    100
                  ).toFixed(2)}
                  %
                </span>
              </div>
            </div>

            {selectedInvestment.history &&
              selectedInvestment.history.length > 0 && (
                <div>
                  <h4 style={{ marginBottom: '1rem' }}>Histórico Recente</h4>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '0.9rem',
                      }}
                    >
                      <thead>
                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                          <th style={{ padding: '0.5rem', textAlign: 'left' }}>
                            Data
                          </th>
                          <th style={{ padding: '0.5rem', textAlign: 'left' }}>
                            Tipo
                          </th>
                          <th style={{ padding: '0.5rem', textAlign: 'right' }}>
                            Valor
                          </th>
                          <th style={{ padding: '0.5rem', textAlign: 'left' }}>
                            Descrição
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvestment.history
                          .slice(-10)
                          .reverse()
                          .map((item, index) => (
                            <tr
                              key={index}
                              style={{
                                borderBottom: '1px solid #e0e0e0',
                              }}
                            >
                              <td style={{ padding: '0.5rem' }}>
                                {format(new Date(item.date), 'dd/MM/yyyy', {
                                  locale: ptBR,
                                })}
                              </td>
                              <td style={{ padding: '0.5rem' }}>
                                <span
                                  style={{
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem',
                                    backgroundColor:
                                      item.type === 'APORTE'
                                        ? '#3498db'
                                        : item.type === 'RENDIMENTO'
                                        ? '#2ecc71'
                                        : '#e74c3c',
                                    color: 'white',
                                  }}
                                >
                                  {item.type}
                                </span>
                              </td>
                              <td
                                style={{
                                  padding: '0.5rem',
                                  textAlign: 'right',
                                  fontWeight: 600,
                                  color:
                                    item.type === 'SAQUE' ? '#e74c3c' : '#2ecc71',
                                }}
                              >
                                {item.type === 'SAQUE' ? '-' : '+'}
                                {formatCurrencyWithCode(item.value, selectedInvestment?.currency || 'BRL')}
                              </td>
                              <td
                                style={{ 
                                  padding: '0.5rem', 
                                  textAlign: 'right',
                                  color: '#7f8c8d',
                                  fontWeight: item.quantity > 0 ? 600 : 400,
                                }}
                              >
                                {item.quantity > 0 ? item.quantity : '-'}
                              </td>
                              <td
                                style={{ padding: '0.5rem', color: '#7f8c8d' }}
                              >
                                {item.description || '-'}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={actionModalOpen}
        onClose={() => {
          setActionModalOpen(false);
          setActionData({ value: '', quantity: '', description: '' });
        }}
        title={
          actionType === 'contribution'
            ? 'Adicionar Aporte'
            : actionType === 'profit'
            ? 'Adicionar Rendimento'
            : actionType === 'dailyProfit'
            ? 'Adicionar Rendimento Diário'
            : actionType === 'withdrawal'
            ? 'Realizar Saque'
            : 'Reinvestir Lucro'
        }
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setActionModalOpen(false);
                setActionData({ value: '', quantity: '', description: '' });
              }}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleAction}>
              Confirmar
            </Button>
          </>
        }
      >
        <Form onSubmit={handleAction}>
          <Input
            type="number"
            step="0.01"
            label={
              actionType === 'reinvest'
                ? `Valor a Reinvestir (Máx: ${formatCurrencyWithCode(selectedInvestment?.totalProfit || 0, selectedInvestment?.currency || 'BRL')})`
                : actionType === 'profit'
                ? `Valor do Rendimento (${getCurrencyByCode(selectedInvestment?.currency || 'BRL').symbol})`
                : actionType === 'dailyProfit'
                ? `Valor do Rendimento Diário (${getCurrencyByCode(selectedInvestment?.currency || 'BRL').symbol})`
                : `Valor (${getCurrencyByCode(selectedInvestment?.currency || 'BRL').symbol})`
            }
            value={actionData.value}
            onChange={(e) =>
              setActionData({ ...actionData, value: e.target.value })
            }
            required
            placeholder={
              actionType === 'profit' || actionType === 'dailyProfit'
                ? 'Ex: 0.10'
                : actionType === 'contribution'
                ? 'Ex: 1000.00'
                : actionType === 'withdrawal'
                ? 'Ex: 200.00'
                : 'Digite o valor'
            }
          />
          {(actionType === 'contribution' || actionType === 'withdrawal') && (
            <Input
              type="number"
              step="0.01"
              label={`Quantidade de Cotas${actionType === 'withdrawal' ? ` (Disponível: ${selectedInvestment?.quantity || 0})` : ''}`}
              value={actionData.quantity}
              onChange={(e) =>
                setActionData({ ...actionData, quantity: e.target.value })
              }
              placeholder="Ex: 10 (opcional)"
            />
          )}
          <Input
            label="Descrição (opcional)"
            value={actionData.description}
            onChange={(e) =>
              setActionData({ ...actionData, description: e.target.value })
            }
            placeholder={
              actionType === 'dailyProfit'
                ? 'Deixe em branco para usar data automática'
                : 'Ex: Rendimento de dezembro'
            }
          />
        </Form>
      </Modal>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedInvestment(null);
        }}
        title="Confirmar Exclusão"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedInvestment(null);
              }}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteInvestment}>
              <FaTrash />
              Excluir
            </Button>
          </>
        }
      >
        <div style={{ padding: '1rem 0' }}>
          <p style={{ marginBottom: '1rem', fontSize: '1rem' }}>
            Tem certeza que deseja excluir o investimento{' '}
            <strong>{selectedInvestment?.name}</strong>?
          </p>
          <p
            style={{
              color: '#e74c3c',
              fontSize: '0.9rem',
              fontWeight: '600',
            }}
          >
            ⚠️ Esta ação não pode ser desfeita!
          </p>
          {selectedInvestment && (
            <div
              style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
              }}
            >
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <strong>Valor Investido:</strong>{' '}
                {formatCurrencyWithCode(selectedInvestment.investedAmount, selectedInvestment.currency || 'BRL')}
              </p>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <strong>Lucro Total:</strong>{' '}
                {formatCurrencyWithCode(selectedInvestment.totalProfit, selectedInvestment.currency || 'BRL')}
              </p>
              <p style={{ fontSize: '0.9rem' }}>
                <strong>Tipo:</strong> {selectedInvestment.type}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </InvestmentsContainer>
  );
};

export default Investments;
