import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import Home from './Home';
import Login from './Login';
import Register from './Register';

function App() {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Login username={username} setUsername={setUsername} password={password} setPassword={setPassword}/>} />
        <Route path="/home" element={<Home username={username} password={password}/>} />
        <Route path="/register" element={<Register username={username} setUsername={setUsername} password={password} setPassword={setPassword}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
