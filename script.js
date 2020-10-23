const search = document.getElementById('searchBox');
const submitBtn = document.getElementById('submit');
const otputField = document.getElementById('outputField');



function searchWord(){
  otputField.style.display = 'block';

  var word = document.getElementById('word');
  var speech = document.getElementById('speech');
  var definition= document.getElementById('definition');
  var example = document.getElementById('example');
  var synonym = document.getElementById('synonym');
  var spelling = document.getElementById('spelling');
  var sound = document.getElementById('sound');

  var inputWord = search.value.trim().toLowerCase();
  var api = 'https://api.wordnik.com/v4/word.json/';
  var key = 'ag99rn7f4gdd82rlrrcxdd1p6yaxw6hbogitsadptvg5221d8';

if(inputWord){

  Promise.all([

    fetch(`${api}${inputWord}/definitions?limit=10&includeRelated=true&sourceDictionaries=all&useCanonical=true&includeTags=false&api_key=${key}`),
    fetch(`${api}${inputWord}/examples?includeDuplicates=false&useCanonical=true&limit=10&api_key=${key}`),
    fetch(`${api}${inputWord}/relatedWords?useCanonical=true&relationshipTypes=synonym&limitPerRelationshipType=10&api_key=${key}`),
    fetch(`${api}${inputWord}/audio?useCanonical=true&limit=10&api_key=${key}`)
    ])
  .then(function (responses) {
    return Promise.all(responses.map(function (response) {
      return response.json();
    }));
  })
  .then(function (data){
    var i = Math.floor(Math.random()*9);
      
      if(data[0].statusCode === 404) {

        alert('No such word!');
        word.innerHTML = inputWord;
        definition.innerHTML = '';
        example.innerHTML = '';
        synonym.innerHTML = '';
        search.value = '';
        speech.innerHTML = '';
      } else {
        word.innerHTML = data[0][i].word;

        //Choosing correct article before part of speech
        var vowelRegex = '^[aeiou].*i';
        if (data[0][i].partOfSpeech){
          var partSpeech = data[0][i].partOfSpeech;
        partSpeech.match(vowelRegex) ? speech.innerHTML = `(an ${partSpeech})` : speech.innerHTML = `(a ${partSpeech})`;
        } else {
          speech.innerHTML = '';
        }
        
        if (data[0][i].text){
          definition.innerHTML = data[0][i].text
        } else {
          definition.innerHTML = 'Not Found'
        }

        example.innerHTML = data[1].examples[i].text;

        data[2].statusCode === 404 ? synonym.innerHTML = 'No synonyms' : synonym.innerHTML = data[2][0].words.map(line=> `<li>${line}</li>`
          ).join('');

        data[3].statusCode === 404 ? sound.src = '' : sound.src = data[3][0].fileUrl;

        //Clear search text
        search.value = '';
      } 

    console.log(data);
  })
  .catch(function (error) {
    console.log(error);
  })
} else {
        alert('Please enter a search word');
        otputField.style.display = 'none';
      }
};


submitBtn.addEventListener('click', searchWord);