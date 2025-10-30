import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useExercise } from '../context/ExerciseContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import LanguageSwitcher from '../components/LanguageSwitcher';

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const { muscleGroups, addMuscleGroup, deleteMuscleGroup } = useExercise();
  const navigate = useNavigate();
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleSignOut = async () => {
    if (window.confirm(t('profile.logoutConfirm'))) {
      try {
        await signOut();
        navigate('/');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    const result = await addMuscleGroup(newCategoryName.trim());
    if (result.error) {
      alert(result.error);
    } else {
      setNewCategoryName('');
      setShowAddCategory(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (window.confirm(t('profile.categories.deleteConfirm').replace('{name}', name))) {
      const result = await deleteMuscleGroup(id);
      if (result.error) {
        alert(t('profile.categories.deleteError'));
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          {t('profile.title')}
        </h1>
        <p className="page-subtitle">
          {user?.email}
        </p>
      </div>

      <div className="page-content">
        {/* User Info Card */}
        <div className="dark-card fade-in" style={{ marginBottom: 'var(--space-4)', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: 'var(--space-3)' }}>👤</div>
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
            {user?.email}
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
            {user?.created_at ? t('profile.memberSince').replace('{date}', formatDate(user.created_at)) : ''}
          </div>
        </div>

        {/* Settings Section */}
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <h2 style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
            ⚙️ {t('profile.settings.title')}
          </h2>

          <div className="dark-card" style={{ marginBottom: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  🌐 {t('profile.settings.language')}
                </div>
              </div>
              <LanguageSwitcher />
            </div>
          </div>

          <div className="dark-card" style={{ marginBottom: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  🌙 {t('profile.settings.darkMode')}
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                  {t('profile.settings.darkModeAlways')}
                </div>
              </div>
              <div style={{ fontSize: 'var(--text-2xl)' }}>●</div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', margin: 0 }}>
              🏷️ {t('profile.categories.title')}
            </h2>
            <button
              onClick={() => setShowAddCategory(true)}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                background: 'var(--accent-primary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                color: 'white',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-semibold)',
                cursor: 'pointer'
              }}
            >
              ➕ {t('profile.categories.add')}
            </button>
          </div>

          {/* Add Category Form */}
          {showAddCategory && (
            <div className="dark-card" style={{ marginBottom: 'var(--space-3)', padding: 'var(--space-3)' }}>
              <div style={{ marginBottom: 'var(--space-2)' }}>
                <input
                  type="text"
                  className="dark-input"
                  placeholder="Category name..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                  autoFocus
                  style={{ fontSize: 'var(--text-base)' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  onClick={handleAddCategory}
                  style={{
                    flex: 1,
                    padding: 'var(--space-2)',
                    background: 'var(--accent-primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    color: 'white',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    cursor: 'pointer'
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategoryName('');
                  }}
                  style={{
                    flex: 1,
                    padding: 'var(--space-2)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Categories List */}
          {muscleGroups.length === 0 ? (
            <div className="dark-card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
              <div style={{ fontSize: '48px', marginBottom: 'var(--space-2)' }}>🏷️</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                No muscle groups yet. Add one to organize your exercises!
              </p>
            </div>
          ) : (
            muscleGroups.map(group => (
              <div
                key={group.id}
                className="dark-card"
                style={{
                  marginBottom: 'var(--space-2)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-medium)',
                    color: 'var(--text-primary)'
                  }}>
                    💪 {group.name}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteCategory(group.id, group.name)}
                  style={{
                    padding: 'var(--space-2)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--danger)',
                    fontSize: 'var(--text-lg)',
                    cursor: 'pointer'
                  }}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleSignOut}
          style={{
            width: '100%',
            padding: 'var(--space-3)',
            background: 'transparent',
            border: '2px solid var(--danger)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--danger)',
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-bold)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--danger)';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = 'var(--danger)';
          }}
        >
          🚪 {t('profile.logout')}
        </button>

        {/* Version Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: 'var(--space-8)',
          padding: 'var(--space-4)',
          color: 'var(--text-tertiary)',
          fontSize: 'var(--text-xs)'
        }}>
          <div className="divider" />
          {t('profile.version')} • Made with 💪
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
