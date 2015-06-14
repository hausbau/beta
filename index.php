<?php
session_start();
session_regenerate_id();
header('Content-Type: text/html; charset=utf-8');

error_reporting(E_ALL);
ini_set("display_errors", true);

set_include_path(define('ROOT_DIR', dirname(__FILE__)));

include("php/config.php");
include("php/class/db.class.php");
include("php/class/func.class.php");
include("php/class/user.class.php");

$db = db::connect($config["mysql"]);
$error = null;
$gamelogin = false;
if (!isset($_GET["p"])) { $page = null; } else { $page = $_GET["p"]; }
if (!isset($_POST)) { $post = null; } else { $post = $_POST; }

##Login control
if (isset($_SESSION["AID"]) && $_SESSION["AID"] > 0 && $_SESSION["LOGGEDIN"] == true) 
{
	$aid = $_SESSION["AID"];
	$account = user::getDatas($aid, "accounts", "aid");
	$logged = $_SESSION["LOGGEDIN"];
	$ownip 	= $_SERVER["REMOTE_ADDR"];

} else { $logged = false; }

if (isset($post["login"])) {
	if (empty($post["name"]) || empty($post["pass"])) {
		$error = func::text("Bitte füllen sie alle Felder aus", "error", true);
	} else {
		$user = db::ci($post["name"]);
		$pass = db::ci(md5($post["pass"]));
		if (user::exists($user)) {
			$data = user::getDatas($user, "accounts", "name");
			if ($data["pass"] == $pass) {
				$ip = $_SERVER["REMOTE_ADDR"];
				$time = time();
				if(db::query("UPDATE `".dbprefix."accounts` SET `lastip`='$ip', `lastlogin`='$time' WHERE (`name`='$user');")) {
					$_SESSION["LOGGEDIN"] 	= true;
					$_SESSION["AID"] 		= $data["aid"];
					$_SESSION["IP"] 		= $_SERVER["REMOTE_ADDR"];
					header("LOCATION: index.php");	
				}
			} else {
				$error = func::text("Das Passwort ist falsch!", "error", true);
			}
		} else {
			$error = func::text("Benutzer exestiert nicht!", "error", true);
		}
	}
}

include("php/temp/header.php");
include("php/temp/content.php");
include("php/temp/footer.php");

db::disconnect();
?>