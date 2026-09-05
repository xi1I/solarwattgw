/**
 * Created by irvn on 11.01.2017.
 */


// need to be adjusted if layout changes
ConBut = "1_1";
DiagBut = "3_1";
ConfBut = "5_1";
BackBut = "7_1";
EndBut = "9_1";
var NumCols = 4;
var NumRows = 12;
var ContentRow = 1;
var RowCount = 0;

////////// TODO: weiter-Button
//connection conf types
var ConnCable = "0";
var ConnWifi = "1";
var ConnDhcp = "0";
var ConnIp = "1";

//connection conf states
var SPhys = "1";
var SLog = "2";
var SIP = "3";
var SNM = "4";
var SGW = "5";
var SWifi = "6";
var SReady = "7";

var Red = '<p><img width="20px" height="20px" src="image/red_circle.png"/></p>';
var Green = '<p><img width="20px" height="20px" src="image/green_circle.png"/></p>';
var Yellow = '<p><img width="20px" height="20px" src="image/yellow_circle.png"/></p>';


function onClickConnection() {

    window.location.href = "connection.html";
}
function onClickDiag() {

    window.location.href = "settings.html";
}

function onClickConfig() {

    window.location.href = "configuration.html";

}
function onClickBack(page) {
    window.location.href = page;
}


function makeRows(data, tableBody, actRow, k) {


    var rows = 0;
    var cols = 0;

    //TODO: row coloring if nested

    var keys = [];
    if (k.length == 0) {
        keys = [
            "HOSTNAME",
            "HOSTTIME",
            "DNS",
            "ACT_GATEWAY",
            "PREF_INTERFACE",
            "eth0",
            "wlan0",
            "ROUTING",
            "MYRESERVE_NAME",
            "MYRESERVE_ADDR",
            "MYRESERVE_PW",
            "LAST_BTLE_DATA",
            "BTLE_IS_UP"


        ];
    }
    else {
        keys = k;
    }

    if (keys.length !== 0) {
        rows = keys.length;//+ actRow;
        cols = 2;
    }
    for (var i = 0; i < rows; i++) {
        var tr = document.createElement('TR');

        tableBody.appendChild(tr);
        RowCount = RowCount + 1;
        for (var j = 0; j < cols; j++) {

            var td = document.createElement('TD');

            //add class for different background
            if (RowCount % 2) {
                td.className = "lightrow";
            }
            else {
                td.className = "darkrow";
            }

            if (j === 0) {
                var d = document.createElement('div');
                var c = document.createTextNode(keys[i]);

                d.id = "de";

                d.setAttribute("data-lang", keys[i]);
                d.setAttribute("class", "lang");

                d.appendChild(c);
                td.appendChild(d);
            }
            else {

                if (data === null) {
                    td.appendChild(document.createTextNode(""));
                    tr.appendChild(td);
                    return;
                }

                if (typeof (data[keys[i]]) == 'object') {
                    var k1 = [];

                    td.appendChild(document.createTextNode(""));
                    if (keys[i] === "wlan0") {
                        k1 = [
                            "MAC",
                            "ACT_IP",
                            "ACT_NETMASK",
                            "IS_UP",
                            "SID",
                            "PW",

                        ];
                    }
                    if (keys[i] === "eth0") {
                        k1 = [
                            "MAC",
                            "ACT_IP",
                            "ACT_NETMASK",
                            "IS_UP",
                        ];

                    }

                    //recursively add data
                    makeRows(data[keys[i]], tableBody, rows + 1, k1);
                } else {
                    td.appendChild(document.createTextNode(data[keys[i]]));
                }
            }
            tr.appendChild(td);


        }
    }

}

function fillElem(elemname, data, valname) {
    var elem = document.getElementById(elemname);
    var val = "";
    if (elem) {
        try {
            val = data[valname];
        }
        catch (err) {
            val = "";
        }
        elem.innerHTML = val;
    }
}

