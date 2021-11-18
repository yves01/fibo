import React, { useState } from 'react';

import ColoredSquare from './styled/ColoredSquare';

const ColorPanel = (props) => {
    const { color, resetting } = props;
    const [ bgcolor, setBgColor] = useState(color);

    const handleClick = (e) => {
        e.preventDefault();
        if ( !resetting ) {
            if ( bgcolor === color ) {
                setBgColor('yellow')
            } else {
                setBgColor('transparent')
            }
        } else {
            setBgColor('transparent')
        }
    }

    return (
        <ColoredSquare
            onMouseDown={(e) => { handleClick(e) }}
            onMouseUp={(e) => { handleClick(e) }}
            color={bgcolor}>
            { props.children}
        </ColoredSquare>
    )
}

export default ColorPanel;