<!DOCTYPE html>
<html>
<head>
	<title></title>
	<script type="text/javascript" src='jquery.js'></script>
	<script type="text/javascript" src='newscript.js'></script>
	<script type="text/javascript">
	var gamedata = {
		wood:1000
	};
	</script>
</head>
<body>
	<pre>
		<?php
			$village["village"] = null;
			$con = mysql_connect("127.0.0.1", "root", "123456");
			mysql_select_db("hausbau");
			$res = mysql_query("SELECT * FROM `village` WHERE (`vid`='1');");
			$row = mysql_fetch_assoc($res);
			print_r($row);
			$json["village"] = $row;
			$kacka = json_encode($json);
			print_r($kacka);
		?>
	</pre>
	<div><span id='wood' class='res' title='0.666666666666667'>1000</span></div><div></div>
	<script type="text/javascript">
		$(document).ready(function() {
			Timer.init(<?php echo time(); ?>);
		});
	</script>
</body>
</html>