<?php
	try {
		$db = new PDO('mysql:host=localhost;dbname=motus','root','root');
		$db->query('SET NAMES utf8');
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	catch (PDOException $e) {
    	die("Erreur !: " . $e->getMessage() . "<br/>");
	}
	

?>
