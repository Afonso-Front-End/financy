import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { toast } from 'react-toastify';
import {
  FaFileAlt,
  FaArrowDown,
  FaArrowUp,
  FaMoneyBillWave,
  FaFilter,
  FaChartBar,
  FaTimes,
  FaCalendarAlt,
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatCurrency';
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import DateInput from '../../components/DateInput/DateInput';
import Button from '../../components/Button/Button';

const ReportsContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FilterToggle = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FiltersCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  transition: all 0.3s ease;
`;

const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FiltersTitle = styled.h3`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StatCard = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$color',
})`
  background: linear-gradient(135deg, ${({ $color }) => $color} 0%, ${({ $color }) => $color}dd 100%);
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ChartCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const ChartTitle = styled.h3`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const HistoryCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
`;

const HistoryHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.light};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HistoryTitle = styled.h3`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: ${({ theme }) => theme.colors.light};
`;

const TableRow = styled.tr`
  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.background};
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
`;

const TypeBadge = styled.span`
  padding: 6px 14px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  ${({ $type, theme }) => {
    switch ($type) {
      case 'APORTE':
        return `background-color: #3498db; color: white;`;
      case 'RENDIMENTO':
        return `background-color: #2ecc71; color: white;`;
      case 'SAQUE':
        return `background-color: #e74c3c; color: white;`;
      default:
        return `background-color: ${theme.colors.gray}; color: white;`;
    }
  }}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  opacity: 0.5;
`;

const Loading = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textLight};
`;

const COLORS = ['#3498db', '#2ecc71', '#e74c3c'];

