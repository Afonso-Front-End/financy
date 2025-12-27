import { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { toast } from 'react-toastify';
import {
  FaWallet,
  FaChartLine,
  FaCalendarAlt,
  FaBriefcase,
  FaArrowUp,
  FaPiggyBank,
} from 'react-icons/fa';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatCurrency';

const DashboardContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatCard = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== '$color',
})`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border-left: 4px solid
    ${({ $color, theme }) => theme.colors[$color] || theme.colors.primary};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StatTitle = styled.h3`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textLight};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.h2`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ChartCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const ChartTitle = styled.h3`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ChartSubtitle = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const Loading = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textLight};
`;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: 'white',
          padding: '12px',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#2c3e50' }}>
          {label}
        </p>
        {payload.map((entry, index) => (
          <p
            key={index}
            style={{
              margin: '4px 0',
              color: entry.color,
              fontWeight: 600,
            }}
          >
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/investments/stats/summary');
      setStats(response.data.data);
    } catch (error) {
      toast.error('Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading>Carregando...</Loading>;
  }

  if (!stats || !stats.monthlyEvolution) {
    return <Loading>Nenhum dado disponível</Loading>;
  }

  const chartData = (stats.monthlyEvolution || []).map((item) => ({
    mês: item.month ? item.month.substring(5) : '',
    lucro: item.profit || 0,
    fullDate: item.month || '',
  }));

  // Calcular média e tendência
  const totalProfit = chartData.reduce((sum, item) => sum + (item.lucro || 0), 0);
  const averageProfit = chartData.length > 0 ? totalProfit / chartData.length : 0;
  const lastMonthProfit = chartData.length > 0 ? (chartData[chartData.length - 1]?.lucro || 0) : 0;
  const previousMonthProfit = chartData.length > 1 ? (chartData[chartData.length - 2]?.lucro || 0) : 0;
  const trend = lastMonthProfit > previousMonthProfit ? 'up' : 'down';

  // Cores para barras baseadas no valor
  const getBarColor = (value) => {
    if (value >= averageProfit * 1.2) return '#2ecc71'; // Verde para valores altos
    if (value >= averageProfit) return '#3498db'; // Azul para valores médios
    return '#95a5a6'; // Cinza para valores baixos
  };

  return (
    <DashboardContainer>
      <StatsGrid>
        <StatCard $color="primary">
          <StatHeader>
            <FaWallet size={24} />
            <StatTitle>Total Investido</StatTitle>
          </StatHeader>
          <StatValue>{formatCurrency(stats.totalInvested)}</StatValue>
        </StatCard>
        <StatCard $color="profit">
          <StatHeader>
            <FaChartLine size={24} />
            <StatTitle>Lucro Total</StatTitle>
          </StatHeader>
          <StatValue>{formatCurrency(stats.totalProfit)}</StatValue>
        </StatCard>
        <StatCard $color="info">
          <StatHeader>
            <FaCalendarAlt size={24} />
            <StatTitle>Lucro do Mês</StatTitle>
          </StatHeader>
          <StatValue>{formatCurrency(stats.currentMonthProfit)}</StatValue>
        </StatCard>
        <StatCard $color="secondary">
          <StatHeader>
            <FaBriefcase size={24} />
            <StatTitle>Investimentos Ativos</StatTitle>
          </StatHeader>
          <StatValue>{stats.investmentsCount + (stats.piggyBanksCount || 0)}</StatValue>
        </StatCard>
        {stats.totalInPiggyBanks > 0 && (
          <StatCard $color="warning">
            <StatHeader>
              <FaPiggyBank size={24} />
              <StatTitle>Em Cofrinhos</StatTitle>
            </StatHeader>
            <StatValue>{formatCurrency(stats.totalInPiggyBanks || 0)}</StatValue>
          </StatCard>
        )}
      </StatsGrid>

      {chartData.length > 0 && (
        <ChartsGrid>
          <ChartCard>
            <ChartHeader>
            <div>
              <ChartTitle>
                <FaArrowUp />
                Evolução de Lucros
              </ChartTitle>
              <ChartSubtitle>
                Últimos 12 meses • Média: {formatCurrency(averageProfit)}
              </ChartSubtitle>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: trend === 'up' ? '#2ecc71' : '#e74c3c',
                fontWeight: 600,
              }}
            >
              <FaArrowUp
                style={{
                  transform: trend === 'down' ? 'rotate(180deg)' : 'none',
                }}
              />
              {trend === 'up' ? 'Crescendo' : 'Em queda'}
            </div>
          </ChartHeader>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2ecc71" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e0e0e0"
                vertical={false}
              />
              <XAxis
                dataKey="mês"
                stroke="#7f8c8d"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="#7f8c8d"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Area
                type="monotone"
                dataKey="lucro"
                stroke="#2ecc71"
                strokeWidth={3}
                fill="url(#colorLucro)"
                name="Lucro Mensal"
                dot={{ fill: '#2ecc71', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <div>
              <ChartTitle>
                <FaChartLine />
                Comparação Mensal
              </ChartTitle>
              <ChartSubtitle>
                Análise detalhada por período
              </ChartSubtitle>
            </div>
          </ChartHeader>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e0e0e0"
                vertical={false}
              />
              <XAxis
                dataKey="mês"
                stroke="#7f8c8d"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="#7f8c8d"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="square"
              />
              <Bar
                dataKey="lucro"
                name="Lucro Mensal"
                radius={[8, 8, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.lucro)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        </ChartsGrid>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;
