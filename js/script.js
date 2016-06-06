"use strict";
var dico=[];
var timer=
{
	valeur:8,
	horloge:8
};
var timerEventHandler;
var motus;
var pseudo;
var score;
var playerAudio=
{
	 bienPlacee : new Audio("sound/bienPlacee.wav"),
	 malPlacee : new Audio("sound/malPlacee.wav"),
	 mauvaiseLettre : new Audio("sound/mauvaiseLettre.wav"),
	 sonVictoire : new Audio("sound/sonVictoire.wav")
};

function timerEvent()
{	
	if(timer.horloge>0)
	{
		$("#valTimer").html("&nbsp;"+(timer.horloge-1) +"&nbsp;");
		timer.horloge=timer.horloge-1;
	}

	if(timer.horloge==0)
		$("#valTimer").trigger("timerChange");

}

function loadDictionnary()
{
     var txtFile = new XMLHttpRequest();
     txtFile.open("GET", "dico.txt", true); //Si ça bug, remettre à false
     txtFile.overrideMimeType('text/plain; charset=iso-8859-1');
     txtFile.onreadystatechange = function () 
     {
	    if (txtFile.readyState === 4) 
	    {  
	        // Makes sure the document is ready to parse.
	        if (txtFile.status === 200) 
	        {  
	             // Makes sure it's found the file.
	            var wordList = txtFile.responseText.split('\n');
	            for(var i=0;i<wordList.length;i++)
	            {
	            	dico[i]=wordList[i].trim();
	            }

	            //console.log(dico);
	        }
	    }
	}

	txtFile.send(null);
}

function getRandomWord(taille)
{
	var sousDico = dico.filter( function( element ) {
  		return breakUTF8Character(element).length == taille;
	});

	var index = Math.floor((Math.random() * (sousDico.length-1)) );

	return breakUTF8Character(sousDico[index]);
}

function breakUTF8Character(word)
{
	var str = word.toUpperCase();
	str = str.replace(/[ÀÁÂÃÄÅ]/g,"A");
    str = str.replace(/[ÈÉÊË]/g,"E");
    str = str.replace(/[ÎÏ]/g,"I");
    str = str.replace(/[ÔÖ]/g,"O");
    str = str.replace(/[ÙÛÜ]/g,"U");
    //.... all the rest
    return str.replace(/[^A-Z]/gi,'');
}

function resetTimer()
{
		console.log("resetTimer");

		$("#validerMot").attr("disabled","disabled");

		var win = 0;
		if(motus.victoire($("#mot").val()))
			win=1;

		clearInterval(timerEventHandler);
		var delay=motus.taille*220+150+win*3150;

		if(!motus.proposerMot($("#mot").val()))
			delay=500;

		$("#mot").val("");

		if(!motus.defaite())
		{
			setTimeout(function()
			{
				timer.horloge=timer.temps;
				$("#valTimer").html("&nbsp;"+timer.temps + "&nbsp;");
				if(win==0)
				{
					timerEventHandler = setInterval(timerEvent, 1000);
					$("#validerMot").removeAttr("disabled");
				}
			},delay);
		}
		else if(win==0)
		{
			$('#play').hide();
			$("h1").html("Motus");
			//$('#config').show(250);
				
			//$("body").append('<div><button id="newGame">REJOUER</button></div></div>');
			$("#config").after('<div id="endGame" class="col-lg-8 center-block"><h1>VOUS AVEZ PERDU !</h1><p class="lead">Le mot était : '+motus.mot.mot_a_trouver.toUpperCase()+'. Vous avez trouvé '+score+' mots</p><div class="form-group"><input type="text" class="form-control" placeholder="Pseudonyme" id="pseudo" /></div><div class="centered"><button id="showHighscore" class="btn btn-danger" disabled>Enregistrer votre score</button><button class="btn btn-danger" id="skipHighscore">Passez cette étape</button</div></div></div>');
		}
}

function pauseAudio()
{
	Object.keys(playerAudio).forEach(function(key) {
        playerAudio[key].pause();
        playerAudio[key].currentTime=0;
    });
}

loadDictionnary();//A placer avant document ready

