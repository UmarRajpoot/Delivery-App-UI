import React, {useEffect, useState} from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, FONTS, icons, SIZES} from '../Constants';

const Resturent = ({route, navigation}) => {
  const [resturent, setResturent] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [orderItems, setOrderItems] = useState([]); // For Items Add or Subtract

  const scrollX = new Animated.Value(0);

  // Getting the Value from Previous Screen
  useEffect(() => {
    let {item, currentLocation} = route.params;
    setResturent(item);
    setCurrentLocation(currentLocation);
  });

  ///////////////////////////EDIT ORDER///////////////////////

  function editOrder(action, menuId, price) {
    let orderList = orderItems.slice();
    let item = orderList.filter((a) => a.menuId == menuId);
    if (action == '+') {
      if (item.length > 0) {
        let newQty = item[0].qty + 1;
        item[0].qty = newQty;
        item[0].total = item[0].qty * price;
      } else {
        const newItem = {
          menuId,
          qty: 1,
          price: price,
          total: price,
        };
        orderList.push(newItem);
      }
      setOrderItems(orderList);
    } else if (action == '-') {
      if (item.length > 0) {
        if (item[0]?.qty > 0) {
          console.log('Sub Apply');
          let newQty = item[0].qty - 1;
          item[0].qty = newQty;
          item[0].total = newQty * price;
        }
      }
      setOrderItems(orderList);
    }
  }
  // Get and Show the Quantity of each Product
  function getOrderQty(menuId) {
    let orderitem = orderItems.filter((a) => a.menuId == menuId);

    if (orderitem.length > 0) {
      return orderitem[0].qty;
    } else {
      return 0;
    }
  }

  //// Calculate the Amount of Total Products in a cart
  function getBasketItemCount() {
    let itemCount = orderItems.reduce((a, b) => a + (b.qty || 0), 0);
    return itemCount; // This method used to sum up all the quantity
  }

  function sumOrder() {
    let totalPrice = orderItems.reduce((a, b) => a + (b.total || 0), 0);

    return totalPrice;
  }

  // Header
  function renderHeader() {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={{
            width: 50,
            paddingLeft: SIZES.padding * 2,
            justifyContent: 'center',
          }}
          onPress={() => navigation.goBack()}>
          <Image
            source={icons.back}
            resizeMode="contain"
            style={{
              width: 30,
              height: 30,
            }}
          />
        </TouchableOpacity>
        {/* Resturent name Section */}
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
              {resturent?.name}
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
  //////////////////////////////////Food InFO/////////////////////////////////
  function renderFoodInfo() {
    return (
      <Animated.ScrollView
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}>
        {resturent?.menu.map((item, index) => {
          return (
            <View
              key={`menu-${index}`}
              style={{
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: SIZES.height * 0.35,
                }}>
                {/* Food Images */}
                <Image
                  source={item.photo}
                  resizeMode="cover"
                  style={{
                    width: SIZES.width,
                    height: '100%',
                  }}
                />
                {/* quantity */}
                <View
                  style={{
                    position: 'absolute',
                    bottom: -20,
                    width: SIZES.width,
                    height: 50,
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    style={{
                      width: 50,
                      backgroundColor: COLORS.white,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderTopLeftRadius: 25,
                      borderBottomLeftRadius: 25,
                    }}
                    onPress={() => editOrder('-', item.menuId, item.price)}>
                    <Text style={{...FONTS.h1}}>-</Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      width: 50,
                      backgroundColor: COLORS.white,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{...FONTS.h2}}>
                      {getOrderQty(item.menuId)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      width: 50,
                      backgroundColor: COLORS.white,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderTopRightRadius: 25,
                      borderBottomRightRadius: 25,
                    }}
                    onPress={() => editOrder('+', item.menuId, item.price)}>
                    <Text style={{...FONTS.body1}}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* name And Description */}
              <View
                style={{
                  width: SIZES.width,
                  alignItems: 'center',
                  marginTop: 15,
                  paddingHorizontal: SIZES.padding * 2,
                }}>
                <Text
                  style={{
                    marginVertical: 10,
                    textAlign: 'center',
                    ...FONTS.h2,
                  }}>
                  {item.name} - ${item.price.toFixed(2)}
                </Text>
                <Text
                  style={{
                    ...FONTS.body3,
                  }}>
                  {item.description}
                </Text>
              </View>

              {/* calories */}
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                }}>
                <Image
                  source={icons.fire}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
                <Text
                  style={{
                    ...FONTS.h3,
                    color: COLORS.darkgray,
                  }}>
                  {' '}
                  {item.calories.toFixed(2)} cal
                </Text>
              </View>
            </View>
          );
        })}
      </Animated.ScrollView>
    );
  }
  //////////////////////////////Order Detail///////////////////////

  function renderDots() {
    const dotsPosition = Animated.divide(scrollX, SIZES.width);
    return (
      <View style={{height: 30}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: SIZES.padding,
          }}>
          {resturent?.menu.map((item, index) => {
            const opacity = dotsPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            const dotSize = dotsPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [SIZES.base * 0.8, 10, SIZES.base * 0.8],
              extrapolate: 'clamp',
            });

            const dotColor = dotsPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [COLORS.darkgray, COLORS.primary, COLORS.darkgray],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={`dot-${index}`}
                opacity={opacity}
                style={{
                  borderRadius: SIZES.radius,
                  marginHorizontal: 6,
                  width: dotSize,
                  height: dotSize,
                  backgroundColor: dotColor,
                }}
              />
            );
          })}
        </View>
      </View>
    );
  }

  function renderOrder() {
    return (
      <View>
        {renderDots()}

        <View
          style={{
            backgroundColor: COLORS.white,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: SIZES.padding * 2,
              paddingHorizontal: SIZES.padding * 3,
              borderBottomColor: COLORS.lightGray2,
              borderBottomWidth: 1,
            }}>
            <Text style={{...FONTS.h3}}>
              items in Cart {getBasketItemCount()}
            </Text>
            <Text style={{...FONTS.h3}}>${sumOrder()}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: SIZES.padding * 3,
              paddingVertical: SIZES.padding * 4,
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Image
                source={icons.pin}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                  tintColor: COLORS.darkgray,
                }}
              />
              <Text
                style={{
                  marginLeft: SIZES.padding,
                  ...FONTS.h4,
                }}>
                Location
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Image
                source={icons.master_card}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                  tintColor: COLORS.darkgray,
                }}
              />
              <Text style={{marginLeft: SIZES.padding, ...FONTS.h4}}>
                88888
              </Text>
            </View>
          </View>
          {/* //////////////////Order Button///////////////// */}
          <View
            style={{
              padding: SIZES.padding * 2,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Checkout', {
                  resturent: resturent,
                  currentLocation: currentLocation,
                  totalCash: sumOrder(),
                })
              }
              style={{
                width: SIZES.width * 0.9,
                padding: SIZES.padding,
                backgroundColor: COLORS.primary,
                alignItems: 'center',
                borderRadius: SIZES.radius,
              }}>
              <Text
                style={{
                  color: COLORS.white,
                  ...FONTS.h2,
                }}>
                Check Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderFoodInfo()}
      {renderOrder()}
    </View>
  );
};

export default Resturent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});
