<?php
if (isset($_GET["w"]) && $_GET["w"] > 0) {
	$wid = db::ci($_GET["w"]);
	$res = db::query("SELECT w.*, ws.* FROM worlds w, worldsettings ws WHERE w.wid = '$wid' AND ws.wsid = w.wsid;");
	if($res && (db::num_rows($res) > 0)) {
		$error2 = null;
		$table = "<table class='table table-bordered'><tr><th>Bezeichnung</th><th>Wert</th></tr>";
		$worlddata = db::fetch_assoc($res);
		#func::pre($worlddata);
		foreach ($worlddata as $key => $value) {
			if (!in_array($key, array("wid","wsub","wsid"))) {
				$table .= "<tr><td>$key</td><td>$value</td></tr>";
			}
		}

		if (isset($_GET["join"])) {
			$test = db::query("SELECT * FROM `".dbprefix."worldusers` WHERE (`wid`='$wid');");
			if (db::num_rows($test) > 0) {
				$error2 = func::text("Du bist schon auf dieser Welt!", "error");
			} else {
				$sql = db::arrayToInsert("worldusers", array("wid"=>"$wid", "aid"=>"$aid"));
				if (db::query($sql)) { header("LOCATION: ./?p=worlds"); }
			}
		}

		$table .= "<tr><td align='right'><a href='./?p=$p&w=$wid&join=1' class='btn btn-success'>Teilnehmen</a></td><td><a href='./?p=worlds' class='btn btn-danger'>Abbrechen</a></td></tr>";
		echo $table;
		echo $error2;
	}
}

?>
