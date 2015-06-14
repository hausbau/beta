<?php 
error_reporting(E_ALL);
ini_set("display_errors", true);
global $wid,$vid,$village,$page;
 }

$points=66;
echo mysqli_error($conn);
##Abbrechen eines Auftrags
if (isset($_GET["c"]) && $_GET["c"] == "cancel")
{
	$id = intval($_GET['id']);
	$buildings = explode(",", $village["buildings"]);
	if (count($buildings) > ($id * 2 + 1)) 
	{
		$res = db::query("SELECT * FROM `buildsettings` WHERE (`id` = '".$buildings[$id*2]."');");
		$data = db::fetch_assoc($res);
		$cancelcount = $village[$data["name"]];

		for ($i=0; $i <= $id; $i++) { 
			if ($buildings[$i * 2] == $data["id"]) {
				$cancelcount++;
			}
		}

		$woodneed 	= round($data["wood_b"] * (pow($data["wood_m"], $cancelcount)));
		$stoneneed 	= round($data["stone_b"] * (pow($data["stone_m"], $cancelcount)));
		$ironneed 	= round($data["iron_b"] * (pow($data["iron_m"], $cancelcount)));

		$newqueue = "";
		$newtime = 0;
		$endbuildtime = 0;
		if ((count($buildings) / 2) > 1) {
			for ($i = 0; $i < (count($buildings) / 2); $i++) {
				if ($i != $id) {
					if ($newqueue != ""){ $newqueue .= ','; }
					$newqueue .= $buildings[$i * 2] . "," . $buildings[$i * 2 + 1];
				}
			}
			if ($id == 0) { $newtime = time(); }
			else { $newtime = $village["h_time"]; }

			$newbuildings = explode(",",  $newqueue);
			$endbuildtime = $village["h_time"];
			
			for ($i=0; $i < count($newbuildings) / 2; $i++) { 
				$endbuildtime += $newbuildings[$i*2+1];
			}
		}

		$wood 	= $village["rwood"]+$woodneed;
		$stone 	= $village["rstone"]+$stoneneed;
		$iron 	= $village["riron"]+$ironneed;
		db::query("UPDATE `villagestate` SET `h_time` = '$newtime', `buildings`='$newqueue', `h_endtime`='$endbuildtime' WHERE (`vid`='$vid' AND `wid`='$wid');");
		db::query("UPDATE `ressources` SET `rwood` = '$wood', `rstone`='$stone', `riron`='$iron' WHERE (`vid`='$vid' AND `wid`='$wid');");
		header("LOCATION: game.php?w=$wid&v=$vid&p=$page");
	}
}


##neuer Bauauftrag
if (isset($_GET["c"]) && isset($_GET["b"])) {
		$error = null;
		$bid = intval(db::ci($_GET["b"]));
		$res = db::query("SELECT v.*, bs.*, r.*, vs.* FROM village v, ressources r, buildsettings bs, villagestate vs WHERE (vs.vid = v.vid AND r.vid = v.vid AND bs.id = '$bid' AND v.vid='$vid');");
		$data = db::fetch_assoc($res);
		$samebid = 0;
		$sss = explode(",", $data["buildings"]);

		#exestieren bau aufträge der selben id?
		for ($l=0; $l < count($sss) / 2; $l++) { 
			if ($sss[$l * 2] == $data["id"]){
				$samebid++;
			}
		}
		#func::pre($data);
		#exestieren bau aufträge?
		if ($data["max"] >= ($data[$data["name"]] + $samebid)) {
			$woodneed 	= round($data["wood_b"] * (pow($data["wood_m"], $village[$data["name"]] + $samebid)));
			$stoneneed 	= round($data["stone_b"] * (pow($data["stone_m"], $village[$data["name"]] + $samebid)));
			$ironneed 	= round($data["iron_b"] * (pow($data["iron_m"], $village[$data["name"]] + $samebid)));
			$buildtime 	= round((562.5 * (pow($data["time_m"], $data[$data["name"]]) + $samebid)) * pow(0.952381, $data["headquater"]));
		}
		if ($woodneed > $data["rwood"] || $stoneneed > $data["rstone"] || $ironneed > $data["riron"]) { $error = "Zu wenig rohstoffe"; }
		if ($error == null) {
			$queue = $data["buildings"];
			if ($data["buildings"] != "") { $queue .= ","; }
			$queue .= $bid.",".round($buildtime);
			#if ($data["h_time"] == 0 || $data["buildings"] == "") { $data["h_time"] = time(); }
			if ($data["h_time"] == 0 || $data["buildings"] == "") { $data["hq_time"] = time(); }
			$endbuildtime = $data["h_time"];
			$ddd = explode(",", $queue);
			for ($l = 0; $l < count($ddd) / 2; $l++) { $endbuildtime += $ddd[$l * 2 + 1]; }
			$data["buildings"] = $queue;
			$data["h_endtime"] = $endbuildtime;
			$data['rwood']-=$woodneed;
			$data['rstone']-=$stoneneed;
			$data['riron']-=$ironneed;	
			db::query("UPDATE `villagestate` SET `h_endtime`='$endbuildtime', `h_time`='".$data["h_time"]."', `buildings`='$queue' WHERE (`vid`='$vid');");
			db::query("UPDATE `ressources` SET `rwood`='".$data['rwood']."', `rstone`='".$data['rstone']."', `riron`='".$data['riron']."' WHERE (`vid`='$vid');");		
		    db::query("UPDATE `village` SET `points`='".$points."' WHERE (`vid`='$vid');") or die(mysqli_error($conn));
		}
			#$buildtime 	= round((562.5 * (pow($buildsettings["time_m"], $village[$buildsettings["name"]] + 1))) * pow(0.952381, $village["headquater"])); 
	if ($error != null) { echo $error; }
	#else { header("LOCATION: game.php?w=$wid&v=$vid&p=$page");	}
}

