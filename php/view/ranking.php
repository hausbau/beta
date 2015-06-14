<?php
error_reporting(E_ALL);
ini_set("display_errors", true);

global $action, $wid, $link, $vid,$page, $user, $account;

$sql2 = db::query("SELECT * FROM `worldusers` WHERE (`wid`='$wid');");

$ranking = db::query($sql2);
$rows2 = null;
while ($rankingdata = db::fetch_assoc($ranking)) {


		$rows2 .= "<tr>";
		$rows2 .= "<td>".$rankingdata['rang']."</td>";
		$rows2 .= "<td>".$rankingdata["points"]."</td>";

		$rows2 .= "</tr>";
	}



echo print_r($rows2);
?>
