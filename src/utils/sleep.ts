export const sleep = <T>(time: number, resolveTo?: T): Promise<T> => new Promise((resolve) => {
  setTimeout(resolve, time, resolveTo);
});