function fillSettingsValues(data) {

    fillElem("hostname", data, "HOSTNAME");


    fillElem("mrname", data, "MYRESERVE_NAME");

}
function fillHomeValues(data) {

    fillElem("hosttime", data, "HOSTTIME");
    fillElem("hostname", data, "HOSTNAME");
    fillElem("ipaddr", data, "REMOTE_ADDR");


    var elem = document.getElementById("internetconncircle");
    var val = "";
    if (elem) {
        try {
            val = data["IS_CONNECTED"];
        }
        catch (err) {
            val = "";
            elem.innerHTML = Yellow;
        }
        if (val === false) {
            elem.innerHTML = Red;
        }
        else if (val === true) {
            elem.innerHTML = Green;
        }
    }

    elem = document.getElementById("bluetoothconncircle");
    val = "";
    if (elem) {
        try {
            val = data["BTLE_IS_UP"];
        }
        catch (err) {
            val = "";
            elem.innerHTML = Yellow;
        }
        if (val === false) {
            elem.innerHTML = Red;
        }
        else if (val === true) {
            elem.innerHTML = Green;
        }
    }
    fillElem("mrname", data, "MYRESERVE_NAME");
}
function addTable(data, place, rows, cols) {
    //alert(place);
    //var table = document.createElement('TABLE');
    mtable = document.getElementById("confmenu");
    //need to remove content row and create new in order to get the spans right

    mtable.deleteRow(ContentRow);
    var row2 = mtable.insertRow(ContentRow);

    //the leftmost cell
    var cell = row2.insertCell(0);
    cell.innerHTML = ""
    cell.className = "menucolempty";


    //the content cell
    var cell2 = row2.insertCell(1);

    // adjust the col/rowspan
    cell2.colSpan = NumCols - 1;
    cell2.id = place;

    //TODO: adjust span
    cell2.rowSpan = 30;//NumRows-2;
    cell2.className = "content";

    //create new table to display the results and place it in content cell
    var table = document.createElement('TABLE');

    table.border = '1';
    table.id = "confdispt";  //for css

    var tableBody = document.createElement('TBODY');

    var tableHeader = table.createTHead();
    var hr = tableHeader.insertRow(0);

    hr.className = "tablehead";

    var hc = hr.insertCell(0);
    hc.innerHTML = '<div id="de" class="lang" data-lang="PARAMETER">Parameter</div>';

    var hc2 = hr.insertCell(1);
    hc2.innerHTML = '<div id="de" class="lang" data-lang="WERT">Wert</div>';

    table.appendChild(tableBody);

    makeRows(data, tableBody, 0, []);

    cell2.appendChild(table);

}


