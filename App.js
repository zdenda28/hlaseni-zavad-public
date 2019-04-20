/**
 *  Hlavní třída App, které načte aplikaci.
 *  Vrací konteiner navigace komponenty Navigator.
 *
 *@author     Zdeněk Tomka
 *
 */

import React from 'react';
import Navigator from './src/navigation/Navigator';

export default class App extends React.Component {
  render() {
    return (
      <Navigator />
    );
  }
}
