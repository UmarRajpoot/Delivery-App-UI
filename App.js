import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {Resturent, OrderDelivery} from './Screens';
import TabBar from './Navigation/tabs';
import CheckOut from './Screens/CheckOut';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'Home'}
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={TabBar} />
        <Stack.Screen name="Resturent" component={Resturent} />
        <Stack.Screen name="Checkout" component={CheckOut} />
        <Stack.Screen name="OrderDelivery" component={OrderDelivery} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
