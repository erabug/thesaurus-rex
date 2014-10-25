//Thesaurus service provided by words.bighugelabs.com
function d3Func() {

    var fill = d3.scale.category20();
    var width = 700;
    var height = 400;

    d3.layout.cloud().size([width, height])
        .words(wordList.map(function(d) {
          return {text: d, size: 14 + Math.random() * 60}; // normally 90
        }))
        .padding(5)
        .rotate(function() {
          x = Math.floor(Math.random() * 2) * 30;
          if (Math.floor(Math.random() * 2) == 1) {
            return -x;
          } else {
            return x;
          }
          // return ~~(Math.random() * 2) * 90;
        })
        .font("Verdana")
        .fontSize(function(d) { return d.size; })
        .on("end", draw)
        .start();

    function draw(words) {
      d3.select("#word-cloud").append("svg")
          .attr("width", width)
          .attr("height", height)
        .append("g")
          .attr("transform", "translate(350,200)") //transform by half width and height
        .selectAll("text")
          .data(words)
        .enter().append("text")
          .style("font-size", function(d) { return d.size + "px"; })
          .style("font-family", "Gloria Hallelujah")
          .style("fill", function(d, i) { return fill(i); })
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; });
    } // ends draw func
  } // ends d3Func func

// on page load, clear input text and svg
$("input#phrase").val('');
$('svg').remove();
var counter;
var wordList;

$('#trex').click(function(event) {
  console.log('clicky');
  $('.secret').toggleClass('hidden');
});

// click handler
$('button#submit-phrase').click(function(event) {

  event.preventDefault();
  APIKEY = 'a411a7a6e033f2fb104095e37c87325a';
  
  // grab the phrase, split it up
  var phrase = $('input#phrase').val();
  var words = phrase.replace('.', '').split(' ');
  
  // reset all the things
  counter = 0;
  wordList = [];
  $("input#phrase").val('');
  $('h2').html(phrase);
  $('svg').remove();

  // iterate through the word list, populating wordList
  words.forEach(function(word, i) {
    console.log('word:', word);

    $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      url: 'http://words.bighugelabs.com/api/2/' + APIKEY + '/' + word + '/json',

      success: function(json) {
        Object.keys(json).forEach(function(pos) { // for each part of speech in the obj
          Object.keys(json[pos]).forEach(function(type) { // for each type of each part of speech
            if (type != 'ant') {
              json[pos][type].forEach(function(word) { // for each word in the type of part of speech
                if (wordList.indexOf(word) == -1) { // if the word is not already in wordList
                  wordList.push(word);
                }
              });
            }
          });
        });
        counter ++;
        if (counter == words.length) {
          console.log(wordList);
          d3Func();
        }
      },

      error: function(x) {
        console.log(wordList);
        console.log('\'' + word + '\' threw an error!');
        counter ++;
      }

    });

  });

});
