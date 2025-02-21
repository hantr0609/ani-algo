import { styled } from 'styled-components';

function App() {
  return <Heading>Hello World!</Heading>;
}

const Heading = styled.h1`
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default App;
