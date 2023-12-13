export type Tokens = {
    accessToken: string | null;
    refreshToken: string | null;
};

export type LinkSettings = {
    name: string | null;
    singleUse: boolean;
    startDate: string | null;
    endDate: string | null;
};
