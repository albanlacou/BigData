// process.argv[2] - Récupère les arguments
let args = process.argv;
let fs = require('fs');



if(args[2] == '-help'){
  console.log("\nThanks for typing help, check out the usage : \n use -action sort_date <input> <output> \n use -action transform <input> <output> \n use -action sort_titre <input> <output> \n use -action search_date <input> <year> <sorted (true or false)> \n use -action search_key_word <input> <key_word> <genre>\n");
} else if (args[2] == "-action"){
  switch(args[3]){
    case "transform":
      let start = new Date();
      transformFile(args[4],args[5]);
      let end = new Date();
      console.log("Duration = " + (end - start) + "ms");
      break;
    case "sort_date":
      break;
    case "sort_title":
      break;
    case "search_date":
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
    let year = a.getFullYear()
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
  console.log('Saved!');
}

function writeToFile(toWrite, output){
  let writable = JSON.stringify(toWrite);
  fs.appendFileSync(output,writable);
}
