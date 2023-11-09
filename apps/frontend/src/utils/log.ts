/* eslint-disable @typescript-eslint/no-explicit-any */
export const logDebug = (message: any, ...optionalParams: any[]) => {
    console.debug(message, optionalParams);
};

export const logError = (message: any) => {
    console.error(message);
};
