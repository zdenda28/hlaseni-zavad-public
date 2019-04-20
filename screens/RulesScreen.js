/**
 *  Třída RulesScreen implementuje obrazovku s pravidly pro použití aplikace.
 *
 *@author     Zdeněk Tomka
 *
 */

import React from 'react';
import { StyleSheet, ScrollView, View, TouchableWithoutFeedback, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native-elements';

export default class RulesScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Pravidla',
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
            <ScrollView contentContainerStyle={styles.container}>
                <Text h3 style={styles.p}>Co mohu nahlásit?</Text>

                <Text style={styles.p}>Při používání aplikace je důležité znát následující pravidla, aby byla zajištěna efektivita aplikace a nedocházelo k jejímu zneužívaní. Níže jsou vymezeny žádoucí a nežádoucí podněty.</Text>

                <Text h4 style={styles.p}>Žádoucí podněty</Text>
                <Text style={styles.p}>Jedná se o závady a připomínky, které můžete v rámci aplikace nahlásit. Patří mezi ně například: vady na pozemní komunikaci (díra v silnici, poničený chodník, převrácená dopravní značka), černá skládka, vandalismus, nefunkční veřejné osvětlení, závady na veřejné zeleni (spadlý strom) a podobně.</Text>
                <Text h4 style={styles.p}>Nežádoucí podněty</Text>
                <Text style={styles.p}>Aplikace neslouží k hlášení závad souvisejících s bytovými prostory. V takovém případě se budete muset obrátit na Správu budov města Letohrad.</Text>
                <Text style={styles.p}>Dále aplikaci nevyužívejte k hlášení závad na soukromém majetku.</Text>

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 20,
    },
    p: {
        marginVertical: 10,
        fontSize: 16,
        color: '#444444'
    }
});