##laufende bauaufträge
$cbuildings = array();
$currentjobs = "<table class='curjobs'><tr><th colspan='4'><h4>Laufende Aufträge</h4></th></tr><tr><th width='20%'>Geb&auml;ude</th><th width='20%'>Dauer</th><th>Fertig in</th><th>Aktion</th></tr>";
$res=db::query("SELECT * FROM `villagestate` WHERE `vid`='$vid';");
$cdata = db::fetch_assoc($res);
if ($cdata["buildings"] != "")
{
	$oldtime = 0;
	$oldbuilding = -1;
	$buildings = explode(",", $cdata["buildings"]);
	
	for ($i=0; $i < count($buildings) / 2; $i++) {
		$oldtime += $buildings[$i*2+1];
		$duratime = ($cdata["h_time"] + $oldtime);
		$donetime = ($cdata["h_time"] + $oldtime);

		$count = 1;
		for ($j = 0; $j < $i; $j++) {
			if ($buildings[$j * 2] == $buildings[$i * 2]) {
				$count++;
			}
		}

		if ($oldbuilding != $buildings[$i * 2]) {
			$res3 = db::query("SELECT `name` FROM `buildsettings` WHERE (`id` = '".$buildings[$i * 2]."');");
			$building = db::fetch_assoc($res3);
			$oldbuilding == $buildings[$i * 2];
		}

		if (!isset($cbuildings[$buildings[$i*2]])) { $cbuildings[$buildings[$i * 2]] = 1;}
		else {  $cbuildings[$buildings[$i * 2]]++; }

		$currentjobs .= "<tr>";
		$currentjobs .= "<td>".$building["name"]." (Sutfe ".($village[$building["name"]]+$count).")</td>";

		if ($i==0) { $currentjobs .= "<td class='timer' t='".($duratime)."'>".func::makeresttime($duratime)."</td>"; } 
		else { $currentjobs .= "<td>".func::makeresttime($buildings[$i * 2 + 1])."</td>"; }

		$currentjobs .= "<td>".func::makesmalldate($donetime)."</td>";
		$currentjobs .= "<td><a class='btn btn-default btn-xs' href='game.php?w=$wid&v=$vid&p=$page&c=cancel&id=$i'>Abbrechen</a></td>";
		$currentjobs .= "</tr>";
	}
	if ($cdata['h_endtime'] != ($cdata['h_time'] + $oldtime)) {
		db::query("UPDATE `villagestate` SET `h_endtime` = '".($cdata['h_time'] + $oldtime)."' WHERE `vid` = '".$vid."';");
	}
}

$currentjobs .= "</table>";
echo $currentjobs;

##Laufende aufträge fertig!
$buildmenu = "<table class='buildmenu'><tr><th>Geb&auml;ude</th><th colspan='4'>Bedarf</th><th>Bauen</th></tr>";
$res = db::query("SELECT * FROM `buildsettings` ORDER BY `id`");
while ($buildsettings = db::fetch_assoc($res)) {

	if(isset($village[$buildsettings["name"]]))
	{
		$buildmenu .= "<tr>";
		$count = 1;
		if (isset($cbuildings[$buildsettings["id"]])) { $count += $cbuildings[$buildsettings["id"]]; }
		$woodneed 	= round($buildsettings["wood_b"] * (pow($buildsettings["wood_m"], $village[$buildsettings["name"]] + 1)));
		$stoneneed 	= round($buildsettings["stone_b"] * (pow($buildsettings["stone_m"], $village[$buildsettings["name"]] + 1)));
		$ironneed 	= round($buildsettings["iron_b"] * (pow($buildsettings["iron_m"], $village[$buildsettings["name"]] + 1)));
		$buildtime 	= round((562.5 * (pow($buildsettings["time_m"], $village[$buildsettings["name"]] + 1))) * pow(0.952381, $village["headquater"])); 
		

		$buildmenu .= "<td>$buildsettings[name] (Stufe ".$village[$buildsettings["name"]].")</td>";
		$buildmenu .= "<td>$woodneed</td>";
		$buildmenu .= "<td>$stoneneed</td>";
		$buildmenu .= "<td>$ironneed</td>";
		$buildmenu .= "<td>".func::makeresttime($buildtime)."</td>";
		$buildmenu .= "<td><a class='btn btn-default btn-xs' href='game.php?w=$wid&v=$vid&p=$page&c=build&b=$buildsettings[id]&l=".($village[$buildsettings["name"]] + $count)."'>Ausbau auf Stufe ".($village[$buildsettings["name"]] + $count)."</a></td>";
		$buildmenu .= "</tr>";
	}
}
$buildmenu .= "</table>";
echo $buildmenu;
?>
