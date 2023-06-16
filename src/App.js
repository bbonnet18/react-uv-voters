import logo from './logo.svg';
import './App.css';
import "@aws-amplify/ui-react/styles.css";
import {Amplify,API} from "aws-amplify";
import awsconfig from './aws-exports';  


import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
} from "@aws-amplify/ui-react";

function App({ signOut }) {

  Amplify.configure(awsconfig);


  function getData() {
    const apiName = 'votersapi';
    const path = '/voters/voter';
    const myInit = {
      headers: {} // OPTIONAL
    };
  
    return API.get(apiName, path, myInit);
  }
  
  (async function() {
    const response = await getData();
    console.log(response);
  })();

  const getVoters =  () => {
    console.log('getting voters')
  }

  return (
    <View className="App">
      <Card>
        <Image src={logo} className="App-logo" alt="logo" />
        <Heading level={1}>We now have Auth!</Heading>
      </Card>
      <Button onClick={getVoters}>Get Voters</Button>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
}

export default withAuthenticator(App);
