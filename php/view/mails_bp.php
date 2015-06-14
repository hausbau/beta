<?php
$wid = $_SESSION["WID"];
$mail = db::query("SELECT * FROM `mail` WHERE (`world`='$wid' AND `from`='$aid' );");

while ($maildata = db::fetch_assoc($mail)) {
	$datum = date("d.m.Y",$maildata["time"]);
	$uhrzeit = date("H:i",$maildata["time"]);

}
?>

<table>
<tr>

 <th>Betreff </th>
 <th>Spieler </th>
 <th>Letzter Beitrag </th>

</tr>
<tr>
<?php

?>    
 <td> <?php echo $mail["betreff"]; ?></td>
 <td> <?php if ($aid==$aid){ echo $mail["from"];}else{ echo $mail["to"];} ?></td>
 <td> <?php echo $datum," - ",$uhrzeit," Uhr"; ?></td>

</tr></table>
