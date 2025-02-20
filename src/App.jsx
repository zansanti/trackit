import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignUpPage';
import HabitsPage from './components/HabitsPage';
import TodayPage from './components/TodayPage';
import { useUser } from './UserContext.jsx';

function App() {
    const [habits, setHabits] = useState([]);
    const { user } = useUser();

    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={user ? <Navigate to="/habits" /> : <LoginPage />} />
                <Route path="/" element={user ? <Navigate to="/habits" /> : <LoginPage />} />
                <Route path="/habits" element={<HabitsPage habits={habits} setHabits={setHabits} />} />
                <Route path="/today" element={<TodayPage habits={habits} />} />
            </Routes>
        </Router>
    );
}

export default App;