/*********************
	Kanji generation
*********************/

// get every level label 
let jlpt5_level_label = document.querySelector('label#level-5');
let jlpt4_level_label = document.querySelector('label#level-4');
let jlpt3_level_label = document.querySelector('label#level-3');
let jlpt2_level_label = document.querySelector('label#level-2');

// add eventListener to generate cards when user clicks on label
jlpt5_level_label.addEventListener('click', setKanjis(5));
jlpt4_level_label.addEventListener('click', setKanjis(4));
jlpt3_level_label.addEventListener('click', setKanjis(3));
jlpt2_level_label.addEventListener('click', setKanjis(2));

/*
	setKanjis(level_number);
	AJAX call to get an object that contains all kanjis
	for the level specified by param: level_number
*/
function setKanjis(level_number) {

	var requestKanjiFile = new XMLHttpRequest();

	// when the file is loaded
	requestKanjiFile.addEventListener("load", () => {
		//console.log('Transfer completed');
		var k_list = JSON.parse(requestKanjiFile.responseText);
		console.log(k_list);
		generateCards(level_number, k_list);
	});

	requestKanjiFile.addEventListener("error", () => {
		console.log('Error during transfer of Kanji file JLPT n°' + level_number);
	});

	requestKanjiFile.addEventListener("abort", () => console.log('Canceled by user'));

	requestKanjiFile.open("GET", "./kanji-objects/kanji-jlpt"+level_number+".json", true);
	requestKanjiFile.send();
}

/*
	generateCards(level_number, kanji_list);
	Create html that contains every kanji of the list
*/
function generateCards(level_number, kanji_list) {

	let jlpt_container = document.querySelector('#jlpt' + level_number + '_container');

	for (var i = 0; i < kanji_list.kanji.length; i++) {
		let card = document.createElement('div');
		card.className = 'flip-card';

		let card_inner = document.createElement('div');
		card_inner.className = 'flip-card-inner';

		// create front face of the card
		let card_front = document.createElement('div');
		card_front.className = 'flip-card-front';

		let kanji_symbol = document.createElement('p');
		kanji_symbol.textContent = kanji_list.kanji[i].char;

		card_front.appendChild(kanji_symbol);

		// create back face of the card
		let card_back = document.createElement('div');
		card_back.className = 'flip-card-back';

		let meaning = document.createElement('p');
		let onyomi = document.createElement('p');
		let kunyomi = document.createElement('p');
		let vocab = document.createElement('p');

		meaning.textContent = kanji_list.kanji[i].meaning;
		onyomi.textContent = 'on : ' + kanji_list.kanji[i].on;
		kunyomi.textContent = 'kun : ' + kanji_list.kanji[i].kun;

		card_back.appendChild(meaning);
		card_back.appendChild(onyomi);
		card_back.appendChild(kunyomi);
		card_back.appendChild(vocab);

		// add faces to the card
		card_inner.appendChild(card_front);
		card_inner.appendChild(card_back);

		card.appendChild(card_inner);

		// add card to the container
		jlpt_container.appendChild(card);
	}
}

/***********************
	Quizz management
***********************/

//récupère le bouton de confirmation du quizz
let quizz_generator_btn = document.querySelector('button#quizz-generator');
//récupère le div correspondant au quizz 
let quizz_container = document.getElementById('quizz-container');
//récupère la section, onglet contenant le quizz
let quizz_section = document.getElementById('quizz-content');

quizz_generator_btn.addEventListener('click', e => {
	let level = getQuizzLevel(document.getElementsByName('quizz-level'));
	//console.log(level);
	let nb_kanji = getQuizzKanjiNumber(document.getElementsByName('quizz-nb'));
	//console.log(nb_kanji);
	let answer_type = new String(getAnswerType(document.getElementsByName('quizz-type')));
	//console.log(answer_type.toString());

	setQuizzKanji(level, nb_kanji, answer_type);
});

/*
	getQuizzLevel(level_list);
	return Integer the quizz level selected by user
	param: level_list list of possible levels
*/
function getQuizzLevel(level_list) {
	for (var i = 0; i < level_list.length; i++) {
		if (level_list[i].checked) {
			return parseInt(level_list[i].id.substring(6));
		}
	}
}

/*
	getQuizzKanjiNumber(nb_kanji_list);
	return Integer the quizz number of kanji selected by user
	param: nb_kanji_list list of possible levels
*/
function getQuizzKanjiNumber(nb_kanji_list) {
	for (var i = 0; i <  nb_kanji_list.length; i++) {
		if (nb_kanji_list[i].checked) {
			return parseInt(nb_kanji_list[i].id.substring(3));
		}
	}
}

/*
	getAnswerType(answer_type_list);
	return String the quizz type of answer selected by user
	param: answer_type_list list of possible answer type
*/
function getAnswerType(answer_type_list) {
	for (var i = 0; i < answer_type_list.length; i++) {
		if (answer_type_list[i].checked) {
			return new String(answer_type_list[i].id.substring(6));
		}
	}
}

