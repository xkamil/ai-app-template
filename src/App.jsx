import React from 'react'

function App() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h1 className="display-4 fw-bold text-primary mb-3">
                    Welcome to AI App Template
                  </h1>
                  <p className="lead text-muted">
                    A modern React application template for building AI-powered applications
                  </p>
                </div>

                <hr className="my-4" />

                <div className="row g-4 mt-3">
                  <div className="col-md-4">
                    <div className="text-center">
                      <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                           style={{width: '80px', height: '80px'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="text-primary" viewBox="0 0 16 16">
                          <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                          <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z"/>
                        </svg>
                      </div>
                      <h5 className="fw-bold">React 18</h5>
                      <p className="text-muted small">Latest version with modern features</p>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="text-center">
                      <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                           style={{width: '80px', height: '80px'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="text-success" viewBox="0 0 16 16">
                          <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"/>
                        </svg>
                      </div>
                      <h5 className="fw-bold">Bootstrap 5</h5>
                      <p className="text-muted small">Beautiful, responsive design</p>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="text-center">
                      <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                           style={{width: '80px', height: '80px'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="text-warning" viewBox="0 0 16 16">
                          <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
                        </svg>
                      </div>
                      <h5 className="fw-bold">Single File</h5>
                      <p className="text-muted small">Everything in one HTML file</p>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-5">
                  <button className="btn btn-primary btn-lg px-5">Get Started</button>
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="text-muted">
                Built with React {React.version} | Ready for AI integration
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
