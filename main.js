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

