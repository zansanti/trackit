import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
   body {
       margin: 0;
       font-family: 'Lexend Deca', sans-serif;/* Fonte padrão para o resto da aplicação */
       background-color: #f2f2f2; /* Cor de fundo global */
   }

   /* Outros estilos globais podem ser adicionados aqui */
`;

export default GlobalStyle;