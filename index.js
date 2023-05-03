import Sdk from "casdoor-js-sdk";

const initAuthProvider = (cfg)=> {
    cfg.redirectPath= "/#/auth-callback";
    let casdoor = new Sdk(cfg)

    return {
        login: async ({ username, password }) => {
            return Promise.resolve() 
        },
        logout: async () => {
            localStorage.removeItem('token');
            return Promise.resolve();
        },
        checkAuth: async () => {
            
            if (localStorage.getItem('token')) {
                console.log("token", localStorage.getItem('token'));
                return Promise.resolve()
            }  else {
                casdoor.clearState();
                let st = casdoor.getOrSaveState();
                console.log("token not found, new state ",st);
                return Promise.reject()
            }
        },
        checkError:  async (error) => {
            const status = error.status;
            if (status === 401 || status === 403) {
                localStorage.removeItem('username');
                return Promise.reject();
            }
            // other error code (404, 500, etc): no need to log out
            return Promise.resolve();
        },
        getIdentity: async () =>
            Promise.resolve({
                id: 'user',
                fullName: 'John Doe',
            }),
        getPermissions: async () => Promise.resolve(1),
        handleCallback: async ()=> {
            let url = window.location.href.replaceAll('#','');
            const { searchParams } = new URL(url);
            const code = searchParams.get('code');
            const state = searchParams.get('state');
            let expectedState = casdoor.getOrSaveState()
            
            if (expectedState != state) {
                return Promise.reject()
            }
            
            await fetch(`${cfg.serverUrl}${"/api/login/oauth/access_token"}`, {
            method: "post",
            mode:"cors",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                "grant_type": "authorization_code",
                "client_id": cfg.clientId,
                "client_secret": cfg.clientSecret,
                "code": code
            })
            }).then((res)=>{
                res.json().then((r)=>{
                    console.log(r);
                    if (r.access_token != "") {
                        localStorage.setItem("token",r.access_token);
                        return { redirectTo: '/' };
                    }
                })
            }).catch((reason)=>{
                return Promise.reject()
            })
        },
        loginPage: () =>{
            window.location.replace(casdoor.getSigninUrl());
            return (null);
        }
    }
}

export default initAuthProvider;