<?php
$http = ($_SERVER["SERVER_PORT"] == 80)? "http://" : "https://";
$link = $http.$_SERVER["SERVER_NAME"].$_SERVER["SCRIPT_NAME"];
$_GET['mode']='';
$mode=$_GET['mode'];

$wid = $_SESSION["WID"];
$vid=$_SESSION['VID'];

if($mode == "acc") {

include("profil.php");
}

?>
<div class="settings">
<a href='<?php echo $link."?w=$wid&v=$vid";?>&p=settings&mode=acc'>Account</a>
<a href="#">Neu Anfangen</a>
<a href="#">Internet teilen</a>
<a href="#">Schlafmodus</a>
<a href="#">Urlaubsvertretung</a>
<a href="#">Logins</a>
<a href="#">Spieler werben</a>

</div>

