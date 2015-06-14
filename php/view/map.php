<style type="text/css">

.tile { width: 40px; height: 40px; background: green;  }
.tile2 { width: 40px; height: 40px; background: red; }
.tile3 { width: 40px; height: 40px; background: white; }
.tile4 { width: 40px; height: 40px; background: yellow; }
.tile5 { width: 40px; height: 40px; background: black; }

</style>
<div class="popup"></div>
<?php
global $village;
if (isset($_GET['x'])) { $x=$_GET['x']; }
if (isset($_GET['y'])) { $y=$_GET['y']; }
if (!isset($x)) {
	$x = $village["x"];
	$y = $village["y"];
}
game::showmap($x, $y);
?>