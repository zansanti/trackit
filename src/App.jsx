import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet'; // Importando react-helmet
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import HabitsPage from './components/HabitsPage';
import TodayPage from './components/TodayPage';
import { useUser } from './UserContext.jsx';
import GlobalStyle from './styles/GlobalStyle';

function App() {
    const [habits, setHabits] = useState([]);
    const { user } = useUser();

    return (
        <>
            <Helmet>
                {/* Adicionei a fonte Lexend Deca aqui */}
                <link href="https://fonts.googleapis.com/css2?family=Playball&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Lexend+Deca&display=swap" rel="stylesheet" />
            </Helmet>
            <GlobalStyle />
            <Router>
                <Routes>
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/login" element={user ? <Navigate to="/habits" /> : <LoginPage />} />
                    <Route path="/" element={user ? <Navigate to="/habits" /> : <LoginPage />} />
                    <Route path="/habits" element={<HabitsPage habits={habits} setHabits={setHabits} />} />
                    <Route path="/today" element={<TodayPage habits={habits} />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;