var getJSON = function (url, successHandler, errorHandler) {
    var xhr = typeof XMLHttpRequest != 'undefined'
        ? new XMLHttpRequest()
        : new ActiveXObject('Microsoft.XMLHTTP');

    xhr.onreadystatechange = function () {
        var status;
        var data;
        if (xhr.readyState == 4) {
            status = xhr.status;

            if (status == 200) {

                data = JSON.parse(xhr.responseText);
                switch (successHandler) {
                    case "conf":
                        sessionStorage.setItem("actConfData", xhr.responseText);
                        addTable(data, "2_2", 3, 2);
                        break;
                    case "home":
                        sessionStorage.setItem("actConfData", xhr.responseText);
                        fillHomeValues(data);
                        break;
                    case "settings":
                        sessionStorage.setItem("actConfData", xhr.responseText);
                        fillSettingsValues(data);
                        break;
                    case "configChange":
                        informUser(data);
                        break;
                    case "configChange2":
                        informUser2(data);
                        break;
                    case "configChange3":
                        informUser3(data);
                        break;
                    case "factoryReset":
                        informUser(data);
                        break;
                    default:
                        ;
                }

                translateView();
                //successHandler && successHandler(data);
            } else {
                errorHandler && errorHandler(status);
            }
        }
    };
    if (successHandler == "configChange") {
        xhr.open('post', url, true);
        var sdata = new FormData();
        var connstate = JSON.parse(sessionStorage.getItem('connstate'));
        var sid = document.getElementById("sidchoose");
        var versch = document.getElementById("verschchoose");

        if (connstate["phys"] == ConnWifi) {
            var strSID = sid.options[sid.selectedIndex].text;
            var strPW = document.getElementById("pwtext").value;
            var strVersch = versch.options[versch.selectedIndex].text;
            connstate["SID"] = strSID;
            connstate["PW"] = strPW;
            connstate["MODE"] = strVersch;
        }
        sdata.append('config', JSON.stringify(connstate));
        xhr.send(sdata);
    }

    else {
        if (successHandler == "configChange2") {
            xhr.open('post', url, true);
            var sdata = new FormData();

            sdata.append('config',sessionStorage.getItem('mrname'));
            xhr.send(sdata);
        }
        else {
            if (successHandler == "configChange3") {
                xhr.open('post', url, true);
                var sdata = new FormData();

                sdata.append('config',sessionStorage.getItem('hostname'));
                xhr.send(sdata);

            }
            else {
                if (successHandler == "factoryReset") {
                    xhr.open('post', url, true);
                    var sdata = new FormData();
                    xhr.send(sdata);
                }

                else {
                    xhr.open('get', url, true);
                    xhr.send();
                }
            }
        }
    }
};
var handleConfiguration = function () {
    //getJSON("http://solarwattgw/cgi-bin/getConfiguration", null, null);
    getJSON("/cgi-bin/getConfig.py", "conf", null);
};

var factoryreset =  function () {
    var ret=confirm(translate("FACTORY_RESET_CONFIRM"));
    if (ret === true){
        submitFactoryReset();
    }

}
var informUser = function (data) {

}
var informUser2 = function (data) {

}
var informUser3 = function (data) {

}

var submitFactoryReset = function () {

    //set default config network/hostname/wifi credentials/bluetooth binding

    alert(translate("PDG_RESET") + '\n'  + translate("WARN_MINUTE") + '\n' + translate("REDIRECT_ACTION"));

    sessionStorage.setItem('hostname','solarwattgw');
    var deststr="http://"+'solarwattgw'+"/index.html";
    sessionStorage.setItem('nextpage',deststr);

    getJSON("/cgi-bin/factoryReset.py", "factoryReset", null);


    setTimeout(function () {
        window.location.replace("countdown.html");
    }, (2000));


}

var submitConfig = function () {

    //Network connection change

    alert(translate("PDG_RESET") + '\n'  + translate("WARN_MINUTE") + '\n' + translate("REDIRECT_ACTION"));
    sessionStorage.setItem('nextpage',"index.html");
    getJSON("/cgi-bin/configChange.py", "configChange", null);


    //window.location.replace("countdown.html");
    setTimeout(function () {
        window.location.replace("countdown.html");
    }, (2000));


}

var submitConfig2 = function (t) {

    //MR device change
    sessionStorage.setItem('mrname',t);

    alert(translate("PDG_RESET_SERVICE"));
    getJSON("/cgi-bin/configChange2.py", "configChange2", null);

    setTimeout(function () {
        window.location.href="index.html";
    }, (2000));


}
var submitConfig3 = function (t) {

    //hostname change
    sessionStorage.setItem('hostname',t);
    var deststr="http://"+t+"/index.html";
    sessionStorage.setItem('nextpage',deststr);
    alert(translate("PDG_RESET") + '\n' +  translate("WARN_MINUTE") + '\n' + translate("REDIRECT_ACTION2")+'\n' +deststr);
    getJSON("/cgi-bin/configChange3.py", "configChange3", null);

    //window.location.href="countdown.html";

    setTimeout(function () {
        window.location.href="countdown.html";

    }, (2000));


}
function isAlphanumeric( stri ) {
    return /^[0-9a-zA-Z]+$/.test(stri);
}
var validateHostname = function () {
    var valid = true;
    var e = document.getElementById("hostnametext");
    var hText = e.value;
    if (hText.length===0){
        valid=false;
    }
    if (! isAlphanumeric(hText))
    {
        valid=false;
    }

    if(hText.substr(0,11) !="solarwattgw")
    {
        valid=false;
    }

    if (hText.length>11) {
        var numpart=hText.substr(11);
        var intnum= parseInt(numpart);

        if (isNaN(intnum)){
            valid=false;
        }
    }
    if (valid === false) {
        alert(translate("INCORRECT_HOSTNAME") );
    }
    else {
        submitConfig3(hText);
    }
}

