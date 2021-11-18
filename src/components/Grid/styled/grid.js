import styled from 'styled-components'
import { MAX } from '../../../config';

export default styled.div`
    display: grid;
    width: 100%;
    height: 90vh;
    grid-template-columns: repeat(${MAX}, 1fr);
    grid-template-rows: repeat(${MAX}, 1fr);
`