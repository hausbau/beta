<?php
if ($_SERVER["HTTP_X_REQUESTED_WITH"] != "XMLHttpRequest") { header("LOCATION: index.php"); die(); }
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
} else { $error = array("error"=>"Nicht Eingeloggt"); session_destroy(); exit(); }

include("../../php/config.php");
include("../../php/class/db.class.php");
include("../../php/class/game.class.php");
include("../../php/class/func.class.php");
$db = db::connect($config["mysql"]);

if (!isset($_POST["mode"])) { $mode = null; } else { $mode = db::ci(trim($_POST["mode"])); }
if (!isset($_POST["units"])) { $units = null; } else { $units = $_POST["units"]; }
if (!isset($_POST["bid"])) { $bid = null; } else { $bid = db::ci(trim($_POST["bid"])); }
$account = db::query("SELECT * FROM `accounts` WHERE (`aid`='$aid');")->fetch_assoc();
$user = db::query("SELECT * FROM `worldusers` WHERE (`wid`='$wid' AND `aid`='$aid');")->fetch_assoc();
$wuid = $user["wuid"];
$world = db::query("SELECT w.*, ws.* FROM worlds w, worldsettings ws WHERE (ws.wid = '$wid' AND ws.wsid = w.wid);")->fetch_assoc();
$villageres = db::query("SELECT v.*, r.*, vs.*,u.* FROM village v, ressources r, villagestate vs, accounts a, units u WHERE (u.vid=v.vid AND v.wuid = '$wuid' AND v.wid = '$wid' AND v.vid = '".$user["currentVillage"]."' AND r.vid = v.vid AND r.wid = '$wid' AND vs.vid = v.vid AND vs.wid='$wid'); ");

if ($wuid < 1) { exit(); }
$village = db::fetch_assoc($villageres);
game::checkunitbuildloop();
game::checkressorces();
$error = null;
$ress = array();
$bid = $bid;
$modeselect = array("br"=>"2");
$rec_buildid = $modeselect[$bid];
if($mode == "cancel") {
	$id = db::ci(intval($_GET["id"]));
	$unit = explode(',', $village[$bid."_buildings"]);
	if (isset($unit[$id*3])) {
		if($unitsettings = db::query("SELECT * FROM `unitsettings` WHERE `unitid`='" . $unit[$id*3] . "';")->fetch_assoc()) {
			$woodneeded = ($unitsettings["wood"] * 0.9) * $unit[$id*3+1];
			$stoneneeded = ($unitsettings["stone"] * 0.9) * $unit[$id*3+1];
			$ironneeded = ($unitsettings["iron"] * 0.9) * $unit[$id*3+1];

			$wood = $village["rwood"] += $woodneeded;
			$stone = $village["rstone"] += $stoneneeded;
			$iron = $village["riron"] += $ironneeded;
			$newqueue = "";
			$newtime = 0;
			for ($i = 0; $i < (count($unit) / 3); $i++) {
				if ($i != $id) {
					if ($newqueue != "") { $newqueue .= ','; }
					$newqueue .= $unit[$i*3].",".$unit[$i*3+1].",".$unit[$i*3+2];
				}
			}
			if ($id == 0) { $newtime = time(); }
			else { $newtime = $village[$bid."_time"]; }
			$endbuildtime = $newtime;
			for ($i = 0; $i < count($unit) / 3; $i++) {
				if ($i != $id) { $endbuildtime += ceil($unit[$i * 3 + 1] * $unit[$i * 3 + 2] / 1000); }
			}

			db::query("UPDATE `villagestate` SET `".$bid."_time` = '".$newtime. "', `".$build."_buildings` = '$newqueue' WHERE (`vid`= '$vid' && `wid`='$wid');");
		    #db::query("UPDATE `villagestate` SET `".$bid."_time` = '".$newtime. "', `".$build."_endtime`= '".$endbuildtime."',  `".$bid."_buildings` = '$newqueue' WHERE (`vid`= '$vid' && `wid`='$wid');");
			db::query("UPDATE `ressources` SET `rwood` = '$wood', `rstone`='$stone', `riron`='$iron', `lastupdate`='".time()."' WHERE (`vid`='$vid' AND `wid`='$wid');");
			$village[$bid."_time"] = $village[$bid."_time"];
			#$village[$bid."_endtime"] = $endbuildtime;
			$village[$bid."_buildings"] = $newqueue;
		}
	}
} 

