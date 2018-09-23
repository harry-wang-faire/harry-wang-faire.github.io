

var link = "https://api.github.com/search/repositories?q=";
// Tried to use Github v4 but not able to do so
// var link = 'https://api.github.com/graphql';
// var query =
//   {
//   "query": "query SearchMostTop10Star($queryString: String!) { " +
//     "search(query: $queryString, type: REPOSITORY, first: 10) { " +
//     "repositoryCount " +
//     "edges {" +
//     "node {" +
//     "... on Repository {" +
//     "name" +
//     "descriptionHTML" +
//     "stargazers {" +
//     "totalCount" +
//     "}" +
//     "forks {" +
//     "totalCount" +
//     "}" +
//     "updatedAt } } } } }"
// }

var data = [];
var fav = new Set();
class repo{
  constructor(author_repo,language){
    this.author_repo = author_repo;
    this.language = language;
  }
}

var res_table = document.getElementById('result-table');
var fav_table = document.getElementById('fav-table');

function parseData() {
    for (let i = 0; i < data.length; i++){
      var row = res_table.insertRow(i+1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var temp = new repo(data[i].owner.login + '/' + data[i].name,data[i].language);
      cell1.innerHTML = temp.author_repo;
      cell2.innerHTML = temp.language;

        cell4.innerHTML = "<a class='add_button'> add </a>";

      for (let i = 0; i < fav_table.rows.length; i++){
        if (fav_table.rows[i].cells[0].innerHTML == cell1.innerHTML &&
          fav_table.rows[i].cells[1].innerHTML == cell2.innerHTML){
          cell4.style.display="none";
        }
      }

         cell4.onclick=function () {

          var row = fav_table.insertRow(fav_table.length);
          var rindex = this.parentElement.rowIndex;
          var t = new repo(res_table.rows[rindex].cells[0].innerHTML, res_table.rows[rindex].cells[1].innerHTML);
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          var cell3 = row.insertCell(2);
          var cell4 = row.insertCell(3);
          cell1.innerHTML = res_table.rows[rindex].cells[0].innerHTML;
          cell2.innerHTML = res_table.rows[rindex].cells[1].innerHTML;
          cell3.innerHTML = res_table.rows[rindex].cells[2].innerHTML;
          cell4.innerHTML = "<a class='add_button'> Remove </a>";
          res_table.rows[rindex].cells[3].style.display = "none";
          cell4.onclick=function () {
            var rindex = this.parentElement.rowIndex;
            //make the list visibility as true if it is in first list;
            for (let i = 0; i < res_table.rows.length; i++){
              if (res_table.rows[i].cells[0].innerHTML == cell1.innerHTML &&
                  res_table.rows[i].cells[1].innerHTML == cell2.innerHTML){
                res_table.rows[i].cells[3].style.display = "inline";
              }
            }
            // Remove this from the second list
            this.parentElement.parentElement.removeChild(this.parentElement);
          }
        }
      }

}


function doSearch() {
  $("#result-table").find("tr:not(:nth-child(1))").remove();
  data = [];
  var textbox = document.getElementById('search-input');
  var input = textbox.value;
  var reminder = document.getElementById('reminder');
  if (input == ""){
    textbox.style.borderColor = "red";
    reminder.style.display = "inline";
    return;
  }
  var templink = link + input;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', templink, true);
  xhr.send();
  xhr.addEventListener("readystatechange", processRequest, false);

  function processRequest(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {

      var response = JSON.parse(xhr.responseText);
      for (let i = 0; i < 10 && i < response.items.length; i++){
        data[i]=response.items[i];
      }
      parseData();
      //console.log(response)
    }
  }
}

