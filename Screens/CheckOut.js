import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {COLORS, FONTS, icons, SIZES} from '../Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CheckOut = ({route, navigation}) => {
  const [resturent, setResturent] = useState(null);
  const [currentlocation, setCurrentLocation] = useState('');
  const [totalcash, setTotalCash] = useState('');

  useEffect(() => {
    let {resturent, currentLocation, totalCash} = route.params;
    setResturent(resturent);
    setCurrentLocation(currentLocation);
    setTotalCash(totalCash);
  }, []);
  //   Header
  function headerCheckout() {
    return (
      <View style={{flexDirection: 'row', marginTop: 10}}>
        <TouchableOpacity
          style={{
            width: 50,
            paddingLeft: SIZES.padding * 2,
            justifyContent: 'center',
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            source={icons.back}
            resizeMode="contain"
            style={{
              width: 30,
              height: 30,
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: SIZES.padding * 3,
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.lightGray3,
            }}>
            <Text
              style={{
                ...FONTS.h3,
              }}>
              Check Out
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            width: 50,
            paddingRight: SIZES.padding * 2,
            justifyContent: 'center',
          }}>
          <Image
            source={icons.list}
            resizeMode="contain"
            style={{
              width: 30,
              height: 30,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }
  // Address are Here
  function Address() {
    return (
      <View style={{marginHorizontal: 30, marginTop: 20}}>
        <View style={styles.card}>
          <View>
            <Text style={{fontWeight: 'bold', marginBottom: 10, fontSize: 20}}>
              Home
            </Text>
            <Text style={{fontSize: 18}}> {currentlocation.streetName}</Text>
          </View>

          <View
            style={{
              backgroundColor: COLORS.primary,
              padding: 5,
              borderRadius: 10,
            }}>
            <Ionicons
              name="md-checkmark-sharp"
              size={30}
              color={COLORS.white}
            />
          </View>
        </View>
      </View>
    );
  }

  // Payment Method Here
  const Payment = () => {
    return (
      <View style={{marginHorizontal: 30, marginTop: 20}}>
        <View style={styles.card}>
          <View>
            <Text style={{fontWeight: 'bold', marginBottom: 10, fontSize: 20}}>
              Cash on Delivery
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={icons.cash}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: COLORS.darkgray,
                }}
              />
              <Text style={{fontSize: 25}}> $ {totalcash}</Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: COLORS.primary,
              padding: 5,
              borderRadius: 10,
            }}>
            <Ionicons
              name="md-checkmark-sharp"
              size={30}
              color={COLORS.white}
            />
          </View>
        </View>
      </View>
    );
  };
  function totalPrice() {
    return (
      <View
        style={{
          backgroundColor: 'whitesmoke',
          position: 'absolute',
          bottom: 0,
          width: SIZES.width,
          padding: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{padding: 10}}>
          <Text style={{fontSize: 25}}>Total</Text>
          <Text style={{fontWeight: 'bold', fontSize: 25}}>$ {totalcash}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('OrderDelivery', {
              resturent: resturent,
              currentLocation: currentlocation,
            })
          }>
          <View
            style={{
              backgroundColor: COLORS.black,
              padding: SIZES.padding * 1.5,
              borderRadius: 20,
            }}>
            <Text style={{color: COLORS.white, fontSize: 20}}>
              Buy and Track Order
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {headerCheckout()}
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 20,
          marginHorizontal: 30,
          marginTop: 30,
        }}>
        Address
      </Text>
      {Address()}
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 20,
          marginHorizontal: 30,
          marginTop: 30,
        }}>
        Payment
      </Text>
      {Payment()}
      {totalPrice()}
    </View>
  );
};

export default CheckOut;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: 'whitesmoke',
    padding: SIZES.padding * 2,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