if($mode == "recruit") {

	foreach ($units as $key => $value) {
		$unitid = $value["name"];
		$ammout = $value["value"];

		$unit = db::query("SELECT * FROM `unitsettings` WHERE (`building` ='".$rec_buildid."' AND `unitid`='$unitid');")->fetch_assoc();
		if (preg_match("#[^0-9]#i", $ammout)) { $error = "Ungültig"; }
		if ($ammout > 0 && $ammout != "") {
			$woodneeded = $unit["wood"] * $ammout;
			$stoneneeded = $unit["stone"] * $ammout;
			$ironneeded = $unit["iron"] * $ammout;
			if (($woodneeded > $village["rwood"]) || ($stoneneeded > $village["rstone"]) || ($ironneeded > $village["riron"])) {  $error = "Zu wenige Rohstoffe für: ".$unit["name"];  }
			if ($error == null) {
				$buildtime = game::getunitbuildspeed($unit["time"], 1.06, $village["barracks"]);
				$ress["wood"] = $wood = $village["rwood"] -= $woodneeded;
				$ress["stone"] = $stone = $village["rstone"] -= $stoneneeded;
				$ress["iron"] = $iron = $village["riron"] -= $ironneeded;
				$queue = $village[$bid."_buildings"];
				if ($queue != "") { $queue .= ","; }
				$queue .= intval($unitid). ",".$ammout.",".floor($buildtime);
				//$queue .= intval($unitid). ",".$ammout;
				$data = explode(",", $queue);
				if (count($data) < 4) { $village[$bid."_time"] = time(); }
				$endbuildtime = $village[$bid."_time"];
				for ($i = 0; $i < count($data) / 3; $i++) { $endbuildtime += ceil($data[$i*3+1] * $buildtime); }
				
				#$test = db::query("UPDATE `villagestate` SET `".$bid."_time` = '".$village[$bid."_time"]. "', `".$bid."_buildings` = '$queue' WHERE (`vid`= '$vid' && `wid`='$wid');");
				db::query("UPDATE `villagestate` SET `".$bid."_time` = '".$village[$bid."_time"]. "', `".$bid."_endtime`= '".$endbuildtime."',  `".$bid."_buildings` = '$queue' WHERE (`vid`= '$vid' && `wid`='$wid');");
				db::query("UPDATE `ressources` SET `rwood` = '$wood', `rstone`='$stone', `riron`='$iron', `lastupdate`='".time()."' WHERE (`vid`='$vid' AND `wid`='$wid');");
				$village[$bid."_time"] = $village[$bid."_time"];
				$village[$bid."_endtime"] = $endbuildtime;
				$village[$bid."_buildings"] = $queue;
			} else {
				break;
			}
		}
	}
}


$rec_build = $bid;
include("../view/contents/barracks.php");
$resshour["wood"] 	= game::getRess($village["wood"]);
$resshour["stone"] 	= game::getRess($village["stone"]);
$resshour["iron"]	= game::getRess($village["iron"]);
$village["speed"] 	= array("rwood" => ($resshour["wood"]/3600), "rstone"=> ($resshour["stone"]/3600), "riron" => ($resshour["iron"]/3600));
$village["maxstorage"] = game::getStorage($village["storage"]);

$json["gamedata"]["village"] = $village;
$json["gamedata"]["user"]	 = $user;
$json["content"] 			 = $builddesc.$currentjobs.$buildmenu;
$json["errors"] 			 = $error;
$json["newress"]			 = $ress;
echo game::gengamedata($json);


?>