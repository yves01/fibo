export const fibonacci = (max) => {
    const suite = [ 1, 1 ];
    for ( let i = 2; i < max; i++ ) {
        suite[i] = suite[ i - 2 ] + suite[ i - 1];
    }
    return suite;
}