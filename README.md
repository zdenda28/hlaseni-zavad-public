# Bakalářská práce - Aplikace pro sběr podnětů od obyvatel města Letohrad
Autor: Zdeněk Tomka

link na Expo stránku s projektem:
https://expo.io/@zdenda28/hlaseniZavad

Google play:
https://play.google.com/store/apps/details?id=com.tomka.hlasenizavad

## O aplikaci
Tato mobilní aplikace vznikla ve spolupráci s městem Letohrad za účelem sběru podnětů od jeho obyvatel. Konkrétně se jedná o podněty týkající se závad ve městě. Uživatel pomocí této aplikace může hlásit závady, které následně obdrží pracovníci podatelny úřadu města Letohrad v podobě e-mailu.

## Použité technologie
Front-endová část této mobilní je napsána pomocí JavaSciptového frameworku pro tvorbu mobilních aplikací React Native. Dále jsou využity dvě back-endové služby k účelům uchování podnětů a jejich odesílání elektronickou poštou. Jednotlivé podněty jsou uchovávány v úložišti Firestore poskytovaným službou Google Firebase. E-maily jsou odesílány automaticky prostřednictvím služby Zapier, která každých 15 minut odešle nově vzniklé záznamy v databázi Firestore.

## Nastavení pro další vývoj
1) Nainstalujte si Node.js do vašeho počítače (https://nodejs.org/en/)

2) Globálně si nainstalujte balíček exp níže uvedeným příkazem 
   prostřednictvím příkazové řádky.
	```
	npm install exp --global
	```
3) Nainstalujte si chybějící balíčky. Nejprve se přesuňte v rámci příkazové
   řádky do složky 'aplikace', jež je součástí přílohy. Následně spusťte níze 
   uvedený příkaz.
	```
	npm install
	```
4) V rámci složky 'aplikace' v prostředí příkazové řádky zadejte následující příkaz.
	```
	exp start
	```
5) Nyní jste spustili metro bundler, který připravil aplikaci ke spuštění.

6) Ke spuštění aplikace v telefonu potřebujete mít nainstalovanou aplikaci expo a naskenovat
   QR kód poskytnutý metro bundlerem v příkazové řádce.
   
7) Ve složce projekt/src/constants vytvořit soubor firestoreConnection.js a implementovat uvnitř následující kód, který je potřeba doplnit o vlastní konfigurační údaje.

```
import * as firebase from 'firebase';
import 'firebase/firestore';

const CONFIG = {
    apiKey: "xxx",
    authDomain: "xxx",
    databaseURL: "xxx",
    projectId: "xxx",
    storageBucket: "xxx",
    messagingSenderId: "xxx"
};

firebase.initializeApp(CONFIG);
export const db = firebase.firestore();
export const storageRef = firebase.storage().ref();
```
## Budoucí vývoj a vylepšení
Aby se maximalizovala efektivita aplikace, je potřeba vytvořit nejlépe webové rozhraní správy jednotlivých podnětů, kde zaměsnanci úřadu budou moci provádět například mazání podnětů či změnu stavu podnětu na vyřešeno.
