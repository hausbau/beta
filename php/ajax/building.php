<?php
if ($_SERVER["HTTP_X_REQUESTED_WITH"] != "XMLHttpRequest") { header("LOCATION: http://$_SERVER[SERVER_NAME]"); die(); }
session_start();
session_regenerate_id();
header('Content-Type: text/html; charset=utf-8');

##Session Control
if (isset($_SESSION) && $_SESSION["LOGGEDIN"] === true) {
	$logged = $_SESSION["LOGGEDIN"];
	$aid = intval($_SESSION["AID"]);
	$wid = intval($_SESSION["WID"]);
	$vid = intval($_SESSION["VID"]);
	$gamelogin = true;
} else { exit(); }



include("../../php/config.php");
include("../../php/class/db.class.php");
include("../../php/class/game.class.php");
include("../../php/class/func.class.php");
$db = db::connect($config["mysql"]);

if (!isset($_POST["mode"])) { $m = null; } else { $m= db::ci(trim($_POST["mode"])); }
if (!isset($_POST["bid"])) { $bid = null; } else { $bid = db::ci(trim($_POST["bid"])); }
if (!isset($_POST["p"])) { $page = null; } else { $requestvid = db::ci(trim($_POST["vid"])); }

$account 	= db::query("SELECT * FROM `accounts` WHERE (`aid`='$aid');")->fetch_assoc();
$user 		= db::query("SELECT * FROM `worldusers` WHERE (`wid`='$wid' AND `aid`='$aid');")->fetch_assoc();
$world 		= db::query("SELECT w.*, ws.* FROM worlds w, worldsettings ws WHERE (ws.wid = '$wid' AND ws.wsid = w.wid);")->fetch_assoc();
$villageres = db::query("SELECT v.*, r.*, vs.* FROM village v, ressources r, villagestate vs, accounts a WHERE (v.wuid = '$user[wuid]' AND v.wid = '$wid' AND v.vid = '$user[currentVillage]' AND r.vid = v.vid AND r.wid = '$wid' AND vs.vid = v.vid AND vs.wid='$wid'); ");
$wuid 		= $user["wuid"];
if ($wuid < 1) { exit(); }

$village = db::fetch_assoc($villageres);
game::checkbuildingloop();
game::checkressorces();
//game::checkunitbuildloop();

$error = null;
$ress = array();
$village = db::fetch_assoc($villageres);

if ($m == "cancel" && $bid >= 0) {
	$id = $bid;
	$buildings = explode(",", $village["buildings"]);
	if (count($buildings) > ($id * 2 + 1)) {
		$buildsettings = db::query("SELECT * FROM `buildsettings` WHERE (`id` = '".$buildings[$id*2]."');")->fetch_assoc();
		$cancelcount = $village[$buildsettings["name"]];
		
		for ($i=0; $i <= $id; $i++) {
			$j=0;
			if ($buildings[$i*2] == $buildsettings["id"]) { $cancelcount++; }
		}

		$woodneed 	= round($buildsettings["wood_b"] * (pow($buildsettings["wood_m"], $cancelcount)));
		$stoneneed 	= round($buildsettings["stone_b"] * (pow($buildsettings["stone_m"], $cancelcount)));
		$ironneed 	= round($buildsettings["iron_b"] * (pow($buildsettings["iron_m"], $cancelcount)));
		$newqueue = "";
		$newtime = 0;
		$endbuildtime = 0;
		$j = $village[$buildsettings["name"]];
		if ((count($buildings) / 2) > 1) {
			for ($i = 0; $i < (count($buildings) / 2); $i++) {
				if ($i != $id) {
					if ($newqueue != "") { $newqueue .= ','; }
					if ($buildings[$i*2] == $buildsettings["id"]) {
						$j++;
						$buildtime = game::getbuildtime($j, $buildsettings["time_m"], $village["headquater"]); 
						$newqueue .= $buildings[$i*2] . "," . $buildtime;
					}
					else {$newqueue .= $buildings[$i*2] . "," . $buildings[$i*2+1]; }
				}
			}
			if ($id == 0) { $newtime = time(); }
			else { $newtime = $village["h_time"]; }
		}
		$ress["wood"] = $wood = $village["rwood"]+$woodneed;
		$ress["stone"] = $stone = $village["rstone"]+$stoneneed;
		$ress["iron"] = $iron = $village["riron"]+$ironneed;
		$village["buildings"] = $newqueue;
		$village["h_endtime"] = $endbuildtime;
		$village["h_time"] = $newtime;
		db::query("UPDATE `villagestate` SET `h_time` = '$newtime', `buildings`='$newqueue', `h_endtime`='$endbuildtime' WHERE (`vid`='$vid' AND `wid`='$wid');");
		db::query("UPDATE `ressources` SET `rwood` = '$wood', `rstone`='$stone', `riron`='$iron' WHERE (`vid`='$vid' AND `wid`='$wid');");
		$villageres = db::query("SELECT v.*, r.*, vs.* FROM village v, ressources r, villagestate vs, accounts a WHERE (v.wuid = '$wuid' AND v.wid = '$wid' AND r.vid = v.vid AND r.wid = '$wid' AND vs.vid = v.vid AND vs.wid='$wid'); ");
		$village = db::fetch_assoc($villageres);
		game::checkbuildingloop($vid);
	}
}