/*
	getRandomKanjis(list);
	return Array that contains list of random kanji
	param: list of kanjis
*/
function getRandomKanjis(list, nb_kanji) {
	var kanji_list = [];
	for (var i = 0; i < nb_kanji; i++) {
		kanji_list[i] = list.kanji[Math.floor((Math.random() * 100) + 1)]; 
	}
	return kanji_list;
}

/*
	generateQuizz(kanji_list, type_of_response); 
	generate html element for the quizz 
	depending on param : kanji_list
*/
function generateQuizz(kanji_list, type_of_response) {
	var generated_quizz = document.createElement('div');
	generated_quizz.id = 'generated-quizz';

	var cpt = 0;
	var score = 0;

	let question = document.createElement('p');
	question.className = 'kanji-quizz';
	question.id = 'kanji-' + cpt;
	question.textContent = kanji_list[cpt].char;
	//console.log(question);

	let response_input = document.createElement('input');
	response_input.type = 'text';
	response_input.className = 'input-quizz';
	response_input.id = 'input-' + cpt;
	response_input.placeholder = 'your answer';
	//console.log(response_input);

	let submit_answer_btn = document.createElement('button');
	submit_answer_btn.className = 'submit-answer';
	submit_answer_btn.id = 'submit-answer' + cpt;
	submit_answer_btn.type = 'submit';
	submit_answer_btn.innerText = 'next';
	//console.log(submit_answer_btn);

	generated_quizz.appendChild(question);
	generated_quizz.appendChild(response_input);
	generated_quizz.appendChild(submit_answer_btn);

	quizz_section.appendChild(generated_quizz);

	// add on click listener that will store the response
	// and build the answer sheet and score
	submit_answer_btn.addEventListener('click', e => {
		store_answer(response_input, submit_answer_btn, kanji_list, type_of_response);
		// if every questions have been nexted then generate answer sheet
		if (cpt === kanji_list.length-1) {
			generated_quizz.remove();

			let answers_container = document.createElement('div');
			answers_container.className = "answers-container";

			let good_answers = document.createElement('div');
			good_answers.className = 'good-answers';

			let bad_answers = document.createElement('div');
			bad_answers.className = 'bad-answers';

			for (var i = 0; i < kanji_list.length; i++) {
				if (localStorage.getItem('answer-' + i) == localStorage.getItem('correction-' + i)) {
					score++;

					let ga_text = document.createElement('p');
					ga_text.textContent = kanji_list[i].char + ' is correct. You answered: ' +localStorage.getItem('answer-' + i);
					good_answers.appendChild(ga_text);
				} else {
					let ba_text = document.createElement('p');
					ba_text.textContent = kanji_list[i].char + ' is not correct. You answered: ' + localStorage.getItem('answer-' + i) + ', the good answer is: ' + localStorage.getItem('correction-' + i);
					bad_answers.appendChild(ba_text);
				} 
			}

			let score_text = document.createElement('p');
			score_text.className = 'score';
			score_text.textContent = score + '/' + kanji_list.length;

			answers_container.appendChild(good_answers);
			answers_container.appendChild(bad_answers);

			quizz_section.appendChild(answers_container);
			quizz_section.appendChild(score_text);

			localStorage.clear();
		} else {
			cpt++;

			question.id = 'kanji-' + cpt;
			question.textContent = kanji_list[cpt].char;

			response_input.id = 'input-' + cpt;
			response_input.value = '';
			submit_answer_btn.id = 'submit-answer' + cpt;
		}
	});
}

/*
	setQuizzKanji(level, nb_kanji, type_of_response);
	set and manage quizz
*/
function setQuizzKanji(level, nb_kanji, type_of_response) {
	
	var requestKanjiFile = new XMLHttpRequest();

	requestKanjiFile.addEventListener("load", () => {
		let kanji_list = getRandomKanjis(JSON.parse(requestKanjiFile.responseText), nb_kanji);
		console.log(kanji_list);

		quizz_container.remove();
		generateQuizz(kanji_list, type_of_response);
	});

	requestKanjiFile.open("GET", "./kanji-objects/kanji-jlpt"+level+".json", true);
	requestKanjiFile.send();
}

/*
	store_answer(cpt, response_input, kanji_list);
	store answers in local storage
*/
function store_answer(response_input, submit_answer_btn, kanji_list, type_of_response) {
	question_number = submit_answer_btn.id.substring(13);
	localStorage.setItem('answer-' + question_number, response_input.value);

	console.log(type_of_response.toString());
	if (type_of_response.toString() === 'meaning') {
		localStorage.setItem('correction-' + question_number, kanji_list[question_number].meaning);
	}
	if (type_of_response.toString() === 'on') {
		localStorage.setItem('correction-' + question_number, kanji_list[question_number].on);
	}
	if (type_of_response.toString() === 'kun') {
		localStorage.setItem('correction-' + question_number, kanji_list[question_number].kun);
	}

	
}