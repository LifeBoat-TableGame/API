export interface Room{
    creator: {
        id: number,
        username: string;
    }
    id:number;
    limit:number;
    name:string;
    usersCount:number;
}