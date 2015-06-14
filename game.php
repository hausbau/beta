<?php
session_start();
session_regenerate_id();
header('Content-Type: text/html; charset=utf-8');



##Session Control
if (isset($_SESSION) && $_SESSION["LOGGEDIN"] === true) {
	$logged = $_SESSION["LOGGEDIN"];
	$aid = intval($_SESSION["AID"]);
	$gamelogin = true;
} else { header("LOCATION: index.php?p=login"); exit(); }

set_include_path(define('ROOT_DIR', dirname(__FILE__)));

$http = ($_SERVER["SERVER_PORT"] == 80)? "http://" : "https://";
$link = $http.$_SERVER["SERVER_NAME"].$_SERVER["SCRIPT_NAME"];

include("php/config.php");
include("php/class/db.class.php");
include("php/class/func.class.php");
include("php/class/user.class.php");
include("php/class/game.class.php");

$db = db::connect($config["mysql"]);
$error = null;

if (!isset($_GET["w"])) { $wid = null; } else { $wid = db::ci(trim($_GET["w"])); }
if (!isset($_GET["p"])) { $page = null; } else { $page = db::ci(trim($_GET["p"])); }
if (!isset($_GET["s"])) { $show = null; } else { $show = db::ci(trim($_GET["s"])); }
if (!isset($_GET["a"])) { $action = null; } else { $action = db::ci(trim($_GET["a"])); }
if (!isset($_GET["village"])) { $v = null; } else { $v = db::ci(trim($_GET["village"])); }

$account = db::query("SELECT * FROM `accounts` WHERE (`aid`='$aid');")->fetch_assoc();
$user = db::query("SELECT * FROM `worldusers` WHERE (`wid`='$wid' AND `aid`='$aid');")->fetch_assoc();
$mail = db::query("SELECT * FROM `mail` WHERE (`world`='$wid' AND `from`='$aid');")->fetch_assoc();
$world = db::query("SELECT w.*, ws.* FROM worlds w, worldsettings ws WHERE (ws.wid = '$wid' AND ws.wsid = w.wid);")->fetch_assoc();

$wuid = $user["wuid"];
$sfcv = null;
if ($user["currentVillage"] > 0) { $sfcv = "AND v.vid = '$user[currentVillage]'"; }
$res = db::query("SELECT v.*, r.*, vs.*,u.* FROM village v, ressources r, villagestate vs, accounts a, units u WHERE (v.wuid = '$wuid' AND v.wid = '$wid' $sfcv AND u.vid=v.vid AND r.vid = v.vid AND  vs.vid = v.vid);");
if ($wuid < 1) { header("LOCATION: index.php"); exit(); }
$_SESSION["WID"] = $wid;
$village = db::fetch_assoc($res);

##checkt ob es der Spieler einen Dorf hat.
if (db::num_rows($res) < 1) {
	$return = game::createVillage($wid, $world, $account, $wuid);
	if ($return) { header("LOCATION: ".$linkw."?w=$wid"); exit(); }
}

#Prüft ob VillageID gesetzt wird, wenn nicht dann wird Sie gesetzt
if (!isset($_SESSION["VID"]) && isset($village["vid"]) && !isset($_GET["v"]) && $village["vid"] > 0) {
	$_SESSION["VID"] = $vid = $user["currentVillage"] = $village["vid"];
	game::setCV($user["currentVillage"]);
}


##Prüft ob er ins Game darf
if ($gamelogin !== true) { header("LOCATION: index.php"); exit(); }

##Wenn alles so weit ist, darf er jetzt auch Spielen.
#Prüft ob es überhaubt sein Dorf ist?
if (isset($_GET["v"]) && $_GET["v"] > 0) {
	$vid = intval($_GET["v"]);
	if (!game::isownvillage($vid, $wuid)) { $vid = $user["currentVillage"]; } else {
		game::setCV($vid);
		$_SESSION["VID"] = $user["currentVillage"] = $village["vid"] = $vid;
		$res = db::query("SELECT v.*, r.*, vs.*,u.* FROM village v, ressources r, villagestate vs, accounts a, units u WHERE (u.vid=v.vid AND v.wuid = '$wuid' AND v.wid = '$wid' AND v.vid = '".$user["currentVillage"]."' AND r.vid = v.vid AND  vs.vid = v.vid);");
		$village = db::fetch_assoc($res);
	}
} else { $vid = $_SESSION["VID"] = $user["currentVillage"]; }

//Definieren von Gamedata für Javascript
$resshour["wood"] 	= game::getRess($village["wood"]);
$resshour["stone"] 	= game::getRess($village["stone"]);
$resshour["iron"]	= game::getRess($village["iron"]);
$village["speed"] = array("rwood" => ($resshour["wood"]/3600), "rstone"=> ($resshour["stone"]/3600), "riron" => ($resshour["iron"]/3600));
$village["maxstorage"] = game::getStorage($village["storage"]);
$newvil["village"] = $village;
$newuser["user"] = $user;
$newpage["page"] = game::gamedatapage($page); 

$gamedata = game::gengamedata($newvil, $newuser , $newpage);


//game::checkunitbuildloop();
game::checkbuildingloop();
game::checkressorces();

game::calculatemovingunits($vid);
game::calculatefightforvillage($vid);

if ($page == null) { $page = "overview"; }
include("php/temp/game/header.php");
include("php/temp/game/content.php");
include("php/temp/game/footer.php");
?>