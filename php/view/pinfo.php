<?php

global $v,$wid,$wuid;
$pinfo = db::query("SELECT * FROM   worldusers  WHERE (`aid`='$aid' AND `wid`='$wid');");
$pinfo = db::fetch_assoc($pinfo);
$gegner=0;
?>


<div id="info">
<?php echo $pinfo["name"]; ?></br></br>
Punkte:<?php echo $pinfo["points"]; ?></br>
Rang:<?php echo $pinfo["rang"]; ?></br>
Besiegte </br>
Gegner:<?php echo $gegner; ?></br>
Stamm:<?php echo $pinfo["ally"]; ?></br>

</div></br></br>
<?php if($aid == $aid ){}else{
echo'<div id="akti">';	
echo'<a href="">Nachricht schreiben</a></br>';
echo'<a href="">Als Freund hinzufügen</a> </br>';
echo'<a href="">In Stamm einladen</a></br>';
echo'<a href="">Blockieren</a></br>';

echo '</div>';}?>
<div id="dorf">	</br></br>
Dörfer (1)	Koordinaten	Punkte</br>
0-001 Miezmauss Dorf 	280|529 	358
</br>
</div>