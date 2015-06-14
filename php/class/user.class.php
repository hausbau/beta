<?php
class user {

	public static function exists($user) {
		$user = db::ci($user);
		$qry = db::query("SELECT COUNT(*) as `count` FROM `".dbprefix."accounts` WHERE (`name`='$user');");
		$row = db::fetch_assoc($qry);
		if ($row["count"] > 0) { return 1; }
		return 0;
	} 

	public static function getDatas($user, $table="users", $w = "uID") {
		if (is_numeric($user) && $w =="name" ) { $w = "uID"; } else { $user = db::ci($user); }
		$res = db::query("SELECT * FROM `".dbprefix.$table."` WHERE `$w` = '".$user."';");
		return db::fetch_assoc($res);
	} 

	public static function logout() {
		unset($_SESSION);
		session_unset();
		session_destroy();
		return true;
	}

	public static function validateuser($name) {
		if (strlen($name) < 1) { return 0; }
		if(preg_match('/^[a-zA-Z0-9][\w]+[a-zA-Z0-9]$/', $name)) { return 1; }
		return 0;
	}

	public static function validatemail($mail) {
		if (strlen($mail) < 1) { return 0; }
		if(filter_var($mail, FILTER_VALIDATE_EMAIL)) { return 1; }
		return 0;
	}

	public static function getadmin($user) {
		$user = db::ci($user);
		$qry = db::query("SELECT `isadmin` FROM `".dbprefix."accounts` WHERE (`aid`='$user');")->fetch_assoc();
		return $qry["isadmin"];
	}
}
?>