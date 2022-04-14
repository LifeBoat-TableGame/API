export interface Room{
    id:number;
    name:string;
    usersCount:number;
    limit:number;
    password:string|null;
}