var mrSetDefault = function () {
    submitConfig2("");
}
var validateMR = function () {
    var validMR = true;
    var e = document.getElementById("mrnametext");
    var mrText = e.value;
    var hexpart=mrText.substr(10,14);
    hexpart=hexpart.toLowerCase();
    var hexint=parseInt(hexpart,16);
    if ((hexint.toString(16) !== hexpart) || (mrText.length!=14))
    {
        validMR = false;
    }

    if (mrText.substr(0,10)!='MyReserve-') {
        validMR = false;
    }
    if (validMR === false) {
        alert(translate("INCORRECT_NAME") );
    }
    else{
        submitConfig2(mrText);
    }
}

var validateIP = function () {
    var connstate = JSON.parse(sessionStorage.getItem('connstate'));
    var e = document.getElementById("iptext");
    var ipText = e.value;
    validIP = false;
    ipParts = ipText.split(".");
    if (ipParts.length == 4) {
        for (i = 0; i < 4; i++) {

            theNum = parseInt(ipParts[i]);
            if (theNum >= 0 && theNum <= 255) {
            }
            else {
                break;
            }

        }
        if (i == 4) validIP = true;
    }
    if (!validIP) {
        alert("IP Format korrigieren : xxx.xxx.xxx.xxx");
        connstate["IP"] = "";
        sessionStorage.setItem('connstate', JSON.stringify(connstate));
    }
    else {

        connstate["IP"] = ipText;
        sessionStorage.setItem('connstate', JSON.stringify(connstate));

        onClickNetworkLogical(ConnIp);
    }
}
var validateNM = function () {
    var connstate = JSON.parse(sessionStorage.getItem('connstate'));
    var e = document.getElementById("nmtext");
    var nmText = e.value;
    validNM = false;
    ipParts = nmText.split(".");
    if (ipParts.length == 4) {
        for (i = 0; i < 4; i++) {

            theNum = parseInt(ipParts[i]);
            if (theNum >= 0 && theNum <= 255) {
            }
            else {
                break;
            }

        }
        if (i == 4) validNM = true;
    }
    if (!validNM) {
        alert("Netmask Format korrigieren : xxx.xxx.xxx.xxx");
        connstate["NM"] = "";
        sessionStorage.setItem('connstate', JSON.stringify(connstate));
    }
    else {
        connstate["NM"] = nmText;
        sessionStorage.setItem('connstate', JSON.stringify(connstate));

        onClickNetworkLogical(ConnIp);
    }
}


var validateGW = function () {
    var connstate = JSON.parse(sessionStorage.getItem('connstate'));
    var e = document.getElementById("gwtext");
    var gwText = e.value;
    validGW = false;
    ipParts = gwText.split(".");
    if (ipParts.length == 4) {
        for (i = 0; i < 4; i++) {

            theNum = parseInt(ipParts[i]);
            if (theNum >= 0 && theNum <= 255) {
            }
            else {
                break;
            }

        }
        if (i == 4) validGW = true;
    }
    if (!validGW) {
        alert("Gateway Format korrigieren : xxx.xxx.xxx.xxx");
        connstate["GW"] = "";
        sessionStorage.setItem('connstate', JSON.stringify(connstate));
    }
    else {
        connstate["GW"] = gwText;
        sessionStorage.setItem('connstate', JSON.stringify(connstate));

        onClickNetworkLogical(ConnIp);
    }
}

