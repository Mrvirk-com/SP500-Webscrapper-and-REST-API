let url = 'https://en.wikipedia.org/w/api.php?action=parse&format=json&origin=*&page=List_of_S%26P_500_companies';
let tables;
let sp500_JSON = [];

fetch(url)
  .then(function (response) {
    return response.json();
  })
  .then(function (response) {
    html_code = response["parse"]["text"]["*"];
    parser = new DOMParser();
    html = parser.parseFromString(html_code, "text/html");
    tables = html.querySelectorAll(".wikitable");

    //Provides a list of all S&P 500 Company Tickers
    let tickers = tables[0];

    //individual ticker - need to loop through 500 times at least
    let i;
    for (i = 1; i < tickers.rows.length; i++) {
      let ticker = tickers.rows.item(i);

      parseTickerInformation(ticker);
    }
    quick(sp500_JSON);
    createList(sp500_JSON);

  });

//get the core info about the company
function parseTickerInformation(ticker) {
  let name = ticker.cells[1].innerText;
  let symbol = ticker.cells[0].innerText.trim();
  let exchange = ((ticker.cells[0].innerHTML).includes("nasdaq")) ? "NASDAQ" : "NYSE";
  let industry = ticker.cells[3].innerText;
  let sector = ticker.cells[2].innerText;
  let founded = ticker.cells[7].innerText.trim();
  let headquarters = ticker.cells[4].innerText;
  let date_first_added = ticker.cells[5].innerText;
  let cik = ticker.cells[6].innerText;
  let sec_filings = "https://www.sec.gov/cgi-bin/browse-edgar?CIK=" + symbol + "&action=getcompany";
  let exchange_profile = (exchange.includes("NASDAQ")) ? "https://www.nasdaq.com/market-activity/stocks/" + symbol : "https://www.nyse.com/quote/XNYS:" + symbol;
  let yahoo_finance_profile = "https://finance.yahoo.com/quote/" + symbol;
  let dividends = "https://seekingalpha.com/symbol/" + symbol + "/dividends";

  let company = {
    "Name": name,
    "Symbol": symbol,
    "Exchange": exchange,
    "Industry": industry,
    "Sector": sector,
    "Founded": founded,
    "Headquarters": headquarters,
    "date_first_added": date_first_added,
    "cik": cik,
    "sec_filings": sec_filings,
    "exchange_profile": exchange_profile,
    "yahoo_finance_profile": yahoo_finance_profile,
    "dividends": dividends
  };

  sp500_JSON.push(company);
}

function createList(data) {
  let list = document.getElementById("companiesList");

  let i;
  for (i = 0; i < data.length; i++) {
    var contentDiv = document.createElement('div');

    for (var key in data[i]) {
      let div = document.createElement('div');

      if (key == "Name") {
        div.innerHTML = "Company:" + "<a href =" + data[i].yahoo_finance_profile + " class='companyLinks' target='_blank'>" + data[i][key] + "</a>";
      } else if (key == "sec_filings") {
        div.innerHTML = "<a href =" + data[i][key] + " class='companyLinks' target='_blank' rel='nofollow'>SEC Filings</a>";
      } else if (key == "exchange_profile") {
        div.innerHTML = "<a href =" + data[i][key] + " class='companyLinks' target='_blank' rel='nofollow'>Exchange Profile</a>";
      } else if (key == "yahoo_finance_profile") {
        div.innerHTML = "<a href =" + data[i][key] + " class='companyLinks' target='_blank' rel='nofollow'>Yahoo Finance Profile</a>";
      } else if (key == "dividends") {
        div.innerHTML = "<a href =" + data[i][key] + " class='companyLinks' target='_blank' rel='nofollow'>Dividend Information</a>";
      } else if (key == "date_first_added") {
        div.innerHTML = "Included on: " + data[i][key];
      } else {
        div.innerHTML = key + ": " + data[i][key];
      }

      contentDiv.appendChild(div);
      div.className = "infoDivs " + key;
    }

    var listItem = document.createElement('li');
    listItem.appendChild(contentDiv);
    contentDiv.className = "contentDiv";
    list.appendChild(listItem);
    listItem.style.class = 'listItem';
  }
}

let searchInput = document.getElementById("search");
searchInput.addEventListener('keyup', search);

/**
let searchBySymbolInput = document.getElementById("searchBySymbol");
searchBySymbolInput.addEventListener('keyup', searchBySymbol);
**/

function search() {
  let list = document.getElementById("companiesList");
  let searchValue = searchInput.value.toLowerCase();
  let listItems = list.querySelectorAll('li');

  let i;
  for (i = 0; i < listItems.length; i++) {
    let match = listItems[i].innerHTML.toLowerCase().indexOf(searchValue);
    if (match > -1) {
      listItems[i].style.display = '';
    } else {
      listItems[i].style.display = 'none';
    }
  }
}


function lazyLoad() {
  var w = window.innerWidth;
  var h = window.innerHeight;
}

/**
function searchBySymbol() {
  let list = document.getElementById("companiesList");
  let searchValue = searchBySymbolInput.value.toLowerCase();
  let listItems = list.querySelectorAll('li');
  let symbol = list.querySelectorAll('.symbol');
  let i;
  for (i = 0; i < listItems.length; i++) {
    let match = symbol[0].innerHTML.toLowerCase().indexOf(searchValue);
    if (match > -1) {
      listItems[i].style.display = '';
      quick("yes");
    } else {
      listItems[i].style.display = 'none';
      quick("no");
    }
  }
}
**/

//quick console
function quick(input) {
  console.log(input);
}

/*
Help docs:
https://stackoverflow.com/questions/53127383/how-to-pull-data-from-wikipedia-page
*/