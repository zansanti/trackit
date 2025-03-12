import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';
import { BsCalendar3, BsCalendarCheck, BsTrash } from 'react-icons/bs'; // Importando o ícone de lixo
import { ThreeDots } from 'react-loader-spinner'; // Importando o loader

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

const TitleRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
`;

const Title = styled.h2`
    font-size: 22.976px;
    color: #126BA5;
    margin: 0;
`;

const AddButton = styled.button`
    width: 40px;
    height: 35px;
    background-color: #52B6FF;
    border-radius: 4.63636px;
    border: none;
    color: #FFFFFF;
    font-size: 26.976px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
`;

const Message = styled.p`
    font-size: 17.976px;
    line-height: 22px;
    color: #666666;
`;

const ErrorMessage = styled.p`
    font-size: 17.976px;
    line-height: 22px;
    color: red; // Cor vermelha para mensagens de erro
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

const HabitForm = styled.div`
    background-color: white;
    padding: 18px;
    border-radius: 5px;
    margin-bottom: 29px;
`;

const Input = styled.input`
    width: 80%;
    height: 45px;
    background: #FFFFFF;
    border: 1px solid #D5D5D5;
    border-radius: 5px;
    padding: 0 11px;
    font-size: 19.976px;
    margin-bottom: 8px;
    opacity: ${(props) => (props.disabled ? 0.6 : 1)}; // Opacidade para indicar desabilitação
`;

const WeekdaysContainer = styled.div`
   display: flex;
    justify-content: center; /* Centraliza os botões horizontalmente */
    gap: 4px; /* Espaçamento entre os botões */
    margin-bottom: 29px;
    margin-left: 10px;
    margin-right: 10px;
    max-width: 100%; /* Garante que o container não ultrapasse a largura do pai */
`;

const WeekdayButton = styled.button`
    width: 25px; /* Ajuste a largura conforme necessário */
    height: 25px; /* Ajuste a altura conforme necessário */
    background: ${props => props.selected ? '#CFCFCF' : '#FFFFFF'};
    border: 1px solid ${props => props.selected ? '#52B6FF' : '#D5D5D5'};
    border-radius: 5px;
    font-size: 14px; /* Ajuste o tamanho da fonte se necessário */
    color: ${props => props.selected ? '#FFFFFF' : '#DBDBDB'};
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background 0.3s, color 0.3s;

    &:hover {
        background: ${props => props.selected ? '#B3B3B3' : '#F7F7F7'};
    }
`;

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 23px;
`;

const CancelButton = styled.button`
    background: none;
    border: none;
    font-size: 15.976px;
    color: #52B6FF;
`;

const SaveButton = styled.button`
    width: 84px;
    height: 35px;
    background: #52B6FF;
    border-radius: 4.63636px;
    border: none;
    font-size: 15.976px;
    color: #FFFFFF;
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')}; // Altera cursor se desabilitado
`;

const HabitCard = styled.div`
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const HabitName = styled.h3`
    font-size: 20px;
    color: #666666;
    margin: 0;
    margin-right: 20px;
`;

const DaysContainer = styled.div`
    display: flex;
    gap: 4px;
`;

const DeleteButton = styled.button`
    background: none;
    border: none;
    color: #52B6FF;
    cursor: pointer;
`;

