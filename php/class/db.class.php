<?php
class db {

	private static $con=null;

	public static function connect($mysql) {
		if (!empty($mysql["host"]) && !empty($mysql["user"]) && !empty($mysql["db"])) {
			$con = self::$con = mysqli_connect($mysql["host"], $mysql["user"], $mysql["pass"], $mysql["db"]);
			if(!empty($con)) { return $con; }
			else { self::werror(mysqli_connect_error()); }
		} else { self::werror("Cannot connect to DB", $mysql); }
	}

	public static function arrayToUpdate($table,$array,$where = null) {
		$update = $wqry = null;
		if ( count($where) > 0 ) {
			$wqry = "WHERE ";
			$keys = array_keys($where);
			for ($n=0;$n<count($where);$n++) {
				if ( $n > 0 ) { $update .=", "; }
				$wqry .= "`".$keys[$n]."` = '".$where[$keys[$n]] ."'";
			}
		}
		
		$keys = array_keys($array);
		for ($n=0;$n<count($array);$n++) {
			if ( $n > 0 ) { $update .=", "; }
			$update .= "`".$keys[$n]."` = '".$array[$keys[$n]] ."'";
		}
		return "UPDATE `".dbprefix."$table` SET $update $wqry;";
	}

    public static function arrayToInsert($table,$array) {
		$insert = $values = null;
		$keys = array_keys($array);
		for ($n=0;$n<count($array);$n++) {
			if ( $n > 0 ) { $insert .=", "; $values .= ", "; }
			$insert .= "`".$keys[$n]."`";
			$values .= "'".$array[$keys[$n]]."'";
		}
		return "INSERT INTO `".dbprefix."$table` ($insert) VALUES ($values);";
	}
	public static function query($qry) {
		$result = mysqli_query(self::$con, $qry);
		if ($result !==FALSE) {
			$return = $result;
			return $return;
		}
		else {
			$bt = debug_backtrace();
			$line = $bt[0]["line"];
			func::pre($bt);
			func::pre(self::error());
		}
	}

	public static function insert_id() { return mysqli_insert_id(self::$con); }
	public static function free($res) { return mysqli_free_result($res); }
	public static function fetch_assoc($res) { return mysqli_fetch_assoc($res); }
	public static function num_rows($res) { return mysqli_num_rows($res); }
	public static function ci($q) { return mysqli_real_escape_string(self::$con, $q); }
	public static function disconnect() { return mysqli_close(self::$con); }
    public static function errno() { return mysqli_errno(self::$con); }
    public static function error() { return mysqli_error(self::$con); }
}

/*
<?php
// 200 - Mysql Error
class db {
    private static $conn = NULL;
	
	public static function connect($array) {
		self::$conn = mysqli_connect($array["host"], $array["user"], $array["pass"], $array["data"]);
		if ( self::errno() > 0 ) { template::showError(200, self::error(),__FILE__); }
		return self::$conn;
	}
    
	public static function arrayToUpdate($table,$array,$where = null) {
		$update = $wqry = null;
		if ( count($where) > 0 ) {
			$wqry = "WHERE ";
			$keys = array_keys($where);
			for ($n=0;$n<count($where);$n++) {
				if ( $n > 0 ) { $update .=", "; }
				$wqry .= "`".$keys[$n]."` = '".$where[$keys[$n]] ."'";
			}
		}
		
		$keys = array_keys($array);
		for ($n=0;$n<count($array);$n++) {
			if ( $n > 0 ) { $update .=", "; }
			$update .= "`".$keys[$n]."` = '".$array[$keys[$n]] ."'";
		}
		return "UPDATE `$table` SET $update $wqry;";
	}
	
    public static function arrayToInsert($table,$array) {
		$insert = $values = null;
		$keys = array_keys($array);
		for ($n=0;$n<count($array);$n++) {
			if ( $n > 0 ) { $insert .=", "; $values .= ", "; }
			$insert .= "`".$keys[$n]."`";
			$values .= "'".$array[$keys[$n]]."'";
		}
		return "INSERT INTO `$table` ($insert) VALUES ($values);";
	}
    
	public static function query($res, $file = "not defined",$line = 1337) {
        $qry = mysqli_query(self::$conn, $res);
        $error = self::errno();
        if ( $error > 0 ) {
            $e = self::error();
            $handle = fopen("mysql.log", "a+");
            $date = date("d.m.Y H:i:s", time());
            fwrite($handle, "Date: $date\r\n");
            fwrite($handle, "Error: $error: $e || File: $file / Line: $line\r\nResult: $res \r\n");
            fclose($handle);
			
			$bt = debug_backtrace();
			$line = $bt[0]["line"];
			$f = explode(DIRECTORY_SEPARATOR,$bt[0]["file"]);
			$nFile = $f[count($f)-1]; $file = null;
			$len = strlen($nFile);
			for($i=0;$i<$len;$i++) {
				if ( $i > ($len-($len/1.3)) && $i < ($len-($len/3)) ) { $file .= "*"; }
				else { $file .= $nFile[$i]; }
			}
			template::showError(ERROR_MYSQL, $file,$line,self::error());
        }
        return $qry;
    }
    
    public static function insertID() { return mysqli_insert_id(self::$conn); }

    public static function disconnect() { return mysqli_close(self::$conn); }

    public static function unescape($res) { return mysqli_real_escape_string(self::$conn, $res); }

    public static function fetch_assoc($res) { return mysqli_fetch_assoc($res); }
    
    public static function fetch_array($res) { return mysqli_fetch_array($res); }

    public static function num_rows($res) { return mysqli_num_rows($res); }
    
    public static function errno() { return mysqli_errno(self::$conn); }
    
    public static function error() { return mysqli_error(self::$conn); }
}
?>
*/
?>