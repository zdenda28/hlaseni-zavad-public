/**
 *  Třída ReportDetailScreen implementuje obrazovku s detailem závady.
 *
 *@author     Zdeněk Tomka
 *
 */

import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { db } from '../src/constants/firestoreConnection';
import { Text } from 'react-native-elements';
import { WIDTH_100_DETAIL } from '../src/constants/uiConstants';
import AutoHeightImage from 'react-native-auto-height-image';
import moment from "moment";
import 'moment/locale/cs'

export default class ReportDetailScreen extends React.Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            data: '',
            dateTime: ''
        };
    }

    componentWillMount() {
        this._isMounted = true;
        var docRef = db.collection("zavady").doc(this.props.navigation.getParam('id'));
        let data;

        docRef.get().then(function (doc) {
            if (doc.exists) {
                data = doc.data();
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).then(() => {
            if (this._isMounted) {
                this.setState({
                    data: data,
                    //převedení milisekund na český formát datumu
                    dateTime: moment(new Date(data.timestamp)).locale('cs').format('LLLL')
                });
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    escapedToSpecialChars = (text) => {
        let result = text.toString();
        result = result.replace(/&lt;/g, "<");
        result = result.replace(/&gt;/g, ">");
        return result;
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Detail závady',
        };
    };

    render() {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <Text h2 style={styles.item}>{this.state.data.nazev}</Text>
                <Text style={{ color: 'grey' }}>{this.state.dateTime}</Text>
                <Text style={[styles.item, { fontSize: 15 }]}>
                    {this.state.data.popis && this.escapedToSpecialChars(this.state.data.popis)}
                </Text>
                <View>
                    <AutoHeightImage
                        width={WIDTH_100_DETAIL}
                        source={{ uri: this.state.data.fotografie }}
                        style={{ marginTop: 15 }}
                    />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 20,
    },
    item: {
        marginVertical: 15,
        color: '#444444'
    }
});