<?php

	$db_name="u618222281_champ";

	try
	{
		$bd=new PDO("mysql:host=mysql.hostinger.fr;dbname=$db_name",'u618222281_root', 'TOUITEURPLS');
		$bd->query("SET NAMES utf8");
		$bd->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
	}
	catch(PDOException $e)
	{
		die("<p> La connexion a échoué.Erreur[".$e->getCode()."]:".$e->getMessage()."</p>");
	}
?>