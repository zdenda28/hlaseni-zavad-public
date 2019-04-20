/**
 *  Soubor definující navigaci v aplikaci.
 *  Exportován je app container obsahující Drawer navigátor.
 *
 *@author     Zdeněk Tomka
 *
 */

import React from 'react';
import { View } from 'react-native';
import {
    createDrawerNavigator,
    createStackNavigator,
    createAppContainer,
    DrawerItems
} from 'react-navigation';
import HomeScreen from '../../screens/HomeScreen';
import HelpScreen from '../../screens/HelpScreen';
import AboutScreen from '../../screens/AboutScreen';
import RulesScreen from '../../screens/RulesScreen';
import MapScreen from '../../screens/MapScreen';
import ReportScreen from '../../screens/ReportScreen';
import SelectLocationScreen from '../../screens/SelectLocationScreen';
import ReportDetailScreen from '../../screens/ReportDetailScreen';
import { WIDTH_70, APP_RED } from '../constants/uiConstants';
import { MaterialIcons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import DrawerHeader from '../components/drawerHeader';

const defaultNavigationOptions = ({ navigation }) => ({
    headerStyle: {
        backgroundColor: APP_RED,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
        fontWeight: 'normal',
    },
})

const StackNavigator = createStackNavigator(
    {
        HomeScreen: {
            screen: HomeScreen
        },
        MapScreen: {
            screen: MapScreen
        },
        ReportScreen: {
            screen: ReportScreen
        },
        SelectLocationScreen: {
            screen: SelectLocationScreen
        },
        ReportDetailScreen: {
            screen: ReportDetailScreen
        },
        RulesScreen: {
            screen: RulesScreen
        }
    },
    {
        defaultNavigationOptions
    }
);

const HelpScreenStack = createStackNavigator(
    {
        HelpScreen: {
            screen: HelpScreen
        },
    },
    {
        defaultNavigationOptions
    }
);

const AboutScreenStack = createStackNavigator(
    {
        AboutScreen: {
            screen: AboutScreen
        },
    },
    {
        defaultNavigationOptions
    }
);

const RulesScreenStack = createStackNavigator(
    {
        RulesScreen: {
            screen: RulesScreen
        },
    },
    {
        defaultNavigationOptions
    }
);

const CustomContentComponent = (props) => (
    <View style={{ flex: 1 }}>
        <DrawerHeader drawer={props} />
        <View><DrawerItems {...props} /></View>
    </View>
)

const DrawerNavigator = createDrawerNavigator(
    {
        Domů: {
            screen: StackNavigator,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => (
                    <MaterialIcons
                        name='home'
                        color={tintColor}
                        size={20}
                    />
                )
            }
        },
        Pravidla: {
            screen: RulesScreenStack,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => (
                    <Entypo
                        name='open-book'
                        color={tintColor}
                        size={20}
                    />
                )
            }
        },
        Nápověda: {
            screen: HelpScreenStack,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => (
                    <MaterialCommunityIcons
                        name='help-circle-outline'
                        color={tintColor}
                        size={20}
                    />
                )
            }
        },
        Info: {
            screen: AboutScreenStack,
            navigationOptions: {
                drawerLabel: 'O aplikaci',
                drawerIcon: ({ tintColor }) => (
                    <MaterialCommunityIcons
                        name='information-outline'
                        color={tintColor}
                        size={20}
                    />
                )
            }
        }
    },
    {
        drawerWidth: WIDTH_70,
        contentOptions: {
            activeTintColor: APP_RED,
            inactiveTintColor: '#444444',
            iconContainerStyle: {
                opacity: 1
            }
        },
        contentComponent: CustomContentComponent,
    },
);

export default createAppContainer(DrawerNavigator);