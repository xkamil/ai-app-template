import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import LanguageSwitcher from '../components/LanguageSwitcher'

function DashboardPage() {
  const { user, signOut } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">{t('dashboard.title')}</a>
          <div className="d-flex gap-2 align-items-center">
            <LanguageSwitcher />
            <button className="btn btn-outline-light" onClick={handleSignOut}>
              {t('dashboard.signOut')}
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body p-4">
                <h2 className="card-title fw-bold mb-3">{t('dashboard.welcomeTitle')}</h2>
                <p className="text-muted mb-4">
                  {t('dashboard.welcomeSubtitle')}
                </p>

                <div className="alert alert-success" role="alert">
                  <h5 className="alert-heading">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle-fill me-2" viewBox="0 0 16 16">
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                    {t('dashboard.sessionActive')}
                  </h5>
                  <p className="mb-0">
                    <strong>{t('dashboard.userEmail')}:</strong> {user?.email}
                  </p>
                  <p className="mb-0">
                    <small className="text-muted">{t('dashboard.userId')}: {user?.id}</small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                     style={{width: '60px', height: '60px'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="text-primary" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                  </svg>
                </div>
                <h5 className="card-title fw-bold">{t('dashboard.profile')}</h5>
                <p className="card-text text-muted">{t('dashboard.profileDescription')}</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                     style={{width: '60px', height: '60px'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="text-success" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                  </svg>
                </div>
                <h5 className="card-title fw-bold">{t('dashboard.aiFeatures')}</h5>
                <p className="card-text text-muted">{t('dashboard.aiFeaturesDescription')}</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                     style={{width: '60px', height: '60px'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="text-warning" viewBox="0 0 16 16">
                    <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5h3z"/>
                    <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-12z"/>
                  </svg>
                </div>
                <h5 className="card-title fw-bold">{t('dashboard.settings')}</h5>
                <p className="card-text text-muted">{t('dashboard.settingsDescription')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-3">{t('dashboard.sessionInfo')}</h5>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <tbody>
                      <tr>
                        <td className="fw-semibold">{t('dashboard.status')}:</td>
                        <td><span className="badge bg-success">{t('dashboard.statusActive')}</span></td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">{t('dashboard.storage')}:</td>
                        <td>{t('dashboard.storageValue')}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">{t('dashboard.authentication')}:</td>
                        <td>{t('dashboard.authenticationValue')}</td>
                      </tr>
                      <tr>
                        <td className="fw-semibold">{t('dashboard.lastActivity')}:</td>
                        <td>{new Date().toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