var setWifiCred = function (val, newSid) {
    var connstate = null;
    var actConfData = null;
    var actSid;
    var actPW;
    var modes = [];

    var sid = document.getElementById("sid");
    var pw = document.getElementById("pwtext");
    try {
        connstate = JSON.parse(sessionStorage.getItem("connstate"));
        actConfData = JSON.parse(sessionStorage.getItem("actConfData"));
        actSid = actConfData["wlan0"]["SID"];
        actPW = actConfData["wlan0"]["PW"];

    }
    catch (err) {
        return;
    }

    if (newSid != null) {
        actConfData["SIDS"][newSid] = {"auth":["WPA","WEP"]};
        sessionStorage.setItem("actConfData", JSON.stringify(actConfData));


        var sidc = document.getElementById("sidchoose");
        var opt = document.createElement('option');
        opt.value = newSid;
        opt.innerHTML = newSid;

        sidc.appendChild(opt);
        sidc.value=newSid;
    }

    if (val == actSid) {
        pw.value = actPW;
    }
    else {
        pw.value = "";
    }

    try {
        modes = actConfData["SIDS"][val]["auth"];
    }
    catch (err) {
        modes = ["WPA", "WEP"];
    }

    var versch = document.getElementById("verschchoose");

    for (var i = versch.options.length - 1; i >= 0; i--) {
        versch.remove(i);
        //versch.options[i]=null;
    }
    for (var i = 0; i < modes.length; i++) {
        var opt = document.createElement('option');
        opt.value = modes[i];
        opt.innerHTML = modes[i];

        versch.appendChild(opt);
    }
}
var WifiSelChangeCB = function () {

    var select = document.getElementById("sidchoose");
    var sel = select.options[select.selectedIndex].value;
    var newSid = null;
    if (sel == translate("OWN_SID")) {
        newSid = window.prompt(translate("OWN_SID"));
    }
    setWifiCred(sel, newSid);
}

