import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import { supportedLanguages } from '../locales'

function LanguageSwitcher({ className = '' }) {
  const { currentLanguage, changeLanguage, t } = useLanguage()

  return (
    <div className={`dropdown ${className}`}>
      <button
        className="btn btn-outline-secondary btn-sm dropdown-toggle"
        type="button"
        id="languageDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {supportedLanguages.find(lang => lang.code === currentLanguage)?.flag} {currentLanguage.toUpperCase()}
      </button>
      <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
        {supportedLanguages.map((lang) => (
          <li key={lang.code}>
            <button
              className={`dropdown-item ${currentLanguage === lang.code ? 'active' : ''}`}
              onClick={() => changeLanguage(lang.code)}
            >
              {lang.flag} {lang.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LanguageSwitcher
