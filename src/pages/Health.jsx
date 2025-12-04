import { useEffect, useState } from 'react'
import { checkBackendHealth, checkAPIHealth } from '../lib/healthCheck'

export default function Health() {
  const [backendStatus, setBackendStatus] = useState(null)
  const [apiStatus, setApiStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const runHealthChecks = async () => {
      setLoading(true)

      // Check backend health
      const backendResult = await checkBackendHealth()
      setBackendStatus(backendResult)

      // Check API health (requires auth)
      const apiResult = await checkAPIHealth()
      setApiStatus(apiResult)

      setLoading(false)
    }

    runHealthChecks()
  }, [])

  const StatusIndicator = ({ success }) => (
    <span className={`inline-block w-3 h-3 rounded-full ${success ? 'bg-green-500' : 'bg-red-500'}`} />
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Backend-Frontend Integration Status</h1>

        {loading ? (
          <div className="text-white text-center py-8">
            <div className="animate-pulse">Running health checks...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Backend Health Check */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <StatusIndicator success={backendStatus?.success} />
                <h2 className="text-xl font-semibold text-white">Backend Health</h2>
              </div>

              {backendStatus?.success ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <span className="ml-2 text-green-400 font-semibold">{backendStatus.data.status}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Environment:</span>
                      <span className="ml-2 text-white">{backendStatus.data.env}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Database:</span>
                      <span className={`ml-2 font-semibold ${backendStatus.data.database === 'connected' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {backendStatus.data.database}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Uptime:</span>
                      <span className="ml-2 text-white">{Math.floor(backendStatus.data.uptime)}s</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="text-gray-400 text-sm">CORS Allowed Origins:</span>
                    <ul className="mt-2 space-y-1">
                      {backendStatus.data.cors_allowed_origins?.map((origin, idx) => (
                        <li key={idx} className="text-xs text-white bg-white/5 px-3 py-1 rounded border border-white/10">
                          {origin}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <details className="mt-4">
                    <summary className="text-sm text-gray-400 cursor-pointer hover:text-white">View Raw Response</summary>
                    <pre className="mt-2 bg-slate-900/50 p-4 rounded border border-white/10 text-xs text-white overflow-auto">
                      {JSON.stringify(backendStatus.data, null, 2)}
                    </pre>
                  </details>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-red-400">❌ Backend is not reachable</p>
                  <p className="text-sm text-gray-400">Error: {backendStatus?.error}</p>
                  {backendStatus?.details && (
                    <pre className="bg-rose-900/30 p-4 rounded border border-rose-500/30 text-xs text-white overflow-auto">
                      {JSON.stringify(backendStatus.details, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>

            {/* API Health Check */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <StatusIndicator success={apiStatus?.success} />
                <h2 className="text-xl font-semibold text-white">API Health (Authenticated)</h2>
              </div>

              {apiStatus?.success ? (
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="text-gray-400">Status:</span>
                    <span className="ml-2 text-green-400 font-semibold">{apiStatus.data.status}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-400">Message:</span>
                    <span className="ml-2 text-white">{apiStatus.data.message}</span>
                  </div>

                  <details className="mt-4">
                    <summary className="text-sm text-gray-400 cursor-pointer hover:text-white">View Raw Response</summary>
                    <pre className="mt-2 bg-slate-900/50 p-4 rounded border border-white/10 text-xs text-white overflow-auto">
                      {JSON.stringify(apiStatus.data, null, 2)}
                    </pre>
                  </details>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-yellow-400">⚠️ API endpoint check failed (authentication may be required)</p>
                  <p className="text-sm text-gray-400">Error: {apiStatus?.error}</p>
                  {apiStatus?.details && (
                    <pre className="bg-yellow-900/30 p-4 rounded border border-yellow-500/30 text-xs text-white overflow-auto">
                      {JSON.stringify(apiStatus.details, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>

            {/* Connection Info */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">Connection Information</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">Frontend URL:</span>
                  <span className="ml-2 text-white">{window.location.origin}</span>
                </div>
                <div>
                  <span className="text-gray-400">Backend URL:</span>
                  <span className="ml-2 text-white">{import.meta.env.VITE_API_URL || 'https://backend-7we0u50ee-jsjgdh-4059s-projects.vercel.app'}</span>
                </div>
                <div className="mt-4 p-4 bg-blue-900/30 rounded border border-blue-500/30">
                  <p className="text-blue-300 text-xs">
                    💡 <strong>Tip:</strong> If the backend health check fails, ensure:
                  </p>
                  <ul className="mt-2 text-xs text-blue-200 list-disc list-inside space-y-1">
                    <li>The backend server is running</li>
                    <li>CORS is configured to allow this frontend origin</li>
                    <li>Network connectivity is available</li>
                    <li>The backend URL is correct</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

