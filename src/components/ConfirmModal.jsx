import { useLanguage } from '../context/LanguageContext';

const ConfirmModal = ({
  show,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  isDanger = true
}) => {
  const { t } = useLanguage();

  if (!show) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1050,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-4)'
        }}
        onClick={handleBackdropClick}
      >
        {/* Modal */}
        <div
          className="dark-card fade-in"
          style={{
            maxWidth: '400px',
            width: '100%',
            padding: 'var(--space-6)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title */}
          {title && (
            <h2 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-4)',
              margin: 0
            }}>
              {title}
            </h2>
          )}

          {/* Message */}
          <p style={{
            fontSize: 'var(--text-base)',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-5)',
            lineHeight: '1.5'
          }}>
            {message}
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button
              onClick={onCancel}
              className="ghost-button"
              style={{ flex: 1 }}
            >
              {cancelText || t('common.cancel') || 'Cancel'}
            </button>
            <button
              onClick={onConfirm}
              style={{
                flex: 1,
                padding: 'var(--space-3) var(--space-4)',
                background: isDanger ? 'var(--danger)' : 'var(--accent-primary)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                color: 'white',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-semibold)',
                cursor: 'pointer',
                transition: 'all var(--transition-base)'
              }}
              onMouseEnter={(e) => {
                e.target.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '1';
              }}
            >
              {confirmText || t('common.confirm') || 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;
