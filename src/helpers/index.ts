export const getUTCDate = () => {
    return new Date(new Date().toISOString().split('.')[0].replace('T', ' '));
}