import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';
import { BsCalendar3, BsCalendarCheck, BsCheck } from 'react-icons/bs';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br'; // Importando o locale em português

// Configurando o locale para português
dayjs.locale('pt-br');

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playball&display=swap');
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-color: #f2f2f2;
    box-sizing: border-box;
`;

const HeaderBar = styled.header`
    width: 100%;
    max-width: 375px;
    background-color: #126BA5;
    padding: 10px 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const LogoText = styled.h1`
    font-family: 'Playball', cursive !important;
    font-size: 38.982px;
    line-height: 49px;
    color: #FFFFFF;
    margin: 0;
    font-weight: 400;
`;

const UserImage = styled.img`
    width: 51px;
    height: 51px;
    border-radius: 50%;
    object-fit: cover;
`;

const Content = styled.div`
    width: 100%;
    max-width: 375px;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 28px 18px;
    background-color: #f2f2f2;
`;

const Title = styled.h2`
    font-size: 22px;
    color: #126BA5;
    margin: 0;
`;

const HabitCard = styled.div`
    background-color: ${props => (props.$isDone ? '#d4edda' : 'white')}; /* Preenchimento verde quando feito */
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
`;

const HabitInfo = styled.div`
    flex: 1; /* Faz com que este div ocupe o espaço restante */
    margin-right: 10px; /* Espaçamento entre o texto e o checkbox */
`;

const HabitName = styled.h3`
    font-size: 20px;
    color: #666666;
    margin: 0;
`;

const Stats = styled.p`
    font-size: 16px;
    color: #666666;
    margin: 5px 0 0 0; /* Margem superior */
`;

const CheckContainer = styled.button`
    background: none;
    border: none;
    cursor: pointer;
`;

const Footer = styled.footer`
    width: 100%;
    max-width: 375px;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: #FFFFFF;
`;

const FooterButton = styled(Link)`
    color: #52B6FF;
    text-decoration: none;
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 4px;
`;

const TodayPage = () => {
    const [habits, setHabits] = useState([]); // Estado para armazenar os hábitos de hoje
    const user = JSON.parse(localStorage.getItem('user')); // Obtém o usuário
    const token = user ? user.token : null; // Acessa o token diretamente do objeto
    const userImage = user ? user.image : null; // Acessa a imagem do usuário

    useEffect(() => {
        const fetchTodayHabits = async () => {
            console.log("Token:", token); // Verifica o token no console
            console.log("Imagem do usuário:", userImage); // Verifica a imagem do usuário

            try {
                const response = await fetch('https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits/today', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Certifique-se de que o token está armazenado
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Dados dos hábitos:", data); // Verifica os dados retornados
                    setHabits(data); // Atualiza o estado com os hábitos de hoje
                } else {
                    console.error('Erro ao buscar hábitos de hoje:', response.statusText);
                }
            } catch (error) {
                console.error('Erro ao buscar hábitos de hoje:', error);
            }
        };

        fetchTodayHabits(); // Chama a função ao montar o componente
    }, [token]); // O token é uma dependência

    const today = dayjs(); // Usando Day.js para a data atual
    const dayMonth = today.format('DD/MM'); // Formata a data como "DD/MM"
    const dayName = today.format('dddd'); // Obtém o nome completo do dia da semana em português

    const toggleHabit = async (habitId, done) => {
        const endpoint = done
            ? `https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits/${habitId}/uncheck`
            : `https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits/${habitId}/check`;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Certifique-se de que o token está armazenado
                }
            });

            if (response.ok) {
                // Atualizar a lista de hábitos após marcar como feito ou desfeito
                setHabits(prevHabits => 
                    prevHabits.map(habit => 
                        habit.id === habitId ? { ...habit, done: !done } : habit
                    )
                );
            } else {
                console.error('Erro ao marcar/desmarcar hábito:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao marcar/desmarcar hábito:', error);
        }
    };

    return (
        <>
            <GlobalStyle />
            <Container>
                <HeaderBar>
                    <LogoText>TrackIt</LogoText>
                    <UserImage src={userImage} alt="Perfil do usuário" /> {/* Usando a imagem do usuário */}
                </HeaderBar>
                <Content>
                    <Title>{`${dayName.charAt(0).toUpperCase() + dayName.slice(1)}, ${dayMonth}`}</Title>
                    {habits.length === 0 ? (
                        <p>Você não tem hábitos para hoje!</p>
                    ) : (
                        habits.map((habit) => (
                            <HabitCard key={habit.id} $isDone={habit.done}> {/* Usando $isDone */}
                                <HabitInfo>
                                    <HabitName>{habit.name}</HabitName>
                                    <Stats>Sequência atual: {habit.currentSequence} dias</Stats>
                                    <Stats>Seu recorde: {habit.highestSequence} dias</Stats>
                                </HabitInfo>
                                <CheckContainer onClick={() => toggleHabit(habit.id, habit.done)}>
                                    <BsCheck size={20} color={habit.done ? "green" : "grey"} />
                                </CheckContainer>
                            </HabitCard>
                        ))
                    )}
                </Content>
                <Footer>
                    <FooterButton to="/habits">
                        <BsCalendar3 size={20} />
                        Hábitos
                    </FooterButton>
                    <FooterButton to="/today">
                        <BsCalendarCheck size={20} />
                        Hoje
                    </FooterButton>
                </Footer>
            </Container>
        </>
    );
};

export default TodayPage;