import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { toast } from 'react-toastify';
import {
  FaPiggyBank,
  FaPlus,
  FaEdit,
  FaTrash,
  FaInfoCircle,
  FaArrowUp,
  FaArrowDown,
  FaCheckCircle,
  FaTimesCircle,
  FaChartLine,
} from 'react-icons/fa';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatCurrency';
import { getCurrencyByCode, formatCurrency as formatCurrencyWithCode } from '../../data/currencies';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import DateInput from '../../components/DateInput/DateInput';
import CurrencySelect from '../../components/CurrencySelect/CurrencySelect';
import Modal from '../../components/Modal/Modal';

const PiggyBanksContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
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
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TableContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: ${({ theme }) => theme.colors.light};
`;

const TableRow = styled.tr`
  transition: background-color 0.2s ease;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableHeaderCell = styled.th`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: left;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  vertical-align: middle;
`;

const StatusBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== '$status',
})`
  font-size: 0.85rem;
  padding: 0.3rem 0.6rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ $status, theme }) =>
    $status === 'encerrado'
      ? theme.colors.dangerLight
      : theme.colors.primaryLight};
  color: ${({ $status, theme }) =>
    $status === 'encerrado'
      ? theme.colors.danger
      : theme.colors.primary};
  font-weight: 600;
  text-transform: capitalize;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
`;

