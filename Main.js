// process.argv[2] - Récupère les arguments
let args = process.argv;
const { exception } = require('console');
let fs = require('fs');



if(args[2] == '-help'){
  console.log("\nThanks for typing help, check out the usage : \n use -action sort_date <input> <output> \n use -action transform <input> <output> \n use -action sort_titre <input> <output> \n use -action search_date <input> <year> <sorted (true or false)> \n use -action search_key_word <input> <key_word> <genre>\n");
} else if (args[2] == "-action"){
  switch(args[3]){
    case "transform":
        let Tstart = new Date();
        transformFile(args[4],args[5]);
        let Tend = new Date();
        console.log("Duration = " + (Tend - Tstart) + "ms");
        break;
    case "sort_date":
      let SDstart = new Date();
      sortArrayByDate(args[4], args[5]);
      let SDend = new Date();
      console.log("Duration = " + (SDend - SDstart) + "ms");
      break;
    case "sort_title":
      break;
    case "search_date":
      let S_Dstart = new Date();
      searchDate(args[4],args[5],args[6]);
      let S_Dend = new Date();
      console.log("Duration = " + (S_Dend - S_Dstart) + "ms");
      break;
    case "search_key_word":
      break;
  }
} else {
  console.log("Error \n Please type -help to see availables commands")
}

// console.log(movies);

function timeConverter(timestamp){
    let a = new Date(timestamp * 1000);
    let year = a.getFullYear();
    return year;
  }

function transformFile(input, output){
  let file = require("./" + input);
  let allMovies = [];
  for(let i = 0;i< file.length;i++){
    let timestamp_date = {"title": file[i].title +" ("+timeConverter(file[i].release_date)+")"};
    allMovies.push(timestamp_date)
  }
  writeToFile(allMovies,output);
  console.log('Everything Saved!');
}

function writeToFile(toWrite, output){
  let writable = JSON.stringify(toWrite,null,"\t");
  fs.appendFileSync(output,writable);
}

function sortArrayByDate(input,output){
  let file = require("./" + input);
  let tempo = 0;
  for(let i = 0; i < file.length; i++){ 
    for(let j = i+1; j < file.length; j++){ // pour j allant de i+1 à tab.length
      if(file[j].release_date < file[i].release_date){
          tempo = file[i];
          file[i] = file[j];
          file[j] = tempo;
      }
    }
  }
  writeToFile(file,output);
  console.log("Saved")
}

function searchDate(input, year, sorted){
  let file = require("./" + input);
  let dates = [];
  if(sorted == "true"){
    for(let j = 0;j<file.length;j++){
      dates.push(timeConverter(file[j].release_date));
    }
    let sorted_array = tri_rapide(dates,0,dates.length-1);
    console.log(searchBinaire(parseInt(year),sorted_array,0,sorted_array.length));

  } else {
    for(let i=0;i<file.length;i++){
      let date = timeConverter(file[i].release_date);
      if(date == year){
        let donnee = file[i].title + " : " + "(" +date+")";
        console.log(donnee);
      }
    }
  }
}

function tri_alphabetique() {
  let start = new Date();
  let array = require('./movies.json')
  let array2 = []
  array2 = array
  console.log(array2[0].title[0])
  
  for (let j = array2.length-1; j > 1; j--) {
      for (let i = 0; i < (j-1); i++) {
        
          if (array2[j].title[0] < array2[i].title[0]) {
              let temp = array2[j];
              array2[j] = array2[i];
              array2[i] = temp;
          }
      }
  }
  writeToFile(array2,"out.json")
  let end = new Date();
  console.log("Duration = " + (end - start) + "ms");
  return array;
}

function searchBinaire(search, tableau, min, max) {
  let index = Math.floor((min + max) / 2);

  if (search === tableau[index]) {
      return index;
  }
  if (search > tableau[index]) {
      min = index;
      return searchBinaire(search, tableau, min, max);
  }
  else {
      max = index;
      return searchBinaire(search, tableau, min, max);
  }
}

function swap(tab,from,to){
  let tmp = tab[to];
  tab[to]= tab[from];
  tab[from] = tmp;
}
function partitionner(t,premier,dernier,pivot){
  swap(t,pivot,dernier);
  j = premier;
  for(i = premier;i<=dernier-1;i++){
      if( t[i] <= t[dernier]){
          swap(t,i,j)
          j++;
      }
  }
  swap(t,dernier,j)
  return j;
}
function tri_rapide(t,premier, dernier){
  if(premier<dernier){
      let pivot = Math.ceil((premier + dernier) / 2);
      pivot = partitionner(t,premier,dernier,pivot);
      tri_rapide(t,premier, pivot-1);
      tri_rapide(t,pivot+1,dernier);
  }
  return t;
}