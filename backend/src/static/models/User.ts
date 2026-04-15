export interface User {
    id: string;
    firstName: string;
    email: string;
    password?: string;
}

export type UserDtoRegister = {
    firstName: string;
    email: string;
    password: string;
};

export type UserDtoLogin = {
    email: string;
    password: string;
};

export type UserDtoUpdatePassword = {
    oldPassword: string;
    newPassword: string;
};
