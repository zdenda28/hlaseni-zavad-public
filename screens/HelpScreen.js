/**
 *  Třída HelpScreen implementuje obrazovku s nápovědou k aplikaci.
 *
 *@author     Zdeněk Tomka
 *
 */

import React from 'react';
import { StyleSheet, ScrollView, TouchableWithoutFeedback, View, Platform } from 'react-native';
import { Text, Divider } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

export default class HelpScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Nápověda',
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
                <Text h3 style={styles.p}>Jak nahlásit závadu?</Text>

                <Text style={styles.p}>Na úvodní obrazovce aplikace naleznete dvě hlavní možnosti, z nichž jednou je „Nahlásit závadu“. Po zvolení této možnosti se vám zobrazí formulář, který je potřeba vyplnit.</Text>
                <Text style={styles.p}>Povinnými součástmi formuláře jsou položky: název závady, popis závady, fotografie a poloha závady. Nepovinným polem formuláře je e-mail, který vyplníte v případě, že chcete zanechat svůj kontaktní údaj.</Text>

                <Text style={styles.p}><Text style={styles.bold}>Název závady</Text>{"\n"}Tato položka je limitována maximálně 100 znaky. Jedná se tedy o výstižný název závady. Tento název je při odeslání podnětu využit jako předmět e-mailu, který obdrží podatelna městského úřadu. </Text>

                <Text style={styles.p}><Text style={styles.bold}>Popis závady</Text>{"\n"}V popisu závady upřesníte její konkrétní charakteristiku. Znovu se ale pokuste být struční. Popis závady je limitován 300 znaky.</Text>

                <Text style={styles.p}><Text style={styles.bold}>Fotografie</Text>{"\n"}K zachycení fotografie závady jsou k dispozici dvě možnosti. První z nich je zachycení na místě přímo z fotoaparátu vašeho chytrého zařízení. Další možností je výběr fotografie závady z galerie vašeho zařízení. Závadu tedy nemusíte nahlásit přímo na místě, ale klidně i z pohodlí domova.</Text>

                <Text style={styles.p}><Text style={styles.bold}>Poloha závady</Text>{"\n"}Pokud máte v telefonu aktivní možnost informace o poloze (GPS), formulář určí aktuální polohu za vás. V případě, že určování polohy máte v telefonu zakázané, je potřeba polohu závady zvolit ručně z mapy. To samé je potřeba udělat v případě, že se rozhodnete závadu nenahlásit ihned, ale později z jiného místa.</Text>

                <Text h4 style={styles.p}>Jak to funguje?</Text>
                <Text style={styles.p}>Poté, co úspěšně odešlete podnět, aplikace uloží všechny informace do databáze a odešle je e-mailem na podatelnu Úřadu města Letohrad. K tomu abyste mohli úspěšně odeslat nový podnět budete potřebovat připojení k internetu.</Text>

                <Divider style={{ backgroundColor: 'black' }} />

                <Text h3 style={styles.p}>Co je mapa závad?</Text>
                <Text style={styles.p}>Druhou položkou hlavní obrazovky je mapa závad. Na ní naleznete na mapě vyznačené značky, které reprezentují závady nahlášené za posledních 7 dní.</Text>
                <Text style={styles.p}>Po kliknutí na konkrétní značku na mapě se nad ní zobrazí odkaz směřující na detail konkrétní závady.</Text>
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
    },
    bold: {
        fontWeight: 'bold'
    }
});