const Reports = () => {
  const [investments, setInvestments] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [stats, setStats] = useState({
    totalAportes: 0,
    totalRendimentos: 0,
    totalSaques: 0,
    saldoLiquido: 0,
  });
  const [filters, setFilters] = useState({
    investmentId: '',
    type: '',
    startDate: '',
    endDate: '',
  });
  const [showFilters, setShowFilters] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvestments();
  }, []);

  useEffect(() => {
    filterHistory();
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

  const filterHistory = () => {
    let history = [];

    investments.forEach((investment) => {
      investment.history.forEach((item) => {
        history.push({
          ...item,
          investmentName: investment.name,
          investmentId: investment._id,
        });
      });
    });

    // Aplicar filtros
    if (filters.investmentId) {
      history = history.filter(
        (item) => item.investmentId === filters.investmentId
      );
    }

    if (filters.type) {
      history = history.filter((item) => item.type === filters.type);
    }

    if (filters.startDate) {
      history = history.filter(
        (item) => new Date(item.date) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      history = history.filter((item) => new Date(item.date) <= endDate);
    }

    // Ordenar por data (mais recente primeiro)
    history.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calcular estatísticas
    const totalAportes = history
      .filter((h) => h.type === 'APORTE')
      .reduce((sum, h) => sum + h.value, 0);

    const totalRendimentos = history
      .filter((h) => h.type === 'RENDIMENTO')
      .reduce((sum, h) => sum + h.value, 0);

    const totalSaques = history
      .filter((h) => h.type === 'SAQUE')
      .reduce((sum, h) => sum + h.value, 0);

    setStats({
      totalAportes,
      totalRendimentos,
      totalSaques,
      saldoLiquido: totalRendimentos - totalSaques,
    });

    setFilteredHistory(history);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'APORTE':
        return <FaArrowDown />;
      case 'RENDIMENTO':
        return <FaArrowUp />;
      case 'SAQUE':
        return <FaMoneyBillWave />;
      default:
        return null;
    }
  };

  const clearFilters = () => {
    setFilters({
      investmentId: '',
      type: '',
      startDate: '',
      endDate: '',
    });
  };

  // Preparar dados para gráficos
  const chartData = filteredHistory.reduce((acc, item) => {
    const date = format(new Date(item.date), 'dd/MM/yyyy');
    const existing = acc.find((d) => d.date === date);
    
    if (existing) {
      existing[item.type] = (existing[item.type] || 0) + item.value;
      existing.total = existing.total + item.value;
    } else {
      acc.push({
        date,
        APORTE: item.type === 'APORTE' ? item.value : 0,
        RENDIMENTO: item.type === 'RENDIMENTO' ? item.value : 0,
        SAQUE: item.type === 'SAQUE' ? item.value : 0,
        total: item.value,
      });
    }
    return acc;
  }, []).slice(0, 30).reverse(); // Últimos 30 dias

  const pieData = [
    { name: 'Aportes', value: stats.totalAportes },
    { name: 'Rendimentos', value: stats.totalRendimentos },
    { name: 'Saques', value: stats.totalSaques },
  ].filter((item) => item.value > 0);

  if (loading) {
    return (
      <ReportsContainer>
        <Loading>Carregando relatórios...</Loading>
      </ReportsContainer>
    );
  }

  return (
    <ReportsContainer>
      <Header>
        <Title>
          <FaFileAlt />
          Relatórios e Histórico
        </Title>
        <FilterToggle
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter />
          {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
        </FilterToggle>
      </Header>

      {showFilters && (
        <FiltersCard>
          <FiltersHeader>
            <FiltersTitle>
              <FaFilter />
              Filtros
            </FiltersTitle>
            <Button variant="outline" onClick={clearFilters}>
              <FaTimes />
              Limpar
            </Button>
          </FiltersHeader>
          <FiltersGrid>
            <Select
              label="Investimento"
              value={filters.investmentId}
              onChange={(e) =>
                setFilters({ ...filters, investmentId: e.target.value })
              }
            >
              <option value="">Todos os Investimentos</option>
              {investments.map((inv) => (
                <option key={inv._id} value={inv._id}>
                  {inv.name}
                </option>
              ))}
            </Select>
            <Select
              label="Tipo de Operação"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">Todos os Tipos</option>
              <option value="APORTE">Aporte</option>
              <option value="RENDIMENTO">Rendimento</option>
              <option value="SAQUE">Saque</option>
            </Select>
            <DateInput
              label="Data Inicial"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />
            <DateInput
              label="Data Final"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </FiltersGrid>
        </FiltersCard>
      )}

      <StatsGrid>
        <StatCard $color="#3498db">
          <StatLabel>
            <FaArrowDown />
            Total de Aportes
          </StatLabel>
          <StatValue>{formatCurrency(stats.totalAportes)}</StatValue>
        </StatCard>
        <StatCard $color="#2ecc71">
          <StatLabel>
            <FaArrowUp />
            Total de Rendimentos
          </StatLabel>
          <StatValue>{formatCurrency(stats.totalRendimentos)}</StatValue>
        </StatCard>
        <StatCard $color="#e74c3c">
          <StatLabel>
            <FaMoneyBillWave />
            Total de Saques
          </StatLabel>
          <StatValue>{formatCurrency(stats.totalSaques)}</StatValue>
        </StatCard>
        <StatCard $color="#9b59b6">
          <StatLabel>
            <FaChartBar />
            Saldo Líquido
          </StatLabel>
          <StatValue>{formatCurrency(stats.saldoLiquido)}</StatValue>
        </StatCard>
      </StatsGrid>

      {filteredHistory.length > 0 && (
        <ChartsGrid>
          <ChartCard>
            <ChartTitle>
              <FaChartBar />
              Evolução Diária (Últimos 30 dias)
            </ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="APORTE"
                  stroke="#3498db"
                  strokeWidth={2}
                  name="Aportes"
                />
                <Line
                  type="monotone"
                  dataKey="RENDIMENTO"
                  stroke="#2ecc71"
                  strokeWidth={2}
                  name="Rendimentos"
                />
                <Line
                  type="monotone"
                  dataKey="SAQUE"
                  stroke="#e74c3c"
                  strokeWidth={2}
                  name="Saques"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>
              <FaChartBar />
              Comparação por Tipo
            </ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="APORTE" fill="#3498db" name="Aportes" />
                <Bar dataKey="RENDIMENTO" fill="#2ecc71" name="Rendimentos" />
                <Bar dataKey="SAQUE" fill="#e74c3c" name="Saques" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {pieData.length > 0 && (
            <ChartCard>
              <ChartTitle>
                <FaChartBar />
                Distribuição por Tipo
              </ChartTitle>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </ChartsGrid>
      )}

      <HistoryCard>
        <HistoryHeader>
          <HistoryTitle>
            <FaCalendarAlt />
            Histórico Completo ({filteredHistory.length} registros)
          </HistoryTitle>
        </HistoryHeader>
        {filteredHistory.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📊</EmptyIcon>
            <h3>Nenhum registro encontrado</h3>
            <p>Não há registros que correspondam aos filtros selecionados.</p>
          </EmptyState>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <HistoryTable>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Data e Hora</TableHeaderCell>
                  <TableHeaderCell>Investimento</TableHeaderCell>
                  <TableHeaderCell>Tipo</TableHeaderCell>
                  <TableHeaderCell>Valor</TableHeaderCell>
                  <TableHeaderCell>Descrição</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <tbody>
                {filteredHistory.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>
                          {format(new Date(item.date), 'dd/MM/yyyy', {
                            locale: ptBR,
                          })}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
                          {format(new Date(item.date), 'HH:mm', {
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <strong>{item.investmentName}</strong>
                    </TableCell>
                    <TableCell>
                      <TypeBadge $type={item.type}>
                        {getTypeIcon(item.type)}
                        {item.type}
                      </TypeBadge>
                    </TableCell>
                    <TableCell>
                      <span
                        style={{
                          fontWeight: 600,
                          color:
                            item.type === 'RENDIMENTO'
                              ? '#2ecc71'
                              : item.type === 'SAQUE'
                              ? '#e74c3c'
                              : '#3498db',
                        }}
                      >
                        {item.type === 'SAQUE' ? '-' : '+'}
                        {formatCurrency(item.value)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.description || (
                        <span style={{ color: '#95a5a6', fontStyle: 'italic' }}>
                          Sem descrição
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </HistoryTable>
          </div>
        )}
      </HistoryCard>
    </ReportsContainer>
  );
};

export default Reports;