$(document).ready(function(){

	function load() {
		return new Typo("fr_FR");
	}

	//var dictionary = load();

	class MotCherche{
		constructor(mot){
			this.mot_a_trouver = mot || "AVION";
		}

		initialisation(){
			// ajax pour trouver un mot
			this.mot = "AVION";
		}

		verificationMot(mot_propose){
			console.log(mot_propose+ this.mot_a_trouver);
			if(this.mot_a_trouver.length !== mot_propose.length)
				return false;
			/*else if(this.mot_a_trouver.charAt(0) !== mot_propose.charAt(0))
				return false;*/
			//ajouter vérification ortho taln
			else 
				return true; 
		}

		traitementMot(mot_propose){
			if(!verificationMot(this.mot_a_trouver, mot_propose))
				return mot_propose;
		}

		motTrouve(mot_propose){
			if(this.mot_a_trouver === mot_propose)
				return true;
			else
				return false;
		}
	}
	//Class motus
	var Motus = class Motus{

		constructor(taille, nombre_essai){
			//this.mot = new MotCherche("AVION", 1);
			this.mot = new MotCherche(getRandomWord(taille));
			this.tentative = 0;
			this.mot_deja_propose = [];
			this.essai = nombre_essai;
			this.taille = taille;
			this.indiceLettreTrouve = [0];
		}

		letterFind() {
			var line = $("tr").eq(this.tentative);

			for(var i=0;i<this.taille;i++)
			{
				line.find('td').eq(i).text("-");
				console.log("tentative",this.tentative);
			}

			for(var indice of this.indiceLettreTrouve){
				var case_motus = line.find('td').eq(indice);
				$(case_motus).html(this.mot.mot_a_trouver.charAt(indice));
			}
		}

		creerTableau(){
			var str ="";
			$('table tbody').html(str);
			for(var j =0; j < this.essai; j++){
				str += "<tr>";
				for(var i = 0; i < this.taille; i++)
					str+='<td class="lettreNormal"></td>';
				str+='</tr>';
			}
			$('table tbody').append(str);
			this.letterFind(); 
		}
		ajouterIndiceLettreFind(indice){
			if(this.indiceLettreTrouve.includes(indice))
				return;
			else
				this.indiceLettreTrouve.push(indice);
		}

 
		ajouterTentative(mot_propose){
			this.tentative++;
			this.mot_deja_propose.push(mot_propose);
		}

		ajouterMotTableau(mot_propose){
			var tmp = this.mot.mot_a_trouver;
			var audio;
			var delay=225;
			for(var i = 0; i < this.taille; i++){
				if(this.mot.mot_a_trouver.charAt(i) === mot_propose.charAt(i)){
					tmp = tmp.replace(mot_propose.charAt(i));
				}
			}
			for(var i = 0; i < this.taille; i++ ){

				var present_dans_le_mot = tmp.indexOf(mot_propose.charAt(i));
				var caseARemplir=$('table tr:nth-child(' + (this.tentative + 1) + ')  td:nth-child('+ (i + 1) +')');
				var classLettre ='lettreNormal';

				$('table tr:nth-child(' + (this.tentative + 1) + ')  td:nth-child('+ (i + 1) +')').html(mot_propose.charAt(i));
				if(this.mot.mot_a_trouver.charAt(i) === mot_propose.charAt(i))
				{
					audio = playerAudio.bienPlacee;
					classLettre='lettreCorrect';
					this.ajouterIndiceLettreFind(i);
				}
				else if(present_dans_le_mot !== -1){
					console.log(" 2. " + this.mot.mot_a_trouver.charAt(i) + " 20. "+  mot_propose.charAt(i))
					audio = playerAudio.malPlacee;
					classLettre='lettreMalPlacee';
					tmp = tmp.replace(mot_propose.charAt(i));
				}
				else
				{
					classLettre='';
					audio = playerAudio.mauvaiseLettre;
				}

				delay=220*(i+1);
				(function(delayTime,myCase,myClass,audioToPlay){
	        		setTimeout( function(){pauseAudio();myCase.addClass(myClass);audioToPlay.play();}, delayTime);
	    		})(delay,caseARemplir,classLettre,audio);

			}
			if(this.victoire(mot_propose)){
				this.gestionVictoire();
			}
		}

		ajouterMauvaisMot(mot_propose)
		{
			for(var i = 0; i < this.taille; i++ ){
				$('table tr:nth-child(' + (this.tentative + 1) + ')  td:nth-child('+ (i + 1) +')').addClass("wrongWord");
				if(typeof mot_propose[i] != 'undefined')
					$('table tr:nth-child(' + (this.tentative + 1) + ')  td:nth-child('+ (i + 1) +')').text(mot_propose[i]);
				else
					$('table tr:nth-child(' + (this.tentative + 1) + ')  td:nth-child('+ (i + 1) +')').text("-");
			}
		}

		proposerMot(mot_propose){

			var motAjoute=false;

			if(typeof mot_propose =='undefined')
				mot_propose="";
			mot_propose = breakUTF8Character(mot_propose.toUpperCase());
			if(this.mot.motTrouve(mot_propose))
			{
				console.log("victory"); // Add gestion
				this.ajouterMotTableau(mot_propose);
				motAjoute=true;
			}
			else if(this.mot_deja_propose.indexOf(mot_propose) !== -1){
			 // gestion erreur
			 console.log("lost");
			 this.ajouterMauvaisMot(mot_propose);
			}
			else{
				if(this.mot.verificationMot(mot_propose)){
					this.ajouterMotTableau(mot_propose);
					motAjoute=true;
				}

				else
				{
					this.ajouterMauvaisMot(mot_propose);
				}
			}

			var win = 0;
			if(motus.victoire(mot_propose))
				win=1;

			if(win==0)
				this.ajouterTentative(mot_propose);

			var taille = 100;

			if(win==0)
			{

				if(motAjoute)
				{
					(function(motus){

			        	setTimeout( function(){
			        		motus.letterFind();
			        	}, motus.taille*220);

			    	})(this);
		    	}

		    	else
		    	{
		    		this.letterFind();
		    	}
		    }

	    	return motAjoute;
		}
		victoire(mot_propose){
			return this.mot.motTrouve(breakUTF8Character(mot_propose.toUpperCase()));
		}

		defaite()
		{
			return this.tentative>=this.essai;
		}

		gestionVictoire(){
			
			var audio = playerAudio.sonVictoire;
			audio.volume = 0.4;
			$("#mot").val("");
			score++;
			$("#scoreValue").text(score);
			//clearInterval(timerEventHandler);

			setTimeout(function(){
				audio.play();
				}, this.taille*250);

			setTimeout(function()
			{
				//$('#play').hide();
				//$('#config').show(250);
				motus = new Motus(motus.taille,motus.essai);
				motus.creerTableau();
				timer.horloge=timer.temps;
				$("#valTimer").html("&nbsp;" + timer.temps + "&nbsp;");
				setTimeout( function(){
					timerEventHandler = setInterval(timerEvent, 1000);
					$("#validerMot").removeAttr("disabled");
				},750);
				
				//$("body").append('<div id="endGame">VOUS AVEZ GAGNE<div><button id="newGame">REJOUER</button></div></div>');

			},this.taille*230+3150) //taille*250 pour laisser le son des lettres + 3s pour jouer le son victoire
		}
	}

	$("#mot").val("");
	
	$('#validerMot').click(function(){

		resetTimer();
	});

	$("body").on("click","#showHighscore",function()
	{
		pseudo=$("#pseudo").val();

		if(pseudo.trim()!='')
		{
			$.post("php/ajax.php",{Pseudo:pseudo,User:true,score:score,longueur_mot:motus.taille},function(res){
				
				$.get("php/ajax.php",{highScore:true},function(res){
					$("#endGame").html('<button id="newGame"  class="btn btn-danger" >Rejouer</button>');
					$("#endGame").append(res);
				});
			});
		}

	});

	$("body").on("click","#newGame",function()
	{
		$("#endGame").remove();
		$('#config').show(250);
	});

	$("body").on("click","#skipHighscore",function()
	{
		$("#endGame").remove();
		$('#config').show(250);
	});

	$('#config').on('submit', function(event){
		event.preventDefault();
		$("#mot").val("");
		$("#validerMot").removeAttr("disabled");
		var taille = parseInt($('#taille_mot').val());
		var nombre_essai = parseInt($('#nombre_essai').val());

		motus = new Motus(taille , nombre_essai);
		motus.creerTableau();
		score=0;
		$('#config').hide();
		$("h1").remove();
		$("header").html('<h1><div id="scoreDisplay">Mots trouvés : <span id="scoreValue">0</span></div></h1>');
		$('#play').show(250);

		timer.temps=$('#timerSettings').val();
		timer.horloge=timer.temps;
		$("#valTimer").html("&nbsp;" + timer.temps + "&nbsp;");

		/*TIMER*/
		timerEventHandler = setInterval(timerEvent, 1000);


		console.log("Mot à trouver :",motus.mot.mot_a_trouver);
		console.log("temps",timer.temps);
		
	});

	$("body").keydown(function(event)
	{
		if(event.keyCode>=65 && event.keyCode<=90 && !$("#mot").is(":focus"))
		{
			//$("#mot").val($("#mot").val()+event.key.toUpperCase());
			$("#mot").focus();
		}
	});

	$("#mot").keyup(function(event)
	{
		this.value=breakUTF8Character(this.value).toUpperCase();

		if(event.keyCode==13)
			$("#validerMot").trigger("click");
	});

	$("body").on("change","#pseudo",function()
	{
		if($(this).val().trim()=='')
			$("#showHighscore").attr('disabled','disabled');
		else
			$("#showHighscore").removeAttr('disabled');
	});

	$("body").on("keyup","#pseudo",function()
	{
		if($(this).val().trim()=='')
			$("#showHighscore").attr('disabled','disabled');
		else
			$("#showHighscore").removeAttr('disabled');
	});

	/*$("body").keydown(function(event)
	{
		if(event.keyCode>=65 && event.keyCode<=90 && !keyPressed)
		{
			//keyPressed=true;
			console.log(event.key.toUpperCase());

			$("#mot").append(event.key.toUpperCase()); //TEST, à ajouter dans le carré courrant
		}

		else if(event.keyCode == 8 ) //Supp
		{
			var mot=$("#mot").text();
			$("#mot").text(mot.substr(0,mot.length-1));
		}
	});*/

	$("#valTimer").bind("timerChange", function() {

		resetTimer();
	});

	$("body").on("click","#newGame",function()
	{
		$("#endGame").remove();
		$('#config').show(250);
	});
	
	//console.log(dictionary.check("VOITURE"));

});