<?php

	require_once("connexionBDD.php");

	function newJoueur($bdd, $pseudonyme,$score,$longueur_mot){
		
		$req=$bdd->prepare('INSERT INTO score (pseudonyme,score,longueur_mot) VALUES (:pseudonyme,:score,:length);');
		$req->bindValue(':pseudonyme',$pseudonyme);
		$req->bindValue(':score',$score);
		$req->bindValue(':length',$longueur_mot);


		
		$req->execute();
		
	}

	function highscore($bdd){
		$req=$bdd->prepare('SELECT * from score order by score desc LIMIT 20 ;');
		$req->execute();

		$table = '<table class="table">
			<thead>
				<tr>
					<th>Pseudonyme</th>
					<th>Score</th>
					<th>Longueur du mot</th>
				</tr>
			</thead><tbody>';
		while($rep=$req->fetch(PDO::FETCH_ASSOC)){
			$table.= "<tr><td>".$rep['pseudonyme']."</td><td>".$rep['score']. "</td><td>" .$rep['longueur_mot']."</td></tr>";
		}
		$table .= "</tbody></table>";
		echo $table;
	}


?>