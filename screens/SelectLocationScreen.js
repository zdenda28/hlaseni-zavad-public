/**
 *  Třída SelectLocationScreen implementuje obrazovku pro manuální zvolení polohy při tvorbě podnětu.
 *
 *@author     Zdeněk Tomka
 *
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MapView } from 'expo';
import { WIDTH_80, APP_RED } from '../src/constants/uiConstants';
import { MaterialIcons } from '@expo/vector-icons';
import { db } from '../src/constants/firestoreConnection';

export default class SelectLocationScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            coordinate: {
                latitude: this.props.navigation.getParam('latitude', null),
                longitude: this.props.navigation.getParam('longitude', null),
            },
            data: []
        }
    }

    _isMounted = false;

    componentWillMount() {
        this._isMounted = true;
        let data = [];
        db.collection('zavady').get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    //pouze týden staré závady
                    if ((Date.now() - doc.data().timestamp) < 604800000) {
                        data.push({ id: doc.id, data: doc.data() });
                    }
                });
            }).then(() => {
                if (this._isMounted) {
                    this.setState({ data: data });
                }
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    navigateBack = () => {
        this.props.navigation.navigate('ReportScreen', {
            latitude: this.state.coordinate.latitude,
            longitude: this.state.coordinate.longitude
        });
    }

    getLocation = () => {
        navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError);
    }

    //nastaví aktuální polohu dle GPS
    geoSuccess = (position) => {
        this.setState({
            coordinate: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            }
        });

        this.mapView.animateToCoordinate({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        }, 1000);
    }

    geoError = (error) => {
        console.log(error);
    }

    //nastaví poluhu kam uživatel klikne
    setLocation = (event) => {
        this.setState({
            coordinate: {
                latitude: event.nativeEvent.coordinate.latitude,
                longitude: event.nativeEvent.coordinate.longitude
            }
        });

        this.mapView.animateToCoordinate({
            latitude: event.nativeEvent.coordinate.latitude,
            longitude: event.nativeEvent.coordinate.longitude,
        }, 1000);
    }

    static navigationOptions = {
        header: null
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    ref={(ref) => this.mapView = ref}
                    style={styles.map}
                    onPress={this.setLocation}
                    initialRegion={{
                        latitude: this.state.coordinate.latitude ? this.state.coordinate.latitude : 50.03632533752407,
                        longitude: this.state.coordinate.longitude ? this.state.coordinate.longitude : 16.499670445919037,
                        latitudeDelta: this.state.coordinate.latitude ? 0.01 : 0.02,
                        longitudeDelta: this.state.coordinate.latitude ? 0.01 : 0.02
                    }}

                >
                    {this.state.coordinate.latitude && (
                        <MapView.Marker
                            coordinate={this.state.coordinate}
                            title={"Vaše poloha"}
                        />
                    )}

                    {this.state.data.map((marker, index) => (
                        <MapView.Marker
                            key={index}
                            coordinate={marker.data.lokace}
                            pinColor={'wheat'}
                            title={marker.data.nazev}
                            opacity={0.7}
                        >
                        </MapView.Marker>
                    ))}

                </MapView>

                <View style={{ alignItems: 'flex-end', width: WIDTH_80 }}>
                    <TouchableOpacity onPress={this.getLocation}>
                        <View style={styles.circleLocator}>
                            <MaterialIcons
                                name='my-location'
                                color={APP_RED}
                                size={22}
                            />
                        </View>
                    </TouchableOpacity>
                </View>


                <TouchableOpacity onPress={this.navigateBack}>
                    <View style={styles.submitButton}>
                        <Text style={{ color: 'white' }}>Potvrdit</Text>
                    </View>
                </TouchableOpacity>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'column',
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    submitButton: {
        width: WIDTH_80,
        backgroundColor: APP_RED,
        padding: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        marginBottom: 30,
        marginTop: 20
    },
    circleLocator: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    }
});