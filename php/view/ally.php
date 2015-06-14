<?php
include("php/class/db.class.php");
$wid = $_SESSION["WID"];
$ally = db::query("SELECT * FROM `worldusers` WHERE (`aid`='$aid' AND `wid`='$wid'  );");
$test1=1;


if($test1 == 0){}else{

echo'Stämme sind Gruppen von Spielern, die sich zusammenfinden, um stärker auftreten und sich gegenseitig beschützen zu können.';
echo'Hier kannst du dich bei einem Stamm bewerben oder eine erhaltene Stammeseinladung annehmen. Du kannst auch einen eigenen Stamm gründen, wenn du andere Spieler führen möchtest.';
echo'<h2>Stamm gründen</h2>';
echo'<form action="" method="POST">';
echo'Stammesname:<input type="name"  name="stammn"></br>';
echo'Abkürzung:  <input type="name"  name="nkurz">';
echo'<input type="Submit" value="erstellen" float="right">';
echo'</form>';}


if($_POST ==true){

$stammn=$_POST['stammn'];
$stammk=$_POST['nkurz'];


$update=db::query("UPDATE worldusers set ally='$stammn' AND allyk='$stammk' WHERE (`wid`='$wid' AND`aid`='$aid');");

}else{echo"Du hast keinen Stamm ";}

?>


