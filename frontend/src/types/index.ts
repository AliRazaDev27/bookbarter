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

export interface INotification {
    id: number;
    postId: number;
    notification: string;
    isRead: boolean;
    image: string;
    createdAt: string;
}

export interface IPost {
    id: number;
    author: string;
    title: string;
    bookCondition: string;
    exchangeType: string;
    exchangeCondition: string|null;
    description: string|null;
    price: string;
    createdAt: string;
    updatedAt: string;
    userId: number;
    status: string;
    locationApproximate: string;
    language: string;
    isPublic: boolean;
    isFav: boolean;
    isDeleted: boolean;
    favCount: number;
    images: string[];
    category: string;
    currency: string;
}

export interface IReview {
    id: number;
    senderId: number;
    receiverId: number;
    postId: number;
    rating: number;
    review: string;
    postAuthor: string;
    postTitle:string;
    postImages:string[];
    userName:string;
    userPicture:string;
    createdAt: string;
    updatedAt: string;
}