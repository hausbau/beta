<?php
class game {

	public static function createVillage($wid, $world, $account='Barbarendorf', $wuid='-1', $ammout = 1) {
		//for($i=0; $i < $ammout; $i++) {
			$villagename = db::ci($account["name"]."'s Dorf");	
			$spawnx = round(($world["wmaxx"] / 2));
			$spawny = round(($world["wmaxy"] / 2));
			$number = db::query("SELECT COUNT(*) as `count` FROM `village` WHERE `wid`='$wid'")->fetch_assoc();
			$number = $number["count"];
			do {
				$ammout++;
				$number += 3.7;
				$rnd = mt_rand(-360, 0);
				$x = sin(deg2rad($rnd));
				$y = cos(deg2rad($rnd));
				$x = round($x * pow($number, 0.55)) + $spawnx;
				$y = round($y * pow($number, 0.55)) + $spawny;
				if ($x  > $world["wmaxx"] && $y > $world["wmaxy"]) {
					$number -=6;
					$x = round($x * pow($number, 0.55)) + $spawnx;
					$y = round($y * pow($number, 0.55)) + $spawny;
				}
				$dis 	= 2;
				$res1 	= db::query("SELECT `x` FROM `village` WHERE (`x` >= '".($x - $dis)."' AND `x` <= '".($x + $dis)."' AND `y` >= '".($y - $dis)."' AND `y` <= '".($x + $dis)."' AND `wid`='$wid');");
				$res2 	= db::query("SELECT `y` FROM `village` WHERE (`x` = '$x' AND `y` = '$y' AND `wid`='$wid');");
			}
			
			while (((db::num_rows($res1) > 2)) || ((db::num_rows($res2)>0)));
			
			$res = db::query("INSERT INTO `village` (`wuid`,`wid`,`vname`,`x`,`y`) VALUES ('$wuid','$wid','$villagename','$x','$y');");
			$lastid = db::insert_id();
			$sql[] = "INSERT INTO `ressources` (`wid`,`vid`) VALUES ('$wid','$lastid');";
			$sql[] = "INSERT INTO `villagestate` (`wid`,`vid`) VALUES ('$wid','$lastid');";
			$sql[] = "INSERT INTO `units` (`wid`,`vid`) VALUES ('$wid','$lastid');";
			foreach ($sql as $key) { db::query($key); }
			if (!$res) { return false; }
		//}
		return true;
	}

	public static function getunitbuildspeed($unitsspeed, $buildfactor, $buildlvl, $factor = null, $floor = true) {
		global $world;
		if (!isset($factor)) { $factor = $world["wsrecruitspeed"]; }
		if ($floor) { return floor((($unitsspeed * (1 / (1.59 * pow($buildfactor, $buildlvl)))) / $factor)); }
		return (($unitsspeed * (1 / (1.59 * pow($buildfactor, $buildlvl)))) / $factor);
	}
	public static function getbuildtime($buildlvl, $buildmultipiler, $hqlvl) { global $world; return round((562.5 * (pow($buildmultipiler, $buildlvl)) * pow(0.952381, $hqlvl)) / $world["wsspeed"]); } 
	public static function direct($x1,$y1,$x2,$y2) { return (abs($x1 - $x2)+abs($y1-$y2)); }
	public static function getStorage($level) { return round(1000 * pow(1.2294934,$level-1)); }
	public static function getRess($level) { global $world; return round((30 * pow(1.163118, $level-1)) * $world["wsressspeed"]); }
	
