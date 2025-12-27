import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaLock,
} from 'react-icons/fa';
import api from '../../services/api';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Modal from '../../components/Modal/Modal';

const ProfileContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 800px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: white;
  text-align: center;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  font-size: 3rem;
  border: 4px solid white;
`;

const ProfileName = styled.h1`
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ProfileEmail = styled.p`
  font-size: 1rem;
  opacity: 0.9;
`;

const ProfileCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const CardTitle = styled.h2`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const InfoGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background};
`;

const InfoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/auth/me');
      const userData = response.data.user;
      setUser(userData);
      setFormData({
        name: userData.name,
        email: userData.email,
      });
    } catch (error) {
      toast.error('Erro ao carregar dados do usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/auth/me', formData);
      setUser(response.data.user);
      // Atualizar localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Perfil atualizado com sucesso!');
      setEditing(false);
      fetchUserData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar perfil');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Senha alterada com sucesso!');
      setPasswordModalOpen(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao alterar senha');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return <ProfileContainer>Carregando...</ProfileContainer>;
  }

  if (!user) {
    return <ProfileContainer>Erro ao carregar dados do usuário</ProfileContainer>;
  }

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Avatar>
          {getInitials(user.name)}
        </Avatar>
        <ProfileName>{user.name}</ProfileName>
        <ProfileEmail>{user.email}</ProfileEmail>
      </ProfileHeader>

      <ProfileCard>
        <CardHeader>
          <CardTitle>
            <FaUser />
            Informações Pessoais
          </CardTitle>
          {!editing ? (
            <Button variant="outline" onClick={() => setEditing(true)}>
              <FaEdit />
              Editar
            </Button>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                variant="outline"
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    name: user.name,
                    email: user.email,
                  });
                }}
              >
                <FaTimes />
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleUpdateProfile}>
                <FaSave />
                Salvar
              </Button>
            </div>
          )}
        </CardHeader>

        {editing ? (
          <form onSubmit={handleUpdateProfile}>
            <InfoGrid>
              <Input
                label="Nome Completo"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <Input
                type="email"
                label="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </InfoGrid>
          </form>
        ) : (
          <InfoGrid>
            <InfoItem>
              <InfoIcon>
                <FaUser />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Nome Completo</InfoLabel>
                <InfoValue>{user.name}</InfoValue>
              </InfoContent>
            </InfoItem>
            <InfoItem>
              <InfoIcon>
                <FaEnvelope />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{user.email}</InfoValue>
              </InfoContent>
            </InfoItem>
            <InfoItem>
              <InfoIcon>
                <FaCalendarAlt />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Membro desde</InfoLabel>
                <InfoValue>
                  {new Date(user.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </InfoValue>
              </InfoContent>
            </InfoItem>
          </InfoGrid>
        )}
      </ProfileCard>

      <ProfileCard>
        <CardHeader>
          <CardTitle>
            <FaLock />
            Segurança
          </CardTitle>
        </CardHeader>
        <ActionsGrid>
          <Button
            variant="primary"
            fullWidth
            onClick={() => setPasswordModalOpen(true)}
          >
            <FaLock />
            Alterar Senha
          </Button>
        </ActionsGrid>
      </ProfileCard>

      <Modal
        isOpen={passwordModalOpen}
        onClose={() => {
          setPasswordModalOpen(false);
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        }}
        title="Alterar Senha"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setPasswordModalOpen(false);
                setPasswordData({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                });
              }}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleChangePassword}>
              <FaSave />
              Salvar
            </Button>
          </>
        }
      >
        <form onSubmit={handleChangePassword}>
          <InfoGrid>
            <Input
              type="password"
              label="Senha Atual"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
              required
            />
            <Input
              type="password"
              label="Nova Senha"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              required
            />
            <Input
              type="password"
              label="Confirmar Nova Senha"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              required
            />
          </InfoGrid>
        </form>
      </Modal>
    </ProfileContainer>
  );
};

export default Profile;

