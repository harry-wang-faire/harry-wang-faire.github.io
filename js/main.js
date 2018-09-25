
var token = "510"+"0"+"f10b269c4020"+"cc40052f5f4e"+"18e98f23e243";
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


function getTags(url) {
  return new Promise(function (resolve,reject){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader("Authorization","token "+token);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();

  });
}


function getLink(url) {
  return new Promise(function (resolve,reject){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader("Authorization","token d837e1f334492bebdbd90f1701396f9db718b30c")
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();

  });
}

async function parseData() {
  console.log(data[1]);
    for (let i = 0; i < data.length; i++){
      var row = res_table.insertRow(i+1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);

      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var temp = new repo(data[i].owner.login + '/' + data[i].name,data[i].language);
      cell1.innerHTML = temp.author_repo;
      cell2.innerHTML = temp.language;

      // get tags from tags url
      try {
      var tags = JSON.parse(await getTags(data[i].tags_url));
      if (tags.length > 0){
        cell3.innerHTML = tags[0].name;
      }else{
        cell3.innerHTML = '-';
      }
      } catch (err) {
        cell3.innerHTML = '-';
        console.log("You have reach the limit of using github api, please try again later");
      }

      // get link from link url
      try {
        var res = JSON.parse(await getTags(data[i].url));
        var link = res.html_url;
        console.log(link);
        cell1.innerHTML = "<a class ='names' href="+ link +">" + temp.author_repo +"</a>";
      } catch (err) {
        console.log("You have reach the limit of using github api, please try again later");
      }




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
          cell1.style.align
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
  var reminder = document.getElementById('reminder');
  var textbox = document.getElementById('search-input');
  var input = textbox.value;
  if (input == ""){
    textbox.style.borderColor = "red";
    reminder.style.display = "inline";
    return;
  }
  $("#result-table").find("tr:not(:nth-child(1))").remove();
  data = [];


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