if ($m == "build" && $bid > 0) {
	$id = $bid;
	$samebid = 1;
	$buildsettings = db::query("SELECT * FROM `buildsettings` WHERE (`id`='$id');")->fetch_assoc();
	$sss = explode(",", $village["buildings"]);
	for ($l=0; $l < count($sss) / 2; $l++) { if ($sss[$l * 2] == $buildsettings["id"]) { $samebid++; } }
	$woodneed 	= round($buildsettings["wood_b"] * (pow($buildsettings["wood_m"], $village[$buildsettings["name"]] + $samebid)));
	$stoneneed 	= round($buildsettings["stone_b"] * (pow($buildsettings["stone_m"], $village[$buildsettings["name"]] + $samebid)));
	$ironneed 	= round($buildsettings["iron_b"] * (pow($buildsettings["iron_m"], $village[$buildsettings["name"]] + $samebid)));
	$buildtime 	= game::getbuildtime(($village[$buildsettings["name"]] + $samebid),$buildsettings["time_m"],$village["headquater"]);
	if ($woodneed > $village["rwood"] || $stoneneed > $village["rstone"] || $ironneed > $village["riron"]) { $error = "Zu wenig rohstoffe"; }
	if ($error == null) {
		$queue = $village["buildings"];
		if ($village["buildings"] != "") { $queue .= ","; }
		$queue .= $id.",".$buildtime;
		if ($village["h_time"] == 0 || $village["buildings"] == "") { $village["h_time"] = time(); }
		$ddd = explode(",", $queue);
		$endbuildtime = $village["h_time"];
		for ($l = 0; $l < count($ddd) / 2; $l++) { $endbuildtime += $ddd[$l*2+1]; }
		$village["buildings"] = $queue;
		$village["h_endtime"] = $endbuildtime;
		$ress["wood"] = $village['rwood']-=$woodneed;
		$ress["stone"] = $village['rstone']-=$stoneneed;
		$ress["iron"] = $village['riron']-=$ironneed;
		db::query("UPDATE `villagestate` SET `h_endtime`='$endbuildtime', `h_time`='".$village["h_time"]."', `buildings`='$queue' WHERE (`vid`='$vid');");
		db::query("UPDATE `ressources` SET `rwood`='".$village['rwood']."', `rstone`='".$village['rstone']."', `riron`='".$village['riron']."' WHERE (`vid`='$vid');");		
		game::checkbuildingloop($vid);
		
	}
}


include("../view/contents/main.php");

$resshour["wood"] 	= game::getRess($village["wood"]);
$resshour["stone"] 	= game::getRess($village["stone"]);
$resshour["iron"]	= game::getRess($village["iron"]);
$village["speed"] = array("rwood" => ($resshour["wood"]/3600), "rstone"=> ($resshour["stone"]/3600), "riron" => ($resshour["iron"]/3600));
$village["maxstorage"] = game::getStorage($village["storage"]);

$json["gamedata"]["village"] = $village;
$json["gamedata"]["user"]	 = $user;
$json["content"] 			 = $builddesc.$currentjobs.$buildmenu;
$json["errors"] 			 = $error;
$json["newress"]			 = $ress;
echo game::gengamedata($json);

?>