// process.argv[2] - Récupère les arguments
let args = process.argv;
const { exception } = require('console');
const fs = require('fs');
const request = require('request');
let movies = require('./movies.json');
let start = new Date();
let haveToDownload = false;
let folderToDownload;

const download = (url, path, callback) => {
  request.head(url,(err,res,body) => {
    request(url)
    .pipe(fs.createWriteStream(path))
    .on('close',callback)
  })
}

if (args.includes('-save')){
  let saveIndex = args.indexOf('-save');
  if(args[saveIndex + 1] == undefined){
      console.log("Missing Arguments");
  } else{
    haveToDownload = true;
    folderToDownload = args[saveIndex + 1];
  }
}
if(args.includes('-help')){
  let index = args.indexOf('-help');
  console.log('\x1b[32m%s\x1b[0m', "\nThanks for typing help, check out the usage : \n use -action sort_date <input> <output> \n use -action transform <input> <output> \n use -action sort_title <input> <output> \n use -action search_date <input> <year> <sorted (true or false)> \n use -action search_key_word <input> <genre> <key_word>\n");
} else if(args.includes('-action')){
  let index = args.indexOf('-action');
  switch(args[index + 1]){
      case "transform":
          if((args[index+2] == undefined || !fs.existsSync(args[index+2])) || args[index + 3] == undefined){
              console.log('Error with arguments');
          } else {
              transformFile(args[index + 2],args[index + 3]);   
          }
          break;
      case "sort_date":
          if((args[index+2] == undefined || !fs.existsSync(args[index+2])) || args[index + 3] == undefined){
              console.log('Error with arguments');
          } else {
              sortArrayByDate(args[index + 2],args[index + 3]);   
          }
          break;
      case "sort_title":
          if((args[index+2] == undefined || !fs.existsSync(args[index+2])) || args[index + 3] == undefined){
              console.log('Error with arguments');
          } else {
              tri_alphabetique(args[index + 2],args[index + 3]);   
          }
          break;
      case "search_date":
          if((args[index+2] == undefined || !fs.existsSync(args[index+2])) || args[index + 3] == undefined || args[index + 4] == undefined){
              console.log('Error with arguments');
          } else {
              searchDate(args[index + 2],args[index + 3],args[index + 4]);
          }
          break;
      case "search_key_word":
          if((args[index+2] == undefined || !fs.existsSync(args[index+2])) || args[index + 3] == undefined || args[index + 4] == undefined){
              console.log('Error with arguments');
          } else {
              searchKeyWord(args[index + 2],args[index + 3],args[index + 4]);
          }
          break;
  }
} else {
  console.log('\x1b[31m%s\x1b[0m', "Error \n", '\x1b[36m' + 'Please type -help to see availables commands'+'\x1b[0m');
}



function timeConverter(timestamp){
    let a = new Date(timestamp * 1000);
    let year = a.getFullYear();
    return year;
  }

  function transformFile(input, output){
    let file = require("./" + input);
    let allMovies = [];
    for(let i = 0;i< file.length;i++){
      let timestamp_date = {"title": file[i].title +" ("+timeConverter(file[i].release_date)+") " , "poster": file[i].poster , "overview": file[i].overview , "genres": file[i].genres};
      allMovies.push(timestamp_date)
    }
    writeToFile(allMovies,output);
    console.log('\x1b[36m%s\x1b[0m', 'Saved!');
  }

function writeToFile(toWrite, output){
  let writable = JSON.stringify(toWrite,null,"\t");
  fs.appendFileSync(output,writable);
}

function sortArrayByDate(input,output){
  let file = require("./" + input);
  let tempo = 0;
  let allMovies = [];
  for(let i = 0; i < file.length; i++){ 
    for(let j = i+1; j < file.length; j++){ // pour j allant de i+1 à tab.length
      if(file[j].release_date < file[i].release_date){
          swap(file,i,j);
      }
    }
    let timestamp_date = {"title": file[i].title +" ("+timeConverter(file[i].release_date)+") " , "poster": file[i].poster , "overview": file[i].overview , "genres": file[i].genres, "release_date":file[i].release_date};
    allMovies.push(timestamp_date)
  }
  writeToFile(allMovies,output);
  console.log('\x1b[36m%s\x1b[0m',"Saved")
}

function sortArray(input){
  let file = input;
  let tempo = 0;
  let allMovies = [];
  for(let i = 0; i < file.length; i++){ 
    for(let j = i+1; j < file.length; j++){ // pour j allant de i+1 à tab.length
      if(file[j].release_date < file[i].release_date){
          swap(file,i,j);
      }
    }
    let timestamp_date = {"title": file[i].title +" ("+timeConverter(file[i].release_date)+") " , "poster": file[i].poster , "overview": file[i].overview , "genres": file[i].genres, "release_date":file[i].release_date};
    allMovies.push(timestamp_date)
  }
  return allMovies[allMovies.length - 1];
}

function searchDate(input,year,sorted,folder = undefined){
  let file = require('./' + input);
  let date_array = [];
  if (sorted == "true"){
    sortedArray(file,year,0,file.length - 1);
  } else {
    let date_array = []
    for(let i=0;i<file.length;i++){
      let date = timeConverter(file[i].release_date);
      if(date == year){
        let donnee = file[i];
        date_array.push(donnee);
        console.log('\x1b[36m%s\x1b[0m', file[i].title);
      }
  }
  return date_array;
  }
  if(haveToDownload){
    downloadImages(date_array.poster,folderToDownload,date_array.title.replace(/[^a-zA-Z0-9]/g, '_'));
  }
}

function sortedArray(file,year, first, last){
  let middle = Math.ceil((first + last) / 2);
  if(first < last){
    if(timeConverter(file[middle].release_date) == year){
      console.log(file[middle].title);
    }
    sortedArray(file,year,first,middle-1);
    sortedArray(file,year,middle+1,last);
  }
}

function tri_alphabetique(input, output) {
  let array = require('./' + input);
  let array2 = [];
  array2 = array;
  console.log(array2[0].title[0]);
  
  for (let j = array2.length-1; j > 1; j--) {
      for (let i = 0; i < (j-1); i++) {
          if (array2[j].title[0] < array2[i].title[0]) {
              let temp = array2[j];
              array2[j] = array2[i];
              array2[i] = temp;
          }
      }
  }
  writeToFile(array2,output);
  return array;
}

function swap(tab,from,to){
  let tmp = tab[to];
  tab[to]= tab[from];
  tab[from] = tmp;
}
// STORY 7

function downloadImages(url, folder, filename){
  download(url,folder + '/' + filename + '.png',() => {
  console.log('Done');
})
}
// downloadImages(movies[1].poster,'./images','poster');

function searchKeyWord(input,genre,word,folder = undefined){
  let file = require('./' + input);
  let temp = [];
  let result = [];
  for(let i = 0; i< file.length;++i){
    if(file[i].genres){
      if(file[i].genres.includes(genre)){
        temp.push(file[i]);
      }
    }
  }
  for(let j = 0; j < temp.length; ++j){
    if(temp[j].overview.includes(word)){
      result.push(temp[j]);
      // console.log(temp[j].title);
    }
  }
  let mostRecent = sortArray(result);
  console.log(mostRecent.title);
  if(haveToDownload){
    downloadImages(mostRecent.poster,folderToDownload,mostRecent.title.replace(/[^a-zA-Z0-9]/g, '_'));
  }
}


// To create folder automatically

/* fs.mkdir('test', callback => {
  console.log("done!")
}); */

let end = new Date();
console.log('\x1b[32m%s\x1b[0m', "Duration = " + (end - start) + "ms");