export const getError = (err: any) =>
    err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : err.message;

export const onError: any = async (err: any, req: any, res: any, next: any) => {
    await res.status(500).send({ message: err.toString() });
};