	public static function showmap($x,$y,$maxsize = array("x"=>50, "y"=>50), $size=10) {
		global $village,$link, $wid,$wuid;
		$x 		= db::ci(intval($x));
		$y 		= db::ci(intval($y));
		$size 	= db::ci(intval($size));
		$numx	= null;
		if ($x > $maxsize["x"]) { $x=$maxsize["x"]; }
		if ($y > $maxsize["y"]) { $y=$maxsize["y"]; }
		if ($x < -$maxsize["x"]) { $x=-$maxsize["x"]; }
		if ($y < -$maxsize["y"]) { $y=-$maxsize["y"]; }

		$res = db::query("SELECT * FROM `village` WHERE `wid`='$wid' AND `x` BETWEEN ".($x - $size)." AND ".($x + $size)." AND `y` BETWEEN ".($y - $size)." AND ".($y + $size)." ORDER BY `y` DESC,`x` ;");
		while ($vonmap = db::fetch_assoc($res)) { $villages[$vonmap["x"]][$vonmap["y"]] = $vonmap["vid"]; }
		for ($j = ($x - $size+1); $j <= ($x + $size+1); $j++) { $numx .= "<td align='center'>".($j-1)."</td>"; }		
		$map = "<table class='map' border='1'>";
		$map .= "<tr><td colspan='3' align='center'><a href='game.php?w=$wid&p=map&y=".($y - $size)."&x=$x'>Oben</a></td></tr>";
		$map .= "<tr><td style='vertical-align:middle;'><a href='game.php?w=$wid&p=map&x=".($x - $size)."&y=$y'>Links</a></td>";
		$map .= "<td><table class='mapinner' style='border:1px solid black;'>";
		$map .= "<tr style='vertical-align: middle;text-align:center;'><td></td>$numx<td></td></tr>";
		for ($i = $y - $size; $i <= $y + $size; $i++) { 
			$map .= "<tr style='vertical-align: middle;'><td width='20' style='vertical-align: middle;'>$i</td>";
			for ($j = $x - $size; $j <= $x + $size; $j++)
			{
				if (isset($villages[$j][$i]) && $villages[$j][$i] > 0) {
					
					$res = db::query("SELECT * FROM `village` WHERE (`vid`='".$villages[$j][$i]."');");
					$data = db::fetch_assoc($res);
					$res2 = db::query("SELECT a.name FROM accounts a LEFT OUTER JOIN worldusers wu ON wu.wuid='".$data["wuid"]."' WHERE (a.aid=wu.aid AND wu.wuid = '".$data["wuid"]."');");
					$data2 = db::fetch_assoc($res2);

					$onmouseover = "onmousemove='villageinfo(\"".$data2["name"]."\",\" ".str_replace("'", "&#39;", $data["vname"])."\")'";

					if ($villages[$j][$i] == $village["vid"]) {
						$map .= "<td><a href='game.php?w=$wid&p=vinfo&village=".$villages[$j][$i]."' class='field' $onmouseover><div style='background:white;'><img width='40' height='40' src='map/map_2_v1.gif' /></div></a></td>";
					} elseif($data["wuid"] == $wuid && $villages[$j][$i] != $village["vid"]) {
						$map .= "<td><a href='game.php?w=$wid&p=vinfo&village=".$villages[$j][$i]."' class='field' $onmouseover><div style='background:yellow;'><img width='40' height='40' src='map/map_2_v1.gif' /></div></a></td>";
					} else {
						$map .= "<td><a href='game.php?w=$wid&p=vinfo&village=".$villages[$j][$i]."' class='field' $onmouseover><div style='background:darkred;'><img width='40' height='40' src='map/map_2_v1.gif' /></div></a></td>";
					}

				} else {
					if (($maxsize["x"] / 2) == $i && ($maxsize["y"] / 2) == $j) { $map .= "<td><div class='tile5'></div></td>"; }
					else {
						$map .= "<td><div class='tile' style='background: url(map/map_free.gif);'></div></td>\r\n";
					}
				}
			}
			$map .= "<td width='20' style='vertical-align: middle;'>$i</td>";
			$map .= "</tr>";
		}

		$map .= "<tr style='vertical-align: middle;text-align:center;'><td></td>$numx<td></td></tr>";
		$map .= "</table></td>";
		$map .= "<td valign='middle' style='vertical-align:middle;'><a href='game.php?w=$wid&p=map&x=".($x + $size)."&y=$y'>Rechts</a></td></tr>";
		$map .= "<tr><td colspan='3' align='center'><a href='game.php?w=$wid&p=map&y=".($y + $size)."&x=$x'>Unten</a></td></tr></table>";
		echo $map;
	}

	public static function movingunits($vid) {
		global $config;
		$res = db::query("SELECT * FROM `unitsmoving` WHERE (`vid`='$vid');");
		if (db::num_rows($res) > 0) {
			$movinglist = "<table class='buildmenu'><tr><th colspan='3'>Eigene Truppen</th><tr><th>Befehl: </th><th>Ankunft: </th><th>Ankunft in: </th></tr>";
			while ($movingunits = db::fetch_assoc($res)) {
				$type = $movingunits["type"];
				$target 	= db::query("SELECT `vname`,`x`,`y` FROM `village` WHERE (`vid`='".$movingunits["target"]."');")->fetch_assoc();
				$atime 		= func::makeresttime($movingunits["stime"]+$movingunits["atime"]-time());
				$aatime 	= $movingunits["stime"]+$movingunits["atime"];
				$duraction 	= func::makesmalldate($movingunits["stime"]+$movingunits["atime"]);
				$movinglist .= "<tr>";
				if ($type == $config["command"]["attack"]) {
					$movinglist .= "<td>Angriff auf $target[vname] ($target[x] | $target[y])</td>";
				}
				elseif($type == $config["command"]["attackreturn"]) {
					$movinglist .= "<td>Rückkehr von $target[vname] ($target[x] | $target[y])</td>";
				}
				$movinglist .= "<td>$duraction</td>";
				$movinglist .= "<td t='".($aatime)."' p='none' class='timer'>$atime</td>";
				$movinglist .= "</tr>";
			}
			$movinglist .= "</table>";
			echo $movinglist; 
		}
	}

	public static function checkbuildingloop($vid = null) {
		global $village,$wid;
		if (isset($vid) && $vid > 0) { $village = self::getvillage($vid);  }
		$vid = $village["vid"];
		if ($village['buildings'] != "") {
			$buildings = explode(",", $village["buildings"]);
			$newqueue = null;
			$oldtime = 0;
			$update = array();
			$newset = $village["h_time"];
			for ($i=0; $i < count($buildings) / 2; $i++) { 
				$oldtime += $buildings[$i*2+1];
				if (time() < ($oldtime + $village["h_time"])) {
					if ($newqueue != null) { $newqueue .= ","; }
					$newqueue .= $buildings[$i * 2].','.$buildings[$i*2+1];	
				} else { $update[] = $buildings[$i * 2]; $newset = ($village["h_time"] + $buildings[1]); }
				$oldtime - $village["h_time"];
			}
			if ($newqueue == "") { $endtime = $newtime = 0; }
			else { $newtime = $newset; $ddd = explode(",", $newqueue); }
			foreach ($update as $key => $value) {
				$bs = db::query("SELECT * FROM `buildsettings` WHERE `id` = '".$value."';")->fetch_assoc();
				db::query("UPDATE `village` SET `".$bs['name']."` = '".($village[$bs['name']] + 1)."' WHERE (`vid` = '".$vid."' AND `wid`='$wid');");
						    db::query("UPDATE `village` SET `points`='5' WHERE (`vid`='$vid');") or die(mysqli_error($conn));
			}
			db::query("UPDATE `villagestate` SET `h_time` = '".$newtime."', `buildings` = '".$newqueue."' WHERE (`vid` ='".$vid."');");
		}
	}

	public static function checkunitbuildloop($vid = null) {
		global $village,$wid, $world;
		if (isset($vid) && $vid > 0) { $village = self::getvillage($vid);  }
		$vid = $village["vid"];
		$rewhile = true;
		while ($village["br_buildings"] != "" && $rewhile) {
		//if($village["br_buildings"] != "") {
			$units = explode(",", $village["br_buildings"]);
			$unitsettings = db::query("SELECT `time`, `name` FROM `unitsettings` WHERE (`unitid` ='".$units[0]."');")->fetch_assoc();
			$buildtime = game::getunitbuildspeed($unitsettings["time"], 1.06, $village["barracks"], null, false);

			if ($buildtime != $units[2]) {
				$alltime = ($buildtime) * $units[1];
				$newbuildtime = ($buildtime);
			}
			
			else { $alltime = $units[1] * $units[2];}
			
			$elapsed = time() - $village["br_time"];
			$ready = floor(($elapsed*$units[1]) / $alltime+1);
			if ($ready >= $units[1]) { $ready = $units[1]; }
			if ($ready < $units[1]) {
				$units[1] -= $ready;
				$start = 0;
				$rewhile = false;
			} else {
				$units[1] = 0;
				$start = 1;
			}

			if ($ready >= 1 && $units[1] <= 1) {
				func::pre($units[1]);
				$ready = 1;
				$units[1] = 0;
				$start = 1;
			}

			$newqueue = null;
			for ($i = 0; $i < (count($units) / 3); $i++) {
				if ($units[$i*3+1] > 0) {
					if ($newqueue != null) { $newqueue .= ","; }
					$newqueue .= $units[$i*3].",".$units[$i*3+1].",".$units[$i*3+2];
				} else {
					$rewhile = false;
				}
			}

			if ($newqueue == null || $newqueue == "") { $newtime = 0; }			
			$oldtime = $ready * ($buildtime);
			$newtime = $village["br_time"]+$oldtime;
			$newtroop = $ready;
			db::query("UPDATE `units` SET  `".$unitsettings["name"]."`= `".$unitsettings["name"]."` + '$newtroop' WHERE (`vid`='$vid' AND `wid`='$wid');");
			db::query("UPDATE `villagestate` SET `br_time`='$newtime', `br_buildings`= '$newqueue' WHERE (`vid`='$vid' AND `wid`='$wid');");
			$village["br_time"] = $newtime-1;
			$village["br_building"] = $newqueue;
		}
	}

	public static function getvillage($vid) {
		$village = db::query("SELECT v.*, r.*, vs.*,u.* FROM village v, ressources r, villagestate vs, accounts a, units u WHERE (v.vid = '$vid' AND u.vid=v.vid AND r.vid = v.vid AND  vs.vid = v.vid);")->fetch_assoc();
		return $village;
	}
	public static function checkressorces($vid = null) {
		global $village,$wid, $resshour, $world;
		if (isset($vid) && $vid > 0) { $village = self::getvillage($vid);  }
		$vid = $village["vid"];
		$lastupdate = time() - ($village["lastupdate"]);
		$factor = ($lastupdate / 3600);
		$storage = game::getStorage($village["storage"]);
		$newwood = max(0,min($storage, $village['rwood'] + $factor * $resshour["wood"]));
		$newstone = max(0,min($storage, $village['rstone'] + $factor * $resshour["stone"]));
		$newiron = max(0,min($storage, $village['riron'] + $factor * $resshour["iron"]));
		db::query("UPDATE `ressources` SET `rwood` = '$newwood', `rstone` = '$newstone', `riron` = '$newiron', `lastupdate`='".time()."' WHERE (`vid` = '".$vid."' AND `wid`='$wid');");
		$village["rwood"] = floor($newwood);
		$village["rstone"] =  floor($newstone);
		$village["riron"] =  floor($newiron);
	}

	public static function getvids($wuid=null) {
		$wuid = db::ci(intval($wuid));
		if (isset($wuid) && $wuid > 0) {
			$res = db::query("SELECT `vid` FROM `village` WHERE (`wuid`='$wuid');");
			$array = array();
			while ($data = db::fetch_assoc($res)) { $array[] = $data["vid"]; }	
			return $array;
		}
		return false;
	}

	public static function isownvillage($vid, $wuid2=null) {
		global $wuid, $village;
		if (isset($vid) && isset($wuid2) && $wuid2 > 0 && $vid > 0) {
			if (in_array($vid, self::getvids($wuid2))) { return true; }
			return false;
		}
		if (in_array($village["vid"], self::getvids($wuid))) { return true; }
		return false;
	}

	public static function setCV($vid) {
		global $wuid;
		$vid = db::ci(intval($vid));
		if (db::query("UPDATE `worldusers` SET `currentVillage`='$vid' WHERE (`wuid`='$wuid'); ")) { return true; }
		return false;
	}


	#Baustelle !!!!!
	public static function calculatemovingunits($vid = null) {
		global $config;
		$where = null;
		if (isset($vid) && $vid > 0) { $where = "WHERE (`vid`='$vid');"; }

		$res = db::query("SELECT * FROM `unitsmoving` $where");
		while ($um = db::fetch_assoc($res)) {
			if (time() >= ($um["stime"]+$um["atime"])) {
				if ($um["type"] == $config["command"]["attack"]) { self::calculatefightforvillage($um["vid"]); }
				if ($um["type"] == $config["command"]["attackreturn"]) { self::calcattreturn($um["muid"]); }
			}
		}
	}

	public static function calcattreturn($muid) {
		global $config, $wuid, $village;
		$looting = db::query("SELECT `units`,`loot`,`vid` FROM `unitsmoving` WHERE (`muid`='$muid');")->fetch_assoc();
		$units = explode(",", $looting["units"]);
		$loot = explode(",", $looting["loot"]);
		$updateunits = null;
		$ressorces = null;

		for($i=0; $i < count($units) / 2; $i++) {
			$id = $units[$i*2];
			$am = $units[$i*2+1];
			$res = db::query("SELECT `name` FROM `unitsettings` WHERE (`unitid` = '$id');")->fetch_assoc();
			if ($updateunits != null) { $updateunits .= ","; }
			$updateunits .= "`$res[name]` = `$res[name]` + $am";
		}

		for($i=0; $i < count($loot)/2; $i++) {
			$type = $loot[$i*2];
			$am = $loot[$i*2+1];
			if ($ressorces != null) { $ressorces .= ","; }
			$ressorces .= "`r$type` = r$type + $am";
		}
		
		$updateloot = "UPDATE `ressources` SET $ressorces WHERE (`vid`='$looting[vid]');";
		$updateunits = "UPDATE `units` SET $updateunits WHERE (`vid`='$looting[vid]');";
		$delcommand = "DELETE FROM `unitsmoving` WHERE (`muid`='$muid');";
		db::query($updateloot);
		db::query($updateunits);
		db::query($delcommand);
	}

	public static function gamedatapage($page) {
		$aviable["headquater"] 	= "building";
		$aviable["barracks"] 	= "recruit";
		$aviable["stable"] 		= "recruit";
		if(isset($aviable[$page])) { return $aviable[$page]; }
		return false;
	}

	public static function calculatefightforvillage($vid) {
		global $config, $wuid;
		$off_foot = 0;
		$off_kava = 0;
		$off_all  = 0;
		$off_loot = 0;
		$def_foot = $config["village"]["basedeff"];
		$def_kava = $config["village"]["basedeff"];
		$unitnames = array();
		$unitsloot = array();
		$res = db::query("SELECT * FROM `unitsmoving` WHERE (`type`='".$config["command"]["attack"]."' AND `vid`='$vid');");
		while ($data = db::fetch_assoc($res)) {
			$commandid 		= $data["muid"];
			$atime 			= $data["atime"];
			$targetvillage 	= $data["target"];
			$stime 			= $data["stime"];
			$resttime 		= $atime + $stime;
			if ($resttime <= time()) {
				self::checkressorces($targetvillage);
				#Angriffs einheiten werden Zusammen gerechnet!
				$units = explode(",", $data["units"]);
				for ($i=0; $i < count($units) / 2; $i++) { 
					$uammount = $units[$i*2+1];
					$unitsettings = db::query("SELECT `off`,`loot`,`type`,`unitid` FROM `unitsettings` WHERE (`unitid`='".$units[$i*2]."');")->fetch_assoc();
					$unitsloot[$unitsettings["unitid"]] = $unitsettings["loot"]; 
					$o = $unitsettings["off"];
					if ($config["unittype"][$unitsettings["type"]] == "foot") { $off_foot += $uammount*$o; }
					elseif ($config["unittype"][$unitsettings["type"]] == "kava") { $off_kava += $uammount*$o;}
				}

				#Verteidigungs einheiten werden Zusammen gerechnet!
				$targetV = db::query("SELECT * FROM village v, units u, ressources r WHERE (v.vid='$targetvillage' AND u.vid=v.vid AND r.vid=v.vid);")->fetch_assoc();
				$res1 = db::query("SELECT * FROM `unitsettings`");
				while ($unitsettings = db::fetch_assoc($res1)) {
					$unitnames[$unitsettings["unitid"]] = $unitsettings["name"];
					if (isset($targetV[$unitsettings["name"]])) {
						$deff_units[$unitsettings["unitid"]] = $targetV[$unitsettings["name"]];
						$uammount = $targetV[$unitsettings["name"]];
						if ($uammount > 0) {
							$kd = $unitsettings["cavdef"];
							$fd = $unitsettings["deff"];
							if ($config["unittype"][$unitsettings["type"]] == "foot") { $def_foot += $uammount*$fd; } 
							elseif ($config["unittype"][$unitsettings["type"]] == "kava") { $def_kava += $uammount*$kd; }
						}
					}
				}

				$off_all = $off_kava+$off_foot;
				if ($off_kava <= 0) 
				{
					if ($off_foot > $def_foot) {
						$calc1 = $def_foot / (sqrt($off_foot / $def_foot)); 
						$calc2 = $calc1 / ($off_foot);
						$win = 0;
					} else {
						$calc1 = $off_foot / (sqrt($def_foot / $off_foot)); 
						$calc2 = $calc1 / ($def_foot);
						$win = 1;
					}
				}
				else
				{

					if ($off_foot <= 0) 
					{
						if ($off_kava > $def_kava) {
							$calc1 = $def_kava / (sqrt($off_kava / $def_kava)); 
							$calc2 = $calc1 / ($off_kava);
							$win = 0;
						} else {
							$calc1 = $off_kava / (sqrt($def_kava / $off_kava)); 
							$calc2 = $calc1 / ($def_kava);
							$win = 1;
						}
					} 
					
					else
					{
						$rel1_kava  = $off_kava / $off_all;
						$rel2_foot 	= $off_foot / $off_all;

						$kavadeff 	= $def_kava * $rel1_kava;
						$footdeff 	= $def_foot * $rel2_foot;
						$deff_all 	= $kavadeff+$footdeff;

						if ($off_all > $deff_all) {
							$calc1 = $deff_all / (sqrt($off_all / $deff_all)); 
							$calc2 = $calc1 / ($off_all);
							$win = 0;
						} else {
							$calc1 = $off_all / (sqrt($deff_all / $off_all)); 
							$calc2 = $calc1 / ($deff_all);
							$win = 1;
						}
					}
				}

				$updateset = $updateunits = $remove = $updatemoving = null;
				if ($win==0) {
					$targetress["rwood"] = $targetV["rwood"];
					$targetress["riron"] = $targetV["riron"];
					$targetress["rstone"] = $targetV["rstone"];
					$loot = 0;

					foreach ($unitnames as $unitid => $unitname) {
						if ($updateset != null) { $updateset .= ","; }
						if ($updatemoving != null) { $updatemoving .= ","; }

						for($i=0; $i < count($units) / 2; $i++) {
							if (isset($units[$i*2]) && intval($unitid) == intval($units[$i*2])) {
								$id = $units[$i*2];
								$am = $units[$i*2+1];
								$am = round($am - ($am*$calc2));
								$loot += $unitsloot[$id] * $am;
								$updateunits .= "`".$unitnames[$id]."`=".$unitnames[$id]." + '$am' ";
								$updatemoving .= $id.",".$am;
								$remove = explode(",", $updatemoving);
							}
						}
						$updateset .= "`".$unitname."`= '0' ";
					}
				
					$updatemoving = implode(",", $remove);

					$loot = self::genloot($loot, $targetress);
					$lootoff = "wood,$loot[wood],stone,$loot[stone],iron,$loot[iron]";
					$sqlreturn 		= "UPDATE `unitsmoving` SET `type`='".$config["command"]["attackreturn"]."', `stime`='".time()."', `loot`='$lootoff', `units`='$updatemoving' WHERE (`muid`='$commandid'); ";
					$sqlreport 		= "UPDATE `worldusers` SET `newreport` = newreport + 1 WHERE (`wuid`='$wuid');";
					$sqlloot		= "UPDATE `ressources` SET `rwood` = rwood - ".$loot["wood"].", `rstone` = rstone - ".$loot["stone"]." , `riron` = riron - ".$loot["iron"]." WHERE (`vid`='".$targetV["vid"]."');";
					$updateunits	= "UPDATE `units` SET $updateset WHERE (`vid`='$targetvillage');";
					db::query($sqlreturn);
					db::query($sqlreport);
					db::query($sqlloot);
					db::query($updateunits);
				} else {
					for ($i=0; $i < count($deff_units); $i++) {
						if (isset($deff_units[$i])) {
							$am = $deff_units[$i];
							$am = round($am - ($am*$calc2));
							if ($updateset != null) { $updateset .= ","; }
							$updateset .= "`".$unitnames[$i]."`= '$am' ";
						}
					}

					$updateunits = "UPDATE `units` SET $updateset WHERE (`vid`='$targetvillage');";
					$delcommand = "DELETE FROM `unitsmoving` WHERE (`muid`='$commandid');";
					db::query($updateunits);
					db::query($delcommand);
				}


				$sqlreport = "UPDATE `worldusers` SET `newreport` = newreport + '1' WHERE `wuid` IN ('$wuid','".$targetV["wuid"]."');";
				db::query($sqlreport);
			}
		}
	}

/*	public static function getwuidfromvid($vid) {
		return db::query("SELECT wu.wuid FROM worldusers wu, village v WHERE (wu.wuid = v.wuid AND v.vid = '$vid');")->fetch_assoc()["wuid"];
	}
*/

	public static function genloot($offloot, $targetress) {
		$wood = $stone = $iron = 0;
		$maxloot = $offloot;
		$offloot2 = $offloot;
		$loot = floor($offloot/3);
		while(true) {
			if ($maxloot <= 0) { $maxloot = 0; }	
			$oldmaxloot = $maxloot = $offloot2-($wood+$stone+$iron);

			if ($targetress["rwood"] > 0) {
				if ($maxloot <= $loot) {
					if ($targetress["rwood"] >= $maxloot) { $wood += $maxloot; $targetress["rwood"] -= $maxloot; $offloot = $maxloot; }
					else { $wood += $targetress["rwood"]; $targetress["rwood"] = 0; $offloot = $targetress["rwood"]; }
				}
				else {
					if ($targetress["rwood"] <= $loot) { $wood += $targetress["rwood"]; $targetress["rwood"] = 0; $offloot = $targetress["rwood"]; }
					else { $wood += $loot; $targetress["rwood"] -= $loot; $offloot = $loot; }
				}
				$maxloot -= $offloot;
			}

			if ($targetress["riron"] > 0) {
				if ($maxloot <= $loot) {
					if ($targetress["riron"] >= $maxloot) { $iron += $maxloot; $targetress["riron"] -= $maxloot; $offloot = $maxloot; }
					else { $iron += $targetress["riron"]; $targetress["riron"] = 0; $offloot = $targetress["riron"]; }
				}
				else {
					if ($targetress["riron"] <= $loot) { $iron += $targetress["riron"]; $targetress["riron"] = 0; $offloot = $targetress["riron"]; }
					else { $iron += $loot; $targetress["riron"] -= $loot;  $offloot = $loot;}
				}
				$maxloot -= $offloot;			
			}

		
			if ($targetress["rstone"] > 0) {
				if ($maxloot <= $loot) {
					if ($targetress["rstone"] >= $maxloot) { $stone += $maxloot; $targetress["rstone"] -= $maxloot; $test = $maxloot;
					} else { $stone += $targetress["rstone"]; $targetress["rstone"] = 0; $test = $targetress["rstone"]; }
				} else {
					if ($targetress["rstone"] <= $loot) { $stone += $targetress["rstone"]; $targetress["rstone"] = 0; $test = $targetress["rstone"]; }
					else { $stone += $loot; $targetress["rstone"] -= $loot; $test = $loot; }
				}
				$maxloot -= $test;
			}

			$maxloot = $offloot2-($wood+$stone+$iron);
			if ($maxloot <= 0) { $maxloot = 0; }
			if ($maxloot <= 0 || $oldmaxloot == $maxloot) { return array("wood" => $wood, "stone" => $stone, "iron" => $iron); }
		}
	}

	public static function simulieren() {
		echo "<style>p { color: white; }</style>";
		#Einheiten
		$spearman 	= 5000;
		$swordman 	= 5000;
		$spearmanoff= 10;
		$swordmanoff= 10;
		$skav 		= 0;
		$skavoff	= 0;
		$axeman 	= 0;
		$light 		= 0;

		#Kampfstärken
		$spearman_inf	= ($spearman*(15.00));
		$spearman_kav	= ($spearman*(45.00));
		$swordman_inv 	= ($swordman*(50.00));
		$swordman_kav 	= ($swordman*(15.00));
		$skav_deff_inf	= ($skav*(200.00));
		$skav_deff_kav	= ($skav*(80.00));
		$spearman_off 	= ($spearmanoff*(10.00));
		$swordman_off 	= ($swordmanoff*(25.00));
		$axeman_off 	= ($axeman*40.00);
		$light_off 		= ($light*130.00);
		$skav_off		= ($skavoff*150.00);


		#Kampfkraft!
		$off_foot 		= $axeman_off+$spearman_off+$swordman_off;
		$off_kava 		= $light_off+$skav_off;
		$off_all 		= $off_foot+$off_kava;

		$def_foot 		= ($spearman_inf+$swordman_inv+$skav_deff_inf);
		$def_kava 		= ($spearman_kav+$swordman_kav+$skav_deff_kav);

		
		#	
		#$_c2 = $test / $off_foot;

		if ($off_kava <= 0) 
		{
			if ($off_foot > $def_foot) {
				$calc1 = $def_foot / (sqrt($off_foot / $def_foot)); 
				$calc2 = $calc1 / ($off_foot);
			} else {
				$calc1 = $off_foot / (sqrt($def_foot / $off_foot)); 
				$calc2 = $calc1 / ($def_foot);
			}
			if ($off_foot > $def_foot) {
				echo "<p>Axt : ".round($axeman*$calc2)."</p>";
				echo "<p>Leicht: ".round($light*$calc2)."</p><br><br><br>";
				echo "<p>Speer : ".round($spearmanoff*$calc2)."</p>";
				echo "<p>schwert: ".round($swordmanoff*$calc2)."</p>";
			} else {
				echo "<p>Speer : ".round($spearman*$calc2)."</p>";
				echo "<p>schwert: ".round($swordman*$calc2)."</p>";
				echo "<p>Schwere: ".round($skav*$calc2)."</p>";
			}
		}
		else
		{

			if ($off_foot <= 0) 
			{
				if ($off_kava > $def_kava) {
					$calc1 = $def_kava / (sqrt($off_kava / $def_kava)); 
					$calc2 = $calc1 / ($off_kava);
				} else {
					$calc1 = $off_kava / (sqrt($def_kava / $off_kava)); 
					$calc2 = $calc1 / ($def_kava);
				}
			} 

			else
			{
				$rel1_kava  = $off_kava / $off_all;
				$rel2_foot 	= $off_foot / $off_all;

				$kavadeff 	= $def_kava * $rel1_kava;
				$footdeff 	= $def_foot * $rel2_foot;
				$deff_all 	= $kavadeff+$footdeff;

				if ($off_all > $deff_all) {
					$calc1 = $deff_all / (sqrt($off_all / $deff_all)); 
					$calc2 = $calc1 / ($off_all);
				} else {
					$calc1 = $off_all / (sqrt($deff_all / $off_all)); 
					$calc2 = $calc1 / ($deff_all);
				}

				if ($off_all > $deff_all) {
					echo "<p>Axt : ".round($axeman*$calc2)."</p>";
					echo "<p>Leicht: ".round($light*$calc2)."</p><br><br><br>";
				} else {
					echo "<p>Speer : ".round($spearman*$calc2)."</p>";
					echo "<p>schwert: ".round($swordman*$calc2)."</p>";
					echo "<p>Schwere: ".round($skav*$calc2)."</p>";
				}
			}
		}
	}

	public static function gengamedata() {
		$return = null;
		$args = func_get_args();
		for($i=0; $i < func_num_args(); $i++) {
			foreach ($args[$i] as $key => $value) { $return[$key] = $value; }
		}
		return json_encode($return);
	}

	public static function simulieren2() {
		echo "<style>p { color: white; }</style>";
		#Einheiten
		$spearman 	= 5000;
		$swordman 	= 5000;
		$spearmanoff= 10;
		$swordmanoff= 10;
		$skav 		= 0;
		$skavoff	= 0;
		$axeman 	= 0;
		$light 		= 0;

		#Kampfstärken
		$spearman_inf	= ($spearman*(15.00));
		$spearman_kav	= ($spearman*(45.00));
		$swordman_inv 	= ($swordman*(50.00));
		$swordman_kav 	= ($swordman*(15.00));
		$skav_deff_inf	= ($skav*(200.00));
		$skav_deff_kav	= ($skav*(80.00));
		$spearman_off 	= ($spearmanoff*(10.00));
		$swordman_off 	= ($swordmanoff*(25.00));
		$axeman_off 	= ($axeman*40.00);
		$light_off 		= ($light*130.00);
		$skav_off		= ($skavoff*150.00);


		#Kampfkraft!
		$off_foot 		= $axeman_off+$spearman_off+$swordman_off;
		$off_kava 		= $light_off+$skav_off;
		$off_all 		= $off_foot+$off_kava;

		$def_foot 		= ($spearman_inf+$swordman_inv+$skav_deff_inf);
		$def_kava 		= ($spearman_kav+$swordman_kav+$skav_deff_kav);

		
		#	
		#$_c2 = $test / $off_foot;

		if ($off_kava <= 0) 
		{
			if ($off_foot > $def_foot) {
				$calc1 = $def_foot / (sqrt($off_foot / $def_foot)); 
				$calc2 = $calc1 / ($off_foot);
			} else {
				$calc1 = $off_foot / (sqrt($def_foot / $off_foot)); 
				$calc2 = $calc1 / ($def_foot);
			}
			if ($off_foot > $def_foot) {
				echo "<p>Axt : ".round($axeman*$calc2)."</p>";
				echo "<p>Leicht: ".round($light*$calc2)."</p><br><br><br>";
				echo "<p>Speer : ".round($spearmanoff*$calc2)."</p>";
				echo "<p>schwert: ".round($swordmanoff*$calc2)."</p>";
			} else {
				echo "<p>Speer : ".round($spearman*$calc2)."</p>";
				echo "<p>schwert: ".round($swordman*$calc2)."</p>";
				echo "<p>Schwere: ".round($skav*$calc2)."</p>";
			}
		}
		else
		{

			if ($off_foot <= 0) 
			{
				if ($off_kava > $def_kava) {
					$calc1 = $def_kava / (sqrt($off_kava / $def_kava)); 
					$calc2 = $calc1 / ($off_kava);
				} else {
					$calc1 = $off_kava / (sqrt($def_kava / $off_kava)); 
					$calc2 = $calc1 / ($def_kava);
				}
			} 

			else
			{
				$rel1_kava  = $off_kava / $off_all;
				$rel2_foot 	= $off_foot / $off_all;

				$kavadeff 	= $def_kava * $rel1_kava;
				$footdeff 	= $def_foot * $rel2_foot;
				$deff_all 	= $kavadeff+$footdeff;

				if ($off_all > $deff_all) {
					$calc1 = $deff_all / (sqrt($off_all / $deff_all)); 
					$calc2 = $calc1 / ($off_all);
				} else {
					$calc1 = $off_all / (sqrt($deff_all / $off_all)); 
					$calc2 = $calc1 / ($deff_all);
				}

				if ($off_all > $deff_all) {
					echo "<p>Axt : ".round($axeman*$calc2)."</p>";
					echo "<p>Leicht: ".round($light*$calc2)."</p><br><br><br>";
				} else {
					echo "<p>Speer : ".round($spearman*$calc2)."</p>";
					echo "<p>schwert: ".round($swordman*$calc2)."</p>";
					echo "<p>Schwere: ".round($skav*$calc2)."</p>";
				}
			}
		}
	}
}
#2,14
?>



