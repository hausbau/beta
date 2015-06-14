<?php
global $url;
$mailconfig                  = array();
$mailconfig['smtp_debug']    = true;
$mailconfig['smtp_host']     = "mail7.web-server.biz";
$mailconfig['smtp_auth']     = "plain";
$mailconfig['smtp_name']     = "dragon@ts3-voice.eu";
$mailconfig['smtp_pass']     = "64d91ec0";
$mailconfig['smtp_secu']	 = null;
$mailconfig['smtp_port']  	 = 25;
$mailconfig['usesmtp']       = true;

$mailconfig['fromname']      = "dragongun100";
$mailconfig['backsend']      = false;
$mailconfig['frommail']      = "munir.ascieli2013@hotmail.de";
$mailconfig['verifyorder'] 	 = $url.'/buying/verifyorder/';

//Headers
$mailconfig["header-order"]        = "Ihre Bestellung bei ....";


$mailconfig["body-order"]  =
"
Ihre Bestellung

[gender]
[firstname] [lastname]
[street] [housenumber]
[zipcode] [state]
[country]

Auftragsnummer: [orderid]
Bestelldatum: [datetime]

Wir bedanken uns für Ihre Bestellung und werden sie so schnell wie möglich ausführen aber
damit wir ihre Bestellung auch bearbeiten können, müssen Sie diese erste bestätigen.
Klicken Siedazu den folgenden link:
[link]


Ihr Zugangsdaten zum Interface:
Benutzername:  [username]
Passwort:      [password]


Mit freundlichen Gr&uuml;&szlig;en<br>

dragongun100
";

$mailconfig["body-orderverify"]  =
"
Ihre Bestätigung der Bestellung

[gender]
[firstname] [lastname]
[street] [housenumber]
[zipcode] [state]
[country]

Auftragsnummer: [orderid]
Bestelldatum: [datetime]

Wir bedanken uns für Ihre Bestellung und werden sie so schnell wie möglich ausführen.
<hr />
[cart]
<hr />
Versandart: [versand]
Zahlungsart: [pm]
Ich habe die AGB gelesen und akzeptiert: [agb]
Kommentar: [comment]
<hr />


Mit freundlichen Gr&uuml;&szlig;en

dragongun100
";
?>