import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Wallet from "./components/Wallet/Wallet"
import './App.css'
import Navigation from './components/Navigation/Navigation'
import DisplayPanel from './components/DisplayPanels/DisplayPanel'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Wallet>
        <Navigation />
        <DisplayPanel />
      </Wallet>
    </>
  )
}

export default App