var connStatesSetVisu = function (s) {
    var connstate = null;
    var actConfData = null;
    var macval = "unknown";
    var allSids = [];
    var actSid = "";
    var actPW = "";

    try {
        connstate = JSON.parse(sessionStorage.getItem("connstate"));
        actConfData = JSON.parse(sessionStorage.getItem("actConfData"));
    }
    catch (err) {
    }

    //alert(s+" "+connstate["logical"]);
    //Ueberschriftzeile 1
    var uephys = document.getElementById("uephys");
    var uelog = document.getElementById("uelog");
    var uewifi = document.getElementById("uewifi");

    //MAC Zeile
    var mac = document.getElementById("mac");


    //Kabelzeile
    var cable = document.getElementById("cable");
    var dhcp = document.getElementById("dhcp");
    var sid = document.getElementById("sid");

    //WLANzeile
    var wlan = document.getElementById("wlan");
    var ip = document.getElementById("ip");
    var pw = document.getElementById("pw");

    //Versch. zeile
    var nm = document.getElementById("nm");
    var versch = document.getElementById("versch");
    var gw = document.getElementById("gw");

    //Weiterzeile
    var weiter = document.getElementById("weiter");

    uelog.style.visibility = "hidden";
    uewifi.style.visibility = "hidden";


    mac.style.visibility = "hidden";

    dhcp.style.visibility = "hidden";
    sid.style.visibility = "hidden";

    ip.style.visibility = "hidden";
    pw.style.visibility = "hidden";
    gw.style.visibility = "hidden";

    nm.style.visibility = "hidden";
    versch.style.visibility = "hidden";

    weiter.style.visibility = "hidden";

    switch (s) {
        case SReady:

            uelog.style.visibility = "visible";
            if (connstate["logical"] !== ConnDhcp) {
                ip.style.visibility = "visible";
                nm.style.visibility = "visible";
                gw.style.visibility = "visible";
            }
            else {
                dhcp.style.visibility = "visible";
            }
            weiter.style.visibility = "visible";

            if (connstate["phys"] === ConnWifi) {
                uewifi.style.visibility = "visible";
                mac.style.visibility = "visible";
                versch.style.visibility = "visible";
                sid.style.visibility = "visible";
                pw.style.visibility = "visible";
            }
            else {

                ;
            }
            break;
        case SWifi:

            uelog.style.visibility = "visible";
            dhcp.style.visibility = "visible";
            ip.style.visibility = "visible";

            uewifi.style.visibility = "visible";

            break;
        case SIP:
            dhcp.style.visibility = "visible";
            ip.style.visibility = "visible";
            nm.style.visibility = "visible";
            break;
        case SNM:
            dhcp.style.visibility = "visible";
            ip.style.visibility = "visible";
            nm.style.visibility = "visible";
            gw.style.visibility = "visible";
            break;
        case SLog:

            uewifi.style.visibility = "visible";
            mac.style.visibility = "visible";
            sid.style.visibility = "visible";
            pw.style.visibility = "visible";
            versch.style.visibility = "visible";
            weiter.style.visibility = "visible";

        case SPhys:
            uelog.style.visibility = "visible";
            dhcp.style.visibility = "visible";
            ip.style.visibility = "visible";


        case "0":
            ;
        default:
            ;

    }

    //set the corresponding values
    if (mac.style.visibility == "visible") {

        try {
            macval = actConfData["wlan0"]["MAC"];
            mac.innerHTML = "MAC: " + macval;
        }
        catch (err) {
        }
    }
    if (sid.style.visibility == "visible") {
        var select = document.getElementById('sidchoose');

        try {
            allSids = actConfData["SIDS"];
            allSids[translate("OWN_SID")] = {"auth": []};
            actSid = actConfData["wlan0"]["SID"];
            actPW = actConfData["wlan0"]["PW"];
        }
        catch (err) {
        }
        var allSidsKeys = Object.keys(allSids);
        var selectedIndex = -1;
        for (var i = 0; i < allSidsKeys.length; i++) {
            var opt = document.createElement('option');
            opt.value = allSidsKeys[i];
            opt.innerHTML = allSidsKeys[i];

            select.appendChild(opt);
            if (allSidsKeys[i] == actSid) {
                selectedIndex = 1;
                opt.selected = 'selected';
                setWifiCred(actSid, null);
            }
        }
        if (selectedIndex == -1 && allSidsKeys.length != 0) {
            setWifiCred(allSidsKeys[0], null);
        }
    }

}
var onClickNetworkPhys = function (t) {

    var connstate = JSON.parse(sessionStorage.getItem('connstate'));

    connstate["phys"] = t;
    sessionStorage.setItem('connstate', JSON.stringify(connstate));
    sessionStorage.setItem('connstage', "1");

    connStatesSetVisu(SPhys);

}

