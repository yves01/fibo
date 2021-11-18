import styled from 'styled-components';

export default styled.div`
    height: 100%;
    width: 100%;
    ${({color}) => `background-color: ${color}`};
    display: flex;
    justify-content: center;
    align-items: center;
`;