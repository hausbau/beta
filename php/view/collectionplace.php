<?php
global $village;
$_1 = $_2 = $_3 = $_y = $_x = null;
if (isset($_POST["troops"])) {
	$_1 = $_POST["troops"][1][0];
	$_2 = $_POST["troops"][2][0];
	$_3 = $_POST["troops"][3][0];
}
if (isset($_POST["x"])) { $_x = $_POST["x"]; }
if (isset($_POST["y"])) { $_y = $_POST["y"]; }

?>
<form method="post">
<table class='buildmenu' style='width:30%;'>
	<tr><th colspan='2'>Infanterie</th></tr>
	<tr><td>Speerkämpfer</td><td><input size='5' type='text' value='<?php echo $_1; ?>' name='troops[1][]'></td></tr>
	<tr><td>Schwertkämpfer</td><td><input size='5' type='text' value='<?php echo $_2; ?>' name='troops[2][]'></td></tr>
	<tr><td>Axtkämpfer</td><td><input size='5' type='text' value='<?php echo $_3; ?>' name='troops[3][]'></td></tr>
</table>


<table class='buildmenu' style='width:30%;'>
	<tr><th colspan ='2'>Ziel: </th></tr>
	<tr><td>X: <input type='text' name='x' size='3' maxlength='3' value='<?php echo $_x; ?>'></td><td>Y: <input type='text' name='y' value='<?php echo $_y; ?>' maxlength='3' size='3'></td></tr>
</table>
<br>
<input type="submit" name="attack" class="btn btn-primary" value="Angreifen!">
</form>

<?php

if (isset($_POST["attack"])) {
	$x = (($_POST["x"]));
	$y = (($_POST["y"]));
	if ($x != "" && $y != "" && $x != null && $y != null) {
		$x = db::ci(intval($_POST["x"]));
		$y = db::ci(intval($_POST["y"]));
		$res = db::query("SELECT * FROM `village` WHERE (`x`='$x' AND `y`='$y');");
		if (db::num_rows($res) > 0) {
			$distanz = game::direct($village["x"], $village["y"], $x,$y);
			$units = $error = null;
			$time = null;
			$updateunits = null;
			foreach ($_POST["troops"] as $key => $value) {
				if ($value[0] > 0) {
					$unitssettings = db::query("SELECT * FROM `unitsettings` WHERE (`unitid`='$key');")->fetch_assoc();	
					$troopsspeed = db::query("SELECT * FROM `worldsettings`")->fetch_assoc();	
					#$unitnames[$unitssettings["unitid"]] = $unitssettings["name"];
					if ($village[$unitssettings["name"]] >= $value[0]) {
						$time[] =  $troopsspeed["wstroopspeed"] ;
						if ($units != null) { $units .= ","; }
						if ($updateunits != null) {$updateunits .= ","; }
						$units .= $unitssettings["unitid"].",".$value[0];
						$updateunits .= "`$unitssettings[name]`= $unitssettings[name] - '$value[0]'";
					} else {
						$error = "Nicht genug Einheiten bei: ".$unitssettings["name"]." Du hast: ".$village[$unitssettings["name"]];
						break;
					}
				}
			}

			if ($error == null) {
				if (isset($time) && $time != 0) {
					rsort($time);
					$atime = db::ci(($time[0] * $distanz * 60));
					$attv = db::fetch_assoc($res);
					$movingsql 	= "INSERT INTO `unitsmoving` (`vid`,`target`,`units`,`atime`,`stime`,`type`) VALUES ('".$village["vid"]."','".$attv["vid"]."','$units','$atime','".time()."','1');";
					$newunits 	= "UPDATE `units` SET $updateunits WHERE(`vid`='$village[vid]');";
					db::query($movingsql);
					db::query($newunits);
				} else {
					echo "Du hast keine Einheiten angegeben!";
				}
			} else {
				echo $error;
			}
		} else { echo "Dorf exestiert nicht!"; }
	} else { echo "Du musst X und Y eingeben!"; }
}

game::movingunits($village["vid"]);
?>