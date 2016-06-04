<?php

	require_once("connexionBDD.php");

	function newJoueur($bdd, $pseudonyme,$score){
		
		$req=$bdd->prepare('INSERT INTO score (pseudonyme,score) VALUES (:pseudonyme,:score);');
		$req->bindValue(':pseudonyme',$pseudonyme);
		$req->bindValue(':score',$score);

		
		$req->execute();
		
	}

	//ptt a suppr suivant ce qu'on fait
	function upScore($bdd, $pseudonyme){
		$req=$bdd->prepare('UPDATE score SET score=score+1 where pseudonyme=:pseudonyme;');
		$req->bindValue(':pseudonyme',$pseudonyme);
		
		$req->execute();
	}

	function highscore($bdd){
		$req=$bdd->prepare('SELECT pseudonyme, score from score order by score desc LIMIT 20 ;');
		$req->execute();

		echo "PSEUDONYME|SCORE";
		while($rep=$req->fetch(PDO::FETCH_ASSOC)){
			echo "<p>".$rep['pseudonyme']."|".$rep['score']."</p>";
		}
	}


?>