<!--
<table class='overview'>
<tr>
	<td class='leftcolumn' width='612'>
		<div class='vis'>
		<h4 class='head'> dragongun100s Dorf (7651 Punkte)</h4>
			<table class='vis' width='100%'>
				<tr><td>Baumstamm (Stufe 1)</td></tr>
				<tr><td>Baumstamm (Stufe 1)</td></tr>
				<tr><td>Baumstamm (Stufe 1)</td></tr>
				<tr><td>Baumstamm (Stufe 1)</td></tr>
				<tr><td>Baumstamm (Stufe 1)</td></tr>
				<tr><td>Baumstamm (Stufe 1)</td></tr>
				<tr><td>Baumstamm (Stufe 1)</td></tr>
				<tr><td>Baumstamm (Stufe 1)</td></tr>
				<tr><td>Baumstamm (Stufe 1)</td></tr>
				<tr><td>Baumstamm (Stufe 1)</td></tr>
				<tr><td>Baumstamm (Stufe 1)</td></tr>
				<tr><td>Baumstamm (Stufe 1)</td></tr>
				<tr><td>Baumstamm (Stufe 1)</td></tr>
				<tr><td>Baumstamm (Stufe 1)</td></tr>
			</table>
		</div>
	</td>
	<td class='rightcolumn' width='612'>
		<div class='vis'>
			<h4 class='head'>Produktion</h4>
			<table class='vis' width='100%'>
				<tr><td>Holz</td><td>4.000 pro Stunde</td></tr>
				<tr><td>Stein</td><td>4.000 pro Stunde</td></tr>
				<tr><td>Eisen</td><td>4.000 pro Stunde</td></tr>
			</table>
		</div>
	</td>
</tr>
</table>
-->
<?php
global $village,$vid,$wid,$world;

$pro = "Stunde";
$wph = game::getRess($village["wood"]);
$sph = game::getRess($village["stone"]);
$iph = game::getRess($village["iron"]);

$i = 1;
$j = $wph;
if ($j > 5000) {
	$i = $i * 60;
	$j = $j / 60;
	$pro = "Minute";
}

if ($j > 40000) {
	$i = $i * 60;
	$j = $j / 60;
	$pro = "Sekunde";
}


$wph = round($wph / $i);
$sph = round($sph / $i);
$iph = round($iph / $i);

$overview = "<table class='overview'>";
$overview .= "<tr>";

##Linke seite!
$overview .= "<td class='leftcolumn' width='950'>";
$overview .= "<div class='vis'>";
$overview .= "<h4 class='head'>   $village[vname]</h4>";
$overview .= "<table class='vis' width='100%'><tbody>";

$res = db::query('SELECT `name` FROM `buildsettings` ORDER BY `id`;');
while ($data = db::fetch_assoc($res)) {
	if (isset($village[$data['name']]) && $village[$data['name']] > 0) {
		$overview .= "<tr><td><a href='game.php?w=$wid&v=$vid&p=".$data['name']."'>".$data['name']."</a> (Stufe ".$village[$data['name']].")</td></tr>";
	}
}
$overview .= "</tbody></table></div></td>";

##Rechte seite!
$overview .= "<td class='leftcolumn' width='250'>";
$overview .= "<div class='vis'>";
$overview .= "<h4 class='head'>Produktion</h4>";
$overview .= "<table class='vis' width='100%'>";

$overview .= "<tr><td>Holz</td><td><b>$wph</b> pro $pro</td></tr>";
$overview .= "<tr><td>Stein</td><td><b>$sph</b> pro $pro</td></tr>";
$overview .= "<tr><td>Eisen</td><td><b>$iph</b> pro $pro</td></tr>";

$overview .= "</table></div>";

if ($village["buildings"] != "") {
	$overview .= "<div class='vis'>";
	$overview .= "<h4 class='head'>Bauschleife</h4>";
	$overview .= "</div>";
}
/*
################################################################
#Bauschleife
/*
if ($village["buildings"] != "") {
	$currentjobs = "<table class='curjobs'><tr><th width='20%'>Geb&auml;ude</th><th width='20%'>Dauer</th><th>Fertig in</th><th>Aktion</th></tr>";
	$oldtime = 0;
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

		$currentjobs .= "<tr>";
		$currentjobs .= "<td>".$building["name"]." (Sutfe ".($village[$building["name"]]+$count).")</td>";
		if ($i==0) { $currentjobs .= "<td class='timer' t='".($duratime)."'>".func::makeresttime($duratime- time())."</td>"; } 
		else { $currentjobs .= "<td>".func::makeresttime($buildings[$i * 2 + 1])."</td>"; }
		$currentjobs .= "<td>".func::makesmalldate($duratime)."</td>";
		#href='game.php?w=$wid&v=$vid&p=$page&s=cancel&id=$i'
		$currentjobs .= "<td><a class='btn btn-default btn-xs' onclick='buildupgrade(\"$page\", \"cancel\", $i)'>Abbrechen</a></td>";
		$currentjobs .= "</tr>";
	}
	if ($village['h_endtime'] != ($village['h_time'] + $oldtime)) {	db::query("UPDATE `villagestate` SET `h_endtime` = '".($village['h_time'] + $oldtime)."' WHERE `vid` = '".$vid."';"); }
	$currentjobs .= "</table>";
	echo $currentjobs;
}
*/
###############################################################
#Truppen
$overview .= "<div class='vis'>";
$overview .= "<h4 class='head'>Einheiten</h4>";
$overview .= "<table class='vis' width='100%'>";

$res = db::query("SELECT * FROM `unitsettings`");
while ($unitsettings = db::fetch_assoc($res)) {
	if (isset($village[$unitsettings["name"]]) && $village[$unitsettings["name"]] > 0) {
		$overview .= "<tr><td><b>".$village[$unitsettings["name"]]."</b> ".$unitsettings["name"]."</td></tr>";
	}
}

$overview .= "</table></div>";


$overview .= "</td>";


$overview .= "</td>";
$overview .= "</tr>";
$overview .= "</table>";

echo $overview;
?>
