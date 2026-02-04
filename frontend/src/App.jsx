import { useState } from 'react'
import axios from 'axios'

function App() {
  const [address, setAddress] = useState('')
  const [chain, setChain] = useState('ETH')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const checkAddress = async () => {
    if (!address.trim()) {
      setError('Введите адрес')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await axios.post('/api/check-address', {
        address: address.trim(),
        chain
      })
      setResult(response.data)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.message ||
        'Ошибка связи с сервером'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      fontFamily: 'system-ui, sans-serif',
      padding: '20px'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        background: '#0a0a0a',
        borderBottom: '1px solid #222'
      }}>
        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#e53935' }}>
          <span style={{ marginRight: '8px' }}>R</span> OpenAML
        </div>
        <div style={{ fontSize: '1.4rem' }}>💬</div>
      </header>

      <main style={{ maxWidth: '500px', margin: '40px auto' }}>
        <div style={{
          background: '#111',
          borderRadius: '16px',
          padding: '32px 24px',
          border: '1px solid #222',
          boxShadow: '0 8px 32px rgba(229,57,53,0.1)'
        }}>
          <h1 style={{
            color: '#e53935',
            textAlign: 'center',
            marginBottom: '32px',
            fontSize: '1.8rem'
          }}>
            Проверка адреса на AML-риски
          </h1>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontWeight: 500 }}>
              Адрес кошелька
            </label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="0x1234... или bc1q..."
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#0a0a0a',
                border: '1px solid #333',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '1.05rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontWeight: 500 }}>
              Сеть
            </label>
            <select
              value={chain}
              onChange={e => setChain(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#0a0a0a',
                border: '1px solid #333',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '1.05rem'
              }}
            >
              <option value="ETH">Ethereum (ETH)</option>
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="TRX">TRON (TRX)</option>
              <option value="BSC">BSC</option>
              <option value="other">Другая</option>
            </select>
          </div>

          <button
            onClick={checkAddress}
            disabled={loading || !address.trim()}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? '#444' : '#e53935',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: loading || !address.trim() ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {loading ? 'Проверка...' : 'Проверить на риски'}
          </button>

          {error && (
            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: '#330000',
              borderRadius: '10px',
              color: '#ffcccc',
              border: '1px solid #660000'
            }}>
              {error}
            </div>
          )}

          {result && (
            <div style={{
              marginTop: '32px',
              padding: '24px',
              background: '#0a0a0a',
              borderRadius: '12px',
              border: '1px solid #222'
            }}>
              <h3 style={{ color: '#e53935', marginBottom: '16px' }}>Результат</h3>
              <p><strong>Адрес:</strong> {result.address}</p>
              <p><strong>Сеть:</strong> {result.chain}</p>
              <p>
                <strong>Risk Score:</strong>{' '}
                <span style={{
                  color: result.risk_score > 0.7 ? '#ff5252' : 
                         result.risk_score > 0.3 ? '#ffb300' : 
                         '#66bb6a',
                  fontWeight: 'bold',
                  fontSize: '1.3rem'
                }}>
                  {result.risk_score}
                </span>
              </p>
              <p><strong>Категория:</strong> <strong>{result.category}</strong></p>
              {result.reason && <p><strong>Причина:</strong> {result.reason}</p>}
              {result.note && <p style={{ color: '#888', marginTop: '16px' }}>{result.note}</p>}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
