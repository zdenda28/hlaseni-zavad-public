/**
 *  Třída ReportScreen implementuje obrazovku formuláře pro tvorbu nového podnětu.
 *
 *@author     Zdeněk Tomka
 *
 */

import React from 'react';
import {
    StyleSheet,
    TextInput,
    Text,
    View,
    TouchableOpacity,
    KeyboardAvoidingView,
    YellowBox,
    ActivityIndicator,
    NetInfo,
    Platform,
    Alert,
    Dimensions,
    Image,
    ScrollView,
    AsyncStorage
} from 'react-native';
import { ImagePicker, Permissions, Location } from 'expo';
import { Overlay } from 'react-native-elements';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { db, storageRef } from '../src/constants/firestoreConnection';
import AutoHeightImage from 'react-native-auto-height-image';
import { WIDTH_80, WIDTH_70, APP_RED, WARNING_RED } from '../src/constants/uiConstants';
import { StackActions, NavigationActions } from 'react-navigation';

const WIDTH = Dimensions.get('window').width;
//id pro název obrázku
const uuidv1 = require('uuid/v1');

export default class ReportScreen extends React.Component {

    //řeší probléms warningem při kliknutí na tlačítko zpět, GPS asynchroně nastavuje state
    _isMounted = false;

    constructor(props) {
        super(props)
        //řeší problém s warningem firebase
        YellowBox.ignoreWarnings(['Setting a timer']);
        this.state = {
            geoState: 'Automatické načítání polohy...',
            location: {
                latitude: null,
                longitude: null,
            },
            locationErr: false,
            address: 'Letohrad',
            GPSDisabled: false,
            imgOverlayIsVisible: false,
            spinnerOverlayIsVisible: false,
            thumbnailIsVisible: false,
            imgBtnWidth: WIDTH_80,
            image: false,
            imageErr: false,
            reportTitle: '',
            reportTitleErr: false,
            reportDescription: '',
            reportDescriptionErr: false,
            contactMail: '',
            contactMailErr: false
        };
    }

    componentDidMount() {
        this._isMounted = true;

        this.retrieveUsedEmail();

        this._onFocusListener = this.props.navigation.addListener('didFocus', (payload) => {
            if (this.state.location.longitude || this.state.GPSDisabled) {
                //toto přepisuje polohu z mapy
                this.setState({
                    location: {
                        latitude: this.props.navigation.getParam('latitude', this.state.location.latitude),
                        longitude: this.props.navigation.getParam('longitude', this.state.location.longitude),
                    }
                });
            } else {
                this.getLocationAsync().then(() => {
                    if (this._isMounted) {
                        this.setState({
                            geoState: 'Poloha byla automaticky načtena',
                            GPSDisabled: false
                        });
                    }
                }).catch((e) => {
                    if (this._isMounted) {
                        this.setState({
                            geoState: 'Automatické načtení polohy selhalo',
                            GPSDisabled: true,
                        });
                    }
                    console.log(e);
                });
            }
        });
    }

