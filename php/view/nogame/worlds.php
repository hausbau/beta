<?php
$res = db::query("SELECT wu.*, w.* FROM worldusers wu, worlds w WHERE (w.wid = wu.wid AND wu.aid='$aid');");
$worlds=$worlds3=null;
$worlds2=array();
while ($wids = db::fetch_assoc($res)) {
	$worlds2[] = $wids["wid"];
	$worlds .= "<a href='game.php?w=$wids[wid]' class='worldname btn btn-primary'>".$wids["wname"]."</a>";
}

$res = db::query("SELECT * FROM `worlds`");
while ($wids = db::fetch_assoc($res)) {
	if (!in_array($wids["wid"], $worlds2)) {
		$worlds3 .= "<a href='./?p=joinworld&w=$wids[wid]' class='worldname btn btn-danger'>".$wids["wname"]."</a>";
	}
}

echo "Beigetrettene Welten: ";
echo $worlds;

echo "<br><br>Welten die du noch nicht beigetretten bist: ";
echo $worlds3;
?>