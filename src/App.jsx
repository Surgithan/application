import { useState } from 'react'
import Form from './Components/Form'
import ApplicationsList from './Components/ApplicationsList'

function App() {

  return (
    <div className="app-wrapper">
      <style>{`
        .app-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 1200px;
          gap: 40px;
          padding: 40px 20px;
        }
      `}</style>
      <Form />
      {/* <ApplicationsList /> */}
    </div>
  )
}

export default App
