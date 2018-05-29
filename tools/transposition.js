export function transposition(array_1, array_2, value) {
    return ((value - array_2[0]) * ((array_1[1] - array_1[0]) / (array_2[1] - array_2[0])) + array_1[0]);
}
