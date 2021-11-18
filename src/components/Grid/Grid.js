import React, { useEffect, useReducer, useState } from 'react';
import { MAX, SEQUENCE_LENGTH, INITIAL_COLOR } from '../../config'
import { fibonacci } from '../../utils';

import ColorPanel from '../ColorPanel/ColorPanel';
import FibonacciGrid from './styled/grid';
import FibonacciCell from './styled/cell';

// Suite means sequence in French.
const SUITE = fibonacci(50);

/* 
 * Reducer for handling complex state object. 
 */
function reducer(data, action) {
    const val = JSON.parse(JSON.stringify(data));
    const { results } = action;
    switch(action.type) {
        case 'inc':
            const { coord } = action;
            val[coord.x][coord.y].value = val[coord.x][coord.y].value + 1;
            return val;
        case 'color':
            results.forEach( (line) => {
                line && draw(line.start.coord, line.end.coord, val);
            })
            return val;
        case 'reset':
            results.forEach( (line) => {
                line && reset(line.start.coord, line.end.coord, val);
            })
            return val;
        case 'init':
        default:
            return action.data; 
    }
}


/**
 * 
 * @param {*} callback 
 */
function goThrough(start, end , list, callback) {
    if ( start.x === end.x ) {
        for ( let i = 0; i < SEQUENCE_LENGTH; i++ ) {
            callback(list[start.y + i][start.x]);
        }
    } else {
        for ( let i = 0; i < SEQUENCE_LENGTH; i++ ) {
            callback(list[start.y][start.x + i]);
        }
    }
}

/**
 * Horizontal or Vertical only ( Left to Right, Top to Bottom)
 * @param {*} start 
 * @param {*} end 
 * @param {*} list 
 */
function reset( start, end, list) {
    goThrough( start, end , list, (elt) => { elt.value = 0; elt.color = INITIAL_COLOR });
}

/**
 * Horizontal or Vertical only ( Left to Right, Top to Bottom)
 * @param {*} start 
 * @param {*} end 
 * @param {*} list 
 */
function draw(  start, end , list ) {
    goThrough( start, end , list, (elt) => elt.color = 'green');
}

/**
 * The Component.
 */
const Grid = () => {
    const [data, dispatch] = useReducer(reducer, []);
    const [lastUpdatedCell, setLastUpdated] = useState({x:0,y:0});
    const [resetting, setReset ] = useState(false);
    const [lines, setLines ] = useState([]);

    /**
     * Initialise the array when component is mounted.
     */
    useEffect( () => {
        const initArray = [];
        for ( let i =0; i < MAX; i++) {
            initArray[i] = [];
            for ( let j =0; j< MAX; j++ ) {
                initArray[i][j] = { value: 0, color: INITIAL_COLOR, coord: { x: j, y: i} };
            }
        }
        dispatch({type: 'init', data: initArray});
    }, [])

    useEffect( () => {
        /** Validate the sequence */
        const validateSequence = () => {
            if ( data.length > 0  && resetting === false ) {
                const coord = lastUpdatedCell;
                // Avoid negatives;
                const minx = Math.max( 0, coord.x - SEQUENCE_LENGTH );
                const miny = Math.max( 0, coord.y - SEQUENCE_LENGTH );
                // Avoid getting out of the array.
                const maxx = Math.min( MAX , coord.x + SEQUENCE_LENGTH);
                const maxy = Math.min( MAX , coord.y + SEQUENCE_LENGTH);
                const rowArray = [];
                const colArray = [];
                for ( let i = minx; i < maxx; i++ ) {
                    rowArray.push(data[i][coord.y])
                }
                for ( let j = miny; j < maxy; j++) {
                    colArray.push(data[coord.x][j])
                } 
                const RowResults = iterativeSearch(rowArray) || null;
                const ColResults = iterativeSearch(colArray) || null;
                if ( RowResults || ColResults ) {
                    const results = [ RowResults, ColResults]
                    setReset(true);
                    setLines(results)
                    dispatch({type: 'color', results })
                }
            }
        }
        validateSequence();
    },[data, lastUpdatedCell, resetting])

    useEffect( () => {
        if ( resetting && lines.length > 0) {
            const timeoutId = setTimeout(() => {
                dispatch({type: 'reset', results: lines })
                setLines([]);
                setReset(false)
            }, 500);
            return () => clearTimeout(timeoutId);
        }
    },[resetting, lines])

    const handleClick = (e, coord) => {
        e.preventDefault();
        if ( !resetting ) {
            dispatch({type: 'inc', coord});
            setLastUpdated(coord);    
        }
    }

    // From left to right.
    const iterativeSearch = (candidates) => {
       for ( let i = 0; i < candidates.length; i++ ) {
           let index = SUITE.indexOf(candidates[i].value);
           // 1st number of the suite found.
           if ( index !== -1 ) {
                if ( i + SEQUENCE_LENGTH > candidates.length ) {
                    return null;
                } 
                let counter = 1;
                for ( let j = 0; j < SEQUENCE_LENGTH -1 ; j++ ) {
                    if ( SUITE[ index + counter ] === candidates[i + counter].value ) {
                        counter ++;
                    } else {
                        counter = 0;
                        break;
                    }
                }
                if ( counter === SEQUENCE_LENGTH ) {
                    return { start: candidates[i], end: candidates[ i + (SEQUENCE_LENGTH -1) ] }
                }
           }
       }
       return null;
    }

    return (
        <FibonacciGrid>
            { data.map( (cells, i) => (
                cells.map( (cell, j) => {
                    const coordinates= {x:j + 1, y:i +1};
                    return <FibonacciCell
                        key={`${i}_${j}`}
                        onMouseUp={(e) => handleClick(e, {x:i, y:j} )}
                        override={{x:i, y:j}}
                        style={{
                            gridColumnStart: coordinates.x,
                            gridColumnEnd: coordinates.x + 1,
                            gridRowStart: coordinates.y,
                            gridRowEnd: coordinates.y +1,
                            backgroundColor: cell.color                         
                        }}
                        >
                        <ColorPanel
                            color='transparent'
                            resetting={resetting}
                        >
                        {
                            cell.value > 0 && cell.value
                        }
                        </ColorPanel>
                    </FibonacciCell>
                }))
            )}
        </FibonacciGrid>
    )
}

export default Grid;

