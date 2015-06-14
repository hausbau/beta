<?php
db::query("UPDATE worldusers set newreport='0' WHERE (`aid`='$aid');");


echo"Kein Bericht vorhanden";
?>