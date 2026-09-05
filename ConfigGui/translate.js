/**
 * Created by irvn on 09.01.2017.
 */
var lang="de"; // current language

// translation data
var langData = {
    de: {
        TITLE1: "PDG Webserver: Startseite",
        TITLE_CONN: "PDG Webserver: Verbindung herstellen",
        TITLE_CONFIG: "PDG Webserver: Konfiguration",
        TITLE_SETTINGS:"PDG Webserver: Einstellungen",
        TITLE_END:"PDG Webserver: Ende",
        GERMAN: "Deutsch",
        ENGLISH: "Englisch",
        PARAMETER: "Parameter",
        WERT:"Wert",
        IPADDRESS: "IP-Adresse",
        HOSTNAME:"Rechnername",
        PORT:"Port",
        VERBINDUNG:"Verbindung\r\nherstellen",
        VERBINDUNGSTYP:"Schritt 1\r\nVerbindungstyp",
        IPADRESSE: "Schritt 2\r\nIP-Adresse",
        WIFI: "Schritt 3\r\nWLAN-Zugang",
        ZURUECK:"Startseite",// "Zurück",
        ENDE:"Ende",
        DIAGNOSE:"Einstellungen",//"Diagnose",
        KONFIGURATION:"Konfiguration",
        WELCOME: "Willkommen",
        GOODBYE: "Auf Wiedersehen",
        VERBINDUNGSIPTEXT:"Ihre IP-Adresse:",
        INTERNETVERBINDUNG:"Status Internetverbindung:",
        SYSTEMNAME:"PDG Rechnername:",
        SYSTEMZEIT:"Systemzeit auf PDG:",
        HOSTTIME:"Systemzeit",
        BTLEVERBINDUNG:"Bluetooth Verbindung:",
        wlan0:"--- Wifi-Verbindung --- :",
        eth0:"--- Kabelverbindung --- :",
        CONN_STEP1:"Schritt 1",
        CONN_STEP2:"Schritt 2",
        CONN_STEP3:"Schritt 3",
        CONN_PHYS:"Verbindungstyp",
        CONN_TYPE:"IP-Adresse",
        CONN_WIFI:"Wlan-Zugang",
        DHCP:"DHCP",
        ENTER_IP:"IP:",
        ENTER_NM:"Netzmaske:",
        ENTER_GW:"Gateway:",
        WEITER:"weiter",
        PDG_RESET:"PDG resettiert jetzt:",
        PDG_RESET_SERVICE:"PDG-Dienst startet neu",
        CONF_APPLY: "Konfiguration anwenden",
        OK:"OK",
        CANCEL:"Abbrechen",
        RESET_DONE:"Reset durchgefuehrt",
        CONFIG_ERR1:"Fehler in Konfiguration",
        NO_PERM:"Berechtigungen zum Ausfuehren der Aktion fehlen",
        CONFIG_OK:"Konfiguration ok",
        REDIRECT_ACTION:"nach Klick auf Ok gelangen Sie \nautomatisch wieder auf die Startseite",
        REDIRECT_ACTION2:"falls Sie nach Klick auf Ok nicht in wenigen Sekunden\nautomatisch wieder auf die Startseite kommen\ngeben Sie bitte in der Adresszeile ein:",
        OWN_SID:"SID eingeben",
        UNKNOWN:"unbekannt",
        NAMESETTINGS:"Ändern des Hostnames und verbundener MyReserve",
        ENTER_MYRESERVE:"Namen eingeben:",
        INCORRECT_NAME:"falscher Name: Muster: MyReserve-XXXX",
        REMOVESB:"keine Bindung",
        BTLEVERBINDUNGCANCEL:"Normaleinstellung: keine Bluetooth Bindung",
        ENTER_HOSTNAME: "Namen eingeben:",
        INCORRECT_HOSTNAME:"falscher Name: Muster: solarwattgw<Ziffer>",
        Wlan:"Wlan",
        Netzwerkkabel:"Netzwerkkabel",
        WARN_MINUTE:"Das kann bis zu 1 Minute dauern.",
        BITTE_WARTEN:"bitte warten bis zur automatischen Weiterleitung",
        FACTORY_RESET:"Reset auf Werkseinstellungen",
        FACTORY_RESET_CONFIRM:"Reset auf LAN/DHCP\nLöschen der WLAN Zugangsdaten\nRechnernname <solarwattgw>\nKeine Bluetoothbindung"

    },
    en: {
        TITLE1: "PDG webserver: start",
        TITLE_CONN: "PDG webserver: establish connection",
        TITLE_CONFIG: "PDG Webserver: Configuration",
        TITLE_SETTINGS:"PDG webserver: Settings",
        TITLE_END:"PDG webserver: End",
        GERMAN: "German",
        ENGLISH: "English",
        PARAMETER: "Parameter",
        WERT:"Value",
        IPADDRESS: "IP-Adress",
        HOSTNAME:"Hostname",
        PORT:"Port",
        VERBINDUNG:"Configure\r\nConnection",
        VERBINDUNGSTYP:"Step 1\r\nConnectiontype",
        IPADRESSE: "Step 2\r\nIP-Adress",
        WIFI: "Step 3\r\nWLAN-Access",
        ZURUECK:"Homepage",//"Back",
        ENDE: "Finish",
        DIAGNOSE:"Settings",//"Diagnosis",
        KONFIGURATION:"Configuration",
        WELCOME: "Welcome",
        GOODBYE: "Good bye",
        VERBINDUNGSIPTEXT:"Your IP address:",
        INTERNETVERBINDUNG:"State of Internet connection:",
        SYSTEMNAME:"PDG Hostname:",
        SYSTEMZEIT:"System time on PDG:",
        HOSTTIME:"System time",
        BTLEVERBINDUNG:"Bluetooth connection:",
        wlan0:"--- Wifi Connection --- :",
        eth0:"--- Cable Connection --- :",
        CONN_STEP1:"Step 1",
        CONN_STEP2:"Step 2",
        CONN_STEP3:"Step 3",
        CONN_PHYS:"Connection type",
        CONN_TYPE:"IP address",
        CONN_WIFI:"Wifi credentials",
        DHCP:"DHCP",
        ENTER_IP:"IP:",
        ENTER_NM:"Netmask:",
        ENTER_GW:"Gateway:",
        WEITER: "continue",
        PDG_RESET:"PDG is going to reset now:",
        PDG_RESET_SERVICE:"PDG-service is going to restart",
        CONF_APPLY:"apply configuration",
        OK:"OK",
        CANCEL:"Cancel",
        RESET_DONE:"Reset done",
        CONFIG_ERR1:"error in configuration",
        NO_PERM:"missing permissions for this action",
        CONFIG_OK:"configuration ok",
        REDIRECT_ACTION:"after clicking ok you will be redirected \nto start screen in several seconds",
        REDIRECT_ACTION2:"if your are not redirected\nto startpage please enter in your browser:",
        OWN_SID:"enter SID",
        UNKNOWN:"unknown",
        NAMESETTINGS:"Change Hostname and connected MyReserve",
        ENTER_MYRESERVE:"special MyReserve:",
        INCORRECT_NAME:"wrong name: use MyReserve-XXXX",
        REMOVESB:"no binding",
        BTLEVERBINDUNGCANCEL:"Bluetooth default setting; no special bindung",
        ENTER_HOSTNAME: "enter hostname: ",
        INCORRECT_HOSTNAME:"wrong name: use solarwattgw<number>",
        Wlan:"WiFi",
        Netzwerkkabel:"Network cable",
        WARN_MINUTE:"this may last up to 1 minute.",
        BITTE_WARTEN:"please wait until you are redirected",
        FACTORY_RESET:"Factory Reset",
        FACTORY_RESET_CONFIRM:"reset to LAN/DHCP\ndelete WiFi credentials\ncomputername solarwattgw\nno dedicated MyReserve"
    }
};

// returns the translation for the given language key (depending on the current language)
function translate(key) {
    if (langData.hasOwnProperty(lang)) {
        if (langData[lang].hasOwnProperty(key)) {
            return langData[lang][key];
        } else {
            //console.log("Unknown language key: " + key);
            return key;
            //return "Undefined";
        }
    } else {
        //console.log("Unknown language: " + lang);
        return key;
        //return "Undefined";
    }
}

// translate all multi-lingual DOM elements
function translateView() {

    //handle text
    $(".lang").each(function() {
        var key = $(this).attr("data-lang");

        $(this).text(translate(key));

    });

    //handle buttons
    var elemlist=document.getElementsByClassName("langbut");

    for (var i = 0; i< elemlist.length; i++) {
        var key = elemlist[0].getAttribute("data-lang");
        elemlist[i].value = translate(key);
    }


}



$("#dechoose").click(function() {
    lang = "de";
    sessionStorage.setItem('lang',lang);
    translateView();
});

$("#enchoose").click(function() {
    lang = "en";
    sessionStorage.setItem('lang',lang);
    translateView();
});
