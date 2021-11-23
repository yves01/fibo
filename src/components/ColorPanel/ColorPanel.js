import React from 'react';

import ColoredSquare from './styled/ColoredSquare';

const ColorPanel = (props) => {
    const { color } = props;

    return (
        <ColoredSquare
            color={color}>
            { props.children}
        </ColoredSquare>
    )
}

export default ColorPanel;