import './App.css'
import ChatBot from './components/Chatbot'

function App() {
  return (
    <div className="App" style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1576747062714-51b06c74450d?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      backgroundSize: "cover",
      minHeight: "100vh",
    }}>
      <div
        style={{ 
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          width: "100%",
          background: "rgba(0, 0, 0, 0.5)", 
          height: "100vh",
          backdropFilter: "blur(5px)"
        }}/>
      <ChatBot />
    </div>
  )
}

export default App
