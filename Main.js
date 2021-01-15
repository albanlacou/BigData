const { exception } = require('console');
const fs = require('fs');
const request = require('request');
const download = (url, path, callback) => {
  request.head(url,(err,res,body) => {
    request(url)
    .pipe(fs.createWriteStream(path))
    .on('close',callback)
  })
}

let args = process.argv;
let movies = require('./movies.json');
let start = new Date();
let haveToDownload = false;
let folderToDownload;



// STORY 1 ---------------------------------------------------------------------------------------------------

// STORY 1 ---------------------------------------------------------------------------------------------------

// STORY 1 ---------------------------------------------------------------------------------------------------

if (args.includes('-save')){
  let saveIndex = args.indexOf('-save');
  if(args[saveIndex + 1] == undefined){
      console.log("Missing Arguments");
  } else{
    if(!(fs.existsSync(args[saveIndex+1]))){
      fs.mkdir(args[saveIndex+1], callback => {
        console.log("The folder doesn't exist, creation of a new folder!")
      });
    }
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

// STORY 1 ---------------------------------------------------------------------------------------------------


// STORY 2 ---------------------------------------------------------------------------------------------------
// STORY 2 ---------------------------------------------------------------------------------------------------
// STORY 2 ---------------------------------------------------------------------------------------------------

  function transformFile(input, output){
    /**
     * transform file convert millisecond time in a folder input and display it in a output folder
     * @input : input file
     * @output : output file 
     */
    let file = require("./" + input);
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
    console.log('Saved!');
  }

// STORY 2 ---------------------------------------------------------------------------------------------------

// STORY 4 ---------------------------------------------------------------------------------------------------

function sortArrayByDate(input,output){
  /**
   * sortArrayByDate sorting all the date in an input folder and save into an output folder.
   * @input : input file
   * @output : output file
   */
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

function tri_alphabetique(input, output) {
  /**
   * tri_alphabetique get a folder in input and output a folder sorted by alphabetical sort
   * @input : input file
   * @output : output file
   */
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

// STORY 4 ---------------------------------------------------------------------------------------------------

// STORY 4 => 5 ---------------------------------------------------------------------------------------------------

// STORY 5 ---------------------------------------------------------------------------------------------------

function searchDate(input,year,sorted,folder = undefined){
  /**
   * searchDate return an sorted array by date like ask as input
   * @input : input file
   * @year : year to search
   * @sorted : true or false, depends if array is sorted or not
   * @folder : optional parameter for saving posters
   */
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
  }
  return date_array;
}

// STORY 5 ---------------------------------------------------------------------------------------------------

// STORY 5 => 6 ---------------------------------------------------------------------------------------------------

// STORY 6 ---------------------------------------------------------------------------------------------------

function searchKeyWord(input,genre,word,folder = undefined){
  /**
   * display in a console a movie with specified date,genre,Keyword in overview
   * @input :the path where the file is
   * @genre : genre of the movie
   * @word : the key word to search in the overview
   * @folder : folder to save posters
   */
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

// STORY 6 ---------------------------------------------------------------------------------------------------

// STORY 6 => 7 ---------------------------------------------------------------------------------------------------

// STORY 7 ---------------------------------------------------------------------------------------------------

function downloadImages(url, folder, filename){
  /**
   * downloadImages download an image at the url in parameter and save them in a folder
   * @url : url where the image is
   * @folder : folder where the image is download
   * @filename : the filename where the image will be download
   */
  download(url,folder + '/' + filename + '.png',() => {
  console.log('Done');
  })
}

// OTHERS FUNCTIONS -----------------------------------------------------------------------------------------------

function timeConverter(timestamp){
  /**
     * convert time to a year (for example : 1553299200 = 2019)
     * @timestamp : timestamp to convert into year
     */
    let a = new Date(timestamp * 1000);
    let year = a.getFullYear();
    return year;
  }

  // ------

  function sortedArray(file,year, first, last){
    /**
     * sortArray sorting all the date in an input folder.
     * @file : file to sort
     * @year : year 
     * @first : first index of the file
     * @last : last index of the file
     */
    let middle = Math.ceil((first + last) / 2);
    if(first < last){
      if(timeConverter(file[middle].release_date) == year){
        console.log(file[middle].title);
      }
      sortedArray(file,year,first,middle-1);
      sortedArray(file,year,middle+1,last);
    }
  }

  // ------

  function swap(tab,from,to){
    /**
     * swap get to value in a array and swap them
     * @tab : array
     * @from : first variable to switch
     * @to : second variable to switch with the first one 
     */
    let tmp = tab[to];
    tab[to]= tab[from];
    tab[from] = tmp;
  }

  // ------

  function writeToFile(toWrite, output){
    /**
       * write data into an output file
       * @toWrite : data that as to be writen in the output file
       * @output : output file 
       */
    let writable = JSON.stringify(toWrite,null,"\t");
    fs.appendFileSync(output,writable);
  }

  // ------

  function sortArray(input){
    /**
     * sortArray sorting all the date in an input folder.
     * @input : input file
     */
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

  // END
  // Closing the app with the timer

let end = new Date();
console.log('\x1b[32m%s\x1b[0m', "Duration = " + (end - start) + "ms");