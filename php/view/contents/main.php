<?php
global $vid,$village,$world;
//Gebäude beschreibung
game::checkbuildingloop($vid);
$builddesc = "
	<div style='background:rgba(0,0,0,0.5); padding:17px;'>
		Im Hauptgebäude können neue Gebäude errichtet oder vorhandene Gebäude verbessert werden. Je höher die Stufe, desto schneller können neue Gebäude errichtet werden. Sobald dein Hauptgebäude Stufe 15 erreicht hat, bist du in der Lage Gebäude abzureißen.
	</div>
";

//Akktuelle bauaufträge
$cbuildings = array();
$currentjobs = null;
if ($village["buildings"] != "") {
	$currentjobs = "<table class='curjobs'><tr><th width='20%'>Geb&auml;ude</th><th width='20%'>Dauer</th><th>Fertig in</th><th>Aktion</th></tr>";
	$oldtime = 0;
	$mainsame = 0;
	$buildmainfactor = 1;
	$buildings = explode(",", $village["buildings"]);
	for ($i=0; $i < count($buildings) / 2; $i++) 
	{
		$oldtime += $buildings[$i*2+1];
		$duratime = ($village["h_time"] + $oldtime);
		$count = 1;
		$oldbuilding = -1;
		for ($j = 0; $j < $i; $j++) {
			if ($buildings[$j * 2] == $buildings[$i * 2]) { $count++; }
		}

		if ($oldbuilding != $buildings[$i * 2]) {
			$res3 = db::query("SELECT `name` FROM `buildsettings` WHERE (`id` = '".$buildings[$i * 2]."');");
			$building = db::fetch_assoc($res3);
			$oldbuilding == $buildings[$i * 2];
		}

		if (!isset($cbuildings[$buildings[$i*2]])) { $cbuildings[$buildings[$i * 2]] = 1;}
		else {  $cbuildings[$buildings[$i * 2]]++; }

		if (isset($cbuildings[1])) {
			$mainsame = $cbuildings[1];
			$buildmainfactor = pow(0.952381, $village["headquater"] + $mainsame);
		}

		$currentjobs .= "<tr>";
		$currentjobs .= "<td>".$building["name"]." (Sutfe ".($village[$building["name"]]+$count).")</td>";
		if ($i==0) { $currentjobs .= "<td class='timer' p='building' t='".($duratime)."'>".func::makeresttime($duratime- time())."</td>"; } 
		else { $currentjobs .= "<td>".func::makeresttime($buildings[$i * 2 + 1])."</td>"; }
		$currentjobs .= "<td>".func::makesmalldate($duratime)."</td>";
		$currentjobs .= "<td><a data-bid='$i' class='btn btn-default btn-xs btn-cbuild' >Abbrechen</a></td>";
		$currentjobs .= "</tr>";
	}
	if ($village['h_endtime'] != ($village['h_time'] + $oldtime)) {	db::query("UPDATE `villagestate` SET `h_endtime` = '".($village['h_time'] + $oldtime)."' WHERE `vid` = '".$vid."';"); }
	$currentjobs .= "</table>";
}


//Gebäude Menu
$buildmenu = "<table class='buildmenu'><tr><th>Geb&auml;ude</th><th colspan='4'>Bedarf</th><th>Bauen</th></tr>";
$res = db::query("SELECT * FROM `buildsettings` ORDER BY `id`");
$mainsame = 0;
while ($buildsettings = db::fetch_assoc($res)) {

	if(isset($village[$buildsettings["name"]]))
	{
		$mainbuild = $village["headquater"];
		if ($buildsettings["id"] == 1 && isset($cbuildings[1])) {
			$mainsame = $cbuildings[$buildsettings["id"]];
		}
		$buildmenu .= "<tr>";
		$samebid = 1;
		if (isset($cbuildings[$buildsettings["id"]])) {
			$samebid += $cbuildings[$buildsettings["id"]];
		}
		
		if ($village[$buildsettings["name"]] < $buildsettings["max"] && ($samebid+$village[$buildsettings["name"]]) <= $buildsettings["max"]) {
			$woodneed 	= round($buildsettings["wood_b"] * (pow($buildsettings["wood_m"], $village[$buildsettings["name"]] + $samebid)));
			$stoneneed 	= round($buildsettings["stone_b"] * (pow($buildsettings["stone_m"], $village[$buildsettings["name"]] + $samebid)));
			$ironneed 	= round($buildsettings["iron_b"] * (pow($buildsettings["iron_m"], $village[$buildsettings["name"]] + $samebid)));
			$buildtime 	= round((562.5 * (pow($buildsettings["time_m"], $village[$buildsettings["name"]] + $samebid)) * pow(0.952381, $village["headquater"] + $mainsame)) / $world["wsspeed"]) ;
			$buildmenu .= "<td>$buildsettings[name] (Stufe ".$village[$buildsettings["name"]].")</td>";
			$buildmenu .= "<td>$woodneed</td>";
			$buildmenu .= "<td>$stoneneed</td>";
			$buildmenu .= "<td>$ironneed</td>";
			$buildmenu .= "<td>".func::makeresttime($buildtime)."</td>";
			$buildmenu .= "<td><a data-bid='$buildsettings[id]' class='btn btn-default btn-xs btn-build'>Ausbau auf Stufe ".($village[$buildsettings["name"]] + $samebid)."</a></td>";
			//$buildmenu .= "<td><a class='btn btn-default btn-xs' onclick='buildupgrade(\"$page\",\"build\", $buildsettings[id])'>Ausbau auf Stufe ".($village[$buildsettings["name"]] + $samebid)."</a></td>";
			$buildmenu .= "</tr>";
		} else {
			$buildmenu .= "<td>$buildsettings[name] (Stufe ".$village[$buildsettings["name"]].")</td>";
			$buildmenu .= "<td colspan='4'></td>";
			$buildmenu .= "<td>Vollständig aufgebaut</td>";
			$buildmenu .= "</tr>";				
		}
	}
}

$buildmenu .= "</table>";
?>