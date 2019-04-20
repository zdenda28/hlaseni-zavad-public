/**
 *  Třída MapScreen implementuje obrazovku s mapou závad.
 *  Na mapě jsou zobrazovány nejvýše 7 dní staré závady.
 *
 *@author     Zdeněk Tomka
 *
 */

import React from 'react';
import { MapView } from 'expo';
import { db } from '../src/constants/firestoreConnection';
import { Text, View, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tooltip } from 'react-native-elements';
import MapInfo from '../src/components/mapInfo';
import ButtonView from '../src/components/mapScreenButtons';

export default class MapScreen extends React.Component {

    _isMounted = false;

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Mapa závad',
            headerRight: (
                <Tooltip
                    popover={<MapInfo />}
                    backgroundColor='#444444'
                    withOverlay={false}
                    height={130}
                    width={220}>

                    <Ionicons
                        name='ios-information-circle-outline'
                        color='#fff'
                        size={32}
                        style={{ paddingHorizontal: 20 }}
                    />
                </Tooltip>
            )
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            coords: this.props.navigation.getParam('coords', false)
        };
    }

    componentWillMount() {
        this._isMounted = true;
        let data = [];
        db.collection('zavady').get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    //pouze týden staré závady (604800000 milisekund == 7 dní)
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

    componentDidMount() {
        //bohužel na ios nefunguje alert v kombinaci s overlay na předešlé straně -> overlay jinak nezmizí
        if (this.props.navigation.getParam('submitSucces') && Platform.OS === "android") {
            Alert.alert(
                'Hotovo',
                'Váš podnět byl úspěšně odeslán.'
            );

        }

        if (this.props.navigation.getParam('submitSucces') == false && Platform.OS === "android") {
            Alert.alert(
                'Pozor',
                'Váš podnět se nepodařilo odeslat. Zkuste to znovu.'
            );
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.data.length != this.state.data.length) {
            if (this.props.navigation.getParam('submitSucces')) {
                // označí uživatelem vytvořenou závadu
                setTimeout(() => this[this.props.navigation.getParam('timestamp')].showCallout(), 1000);
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    calloutPressed = (id) => {
        this.props.navigation.navigate('ReportDetailScreen', {
            id: id,
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <MapView
                    ref={(ref) => this.mapView = ref}
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: this.state.coords ? this.state.coords.latitude : 50.030832,
                        longitude: this.state.coords ? this.state.coords.longitude : 16.4980802,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                >
                    {this.state.data.map((marker, index) => (
                        <MapView.Marker
                            key={index}
                            coordinate={marker.data.lokace}
                            ref={ref => this[marker.data.timestamp] = ref}
                        >
                            <MapView.Callout
                                tooltip={false}
                                onPress={() => this.calloutPressed(marker.id)}>
                                <View style={styles.callout}>
                                    <Text style={styles.calloutText}>{marker.data.nazev}</Text>
                                    <Ionicons
                                        name='ios-arrow-forward'
                                        color='#444444'
                                        size={15}
                                        style={{ marginLeft: 10 }}
                                    />
                                </View>
                            </MapView.Callout>
                        </MapView.Marker>
                    ))}
                </MapView>

                <View style={styles.buttonView}>
                    <ButtonView navigation={this.props.navigation}
                        mapView={this.mapView} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    callout: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 10,
    },
    calloutText: {
        fontSize: 15,
        textDecorationLine: 'underline',
        color: '#444444',
    },
    buttonView: {
        position: 'absolute',
        bottom: 0,
        right: 0
    }
});