var onClickNetworkLogical = function (t) {
    //main state machine:
    //callback for click DHCP or manual:
    //when called with null, its an internal call from test routines

    var connstate = JSON.parse(sessionStorage.getItem('connstate'));
    if (t !== null) {
        connstate["logical"] = t;
        //alert ( connstate["logical"] + " " + connstate["phys"] );
        sessionStorage.setItem('connstate', JSON.stringify(connstate));
    }

    var connstage = sessionStorage.getItem('connstage');

    if (connstate["logical"] === ConnDhcp) {
        if (connstage === SPhys) {
            // we are ready
            connstage = SReady;
        }
        else {
            //wifi TODO
            //  connstage=SWifi;
        }

    }
    else {
        //manual configuration
        switch (connstage) {
            case SPhys:
                if (connstate["IP"] !== "") {
                    //alert("IP "+connstate["IP"]);
                    //we have IP
                    connstage = SIP;
                }
                break;
            case SIP:

                if (connstate["NM"] !== "") {
                    // we have NM but no gateway yet
                    //alert("NM "+connstate["NM"]);
                    connstage = SNM;
                }
                break;
            case SNM:
                if (connstate["GW"] !== "") {
                    //alert("GW" + connstate["GW"]);
                    connstage = SReady;
                }

                break;

        }
    }
    sessionStorage.setItem('connstage', connstage);
    connStatesSetVisu(connstage);

}
var handleConnection = function () {

    var elem1 = document.getElementById(DiagBut);
    if (elem1) {
        elem1.style.visibility = 'hidden';
    }
    var elem2 = document.getElementById(ConfBut);
    if (elem2) {
        elem2.style.visibility = 'hidden';
    }

    var connstate = JSON.parse(sessionStorage.getItem('connstate'));

    if (!connstate) {

        // for connection states
        connstate = new Array();
        connstate = {
            "phys": ConnCable,
            "logical": ConnDhcp,
            "IP": "",
            "NM": "",
            "GW": ""
        };
    }
    else {
        connstate = {
            "phys": ConnCable,
            "logical": ConnDhcp,
            "IP": "",
            "NM": "",
            "GW": ""
        };
    }
    var connstage = sessionStorage.getItem('connstage');
    if (!connstage) {
        connstage = "0";
    }


    switch (connstage) {
        case "0":
            break;
        default:
            alert("connection state=" + connstage + " reset to begin");
            //onnStatesSetVisu("-1");
            connstage = "0";
            break;
    }


    sessionStorage.setItem('connstage', connstage);
    sessionStorage.setItem('connstate', JSON.stringify(connstate));

    connStatesSetVisu("0");
};

var handleHome = function () {
    //get and disable Back-Button
    var elem1 = document.getElementById(BackBut);
    if (elem1) {
        elem1.style.visibility = 'hidden';
    }

    getJSON("/cgi-bin/getConfig.py", "home", null);
};

var handleSettings = function () {

    getJSON("/cgi-bin/getConfig.py", "settings", null);
};

var handleEnd = function () {
    //get and disable Back-Button
  //  var elem1 = document.getElementById(BackBut);
  //  if (elem1) {
  //      elem1.style.visibility = 'hidden';
  //  }
    //get and disable End-Button
    var elem2 = document.getElementById(EndBut);
    if (elem2) {
        elem2.style.visibility = 'hidden';
    }
};

var handleCountdown = function () {

    setTimeout(function () {
       doCountdown();
    }, (1000));
};

var doCountdown = function (){
    var secsf= document.getElementById("countdown");
    var secs= parseInt(secsf.innerHTML);

    if (secs === 0){
        var np=sessionStorage.getItem("nextpage");
        if (!np){
            np="index.html";
        }
        window.location.replace(np);
    }
    else{
        secs=secs -1;
        secsf.innerHTML=secs;
        setTimeout(function () {
            doCountdown();
        }, (1000));
    }
};

$(document).ready(function () {
    RowCount = 0;
    sessionStorage.setItem('connstage', "0");
    l = sessionStorage.getItem('lang');

    if (!l) {
        lang = document.documentElement.lang;
    }
    else {
        lang = l;
    }
    var fileName = location.href.split("/").slice(-1);


    if (fileName == "configuration.html") {
        handleConfiguration();
    }
    else if (fileName == "connection.html") {
        handleConnection();
    }
    else if (fileName == "settings.html") {
        handleSettings();
    }
    else if ((fileName == "index.html") || (fileName == "")) {
        handleHome();
    }
    else if (fileName == "end.html") {
        handleEnd();
    }
    else if (fileName == "countdown.html") {
        handleCountdown();
    }
    translateView();
});
