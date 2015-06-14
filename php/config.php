<?php
$config["mysql"]["host"] 	= "127.0.0.1";
$config["mysql"]["user"] 	= "root";
$config["mysql"]["pass"] 	= "";
$config["mysql"]["db"] 		= "hausbau_1";
$config["mysql"]["dbprefix"]= "";

$config["version"]= "0.2";
$config["copyright"]= "Andreas B. und Munir A.";


#Gameconfig

$config["command"]["attack"] = 1;
$config["command"]["attackreturn"] = 2;

$config["unittype"][1] = "foot";
$config["unittype"][2] = "archer";
$config["unittype"][3] = "kava";
$config["unittype"][4] = "misc";

$config["village"]["basedeff"] = 1;

$config["build"]["barracks"] 	= "br";
$config["build"]["stable"] 		= "st";
$config["build"]["workshop"] 	= "ws";
$config["build"]["missio"] 		= "ag";

define("classpath", "php/class/");
define("pagepath", "php/view/nogame/");
define("gamepath", "php/view/");
define("dbprefix", $config["mysql"]["dbprefix"]);

$config["pagecontrol"]["logged"] 	= array("logout", "game", "home", "impress", "worlds", "joinworld","impress");
$config["pagecontrol"]["game"] 		= array("vinfo","pinfo","collectionplace","headquater", "map", "overview", "mails","newmails", "report", "barracks","profil","ranking", "settings", "ally","logout");
$config["pagecontrol"]["visit"] 	= array("home", "impress", "register","login");
$config["pagecontrol"]["admin"] 	= array();

/*
$classpath = classpath;
if (is_dir($classpath)) {
	if ($dir=opendir($classpath)) {
		while (($file = readdir($dir)) !== FALSE) {
			if ($file != "." && $file != "..") { include(classpath.$file); }
		}
	}
}
*/
?>