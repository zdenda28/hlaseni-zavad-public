/**
 *  Třída MapInfo implementuje komponentu obsahu tooltipu informace o mapě závad.
 *
 *@author     Zdeněk Tomka
 *
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class MapInfo extends React.Component {
    render() {
        return (
            <View>
                <Text style={[styles.text, { marginBottom: 5 }]}>Na této obrazovce naleznete závady nahlášené za poslední týden.</Text>
                <Text style={styles.text}>Kliknutím na značky zobrazené na mapě si můžete zobrazit detail závady.</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        color: 'white',
    }
});