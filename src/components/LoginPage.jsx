import React, { useState } from 'react';
import styled from 'styled-components';
import TrackItLogo from '../assets/Logo.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner'; // Ajuste aqui para importar corretamente

// Styled components
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    background-color: #f8f9fa;
    padding: 20px;
    box-sizing: border-box;
`;

const LogoImage = styled.img`
    margin-bottom: 20px;
    width: 180px;
    height: auto;
`;

const Input = styled.input`
    margin: 10px 0;
    padding: 10px;
    width: 100%;
    max-width: 300px;
    border: 1px solid #d4d4d4;
    border-radius: 5px;
    font-size: 20px;
    &::placeholder {
        color: #DBDBDB;
    }
    opacity: ${(props) => (props.disabled ? 0.6 : 1)};
`;

const LoginButton = styled.button`
    margin-top: 10px;
    padding: 10px;
    width: 100%;
    max-width: 300px;
    background-color: #52B6FF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    font-size: 20px;
    &:hover {
        background-color: ${(props) => (props.disabled ? '#52B6FF' : '#3fa6ff')};
    }
`;

const SignupText = styled.p`
    margin-top: 15px;
    text-align: center;
    font-size: 14px;
    color: #52B6FF;
    text-decoration: underline;
`;

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);

        const body = {
            email,
            password
        };

        axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/auth/login', body)
            .then(response => {
                console.log(response.data);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.id);
                localStorage.setItem('userName', response.data.name);
                localStorage.setItem('userImage', response.data.image);

                navigate('/today');
            })
            .catch(error => {
                console.error('Erro ao fazer login:', error);
                alert('Erro ao fazer login. Verifique suas credenciais.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Container>
            <LogoImage src={TrackItLogo} alt="TrackIt" />
            <Input 
                type="email" 
                placeholder="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={loading}
            />
            <Input 
                type="password" 
                placeholder="senha" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                disabled={loading}
            />
            <LoginButton onClick={handleLogin} disabled={loading}>
                {loading ? (
                    <ThreeDots color="#ffffff" height={10} width={30} />
                ) : (
                    "Entrar"
                )}
            </LoginButton>
            <SignupText>
                <Link to="/signup">Não tem uma conta? Cadastre-se!</Link>
            </SignupText>
        </Container>
    );
};

export default LoginPage;