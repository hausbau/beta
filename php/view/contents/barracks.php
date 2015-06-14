<?php
global $village,$page,$wid,$vid,$show,$world,$post,$config;
/*
if ($show == "cancel" && isset($_GET["id"])) {
	$id = db::ci(intval($_GET["id"]));
	$unit = explode(',', $village["br_buildings"]);
	if($unitsettings = db::query("SELECT * FROM `unitsettings` WHERE `unitid`='" . $unit[$id * 3] . "';")->fetch_assoc()) {
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
		else { $newtime = $village["br_time"]; }
		$endbuildtime = $newtime;
		for ($i = 0; $i < count($unit) / 3; $i++) {
			if ($i != $id) { $endbuildtime += ceil($unit[$i * 3 + 1] * $unit[$i * 3 + 2] / 1000); }
		}

		db::query("UPDATE `villagestate` SET `br_time` = '".$newtime. "', `br_endtime`= '".$endbuildtime."',  `br_buildings` = '$newqueue' WHERE (`vid`= '$vid' && `wid`='$wid');");
		db::query("UPDATE `ressources` SET `rwood` = '$wood', `rstone`='$stone', `riron`='$iron', `lastupdate`='".time()."' WHERE (`vid`='$vid' AND `wid`='$wid');");
		$village["br_time"] = $village["br_time"];
		$village["br_endtime"] = $endbuildtime;
		$village["br_buildings"] = $newqueue;
		header("LOCATION: game.php?w=$wid&v=$vid&p=$page");
	}
}


if (isset($_POST["train"]) && count($_POST["units"]) > 0) {
	$error = null;
	$units = $_POST["units"];
	$res = db::query("SELECT * FROM `unitsettings` WHERE (`building` ='2');");
	while ($unitsettings = db::fetch_assoc($res)) {
		if (isset($units[$unitsettings["unitid"]]) && isset($units[$unitsettings["unitid"]][0])) {
			if($units[$unitsettings["unitid"]][0] > 0) {
				$ammout = db::ci(intval($units[$unitsettings["unitid"]][0]));

				$woodneeded = $unitsettings["wood"] * $ammout;
				$stoneneeded = $unitsettings["stone"] * $ammout;
				$ironneeded = $unitsettings["iron"] * $ammout;
				if (preg_match("#[^0-9]#i", $ammout)) { $error = "ungültig"; }
				if (($woodneeded > $village["rwood"]) || ($stoneneeded > $village["rstone"]) || ($ironneeded > $village["riron"])) {  $error = "zuwenig Rohstoffe";  }
				if ($error == "") {
#					$buildtime = ($unitsettings["time"] * $ammout) / $world["wsspeed"];
					$buildtime = ($unitsettings["time"] * $ammout) / $world["wsspeed"] * 1/ (1.59 * pow(1.06, $village["barracks"]));
					$ress["wood"] = $wood = $village["rwood"] -= $woodneeded;
					$ress["stone"] = $stone = $village["rstone"] -= $stoneneeded;
					$ress["iron"] = $iron = $village["riron"] -= $ironneeded;
					
					$queue = $village["br_buildings"];
					if ($queue != "") { $queue .= ","; }
					$queue .= intval($unitsettings["unitid"]). ",".$ammout.",".$buildtime;
					$data = explode(",", $queue);
					if (count($data) < 4) { $village["br_time"] = time(); }
					$endbuildtime = $village["br_time"];
					for ($i = 0; $i < count($data) / 3; $i++) { $endbuildtime += ceil($data[$i*3+1] * $data[$i*3+2]); }
					db::query("UPDATE `villagestate` SET `br_time` = '".$village["br_time"]. "', `br_endtime`= '".$endbuildtime."',  `br_buildings` = '$queue' WHERE (`vid`= '$vid' && `wid`='$wid');");
					db::query("UPDATE `ressources` SET `rwood` = '$wood', `rstone`='$stone', `riron`='$iron', `lastupdate`='".time()."' WHERE (`vid`='$vid' AND `wid`='$wid');");
					$village["br_time"] = $village["br_time"];
					$village["br_endtime"] = $endbuildtime;
					$village["br_buildings"] = $queue;
				}
			}
		}	
	}
}

*/

if (!isset($bid)) {	$rec_build = $config["build"][$page]; }
else { $rec_build = $bid; }



