/**
 *  Třída ButtonView implementuje komponentu tlačítek na mapě závad.
 *  Jedná se o centrovací tlačítko a tlačítko přidání závady.
 *
 *@author     Zdeněk Tomka
 *
 */

import React from 'react';
import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { APP_RED } from '../constants/uiConstants';

export default class ButtonView extends React.Component {

    getLocation = () => {
        navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError);
    }

    geoSuccess = (position) => {
        this.props.mapView.animateToCoordinate({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        }, 1000);
    }

    geoError = (error) => {
        Alert.alert("Vyskytl se problém",
            "Ujistěte se, že jsou ve vašem zařízení aktivní služby určování polohy.");
        console.log(error);
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.getLocation()}>
                    <View style={[styles.circleButton, { marginBottom: 20 }]}>
                        <MaterialIcons
                            name='my-location'
                            color={APP_RED}
                            size={22}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('ReportScreen')}>
                    <View style={[styles.circleButton, { backgroundColor: APP_RED }]}>
                        <MaterialCommunityIcons
                            name='plus'
                            color={'#fff'}
                            size={22}
                        />
                    </View>
                </TouchableOpacity>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    circleButton: {
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
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