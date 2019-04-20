/**
 *  Třída HomeScreen implementuje domovskou obrazovku aplikace.
 *
 *@author     Zdeněk Tomka
 *
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Platform } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { WIDTH_90, APP_RED } from '../src/constants/uiConstants';

export default class HomeScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Hlášení závad Letohrad',
            headerLeft: (
                <TouchableWithoutFeedback onPress={() => navigation.toggleDrawer()}>
                    <View>
                        <Ionicons
                            name='ios-menu'
                            color='#fff'
                            size={32}
                            style={{
                                marginHorizontal: 10,
                                paddingVertical: Platform.OS === 'ios' ? 0 : 10,
                                paddingHorizontal: 10
                            }}
                        />
                    </View>
                </TouchableWithoutFeedback>
            )
        };
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.textView}>
                    <Text style={styles.h1}>Vítejte v aplikaci pro sběr{"\n"}podnětů od obyvatel{"\n"}města Letohrad.</Text>
                    <Text style={styles.p}>Ještě předtím, než se poprvé rozhodnete nahlásit závadu, si prosím přečtěte informace o tom, jaké závady můžete nahlásit viz
                    <Text style={{ color: APP_RED }} onPress={() => this.props.navigation.navigate('RulesScreen')}>
                            {"\u00a0"}Pravidla</Text>
                    </Text>
                </View>
                <View style>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ReportScreen')}>
                        <View style={styles.reportButton}>
                            <MaterialCommunityIcons
                                name='hammer'
                                color='#444444'
                                size={32}
                                style={{ marginRight: 10 }}
                            />
                            <Text style={[styles.optionsText, { color: '#444444' }]}>Nahlásit závadu</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('MapScreen')}>
                        <View style={styles.mapButton} >
                            <MaterialCommunityIcons
                                name='google-maps'
                                color='#444444'
                                size={32}
                                style={{ marginRight: 10 }}
                            />
                            <Text style={[styles.optionsText, { color: '#444444' }]}>Mapa závad</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ebebeb',
        paddingVertical: 30
    },
    reportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        width: WIDTH_90,
        borderRadius: 4,
        paddingVertical: 20,
        justifyContent: 'center',
        marginTop: 20,
        backgroundColor: '#67B3AD'
    },
    mapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        width: WIDTH_90,
        borderRadius: 4,
        paddingVertical: 20,
        justifyContent: 'center',
        marginTop: 20,
        backgroundColor: '#B3CE76'
    },
    optionsText: {
        fontSize: 20,
    },
    textView: {
        width: WIDTH_90,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 4,
        flex: 1,
        justifyContent: 'space-around'
    },
    h1: {
        fontSize: 23,
        color: '#444444',
        textAlign: 'center'
    },
    p: {
        fontSize: 16,
        color: 'grey',
        textAlign: 'center',
    }
});