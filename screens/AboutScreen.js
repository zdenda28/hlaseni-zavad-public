/**
 *  Třída AboutScreen implementuje obrazovku o aplikaci.
 *
 *@author     Zdeněk Tomka
 *
 */

import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WIDTH_80 } from '../src/constants/uiConstants';

export default class AboutScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'O aplikaci',
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
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                    <View style={styles.columnLeft}>
                        <Text>Autor:</Text>
                        <Text>Kontakt:</Text>
                    </View>
                    <View style={styles.columnRight}>
                        <Text>Zdeněk Tomka</Text>
                        <Text>tomka.zdenek@gmail.com</Text>
                    </View>
                </View>
                <View style={{ flex: 2, width: WIDTH_80, marginTop: 20, alignItems: 'center' }}>
                    <Text style={{ textAlign: 'center' }}>Tato aplikace vznikla v rámci bakalářské práce (Aplikace pro sběr podnětů od obyvatel města Letohrad) na Fakultě informatiky a statistiky Vysoké školy ekonomické v Praze. </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    columnLeft: {
        flex: 1,
        alignItems: 'flex-end'
    },
    columnRight: {
        flex: 2,
        alignItems: 'flex-start',
        marginLeft: 10
    }
});