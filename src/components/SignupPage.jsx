import React, { useState } from 'react';
import styled from 'styled-components';
import TrackItLogo from '../assets/Logo.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner'; // Importando o loader

// Estilos do componente
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
    width: 100px;
    height: auto;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 400px;
`;

const Input = styled.input`
    margin: 10px 0;
    padding: 10px;
    width: 100%;
    border: 1px solid #ced4da;
    border-radius: 5px;
    opacity: ${(props) => (props.disabled ? 0.6 : 1)}; // Opacidade para indicar desabilitação
`;

const SignupButton = styled.button`
    margin-top: 10px;
    padding: 10px;
    width: 100%;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')}; // Altera cursor se desabilitado

    &:hover {
        background-color: ${(props) => (props.disabled ? '#007bff' : '#0056b3')};
    }
`;

const SignupText = styled.p`
    margin-top: 15px;
    text-align: center;
`;

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Adicionando estado para erro
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null); // Resetando o erro

        const body = {
            email,
            name,
            image,
            password,
        };

        axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/auth/sign-up', body)
            .then(response => {
                console.log(response.data);
                
                // Armazenar informações do usuário no Local Storage
                const userData = {
                    token: response.data.token, // Se a API retornar um token
                    id: response.data.id,
                    name: response.data.name,
                    image: response.data.image
                };
                localStorage.setItem('user', JSON.stringify(userData)); // Armazenar o objeto do usuário

                navigate('/login');
            })
            .catch(error => {
                console.error('Erro ao cadastrar:', error);
                setError('Falha ao cadastrar. Tente novamente.'); // Exibindo mensagem de erro
                alert('Falha ao cadastrar. Popule os campos novamente.'); // Alert para o usuário
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Container>
            <LogoImage src={TrackItLogo} alt="TrackIt" />
            <Form onSubmit={handleSubmit}>
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
                <Input 
                    type="text" 
                    placeholder="nome" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    disabled={loading} 
                />
                <Input 
                    type="url" 
                    placeholder="foto" 
                    value={image} 
                    onChange={(e) => setImage(e.target.value)} 
                    disabled={loading} 
                />
                <SignupButton type="submit" disabled={loading}>
                    {loading ? (
                        <ThreeDots color="#ffffff" height={10} width={30} />
                    ) : (
                        "Cadastrar"
                    )}
                </SignupButton>
            </Form>
            <SignupText>
                Já tem uma conta? <Link to="/login">Faça login!</Link>
            </SignupText>
        </Container>
    );
};

export default SignupPage;