import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import LanguageSwitcher from '../components/LanguageSwitcher'

function PasswordResetPage() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isRecoveryMode, setIsRecoveryMode] = useState(false)
  const { resetPassword, updatePassword } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  useEffect(() => {
    // Check if we're in password recovery mode (user clicked link from email)
    const hashParams = new URLSearchParams(window.location.hash.split('?')[1])
    const accessToken = hashParams.get('access_token')
    const type = hashParams.get('type')

    if (accessToken && type === 'recovery') {
      setIsRecoveryMode(true)
    }
  }, [])

  const handleResetRequest = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    const { error: resetError } = await resetPassword(email)

    if (resetError) {
      setError(resetError.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (newPassword !== confirmPassword) {
      setError(t('errors.passwordsDoNotMatch'))
      return
    }

    if (newPassword.length < 6) {
      setError(t('errors.passwordTooShort'))
      return
    }

    setLoading(true)

    const { error: updateError } = await updatePassword(newPassword)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      setTimeout(() => navigate('/dashboard'), 2000)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light position-relative">
      <div className="position-absolute top-0 end-0 p-3">
        <LanguageSwitcher />
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                {!isRecoveryMode ? (
                  <>
                    <div className="text-center mb-4">
                      <h2 className="fw-bold text-primary">{t('passwordReset.title')}</h2>
                      <p className="text-muted">{t('passwordReset.subtitle')}</p>
                    </div>

                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}

                    {success && (
                      <div className="alert alert-success" role="alert">
                        {t('passwordReset.successMessage')}
                      </div>
                    )}

                    <form onSubmit={handleResetRequest}>
                      <div className="mb-4">
                        <label htmlFor="email" className="form-label">{t('common.email')}</label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading || success}
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 mb-3"
                        disabled={loading || success}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {t('passwordReset.sending')}
                          </>
                        ) : (
                          t('passwordReset.sendResetButton')
                        )}
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <h2 className="fw-bold text-primary">{t('passwordReset.updateTitle')}</h2>
                      <p className="text-muted">{t('passwordReset.updateSubtitle')}</p>
                    </div>

                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}

                    {success && (
                      <div className="alert alert-success" role="alert">
                        {t('passwordReset.updateSuccessMessage')}
                      </div>
                    )}

                    <form onSubmit={handlePasswordUpdate}>
                      <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">{t('passwordReset.newPassword')}</label>
                        <input
                          type="password"
                          className="form-control form-control-lg"
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          disabled={loading || success}
                          minLength={6}
                        />
                        <small className="text-muted">{t('passwordReset.passwordHint')}</small>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="confirmPassword" className="form-label">{t('passwordReset.confirmPassword')}</label>
                        <input
                          type="password"
                          className="form-control form-control-lg"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          disabled={loading || success}
                          minLength={6}
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 mb-3"
                        disabled={loading || success}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {t('passwordReset.updating')}
                          </>
                        ) : (
                          t('passwordReset.updateButton')
                        )}
                      </button>
                    </form>
                  </>
                )}

                <hr className="my-4" />

                <div className="text-center">
                  <p className="mb-0">
                    {t('passwordReset.rememberPassword')}{' '}
                    <Link to="/" className="text-decoration-none fw-bold">
                      {t('signup.signIn')}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordResetPage
