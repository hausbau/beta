<?php
class func {

	public static function pre($msg) {
		echo "<pre>";
		print_r($msg);
		echo "</pre>";
	}
	public static function text($msg, $type = "success", $navbar = false) {
		if ($navbar) { return $msg; }
		return "<div class='text $type'>$msg</div>";
	}

	public static function loadpage($game = false) {
		global $page,$config,$logged,$aid,$gamelogin;

		$filepath = pagepath;
		if ($game) { $filepath = gamepath; }

		$p = urldecode(trim($page));
		$loggedin 	= $config["pagecontrol"]["logged"];
		$game 		= $config["pagecontrol"]["game"];
		$visit 		= $config["pagecontrol"]["visit"]; 
		$isadmin 	= $config["pagecontrol"]["admin"];

		if (empty($p)) { $p="home"; }
		if ($logged) {
			if (!in_array($p, $loggedin) && $gamelogin === false) { $p = "home"; }
			if (!in_array($p, $game) && $gamelogin === true) { $p = "home"; }
			if (!in_array($p, $game) && $gamelogin === true) { $p = "home"; }
			if (user::getadmin($aid) < 1) { if (in_array($p, $isadmin)) { $p="home3"; } }
		} else {
			if (!in_array($p, $visit)) { $p = "home"; }	
		}

		$file = $filepath.$p.".php";
		if (file_exists($file)) { include($file); }
	}


	public static function makeresttime($buildtime) {
		if ($buildtime < 0)
			$buildtime= 0;
		$hours= floor($buildtime / 60 / 60);
		$minutes= floor(($buildtime - $hours * 3600) / 60);
		$seconds= floor($buildtime % 60);
		if ($minutes < 10)
			$minutes= "0".$minutes;
		if ($seconds < 10)
			$seconds= "0".$seconds;

		return $hours.":".$minutes.":".$seconds;
	}

	public static function makesmalldate($date) {
		global $localTime;
		global $config;
		$date+=$localTime*60*60;
		$datum= getdate($date);
		$nowdate= getdate(time());
		if (($datum["wday"]==$nowdate["wday"]) && ($datum["mday"]==$nowdate["mday"])) {
			$date-=$localTime*60*60;
			return self::makedate($date);
		} elseif ($date<time()+60*60*24*5) {
			$tage= array("So", "Mo", "Di", "Mi", "Do", "Fr", "Sa");
			$datum= getdate($date);
			$time= $tage[$datum["wday"]]." ";
		
			$tmp= $datum["hours"];
			if ($tmp < 10) {
				$tmp= "0".$tmp;
			}
			$time= $time.$tmp.":";
			$tmp= $datum["minutes"];
			if ($tmp < 10) {
				$tmp= "0".$tmp;
			}
			$time= $time.$tmp;
			return $time;
		} else {
			$datum= getdate($date);
			$tmp= $datum["mday"];
			if ($tmp < 10) {
				$tmp= "0".$tmp;
			}
			$time= $tmp.".";
			$tmp= $datum["mon"];
			if ($tmp < 10) {
				$tmp= "0".$tmp;
			}
			$time= $time.$tmp." ";
		
			$tmp= $datum["hours"];
			if ($tmp < 10) {
				$tmp= "0".$tmp;
			}
			$time= $time.$tmp."h";
			return $time;
		}
	}

	public static function makedate($date) {
		global $localTime;
		$date+=$localTime*60*60;
		$datum= getdate($date);
		$tmp= $datum["hours"];
		if ($tmp < 10) {
			$tmp= "0".$tmp;
		}
		$time= $tmp.":";
		$tmp= $datum["minutes"];
		if ($tmp < 10) {
			$tmp= "0".$tmp;
		}
		$time= $time.$tmp.":";
		$tmp= $datum["seconds"];
		if ($tmp < 10) {
			$tmp= "0".$tmp;
		}
		$time= $time.$tmp;
		return $time;
	}
}
?>