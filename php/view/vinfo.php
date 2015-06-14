<?php
global $v,$wid,$wuid;
$village = db::query("SELECT v.*,a.name, wu.aid FROM village v, accounts a, worldusers wu WHERE (v.vid = '$v' AND wu.wuid = v.wuid AND a.aid = wu.aid);");
$allyi = db::query("SELECT * FROM `worldusers` WHERE (`aid`='$aid' AND `wid`='$wid'  );");
if ($v > 0 && db::num_rows($village) > 0) {
$village = db::fetch_assoc($village);
$coords = $village["x"]." | ".$village["y"];
?>
<table class="curjobs" style="width:250px;">
	<tr>
		<th colspan='2'><?php echo $village["vname"]; ?></th>
	</tr>
	<tr>
		<td>Koordinaten: </td><td><?php echo $coords; ?></td>
	</tr>
	<tr>
		<td>Punkte: </td><td><?php echo $village["points"]; ?></td>
	</tr>
	<tr>
		<td>Spieler: </td><td><a href='game.php?w=<?php echo $wid; ?>&v=<?php echo $village["vid"]; ?>&p=pinfo'><?php echo $village["name"]; ?></a></td>
	</tr>
	<tr>
		<td>Stamm: </td><td><a href="#"><?php echo $allyi["ally"]; ?></a></td>
	</tr>
	<tr>
		<th colspan='2'>Aktions</th>
	</tr>
	<?php
	if ($wuid == $village["wuid"]) {
	?>
	<tr>
		<td colspan="2"><a href='game.php?w=<?php echo $wid; ?>&v=<?php echo $village["vid"]; ?>'>Zur Dorfübersicht</a></td>
	</tr>
	<?php
	}
	?>
	<tr>
		<td colspan="2"><a href='game.php?w=<?php echo $wid; ?>&p=map&x=<?php echo $village["x"]; ?>&y=<?php echo $village["y"]; ?>'>Karte Zentrieren</a></td>
	</tr>
	<tr>
		<td colspan="2"><a href='#'>Truppen schicken</a></td>
	</tr>
	<tr>
		<td colspan="2"><a href='#'>Rohstoff schicken</a></td>
	</tr>
</table>
<br>
<?php
}