const HabitsPage = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user ? user.token : null; // Recuperando o token do localStorage
    const [showForm, setShowForm] = useState(false);
    const [habitName, setHabitName] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [habits, setHabits] = useState([]); // Estado para armazenar os hábitos
    const [loading, setLoading] = useState(false); // Adicionando estado de loading
    const [errorMessage, setErrorMessage] = useState(''); // Estado para mensagem de erro

    useEffect(() => {
        const fetchHabits = async () => {
            try {
                const response = await fetch('https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Usando o token recuperado
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setHabits(data);
                } else {
                    console.error('Erro ao buscar hábitos:', response.statusText);
                }
            } catch (error) {
                console.error('Erro ao buscar hábitos:', error);
            }
        };

        fetchHabits();
    }, [token]); // Adicionando o token como dependência

    const toggleDay = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const weekdays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    const saveHabit = async () => {
        // Resetando a mensagem de erro
        setErrorMessage('');

        // Verificação se os campos estão preenchidos
        if (!habitName) {
            setErrorMessage('Por favor, preencha o nome do hábito.');
            return;
        }

        if (selectedDays.length === 0) {
            setErrorMessage('Por favor, selecione os dias da semana.');
            return;
        }

        const newHabit = {
            name: habitName,
            days: selectedDays
        };

        setLoading(true); // Iniciando o loading

        try {
            const response = await fetch('https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Usando o token recuperado
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newHabit)
            });

            if (response.ok) {
                const savedHabit = await response.json();
                setHabits([...habits, savedHabit]); // Adiciona o novo hábito ao estado
                setHabitName(''); // Limpa o campo de nome do hábito
                setSelectedDays([]); // Reseta os dias selecionados
                setShowForm(false); // Fecha o formulário
            } else {
                console.error('Erro ao salvar hábito:', response.statusText);
                setErrorMessage('Erro ao salvar o hábito. Tente novamente.'); // Mensagem genérica de erro
            }
        } catch (error) {
            console.error('Erro ao realizar o POST:', error);
            setErrorMessage('Erro ao salvar o hábito. Tente novamente.'); // Mensagem de erro
        } finally {
            setLoading(false); // Finalizando o loading
        }
    };

    const deleteHabit = async (habitId) => {
        try {
            const response = await fetch(`https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits/${habitId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`, // Usando o token recuperado
                }
            });

            if (response.ok) {
                setHabits(habits.filter(habit => habit.id !== habitId));
            } else {
                console.error('Erro ao deletar hábito:', response.statusText);
                setErrorMessage('Erro ao deletar o hábito. Tente novamente.'); // Mensagem de erro ao deletar
            }
        } catch (error) {
            console.error('Erro ao realizar o DELETE:', error);
            setErrorMessage('Erro ao deletar o hábito. Tente novamente.'); // Mensagem de erro ao deletar
        }
    };

    return (
        <>
            <GlobalStyle />
            <Container>
                <HeaderBar>
                    <LogoText>TrackIt</LogoText>
                    <UserImage src={user.image} alt="Perfil do usuário" />
                </HeaderBar>
                <Content>
                    <TitleRow>
                        <Title>Meus hábitos</Title>
                        <AddButton onClick={() => setShowForm(true)} aria-label="Adicionar hábito">+</AddButton>
                    </TitleRow>
                    {showForm && (
                        <HabitForm>
                            <Input 
                                type="text" 
                                placeholder="nome do hábito"
                                value={habitName}
                                onChange={(e) => setHabitName(e.target.value)}
                                disabled={loading} // Desabilitando input se estiver carregando
                            />
                            <WeekdaysContainer>
                                {weekdays.map((day, index) => (
                                    <WeekdayButton 
                                        key={index}
                                        selected={selectedDays.includes(index)}
                                        onClick={() => toggleDay(index)}
                                    >
                                        {day}
                                    </WeekdayButton>
                                ))}
                            </WeekdaysContainer>
                            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>} {/* Exibindo mensagem de erro */}
                            <ButtonsContainer>
                                <CancelButton onClick={() => setShowForm(false)}>Cancelar</CancelButton>
                                <SaveButton onClick={saveHabit} disabled={loading}> {/* Desabilitando o botão se estiver carregando */}
                                    {loading ? (
                                        <ThreeDots color="#ffffff" height={10} width={30} />
                                    ) : (
                                        "Salvar"
                                    )}
                                </SaveButton>
                            </ButtonsContainer>
                        </HabitForm>
                    )}
                    {habits.length === 0 ? (
                        <Message>
                            Você não tem nenhum hábito cadastrado ainda. Adicione um hábito para começar a trackear!
                        </Message>
                    ) : (
                        habits.map((habit) => (
                            <HabitCard key={habit.id}>
                                <HabitName>{habit.name}</HabitName>
                                <DaysContainer>
                                    {weekdays.map((day, dayIndex) => (
                                        <WeekdayButton 
                                            key={dayIndex} 
                                            selected={habit.days.includes(dayIndex)}
                                        >
                                            {day}
                                        </WeekdayButton>
                                    ))}
                                </DaysContainer>
                                <DeleteButton onClick={() => deleteHabit(habit.id)}>
                                    <BsTrash size={20} />
                                </DeleteButton>
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

export default HabitsPage;