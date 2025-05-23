export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    mobileNo: string;
    address: string;
    picture: string;
    status: string;
    role: string;
    createdAt: string;
}
export interface IWishlist {
    id: number;
    userId: number;
    title: string;
    author: string;
    createdAt: string;
    updatedAt: string;
}