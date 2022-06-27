export async function getLoginData(){
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    if(id == null || token == null) {
        const response = await fetch('http://localhost:3000/api/token');
        const loginData: {token: string, id: number} = await response.json();
        localStorage.setItem('token', loginData.token);
        localStorage.setItem('id', loginData.id.toString());
        return loginData;
    }
    else 
        return { token: token, id: +id };
}