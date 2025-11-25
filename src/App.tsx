import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Blocks from './pages/Blocks'
import Wallet from './pages/Wallet'
import Mine from './pages/Mine'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blocks" element={<Blocks />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/mine" element={<Mine />} />
      </Routes>
    </Router>
  )
}

export default App
