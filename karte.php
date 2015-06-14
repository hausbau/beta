<!DOCTYPE html>
<html>
	<head>
		<style type="text/css">
			body, html { background : gray; color: white;} 
			.wrapper{ margin: 30px auto; width: 80%; border: 1px solid black; }
			.tile { width: 40px; height: 40px; background: green; border: 1px solid black; }
			.tile2 { width: 40px; height: 40px; background: lightblue; border: 1px solid black; }
			.tile3 { width: 40px; height: 40px; background: brown; border: 1px solid black; }
			.tile4 { width: 40px; height: 40px; background: yellow; border: 1px solid black; }
		</style>
	</head>

	<body>
		
		<div class='wrapper'>
<?php
		
/*
	echo "</td><th valign='center' align='center'><a href='game.php?village=" . $village["id"] . "&action=map&x=" . ($x + $size * 2) . "&y=" . $y . "&size=" . $size . "'>";
	echo "<img src='" . $imageURL . "/map2d/map_e.gif'></a></th></tr>";
	echo "<tr><th valign='center' align='center'><a href='game.php?village=" . $village["id"] . "&action=map&x=" . ($x - $size * 2) . "&y=" . ($y - $size * 2) . "&size=" . $size . "'>";
	echo "<img src='" . $imageURL . "/map2d/map_sw.gif'></a></th>";
	echo "<th valign='center' align='center'><a href='game.php?village=" . $village["id"] . "&action=map&x=" . $x . "&y=" . ($y - $size * 2) . "&size=" . $size . "'>";
	echo "<img src='" . $imageURL . "/map2d/map_s.gif'></a></th>";
	echo "<th valign='center' align='center'><a href='game.php?village=" . $village["id"] . "&action=map&x=" . ($x + $size * 2) . "&y=" . ($y - $size * 2) . "&size=" . $size . "'>";
*
*
*/
	include("php/config.php");
	include("php/class/db.class.php");
	db::connect($config["mysql"]);
	$dorf = array("x"=>4, "y"=>3, "vid" => 2);
	if (isset($_GET['x'])) { $x=$_GET['x']; }
	if (isset($_GET['y'])) { $y=$_GET['y']; }
	if (!isset($x)) {
		$x = $dorf["x"];
		$y = $dorf["y"];
	}
	
	function showmap($x,$y,$maxsize = array("x"=>50, "y"=>50), $size=25) {
		global $dorf;
		$x 		= db::ci(intval($x));
		$y 		= db::ci(intval($y));
		$size 	= db::ci(intval($size));

		if ($x > $maxsize["x"]) { $x=$maxsize["x"]; }
		if ($y > $maxsize["y"]) { $y=$maxsize["y"]; }
		if ($x < -$maxsize["x"]) { $x=-$maxsize["x"]; }
		if ($y < -$maxsize["y"]) { $y=-$maxsize["y"]; }
		$numx	= null;
		$res = db::query("SELECT * FROM `village` WHERE `x` BETWEEN ".($x - $size)." AND ".($x + $size)." AND `y` BETWEEN ".($y - $size)." AND ".($y + $size)." ORDER BY `y` DESC,`x` ;");
		while ($vonmap = db::fetch_assoc($res)) { $villages[$vonmap["x"]][$vonmap["y"]] = $vonmap["vid"]; }
	
		$map = "<table cellspacing='0' cellpadding='0' border='1'><tr><td>";
		$map .= "<table border='0' cellspacing='1' cellpadding='0'>";
		$map .= "<tr>";
		$map .= "<th valign='center' align='center'><center><a href='karte.php?y=".($y - $size)."&x=$x'>Oben</a></center></th>";
		$map .= "</tr>";
		$map .= "<tr><th valign='center' align='center'><a href='karte.php?x=".($x - $size)."&y=$y'>Links</a></th>";
		$map .= "<td><table cellspacing='0' cellpadding=0>";
		$map .= "<tr><td height=20></td></tr>";


		for ($i= $y - $size; $i <= $y + $size; $i++) { 
			$map .= "<tr><td width='20'>" . $i . "</td>";
			for ($j = $x - $size; $j <= $x + $size; $j++)
			{
				if (isset($villages[$j][$i]) && $villages[$j][$i] > 0) {
					if ($villages[$j][$i] == $dorf["vid"]) {
						$map .= "<td><div class='tile3'></div></td>";
					} else {
						$map .= "<td><div class='tile2'></div></td>";
					}
				} else {
					if (($maxsize["x"] / 2) == $i && ($maxsize["y"] / 2) == $j) { $map .= "<td><div class='tile4'></div></td>"; }
					else {
						$map .= "<td><div class='tile'></div></td>";
					}
				}
				#if (($maxsize["x"] / 2) == $i && ($maxsize["y"] / 2) == $j) { $map .= "<td><div class='tile4'></div></td>"; }
			}
			$map .= "</tr>";
		}
	
		for ($j = $x - $size; $j <= ($x + $size+1); $j++) { $numx .= "<td align='center'>".($j-1)."</td>"; }
		$map .= "<tr>$numx</tr>";
		$map .= "</table>";
		$map .= "<td></td></tr></table>";
		$map .= "</td><th valign='center' align='center'><a href='karte.php?x=".($x + $size)."&y=$y'>Rechts</a></th>";
		$map .= "<tr>";
		$map .= "<th valign='center' align='center'><a href='karte.php?y=".($y + $size)."&x=$x'>Unten</a></th>";
		$map .= "</tr>";
		echo $map;
	}

	showmap($x,$y);
?>			
		</div>

	</body>
</html>