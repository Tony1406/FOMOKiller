export interface IUser {
    id?: number;
    username: string;
    email: string;
    password_hash: string;
    role?: 'USER' | 'ADMIN';
    avatar_url?: string;
}