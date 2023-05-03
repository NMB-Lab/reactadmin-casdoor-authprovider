# reactadmin-casdoor-authprovider

## Installation

```
yarn add reactadmin-casdoor-authprovider
```
or
```
nmp -i reactadmin-casdoor-authprovider
```


## Usage

```js
import { Admin, Resource} from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { Route} from "react-router-dom";
import initAuthProvider from "reactadmin-casdoor-authprovider"


const sdkConfig = {
  serverUrl: "http://localhost:8080",
  clientId: "xxxxxxxxxxxxxxxxxxxx",
  clientSecret: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  appName: "app-built-in",
  organizationName: "built-in"
};
const authProvider = initAuthProvider(sdkConfig);
const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');




const App = () => (
    <Admin dataProvider={dataProvider} authProvider={authProvider} loginPage={authProvider.loginPage}>
      <Resource name="users" list={ListGuesser} />
    </Admin>
);

export default App;
```

## Casdoor configuration

Set callback uri on your application settings to ```/#/auth-callback``` like at the picture

![callback settings](/img/callback.png "callback settings")