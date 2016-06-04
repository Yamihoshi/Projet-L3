<?php

	require_once("connexionBDD.php");

	function newJoueur($bdd, $pseudonyme,$score,$longueur_mot){
		
		$req=$bdd->prepare('INSERT INTO score (pseudonyme,score,longueur_mot) VALUES (:pseudonyme,:score,:length);');
		$req->bindValue(':pseudonyme',$pseudonyme);
		$req->bindValue(':score',$score);
		$req->bindValue(':length',$longueur_mot);


		
		$req->execute();
		
	}

	//ptt a suppr suivant ce qu'on fait
	function upScore($bdd, $pseudonyme){
		$req=$bdd->prepare('UPDATE score SET score=score+1 where pseudonyme=:pseudonyme;');
		$req->bindValue(':pseudonyme',$pseudonyme);
		
		$req->execute();
	}

	function highscore($bdd){
		$req=$bdd->prepare('SELECT * from score order by score desc LIMIT 20 ;');
		$req->execute();

		echo "PSEUDONYME|SCORE|LONGUEUR DU MOT";
		while($rep=$req->fetch(PDO::FETCH_ASSOC)){
			echo "<p>".$rep['pseudonyme']."|".$rep['score'].$rep['longueur_mot']."</p>";
		}
	}


?>