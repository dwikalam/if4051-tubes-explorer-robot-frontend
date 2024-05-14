export const generateArray = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}