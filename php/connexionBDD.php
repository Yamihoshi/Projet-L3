<?php
	try {
		$db = new PDO('mysql:host=localhost;dbname=BDE11300398','E11300398','2405052121N');
		$db->query('SET NAMES utf8');
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	catch (PDOException $e) {
		print "Erreur !: " . $e->getMessage() . "<br/>";
    		die();
	}
	

?>
