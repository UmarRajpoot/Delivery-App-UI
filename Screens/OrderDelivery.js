import React, {useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {icons, SIZES, FONTS, COLORS, GOOGLE_API_KEY} from '../Constants';
import MapsViewDirection from 'react-native-maps-directions';

const OrderDelivery = ({route, navigation}) => {
  const mapRef = useRef();
  const [resturent, setResturent] = useState(null);
  const [streetName, setStreetName] = useState('');
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [duration, setDuration] = useState(0);
  const [IsReady, setIsReady] = useState(false);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    let {resturent, currentLocation} = route.params;
    let fromLoc = currentLocation.gps;
    let toLoc = resturent.location;
    let street = currentLocation.streetName;

    let mapRegion = {
      latitude: (fromLoc.latitude + toLoc.latitude) / 2,
      longitude: (fromLoc.longitude + toLoc.longitude) / 2,
      latitudeDelta: Math.abs(fromLoc.latitude - toLoc.latitude) * 2,
      longitudeDelta: Math.abs(fromLoc.longitude - toLoc.longitude) * 2,
    };

    setResturent(resturent);
    setStreetName(street);
    setFromLocation(fromLoc);
    setToLocation(toLoc);
    setRegion(mapRegion);
  }, []);

  function calculateAngle(coordinates) {
    let startLat = coordinates[0]['latitude'];
    let startLng = coordinates[0]['longitude'];
    let endLat = coordinates[1]['latitude'];
    let endLng = coordinates[1]['longitude'];

    let dx = endLat - startLat;
    let dy = endLng - startLng;

    return (Math.atan2(dy, dx) * 180) / Math.PI;
  }

  ///////////////////////////////////Zoom IN and Out /////////////////////////////////////////////////////

  function ZoomIn() {
    let newRegion = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    };
    setRegion(newRegion);
    mapRef.current.animateToRegion(newRegion, 200);
  }

  function ZoomOut() {
    let newRegion = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    };
    setRegion(newRegion);
    mapRef.current.animateToRegion(newRegion, 200);
  }

  ///////////////////////////////////Zoom IN and Out /////////////////////////////////////////////////////

  // Render MAp
  function renderMap() {
    // Destination Marker
    function destinationMarker() {
      return (
        <Marker coordinate={toLocation}>
          <View
            style={{
              height: 40,
              width: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.white,
            }}>
            <View
              style={{
                height: 30,
                width: 30,
                borderRadius: 15,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.primary,
              }}>
              <Image
                source={icons.pin}
                style={{
                  width: 30,
                  height: 30,
                  tintColor: COLORS.white,
                }}
              />
            </View>
          </View>
        </Marker>
      );
    }

    // Car Icon
    function carIcon() {
      return (
        <Marker
          coordinate={fromLocation}
          anchor={{x: 0.5, y: 0.5}}
          flat={true}
          rotation={angle}>
          <Image
            source={icons.car}
            style={{
              width: 40,
              height: 40,
            }}
          />
        </Marker>
      );
    }

    ///renderDestinationHeader

    return (
      <View style={{flex: 1}}>
        <MapView
          ref={mapRef}
          style={{flex: 1}}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}>
          <MapsViewDirection
            origin={fromLocation}
            destination={toLocation}
            apikey={GOOGLE_API_KEY}
            strokeWidth={5}
            strokeColor={COLORS.primary}
            optimizeWaypoints={true}
            onReady={(result) => {
              setDuration(result.duration);

              if (!IsReady) {
                // Fit Route in Map
                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: SIZES.width / 20,
                    bottom: SIZES.height / 4,
                    left: SIZES.width / 20,
                    top: SIZES.height / 8,
                  },
                });

                // Reposition the Car
                let nextLocation = {
                  latitude: result.coordinates[0]['latitude'],
                  longitude: result.coordinates[0]['longitude'],
                };

                if (result.coordinate >= 2) {
                  let Angle = calculateAngle(result.coordinates);
                  setAngle(Angle);
                }

                setFromLocation(nextLocation);
                setIsReady(true);
              }
            }}
          />
          {destinationMarker()}
          {carIcon()}
        </MapView>
      </View>
    );
  }

  function renderDestinationHeader() {
    return (
      <View
        style={{
          position: 'absolute',
          top: 30,
          left: 0,
          right: 0,
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: SIZES.width * 0.9,
            paddingVertical: SIZES.padding,
            paddingHorizontal: SIZES.padding * 2,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.white,
          }}>
          <Image
            source={icons.red_pin}
            style={{
              width: 30,
              height: 30,
              marginRight: SIZES.padding,
            }}
          />
          <View
            style={{
              flex: 1,
            }}>
            <Text style={{...FONTS.body3}}>{streetName}</Text>
          </View>
          <Text style={{...FONTS.body3}}>{`${Math.ceil(duration)} Mins`}</Text>
        </View>
      </View>
    );
  }

  function renderDeliveryInfo() {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 50,
          left: 0,
          right: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: SIZES.width * 0.9,
            paddingVertical: SIZES.padding * 3,
            paddingHorizontal: SIZES.padding * 2,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.white,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={resturent?.courier.avatar}
              style={{
                width: 50,
                height: 50,
              }}
            />
            <View
              style={{
                flex: 1,
                marginLeft: SIZES.padding,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{...FONTS.h4}}>{resturent?.courier.name}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Image
                    source={icons.star}
                    style={{
                      width: 18,
                      height: 18,
                      tintColor: COLORS.primary,
                      marginRight: SIZES.padding,
                    }}
                  />
                  <Text style={{...FONTS.body3}}>{resturent?.rating}</Text>
                </View>
              </View>
              <Text
                style={{
                  color: COLORS.darkgray,
                  ...FONTS.body4,
                }}>
                {resturent?.name}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: SIZES.padding * 2,
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              style={{
                height: 50,
                width: SIZES.width * 0.5 - SIZES.padding * 6,
                backgroundColor: COLORS.primary,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}>
              <Text style={{...FONTS.h4, color: COLORS.white}}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 50,
                width: SIZES.width * 0.5 - SIZES.padding * 6,
                backgroundColor: COLORS.secondary,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}
              onPress={() => navigation.goBack()}>
              <Text style={{...FONTS.h4, color: COLORS.white}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function renderButtons() {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: SIZES.height * 0.35,
          right: SIZES.padding * 2,
          width: 60,
          height: 130,
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: COLORS.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => ZoomIn()}>
          <Text style={{...FONTS.body1}}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: COLORS.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => ZoomOut()}>
          <Text style={{...FONTS.body1}}>-</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      {renderMap()}
      {renderDestinationHeader()}
      {renderDeliveryInfo()}
      {renderButtons()}
    </View>
  );
};

export default OrderDelivery;

const styles = StyleSheet.create({});
