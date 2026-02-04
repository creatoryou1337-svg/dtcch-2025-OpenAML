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
      setError('Введите адрес кошелька')
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
        'Ошибка соединения с сервером'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      color: '#ffffff',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Шапка в стиле RedWallet */}
      <header style={{
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#0a0a0a',
        borderBottom: '1px solid #222222'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '1.6rem',
          fontWeight: 'bold',
          color: '#e53935'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: '#e53935',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '1.4rem'
          }}>R</div>
          OpenAML
        </div>
        <div style={{ fontSize: '1.4rem', cursor: 'pointer' }}>💬</div>
      </header>

      {/* Основной контент */}
      <main style={{ maxWidth: '480px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{
          background: '#111111',
          borderRadius: '16px',
          padding: '32px 24px',
          border: '1px solid #222222',
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

          {/* Поле адреса */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#aaaaaa', fontWeight: 500 }}>
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
                border: '1px solid #333333',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '1.05rem'
              }}
            />
          </div>

          {/* Выбор сети */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#aaaaaa', fontWeight: 500 }}>
              Сеть
            </label>
            <select
              value={chain}
              onChange={e => setChain(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#0a0a0a',
                border: '1px solid #333333',
                borderRadius: '10px',
                color: '#ffffff',
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

          {/* Кнопка */}
          <button
            onClick={checkAddress}
            disabled={loading || !address.trim()}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? '#444444' : '#e53935',
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

          {/* Ошибка */}
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

          {/* Результат */}
          {result && (
            <div style={{
              marginTop: '32px',
              padding: '24px',
              background: '#0a0a0a',
              borderRadius: '12px',
              border: '1px solid #222222'
            }}>
              <h3 style={{ color: '#e53935', marginBottom: '16px' }}>Результат проверки</h3>
              <p><strong>Адрес:</strong> {result.address}</p>
              <p><strong>Сеть:</strong> {result.chain}</p>
              <p>
                <strong>Risk Score:</strong>{' '}
                <span style={{
                  color: result.risk_score > 0.7 ? '#ff5252' : 
                         result.risk_score > 0.3 ? '#ffb300' : 
                         '#66bb6a',
                  fontWeight: 'bold',
                  fontSize: '1.4rem'
                }}>
                  {result.risk_score}
                </span>
              </p>
              <p><strong>Категория:</strong> <strong>{result.category}</strong></p>
              {result.note && <p style={{ color: '#888888', marginTop: '16px' }}>{result.note}</p>}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
