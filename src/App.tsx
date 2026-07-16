import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import DashboardLayout from './component/layout/DashboardLayout'
import GraphExplorerPage from './features/graphexplorer/graphExplorerPage'
import './App.css'

import { Routes, Route } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

  return (
     <Routes>
      
      <Route path="/" element={<DashboardLayout />}>
   <Route index element={<GraphExplorerPage />} />
        {/* future pages nest here: <Route path="datasets" element={<DatasetList />} /> */}
      </Route>
    </Routes>

  )
}

export default App
