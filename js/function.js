var timer;

// function keyUpDelay(callback, ms){
//   //  var timer = 0;
//     clearTimeout (timer);
//     timer = setTimeout(callback, ms);
// };

var keyUpDelay = (function () {
  var timer = 0;
  return function (callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

function matchSearch(xmlDoc) {
  var input, filter, table, tr, td, i;
  input = document.getElementById("searchBar");
  filter = input.value.toUpperCase();
  table = document.getElementById("cdTable");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      }
      else {
        tr[i].style.display = "none";
      }
    }
  }

  // find how many row are visible
  var visble_count = 0;
  var visble_index;
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      if (tr[i].style.display == "") {
        visble_count++;
        visble_index = i;
      }
    }
  }
  console.log(visble_count);
  // if only one row is visible, than update the datasheet
  if (visble_count == 1) {
    var xml_index = findCompIndex(table.rows[visble_index].cells[0].innerHTML, xmlDoc);
    updateCompData(table.rows[visble_index].cells[0].innerHTML, xmlDoc);
    console.log(table.rows[visble_index].cells[0].innerHTML);
  }
  else
    clearCompData();
}

function loadXmlFile(xmlPath) {
  if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  }
  else {// code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.open("GET", xmlPath, false);
  xmlhttp.send();
  xmlDoc = xmlhttp.responseXML;
  return xmlDoc;
}

function drawTable(xmlDoc) {
  document.write('<tr class="header">');
  document.write('<th style="width:40%;">CODE</th>');
  document.write('<th style="width:20%;">NO.</th>');
  document.write('<th style="width:40%;">NAME</th>');

  var x = xmlDoc.getElementsByTagName("COMPONENT");
  for (i = 0; i < x.length; i++) {
    document.write('<tr>');

    document.write('<td>');
    document.write(x[i].getElementsByTagName("CODE")[0].childNodes[0].nodeValue);
    document.write('</td>');

    document.write('<td>');
    // document.write('<a href="http://www.google.com/" style="text-decoration:none;">');
    document.write(x[i].getElementsByTagName("NO")[0].childNodes[0].nodeValue);
    // document.write('</a>');
    document.write('</td>');

    document.write('<td>');
    document.write(x[i].getElementsByTagName("NAME")[0].childNodes[0].nodeValue);
    document.write('</td>');

    document.write('</tr>');
  }
  document.write('</tr>');
}

function findCompIndex(code, xmlDoc) {
  var index;
  var match_cout = 0;
  var x = xmlDoc.getElementsByTagName("COMPONENT");
  for (i = 0; i < x.length; i++) {
    if (x[i].getElementsByTagName("CODE")[0].childNodes[0].nodeValue == code) {
      match_cout++;
      index = i;
    }
  }
  if (match_cout == 1)
    return index;
  else if (match_cout == 0)
    return -1;
  else {
    alert("error: multiple matching!");
    return -1;
  }
}

function updateCompData(code, xmlDoc) {
  // alert(tableRow.cells[0].innerHTML);
  // document.getElementById("compImg").src = './data/KVA-datasheets/B1/basin_B1_pic.PNG';
  var index = findCompIndex(code, xmlDoc);
  var x = xmlDoc.getElementsByTagName("COMPONENT");

  if (index != -1) {
    document.getElementById("compImg").src = "./data/" + x[index].getElementsByTagName("PICTURE")[0].childNodes[0].nodeValue;
    document.getElementById("compName").innerText = x[index].getElementsByTagName("NO")[0].childNodes[0].nodeValue + "  " +
      x[index].getElementsByTagName("NAME")[0].childNodes[0].nodeValue;
  }
  else
    clearCompData();
}

function clearCompData() {
  document.getElementById("compImg").src = "";
  document.getElementById("compName").innerText = "No matching.";
}

function addTableOnClickEven(table, xmlDoc) {
  if (table != null) {
    for (var i = 0; i < table.rows.length; i++) {
      table.rows[i].onclick = function () {
        var code = this.cells[0].innerHTML;
        updateCompData(code, xmlDoc);
      };
      // for (var j = 0; j < table.rows[i].cells.length; j++);
    }
  }
}

function sortTable() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("cdTable");
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("tr");
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("td")[0];
      y = rows[i + 1].getElementsByTagName("td")[0];
      //check if the two rows should switch place:
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function loadCompImg() {
  document.getElementById("compImg").src = './data/KVA-datasheets/B1/basin_B1_pic.PNG';
}