game::checkunitbuildloop($vid);
$builddesc = "
	<div style='background:rgba(0,0,0,0.5); padding:17px;'>
		Hier inder Kaserne kannst du Leute ausbilden und entlassen.
	</div>
";

$currentjobs = null;
if ($village[$rec_build."_buildings"] != "") {
	$currentjobs = "<table class='curjobs recruitloop'><tr><th width='20%'>Einheit</th><th width='20%'>Dauer</th><th>Fertig in</th><th>Aktion</th></tr>";
	$oldtime = 0;
	$oldunit = null;
	$units = explode(",", $village[$rec_build."_buildings"]);
	for ($i=0; $i < count($units) / 3; $i++) {
		$currentjobs .= "<tr>";

		if ($oldunit != $units[$i*3]) {
			$res3 = db::query("SELECT `name`,`time` FROM `unitsettings` WHERE (`unitid` = '".$units[$i*3]."');");
			$unit = db::fetch_assoc($res3);
			$oldunit = $units[$i*3];
		}

		$factor = game::getunitbuildspeed($unit["time"], 1.06, $village["barracks"]);
		$oldtime += floor($factor * $units[$i*3+1]);
		$duratime = ($village[$rec_build."_time"] + $oldtime);
		$currentjobs .= "<td>".$units[$i*3+1]." ".$unit["name"]."</td>";
		if ($i==0) { $currentjobs .= "<td class='timer' data-bid='$rec_build' p='recruit' t='".($duratime)."'>".func::makeresttime($duratime -time())."</td>"; }
		else { $currentjobs .= "<td >".func::makeresttime($factor * $units[$i*3+1])."</td>"; }
		
		//$village[$rec_build."_endtime"] - 
		$currentjobs .= "<td >".func::makesmalldate($duratime)."</td>";
		$currentjobs .= "<td ><a href='javascript:void(0)' id='$i' build='br' mode='cancel'>Abbrechen</a></td>";
		$currentjobs .= "</tr>";
	}
	//if ($village[$rec_build."_endtime"] != ($village[$rec_build."_time"] + $oldtime)) { db::query("UPDATE `villagestate` SET `".$rec_build."_endtime` = '".($village[$rec_build."_time"] + $oldtime)."' WHERE (`vid` = '".$vid."' AND `wid`='$wid');"); }
	$currentjobs .= "</table>";
}

$buildmenu = "<form method='post' mode='recruit' build='br' class='recruit'><table class='buildmenu'><tr><th>Einheit</th><th colspan='4'>Bedarf</th><th>Vorhanden</th><th>Rekrutieren</th></tr>";
$res = db::query("SELECT * FROM `unitsettings` WHERE (`building`='2') ORDER BY `unitid`");

while ($unitsettings = db::fetch_assoc($res)) {
	$buildmenu .= "<tr>";
	$samebid = 1;
	if (isset($cbuildings[$unitsettings["unitid"]])) { $samebid += $cbuildings[$unitsettings["id"]];}
	$max = 500;
	$woodneed  = $unitsettings["wood"];
	$stoneneed = $unitsettings["stone"];
	$ironneed  = $unitsettings["iron"];
	$buildtime = (($unitsettings["time"] / $world["wsspeed"]) * (1/ (1.59 * pow(1.06, $village["barracks"]))));
	$buildtime = game::getunitbuildspeed($unitsettings["time"], 1.06, $village["barracks"]);
	$buildmenu .= "<td>$unitsettings[name]</td>";
	$buildmenu .= "<td>$woodneed</td>";
	$buildmenu .= "<td>$stoneneed</td>";
	$buildmenu .= "<td>$ironneed</td>";
	$buildmenu .= "<td>".func::makeresttime($buildtime)."</td>";
	$buildmenu .= "<td align='center'>".$village[$unitsettings["name"]]."/".$village[$unitsettings["name"]]."</td>";
	
	$inputfield = "<input type='text' name='$unitsettings[unitid]' >";
	
	#buildupgrade(\"$page\",\"recruit\", $unitsettings[unitid])
	$buildmenu .= "<td width='30%'>$inputfield ($max)</td>";
	$buildmenu .= "</tr>";
}
$buildmenu .= "<tr><td colspan='8' align='right'><button style='margin:5px 50px 5px 5px;' data-bid='br' class='btn btn-default btn-recruit'>Rekrutieren</button></td></tr></table></form>";
?>