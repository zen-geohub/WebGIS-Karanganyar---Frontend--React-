import { HashRouter, Routes, Route } from "react-router-dom"
import Homepage from "./pages/Homepage"
import Dashboard from "./pages/Dashboard"

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </HashRouter>
  )
}

export default App