const ActionsCell = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;
  flex-wrap: wrap;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const PiggyBanks = () => {
  const [piggyBanks, setPiggyBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contributeModalOpen, setContributeModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [profitModalOpen, setProfitModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedPiggyBank, setSelectedPiggyBank] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    currentAmount: '',
    currency: 'BRL',
  });
  const [actionData, setActionData] = useState({
    value: '',
    description: '',
  });

  useEffect(() => {
    fetchPiggyBanks();
  }, []);

  const fetchPiggyBanks = async () => {
    try {
      const response = await api.get('/piggybanks');
      setPiggyBanks(response.data.data);
    } catch (error) {
      toast.error('Erro ao carregar cofrinhos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePiggyBank = async (e) => {
    e.preventDefault();
    try {
      await api.post('/piggybanks', {
        ...formData,
        currentAmount: parseFloat(formData.currentAmount) || 0,
      });
      toast.success('Cofrinho criado com sucesso!');
      setModalOpen(false);
      setFormData({
        name: '',
        description: '',
        currentAmount: '',
        currency: 'BRL',
      });
      fetchPiggyBanks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao criar cofrinho');
    }
  };

  const handleUpdatePiggyBank = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/piggybanks/${selectedPiggyBank._id}`, {
        ...formData,
        currentAmount: parseFloat(formData.currentAmount) || 0,
      });
      toast.success('Cofrinho atualizado com sucesso!');
      setEditModalOpen(false);
      setSelectedPiggyBank(null);
      fetchPiggyBanks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar cofrinho');
    }
  };

  const handleDeletePiggyBank = async () => {
    try {
      await api.delete(`/piggybanks/${selectedPiggyBank._id}`);
      toast.success('Cofrinho excluído com sucesso!');
      setDeleteModalOpen(false);
      setSelectedPiggyBank(null);
      fetchPiggyBanks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao excluir cofrinho');
    }
  };

  const handleContribute = async (e) => {
    e.preventDefault();
    const value = parseFloat(actionData.value);
    if (!value || value <= 0) {
      toast.error('Valor inválido');
      return;
    }

    try {
      await api.post(`/piggybanks/${selectedPiggyBank._id}/contribute`, {
        value,
        description: actionData.description,
      });
      toast.success('Contribuição adicionada com sucesso!');
      setContributeModalOpen(false);
      setActionData({ value: '', description: '' });
      setSelectedPiggyBank(null);
      fetchPiggyBanks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao adicionar contribuição');
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const value = parseFloat(actionData.value);
    if (!value || value <= 0) {
      toast.error('Valor inválido');
      return;
    }

    try {
      await api.post(`/piggybanks/${selectedPiggyBank._id}/withdraw`, {
        value,
        description: actionData.description,
      });
      toast.success('Valor retirado com sucesso!');
      setWithdrawModalOpen(false);
      setActionData({ value: '', description: '' });
      setSelectedPiggyBank(null);
      fetchPiggyBanks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao retirar valor');
    }
  };

  const handleProfit = async (e) => {
    e.preventDefault();
    const value = parseFloat(actionData.value);
    if (!value || value <= 0) {
      toast.error('Valor inválido');
      return;
    }

    try {
      await api.post(`/piggybanks/${selectedPiggyBank._id}/profit`, {
        value,
        description: actionData.description,
      });
      toast.success('Rendimento adicionado com sucesso!');
      setProfitModalOpen(false);
      setActionData({ value: '', description: '' });
      setSelectedPiggyBank(null);
      fetchPiggyBanks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao adicionar rendimento');
    }
  };

  const openEditModal = (piggyBank) => {
    setSelectedPiggyBank(piggyBank);
    setFormData({
      name: piggyBank.name,
      description: piggyBank.description || '',
      currentAmount: piggyBank.currentAmount.toString(),
      currency: piggyBank.currency || 'BRL',
    });
    setEditModalOpen(true);
  };

  const openDeleteModal = (piggyBank) => {
    setSelectedPiggyBank(piggyBank);
    setDeleteModalOpen(true);
  };

  const openContributeModal = (piggyBank) => {
    setSelectedPiggyBank(piggyBank);
    setActionData({ value: '', description: '' });
    setContributeModalOpen(true);
  };

  const openWithdrawModal = (piggyBank) => {
    setSelectedPiggyBank(piggyBank);
    setActionData({ value: '', description: '' });
    setWithdrawModalOpen(true);
  };

  const openProfitModal = (piggyBank) => {
    setSelectedPiggyBank(piggyBank);
    setActionData({ value: '', description: '' });
    setProfitModalOpen(true);
  };

  const openDetailModal = (piggyBank) => {
    setSelectedPiggyBank(piggyBank);
    setDetailModalOpen(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'encerrado':
        return <FaTimesCircle style={{ color: '#e74c3c' }} />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Carregando cofrinhos...</div>;
  }

  return (
    <PiggyBanksContainer>
      <Header>
        <Title>
          <FaPiggyBank /> Meus Cofrinhos
        </Title>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <FaPlus /> Novo Cofrinho
        </Button>
      </Header>

      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableHeaderCell>Nome</TableHeaderCell>
              <TableHeaderCell>Valor Investido</TableHeaderCell>
              <TableHeaderCell>Lucro Total</TableHeaderCell>
              <TableHeaderCell>Moeda</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell style={{ textAlign: 'center' }}>Ações</TableHeaderCell>
            </tr>
          </TableHeader>
          <tbody>
            {piggyBanks.length === 0 ? (
              <TableRow>
                <TableCell colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                  <EmptyState>
                    <FaPiggyBank size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                    <p>Nenhum cofrinho cadastrado ainda.</p>
                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                      Crie seu primeiro cofrinho para começar a economizar!
                    </p>
                  </EmptyState>
                </TableCell>
              </TableRow>
            ) : (
              piggyBanks.map((piggyBank) => (
                <TableRow key={piggyBank._id}>
                  <TableCell>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                        {piggyBank.name}
                      </div>
                      {piggyBank.description && (
                        <div style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
                          {piggyBank.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span style={{ fontWeight: 600 }}>
                      {formatCurrencyWithCode(
                        piggyBank.currentAmount,
                        piggyBank.currency || 'BRL'
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span style={{ color: '#2ecc71', fontWeight: 700 }}>
                      {formatCurrencyWithCode(
                        piggyBank.totalProfit || 0,
                        piggyBank.currency || 'BRL'
                      )}
                    </span>
                  </TableCell>
                  <TableCell>{piggyBank.currency || 'BRL'}</TableCell>
                  <TableCell>
                    <StatusBadge $status={piggyBank.status}>
                      {getStatusIcon(piggyBank.status)}
                      {piggyBank.status === 'encerrado' ? 'Encerrado' : 'Ativo'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <ActionsCell>
                      {piggyBank.status === 'ativo' && (
                        <>
                          <Button
                            variant="secondary"
                            onClick={() => openContributeModal(piggyBank)}
                            style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                          >
                            <FaArrowUp /> Adicionar
                          </Button>
                          <Button
                            variant="primary"
                            onClick={() => openProfitModal(piggyBank)}
                            style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                          >
                            <FaChartLine /> Rendimento
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => openWithdrawModal(piggyBank)}
                            disabled={piggyBank.currentAmount <= 0}
                            style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                          >
                            <FaArrowDown /> Retirar
                          </Button>
                        </>
                      )}
                      <IconButton
                        onClick={() => openDetailModal(piggyBank)}
                        title="Ver detalhes"
                      >
                        <FaInfoCircle />
                      </IconButton>
                      <IconButton
                        onClick={() => openEditModal(piggyBank)}
                        title="Editar"
                      >
                        <FaEdit />
                      </IconButton>
                      <IconButton
                        $danger
                        onClick={() => openDeleteModal(piggyBank)}
                        title="Excluir"
                      >
                        <FaTrash />
                      </IconButton>
                    </ActionsCell>
                  </TableCell>
                </TableRow>
              ))
            )}
          </tbody>
        </Table>
      </TableContainer>

      {/* Modal de Criação */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Novo Cofrinho"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreatePiggyBank}>
              Criar
            </Button>
          </>
        }
      >
        <Form onSubmit={handleCreatePiggyBank}>
          <Input
            label="Nome do Cofrinho"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Ex: Viagem para Europa"
          />
          <Input
            label="Descrição (opcional)"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Ex: Economia para férias"
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
            value={formData.currentAmount}
            onChange={(e) =>
              setFormData({ ...formData, currentAmount: e.target.value })
            }
            required
            placeholder="Ex: 1000.00"
          />
        </Form>
      </Modal>

      {/* Modal de Edição */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedPiggyBank(null);
        }}
        title="Editar Cofrinho"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setEditModalOpen(false);
                setSelectedPiggyBank(null);
              }}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleUpdatePiggyBank}>
              Salvar
            </Button>
          </>
        }
      >
        <Form onSubmit={handleUpdatePiggyBank}>
          <Input
            label="Nome do Cofrinho"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Descrição (opcional)"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
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
            value={formData.currentAmount}
            onChange={(e) =>
              setFormData({ ...formData, currentAmount: e.target.value })
            }
            required
          />
        </Form>
      </Modal>

      {/* Modal de Contribuição */}
      <Modal
        isOpen={contributeModalOpen}
        onClose={() => {
          setContributeModalOpen(false);
          setActionData({ value: '', description: '' });
        }}
        title="Adicionar ao Cofrinho"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setContributeModalOpen(false);
                setActionData({ value: '', description: '' });
              }}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleContribute}>
              Adicionar
            </Button>
          </>
        }
      >
        <Form onSubmit={handleContribute}>
          <Input
            type="number"
            step="0.01"
            label={`Valor (${selectedPiggyBank ? getCurrencyByCode(selectedPiggyBank.currency || 'BRL').symbol : 'R$'})`}
            value={actionData.value}
            onChange={(e) =>
              setActionData({ ...actionData, value: e.target.value })
            }
            required
            placeholder="Ex: 100.00"
          />
          <Input
            label="Descrição (opcional)"
            value={actionData.description}
            onChange={(e) =>
              setActionData({ ...actionData, description: e.target.value })
            }
            placeholder="Ex: Economia de dezembro"
          />
        </Form>
      </Modal>

      {/* Modal de Retirada */}
      <Modal
        isOpen={withdrawModalOpen}
        onClose={() => {
          setWithdrawModalOpen(false);
          setActionData({ value: '', description: '' });
        }}
        title="Retirar do Cofrinho"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setWithdrawModalOpen(false);
                setActionData({ value: '', description: '' });
              }}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleWithdraw}>
              Retirar
            </Button>
          </>
        }
      >
        <Form onSubmit={handleWithdraw}>
          <Input
            type="number"
            step="0.01"
            label={`Valor (Máx: ${selectedPiggyBank ? formatCurrencyWithCode(selectedPiggyBank.currentAmount, selectedPiggyBank.currency || 'BRL') : 'R$ 0,00'})`}
            value={actionData.value}
            onChange={(e) =>
              setActionData({ ...actionData, value: e.target.value })
            }
            required
            placeholder="Ex: 50.00"
          />
          <Input
            label="Descrição (opcional)"
            value={actionData.description}
            onChange={(e) =>
              setActionData({ ...actionData, description: e.target.value })
            }
            placeholder="Ex: Emergência"
          />
        </Form>
      </Modal>

      {/* Modal de Rendimento */}
      <Modal
        isOpen={profitModalOpen}
        onClose={() => {
          setProfitModalOpen(false);
          setActionData({ value: '', description: '' });
        }}
        title="Adicionar Rendimento"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setProfitModalOpen(false);
                setActionData({ value: '', description: '' });
              }}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleProfit}>
              Adicionar
            </Button>
          </>
        }
      >
        <Form onSubmit={handleProfit}>
          <Input
            type="number"
            step="0.01"
            label={`Valor do Rendimento (${selectedPiggyBank ? getCurrencyByCode(selectedPiggyBank.currency || 'BRL').symbol : 'R$'})`}
            value={actionData.value}
            onChange={(e) =>
              setActionData({ ...actionData, value: e.target.value })
            }
            required
            placeholder="Ex: 50.00"
          />
          <Input
            label="Descrição (opcional)"
            value={actionData.description}
            onChange={(e) =>
              setActionData({ ...actionData, description: e.target.value })
            }
            placeholder="Ex: Rendimento de dezembro"
          />
        </Form>
      </Modal>

      {/* Modal de Exclusão */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirmar Exclusão"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeletePiggyBank}>
              Excluir
            </Button>
          </>
        }
      >
        <p>
          Tem certeza que deseja excluir o cofrinho{' '}
          <strong>{selectedPiggyBank?.name}</strong>? Esta ação não pode ser
          desfeita.
        </p>
      </Modal>

      {/* Modal de Detalhes */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedPiggyBank(null);
        }}
        title={`Detalhes - ${selectedPiggyBank?.name}`}
        maxWidth="800px"
        footer={
          <Button
            variant="outline"
            onClick={() => {
              setDetailModalOpen(false);
              setSelectedPiggyBank(null);
            }}
          >
            Fechar
          </Button>
        }
      >
        {selectedPiggyBank && (
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
                <strong>Status:</strong> {selectedPiggyBank.status}
              </div>
              <div>
                <strong>Moeda:</strong> {selectedPiggyBank.currency}
              </div>
              <div>
                <strong>Valor Investido:</strong>{' '}
                {formatCurrencyWithCode(
                  selectedPiggyBank.currentAmount,
                  selectedPiggyBank.currency || 'BRL'
                )}
              </div>
              <div>
                <strong>Lucro Total:</strong>{' '}
                <span style={{ color: '#2ecc71', fontWeight: 700 }}>
                  {formatCurrencyWithCode(
                    selectedPiggyBank.totalProfit || 0,
                    selectedPiggyBank.currency || 'BRL'
                  )}
                </span>
              </div>
            </div>

            {selectedPiggyBank.description && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>Descrição:</strong> {selectedPiggyBank.description}
              </div>
            )}

            {((selectedPiggyBank.contributions && selectedPiggyBank.contributions.length > 0) ||
              (selectedPiggyBank.profits && selectedPiggyBank.profits.length > 0)) && (
                <div>
                  <h4 style={{ marginBottom: '0.5rem', color: '#34495e' }}>
                    Histórico de Operações
                  </h4>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th
                            style={{
                              padding: '0.5rem',
                              textAlign: 'left',
                              borderBottom: '1px solid #ecf0f1',
                            }}
                          >
                            Data
                          </th>
                          <th
                            style={{
                              padding: '0.5rem',
                              textAlign: 'left',
                              borderBottom: '1px solid #ecf0f1',
                            }}
                          >
                            Tipo
                          </th>
                          <th
                            style={{
                              padding: '0.5rem',
                              textAlign: 'right',
                              borderBottom: '1px solid #ecf0f1',
                            }}
                          >
                            Valor
                          </th>
                          <th
                            style={{
                              padding: '0.5rem',
                              textAlign: 'left',
                              borderBottom: '1px solid #ecf0f1',
                            }}
                          >
                            Descrição
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ...(selectedPiggyBank.contributions || []).map(c => ({ ...c, type: 'APORTE' })),
                          ...(selectedPiggyBank.profits || []).map(p => ({ ...p, type: 'RENDIMENTO' })),
                        ]
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .map((item, index) => (
                            <tr key={index}>
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
                                        : '#2ecc71',
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
                                  color: item.type === 'RENDIMENTO' ? '#2ecc71' : '#3498db',
                                }}
                              >
                                +
                                {formatCurrencyWithCode(
                                  item.value,
                                  selectedPiggyBank.currency || 'BRL'
                                )}
                              </td>
                              <td style={{ padding: '0.5rem', color: '#7f8c8d' }}>
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
    </PiggyBanksContainer>
  );
};

export default PiggyBanks;

