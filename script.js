const search = document.getElementById('searchBox');
const submitBtn = document.getElementById('submit');
const otputField = document.getElementById('outputField');



function searchWord(){
  otputField.style.display = 'block';

  var word = document.getElementById('word');
  var definition= document.getElementById('definition');
  var example = document.getElementById('example');
  var synonym = document.getElementById('synonym');
  var spelling = document.getElementById('spelling');
  var sound = document.getElementById('sound');

  var inputWord = search.value;
  var api = 'https://api.wordnik.com/v4/word.json/';
  var key = 'ag99rn7f4gdd82rlrrcxdd1p6yaxw6hbogitsadptvg5221d8';

if(inputWord){
  Promise.all([
    fetch(`${api}${inputWord.trim()}/definitions?limit=10&api_key=${key}`),
    fetch(`${api}${inputWord.trim()}/examples?includeDuplicates=false&useCanonical=false&limit=10&api_key=${key}`),
    fetch(`${api}${inputWord.trim()}/relatedWords?useCanonical=true&relationshipTypes=synonym&limitPerRelationshipType=10&api_key=${key}`),
    fetch(`${api}${inputWord.trim()}/audio?useCanonical=false&limit=10&api_key=${key}`)
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

      } else {

        word.innerHTML = data[0][i].word;
        definition.innerHTML = data[0][i].text;
        example.innerHTML = data[1].examples[i].text;

        let list = data[2][0].words
        synonym.innerHTML = list.map(line=>
          `<ul>
          <li>${line}</li>
          </ul>
          `
        ).join('');
        console.log(list);
        console.log(data[0][i].text);
        sound.src = data[3][0].fileUrl;
      
      } 

    //Clear search text
    search.value = '';

    console.log(data);
  })
  .catch(function (error) {
    console.log(error);
  })
} else {
        alert('Please enter a search word');
      }
};


submitBtn.addEventListener('click', searchWord);