<?php
error_reporting(E_ALL);
ini_set("display_errors", true);

global $action, $wid, $link, $vid,$page, $user, $account;
db::query("UPDATE worldusers set newmsg='0' WHERE (`aid`='$aid');");
$sql = "SELECT * FROM `mail` WHERE (`world`='$wid' AND (`to`='$aid' OR `to`='$account[name]') );";
$mail = db::query($sql);
$rows = null;
if(db::num_rows($mail) > 0) {
	while ($maildata = db::fetch_assoc($mail)) {
		#func::pre($maildata);
		$time = date("d.m.Y, H:i",$maildata["time"]);

		$rows .= "<tr>";
		$rows .= "<td>".$maildata['betreff']."</td>";
		$rows .= "<td>".$maildata["from"]."</td>";
		$rows .= "<td>".$time."</td>";
		$rows .= "</tr>";
	}
} else {
	$rows = "<tr><td colspan='3'>Keine Nachrichten</td></tr>";
}

$href = $link."?w=".$wid."&v=".$vid."&p=".$page;
?>
<style>
	ul > li {
		float: left;
		margin-left:10px; 
	}	
</style>

<ul>
	<li>
		<a href="<?php echo $href."&a=mail" ;?>">Nachrichten</a>
	</li>
	<li>
		<a href="<?php echo $href."&a=newmail" ;?>">Neue Nachricht verfassen</a>
	</li>
</ul>
<br>


<?php
	if ($action == "mail") {
		?>
		<table class="table table-bordered">
			<tr>
				<th>Betreff </th>
				<th>Spieler </th>
				<th>Letzter Beitrag </th>
			</tr>
			<?php echo $rows; ?>
		</table>
		<?php
	}

	else {
		$openlink = "php/view/newmails.php";
		if (file_exists($openlink)) {
			include($openlink);
		} else {
			echo "Keine datei";
		}
	}
?>
