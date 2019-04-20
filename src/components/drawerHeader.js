/**
 *  Třída DrawerHeader implementuje komponentu hlavičky Drawer nevigátoru.
 *
 *@author     Zdeněk Tomka
 *
 */

import React from 'react';
import { StyleSheet, Text, View, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default class DrawerHeader extends React.Component {

    render() {
        return (
            <View style={styles.header}>
                <View style={styles.title}>
                    <Text style={{ fontSize: 25, color: '#444444' }}>Menu</Text>
                </View>
                <TouchableOpacity onPress={() => this.props.drawer.navigation.closeDrawer()}>
                    <View style={styles.button}>
                        <MaterialIcons
                            name='close'
                            color={'#444444'}
                            size={32}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
        flexDirection: 'row',
        height: 90,
    },
    title: {
        flex: 2,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: 20
    },
    button: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        height: 50,
        width: 50,
        marginRight: 20
    }
});