import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../locales'

const LanguageContext = createContext({})

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

const detectBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage
  const langCode = browserLang.split('-')[0] // Get 'pl' from 'pl-PL'

  // Check if we support this language
  if (translations[langCode]) {
    return langCode
  }

  // Default to English
  return 'en'
}

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Try to get saved language from localStorage
    const savedLanguage = localStorage.getItem('app-language')

    if (savedLanguage && translations[savedLanguage]) {
      return savedLanguage
    }

    // Otherwise, detect browser language
    return detectBrowserLanguage()
  })

  useEffect(() => {
    // Save language preference to localStorage whenever it changes
    localStorage.setItem('app-language', currentLanguage)
  }, [currentLanguage])

  const changeLanguage = (langCode) => {
    if (translations[langCode]) {
      setCurrentLanguage(langCode)
    }
  }

  // Translation function
  const t = (key, params = {}) => {
    const keys = key.split('.')
    let value = translations[currentLanguage]

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        // Fallback to English if translation not found
        value = translations.en
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object') {
            value = value[fallbackKey]
          } else {
            return key // Return key if translation not found
          }
        }
        break
      }
    }

    let result = value || key

    // Replace placeholders with params
    if (typeof result === 'string' && params) {
      Object.keys(params).forEach(paramKey => {
        result = result.replace(`{${paramKey}}`, params[paramKey])
      })
    }

    return result
  }

  const value = {
    currentLanguage,
    changeLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
