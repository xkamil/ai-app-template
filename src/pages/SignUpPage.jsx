import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import LanguageSwitcher from '../components/LanguageSwitcher'

function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp, user, loading: authLoading } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to dashboard if user is already logged in
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, authLoading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (password !== confirmPassword) {
      setError(t('errors.passwordsDoNotMatch'))
      return
    }

    if (password.length < 6) {
      setError(t('errors.passwordTooShort'))
      return
    }

    setLoading(true)

    const { data, error: signUpError } = await signUp(email, password)

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      // If email confirmation is disabled, user is logged in immediately
      if (data?.user && data?.session) {
        setTimeout(() => navigate('/dashboard'), 2000)
      }
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
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">{t('signup.title')}</h2>
                  <p className="text-muted">{t('signup.subtitle')}</p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success" role="alert">
                    {t('signup.successMessage')}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
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

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">{t('common.password')}</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading || success}
                      minLength={6}
                    />
                    <small className="text-muted">{t('signup.passwordHint')}</small>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">{t('signup.confirmPassword')}</label>
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
                        {t('signup.creatingAccount')}
                      </>
                    ) : (
                      t('signup.signUpButton')
                    )}
                  </button>
                </form>

                <hr className="my-4" />

                <div className="text-center">
                  <p className="mb-0">
                    {t('signup.alreadyHaveAccount')}{' '}
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

export default SignUpPage
