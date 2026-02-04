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
      const res = await axios.post('/api/check-address', {
        address: address.trim(),
        chain
      })
      setResult(res.data)
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
      fontFamily: 'system-ui, sans-serif'
    }}>
      <header style={{
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#0a0a0a',
        borderBottom: '1px solid #222'
      }}>
        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#e53935' }}>
          <span style={{ marginRight: '8px' }}>R</span> OpenAML
        </div>
        <div style={{ fontSize: '1.4rem' }}>💬</div>
      </header>

      <main style={{ maxWidth: '480px', margin: '40px auto', padding: '0 20px' }}>
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
            <label style={{ display: 'block', marginBottom: '8px', color: '#aaa' }}>
              Адрес кошелька
            </label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="0x1234... или bc1q..."
              style={{
                width: '100%',
                padding: '14px',
                background: '#0a0a0a',
                border: '1px solid #333',
                borderRadius: '10px',
                color: '#fff'
              }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#aaa' }}>
              Сеть
            </label>
            <select
              value={chain}
              onChange={e => setChain(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                background: '#0a0a0a',
                border: '1px solid #333',
                borderRadius: '10px',
                color: '#fff'
              }}
            >
              <option value="ETH">Ethereum</option>
              <option value="BTC">Bitcoin</option>
              <option value="TRX">TRON</option>
              <option value="BSC">BSC</option>
            </select>
          </div>

          <button
            onClick={checkAddress}
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? '#444' : '#e53935',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Проверка...' : 'Проверить'}
          </button>

          {error && <div style={{ marginTop: '20px', color: '#ff5252' }}>{error}</div>}

          {result && (
            <div style={{ marginTop: '30px', padding: '20px', background: '#0a0a0a', borderRadius: '12px' }}>
              <h3 style={{ color: '#e53935' }}>Результат</h3>
              <p><strong>Адрес:</strong> {result.address}</p>
              <p><strong>Risk Score:</strong> <strong style={{ color: '#ff5252' }}>{result.risk_score}</strong></p>
              <p><strong>Категория:</strong> {result.category}</p>
              {result.note && <p style={{ color: '#aaa', marginTop: '16px' }}>{result.note}</p>}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
