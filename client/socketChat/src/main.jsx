import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import './index.css';
import ChatHomePage from './pages/ChatHomePage'
import RockPaperScissorsMain from './pages/RockPaperScissors/RockPaperScissorsMain.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MemoryGamePage from '../src/pages/MemoryGame/MemoryGameMain.jsx';
import LogInPage from './pages/LogInPage/LogInPage.jsx';
import SignUpPage from './pages/SignUpPage/signUpPage.jsx'

axios.defaults.baseURL = "http://localhost:8080";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LogInPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/chat' element={<ChatHomePage/>} />
        <Route path='/game/RPS' element={<RockPaperScissorsMain gameMode="multi" />} />
        <Route path='/game/memory' element={<MemoryGamePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