    getLocationAsync = async () => {
        await Permissions.askAsync(Permissions.LOCATION);
        let location = await Location.getCurrentPositionAsync({});

        if (this._isMounted) {
            this.setState({
                location: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                },
                geoState: 'Poloha byla automaticky načtena',
                GPSDisabled: false
            });
        }
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevState.location.latitude != this.state.location.latitude) {
            this.getReverseAdress(this.state.location.latitude, this.state.location.longitude);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getReverseAdress = (latitude, longitude) => {
        const addressRadius = 10; //okruh v metrech, kde je hledána adresa
        const request = 'https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=' + latitude + '%2C' + longitude + '%2C' + addressRadius + '&mode=retrieveAddresses&maxresults=1&gen=9&app_id=Lt8ZxRpNKTlQB8b7UdA9&app_code=GYOt71oOk_1RaXceZFJLUQ';

        return fetch(request)
            .then((response) => response.json())
            .then((responseJson) => {
                var address = 'Letohrad';

                responseJson = responseJson.Response.View[0].Result[0].Location.Address;

                if (responseJson.District) {
                    address = responseJson.District;

                    if (responseJson.Street) {
                        address += ', ' + responseJson.Street;

                        if (responseJson.HouseNumber) {
                            address += ' ' + responseJson.HouseNumber;
                        }
                    }
                }

                this.setState({
                    address: address
                });

            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    address: 'Letohrad'
                });
            });
    }

    storeUsedEmail = async (contactMail) => {
        try {
            await AsyncStorage.setItem('contactMail', contactMail);
        } catch (error) {
            // Error saving data
        }
    };

    retrieveUsedEmail = async () => {
        try {
            const value = await AsyncStorage.getItem('contactMail');
            if (value !== null) {
                // We have data!!
                console.log(value);
                this.setState({ contactMail: value });
            }
        } catch (error) {
            // Error retrieving data
        }
    };

    geoButtonEnable = () => {
        if (this.state.geoState == 'Automatické načítání polohy...') {
            return true;
        } else {
            return false;
        }
    }

    askPermissionsAsync = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
    };

    imageFromGallery = async () => {
        this.setState({ imgOverlayIsVisible: false })
        await this.askPermissionsAsync();
        let result = await ImagePicker.launchImageLibraryAsync({
            quality: 0.5,
        });

        if (!result.cancelled) {
            this.setState({
                image: result,
                imgBtnWidth: WIDTH * 0.63
            });
        }
    };

    imageFromCamera = async () => {
        this.setState({ imgOverlayIsVisible: false })
        await this.askPermissionsAsync();
        let result = await ImagePicker.launchCameraAsync({
            quality: 0.5,
        });

        if (!result.cancelled) {
            this.setState({
                image: result,
                imgBtnWidth: WIDTH * 0.63
            });
        }
    };

    openImageOverlay = () => {
        this.setState({ imgOverlayIsVisible: true })
    }

    uploadImage = async () => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                resolve(xhr.response);
            };
            xhr.onerror = (e) => {
                console.log(e);
                reject(new TypeError('request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', this.state.image.uri, true);
            xhr.send(null);
        });

        storageRef.child('zavady/' + uuidv1()).put(blob).then((snapshot) => {
            snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log('File available at', downloadURL);
                this.insertToFirebase(downloadURL);
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    escapeSpecialChars = (text) => {
        let result = text.toString();
        result = result.replace(/</g, "&lt;");
        result = result.replace(/>/g, "&gt;");
        return result;
    }

    navigateWithReset = (params) => {
        this.setState({
            spinnerOverlayIsVisible: false
        });
        const resetAction = StackActions.reset({
            index: 1,
            actions: [
                NavigationActions.navigate({ routeName: 'HomeScreen' }),
                NavigationActions.navigate({
                    routeName: 'MapScreen',
                    params: params
                })
            ],
        });
        this.props.navigation.dispatch(resetAction);
    }

    insertToFirebase = (imageUrl) => {
        let email;
        let timestamp = Date.now();
        if (this.state.contactMail == '') {
            email = 'Uživatel aplikace nezanechal kontaktní email.';
        } else {
            email = 'Kontakt na uživatele: ' + this.state.contactMail;
        }

        db.collection("zavady").doc().set({
            email: email,
            fotografie: imageUrl,
            lokace: this.state.location,
            adresa: this.state.address,
            nazev: this.state.reportTitle,
            popis: this.escapeSpecialChars(this.state.reportDescription),
            timestamp: timestamp,
        })
            .then(() => {
                console.log("Document successfully written!");
                this.storeUsedEmail(this.state.contactMail);
                this.navigateWithReset({
                    submitSucces: true,
                    coords: {
                        latitude: this.state.location.latitude,
                        longitude: this.state.location.longitude
                    },
                    timestamp: timestamp
                });
            })
            .catch((error) => {
                console.warn("Error writing document: ", error);
                this.navigateWithReset({
                    submitSucces: false
                });
            });
    }

    validate = () => {
        let valid = true;
        const SPECIAL_CHARS = /[@$^&*<>/{}|]/g;
        const EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;

        //validace názvu závady
        if (this.state.reportTitle == '') {
            this.setState({ reportTitleErr: 'Toto pole je povinné.' });
            valid = false;
        } else if (this.state.reportTitle.length < 4) {
            this.setState({ reportTitleErr: 'Minimální délka názvu jsou 4 znaky.' });
            valid = false;
        } else if (SPECIAL_CHARS.test(this.state.reportTitle)) {
            this.setState({ reportTitleErr: 'Název nesmí obsahovat speciální znaky.' });
            valid = false;
        } else {
            this.setState({ reportTitleErr: false });
        }

        //validace popisku
        if (this.state.reportDescription == '') {
            this.setState({ reportDescriptionErr: 'Toto pole je povinné.' });
            valid = false;
        } else if (this.state.reportDescription.length < 5) {
            this.setState({ reportDescriptionErr: 'Minimální délka popisku je 5 znaků.' });
            valid = false;
        } else {
            this.setState({ reportDescriptionErr: false });
        }

        //validace fotografie
        if (!this.state.image) {
            this.setState({ imageErr: 'Přidejte fotografii.' });
            valid = false;
        } else {
            this.setState({ imageErr: false });
        }

        //validace polohy
        if (this.state.location.latitude == null) {
            this.setState({ locationErr: 'Zadejte polohu závady.' });
            valid = false;
        } else {
            this.setState({ locationErr: false });
        }

        //validace emailu
        if (this.state.contactMail != "") {
            if (!EMAIL.test(this.state.contactMail)) {
                this.setState({ contactMailErr: 'Toto není platná emailová adresa.' });
                valid = false;
            } else {
                this.setState({ contactMailErr: false });
            }
        } else {
            this.setState({ contactMailErr: false });
        }

        return valid;
    }


    CheckConnectivity = () => {

        this.setState({
            spinnerOverlayIsVisible: true
        });

        //Android
        if (Platform.OS === "android") {
            NetInfo.isConnected.fetch().then(isConnected => {
                if (isConnected) {
                    //vložit do databáze
                    this.uploadImage();
                } else {
                    this.setState({
                        spinnerOverlayIsVisible: false
                    });
                    Alert.alert("Nejste připojeni k internetu!");
                }
            });
        } else {
            //iOS
            NetInfo.isConnected.addEventListener(
                "connectionChange",
                this.handleFirstConnectivityChange
            );
        }
    };

    handleFirstConnectivityChange = isConnected => {
        NetInfo.isConnected.removeEventListener(
            "connectionChange",
            this.handleFirstConnectivityChange
        );

        if (isConnected === false) {
            this.setState({
                spinnerOverlayIsVisible: false
            });
            Alert.alert("Nejste připojeni k internetu!");
        } else {
            //vložit do databáze
            this.uploadImage();
        }
    };

    submitForm = () => {

        //očištění od mezer
        this.setState({
            reportTitle: this.state.reportTitle.trim(),
            reportDescription: this.state.reportDescription.trim()
        });

        if (this.validate()) {
            this.setState({
                spinnerOverlayIsVisible: true
            });
            //uvnitř chceck connectivity vkládám do databáze
            this.CheckConnectivity();
        } else {
            console.log('data nebudou vložena');
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Nový podnět',
        };
    };

    render() {
        return (
            <ScrollView contentContainerStyle={styles.container}>

                <Overlay
                    isVisible={this.state.imgOverlayIsVisible}
                    windowBackgroundColor="rgba(0, 0, 0, 0.8)"
                    overlayBackgroundColor="#fff"
                    width={WIDTH_80}
                    height="auto"
                    onBackdropPress={() => this.setState({ imgOverlayIsVisible: false })}
                >
                    <View style={{ marginVertical: 10, paddingHorizontal: 15 }}>

                        <TouchableOpacity onPress={this.imageFromCamera}>
                            <View style={styles.overlayButton}>
                                <MaterialCommunityIcons
                                    name='camera'
                                    color='white'
                                    size={18}
                                />
                                <Text style={{ color: 'white', marginLeft: 3 }}>Fotoaparát</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.imageFromGallery}>
                            <View style={styles.overlayButton}>
                                <MaterialCommunityIcons
                                    name='folder-image'
                                    color='white'
                                    size={18}
                                />
                                <Text style={{ color: 'white', marginLeft: 3 }}>Galerie</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </Overlay>

                <Overlay
                    isVisible={this.state.spinnerOverlayIsVisible}
                    windowBackgroundColor="rgba(0, 0, 0, 0.8)"
                    overlayBackgroundColor="#fff"
                    width={WIDTH_80}
                    height="auto">
                    <View style={styles.spinnerOverlay}>
                        <ActivityIndicator size="large" color={APP_RED} />
                        <Text>Odesílání podnětu...</Text>
                    </View>
                </Overlay>

                <Overlay
                    isVisible={this.state.thumbnailIsVisible}
                    windowBackgroundColor="rgba(0, 0, 0, 0.8)"
                    overlayBackgroundColor="#fff"
                    width={WIDTH_80}
                    height="auto"
                    onBackdropPress={() => this.setState({ thumbnailIsVisible: false })}
                >
                    <View style={{ alignItems: 'center' }}>

                        <AutoHeightImage
                            width={WIDTH_70}
                            source={{ uri: this.state.image.uri }}
                        />

                        <View style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#fff' }}>
                            <TouchableOpacity onPress={() => this.setState({ thumbnailIsVisible: false })} >
                                <MaterialIcons
                                    name='close'
                                    color={'#444444'}
                                    size={32}
                                    style={{ padding: 5 }}
                                />
                            </TouchableOpacity>
                        </View>

                    </View>
                </Overlay>

                <View style={styles.inputGroup}>
                    <View style={styles.item}>
                        <Text style={styles.inputLabel}>Název závady</Text>
                        <TextInput
                            style={[styles.textInput,
                            this.state.reportTitleErr ? { borderColor: WARNING_RED } : { borderColor: '#C0C0C0' }]}
                            placeholder='Název závady'
                            maxLength={100}
                            onChangeText={(text) => this.setState({ reportTitle: text })}
                        />
                        <Text style={styles.errorText}>{this.state.reportTitleErr &&
                            this.state.reportTitleErr}</Text>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.inputLabel}>Kontaktní email</Text>
                        <TextInput
                            value={this.state.contactMail}
                            style={[styles.textInput,
                            this.state.contactMailErr ? { borderColor: WARNING_RED } : { borderColor: '#C0C0C0' }]}
                            placeholder='Email (nepovinný)'
                            onChangeText={(text) => this.setState({ contactMail: text })}
                        />
                        <Text style={styles.errorText}>{this.state.contactMailErr &&
                            this.state.contactMailErr}</Text>
                    </View>

                    <KeyboardAvoidingView
                        behavior="padding"
                        enabled
                    >
                        <View style={styles.item}>
                            <Text style={styles.inputLabel}>Popis závady</Text>
                            <TextInput
                                style={[styles.textArea,
                                this.state.reportDescriptionErr ? { borderColor: WARNING_RED } : { borderColor: '#C0C0C0' }]}
                                placeholder='Popis max. 300 znaků'
                                multiline={true}
                                numberOfLines={8}
                                maxLength={300}
                                onChangeText={(text) => this.setState({ reportDescription: text })}
                            />
                            <Text style={styles.errorText}>{this.state.reportDescriptionErr &&
                                this.state.reportDescriptionErr}</Text>
                        </View>
                    </KeyboardAvoidingView>

                    <View style={styles.item}>
                        <View style={{ width: WIDTH_80, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TouchableOpacity onPress={this.openImageOverlay}>
                                <View style={[styles.takeImageBtn, { width: this.state.imgBtnWidth }]}>
                                    <Text style={{ color: 'white', marginRight: 3 }}>Fotografie</Text>
                                    {this.state.image &&
                                        <MaterialIcons
                                            name='check'
                                            color='lightgrey'
                                            size={18}
                                        />
                                    }
                                </View>
                            </TouchableOpacity>

                            {this.state.image &&
                                <TouchableOpacity onPress={() => this.setState({ thumbnailIsVisible: true })}>
                                    <View>
                                        <Image
                                            style={{ width: WIDTH * 0.15, height: 46, borderRadius: 4 }}
                                            source={{ uri: this.state.image.uri }}
                                        />
                                    </View>
                                </TouchableOpacity>}
                        </View>

                        <Text style={styles.errorText}>{this.state.imageErr &&
                            this.state.imageErr}</Text>
                    </View>

                    <View style={styles.item}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('SelectLocationScreen', {
                            longitude: this.state.location.longitude,
                            latitude: this.state.location.latitude,
                        })}
                            disabled={this.geoButtonEnable()}>
                            <View style={[styles.geoButton, { backgroundColor: '#6c757d' }]}>
                                <Text style={{ color: 'white', marginRight: 3 }}>Volba polohy</Text>
                                {this.state.location.longitude &&
                                    <MaterialIcons
                                        name='check'
                                        color='lightgrey'
                                        size={18}
                                    />
                                }
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.errorText}>{this.state.locationErr &&
                            this.state.locationErr}</Text>
                        <Text style={styles.geoInfo}>{this.state.geoState}</Text>
                    </View>

                    <TouchableOpacity onPress={() => this.submitForm()}>
                        <View style={styles.submitButton}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Odeslat</Text>
                        </View>
                    </TouchableOpacity>

                </View>
            </ScrollView >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10
    },
    item: {
        marginBottom: 5,
    },
    textInput: {
        width: WIDTH_80,
        borderWidth: 1,
        paddingVertical: 5,
        paddingLeft: 10,
        fontSize: 15,
        borderRadius: 4
    },
    textArea: {
        textAlignVertical: 'top',
        width: WIDTH_80,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
    },
    inputGroup: {
        justifyContent: 'center',
    },
    geoButton: {
        width: WIDTH_80,
        padding: 14,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 4
    },
    takeImageBtn: {
        backgroundColor: '#6c757d',
        padding: 14,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 4
    },
    overlayButton: {
        backgroundColor: '#6c757d',
        padding: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        flexDirection: 'row',
        borderRadius: 4
    },
    submitButton: {
        width: WIDTH_80,
        backgroundColor: APP_RED,
        padding: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        borderRadius: 4
    },
    geoInfo: {
        fontSize: 9,
        color: 'grey',
    },
    errorText: {
        fontSize: 10,
        color: WARNING_RED,
        marginTop: 3
    },
    inputLabel: {
        marginBottom: 3,
        color: 'grey'
    },
    spinnerOverlay: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    }
});