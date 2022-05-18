/*
TO MAKE MORE SOUNDS THE DEFAULT:
Go to the soundGroups array in setup() and change the checkDefault property to true

TO ADD NEW SOUNDS:
Step 1. Reference the sound files in the loadedSounds array below
Step 2. Create a new soundGroup in the soundGroups object in setup.
The sound list should just use the file names without the '.mp3'
Step 3. Create the checkbox element by copy-pasting the code for
the other checkboxes in index.html. There are 3 spots where you need
to change the name (the id needs to match the name of the soundGroup in soundGroups)
*/
function preload() {

  finishedLoading = false;
  /*Feel free to put line breaks or spaces here;
  they are both treated the same.
  */
  soundsToLoad = `
  door
  dog1 dog2 dog3 dog4
  mindfulness
  chew-apple chew-apple2 chew-chips chew-crunch-and-wet chew-crunch chew-gum chew-noodles-slurp chew-popcorn chew-sandwich chew-spicy-noodle chew-wetonly
  cough-kid cough1 cough2 cough3 cough4
  slurp1 slurp2 slurp3
  sneeze sneeze2
  sniffle1 sniffle2
  snore
  swallow
  throatclear-1 throatclear-2 throatclear-3
  yawn1 yawn2 yawn3
  `
  completeSound = loadSound('complete.mp3')

  //split soundsToLoad by both spaces AND line breaks
  soundsToLoad = soundsToLoad.split(/(?:\n| )+/)
  soundLoadingText = document.getElementById("soundLoadingText")
  loadedSounds = []
  loadedSoundCount = 0;
  for(var i = 0; i < soundsToLoad.length; i ++){
    if(soundsToLoad[i].length > 1){
      loadedSounds.push( new Audio(soundsToLoad[i] + '.mp3', loadedSoundCallback, failLoadCallback) )

      loadedSounds[loadedSounds.length-1].file = soundsToLoad[i] + '.mp3'

    }

  }
  /*loadedSounds = [
    loadSound('door.mp3'),
    loadSound('dog1.mp3'),
    loadSound('dog2.mp3'),
    loadSound('dog3.mp3'),
    loadSound('dog4.mp3'),
    loadSound('300.mp3'),
    loadSound('400.mp3'),
    loadSound('500.mp3'),
    loadSound('600.mp3'),
    loadSound('mindfulness.mp3')
  ]*/

}
function loadedSoundCallback(){
  loadedSoundCount ++;
  soundLoadingText.innerText = 'Loading file ' + loadedSoundCount + '/'+soundsToLoad.length
}
function failLoadCallback(event){
  console.log(event)
}
function removeMP3(m){
  return m.slice(0,-4)
}
function setup() {
  soundLoadingText.hidden = true
  allSounds = [];
  for(var i = 0; i < loadedSounds.length; i ++){
    var soundName = removeMP3(loadedSounds[i].file)
    allSounds[soundName] = loadedSounds[i]
  }
  soundGroups = {
    'mindfulness':{'sounds':'mindfulness','minRTime':0, 'maxRTime':0,'checkDefault':false},
    'door':{'sounds':'door','minRTime':3,'maxRTime':15/*seconds*/,'checkDefault':true},
    'dogs':{'sounds':"dog1 dog2 dog3", 'minRTime':40, 'maxRTime':120,'checkDefault':true},
    'chew':{'sounds':"chew-apple chew-apple2 chew-chips chew-crunch-and-wet chew-crunch chew-gum chew-noodles-slurp chew-popcorn chew-sandwich chew-spicy-noodle chew-wetonly", 'minRTime':8, 'maxRTime':16,'checkDefault':false},
    'cough':{'sounds':"cough-kid cough1 cough2 cough3 cough4", 'minRTime':5, 'maxRTime':10,'checkDefault':true},
    'slurp':{'sounds':"slurp1 slurp2 slurp3", 'minRTime':5, 'maxRTime':10,'checkDefault':false},
    'sneeze':{'sounds':"sneeze sneeze2", 'minRTime':5, 'maxRTime':10,'checkDefault':true},
    'sniffle':{'sounds':"sniffle1 sniffle2", 'minRTime':5, 'maxRTime':10,'checkDefault':true},
    'snore':{'sounds':"snore", 'minRTime':10, 'maxRTime':50,'checkDefault':true},
    'swallow':{'sounds':"swallow", 'minRTime':5, 'maxRTime':10,'checkDefault':false},
    'throatclear':{'sounds':"throatclear-1 throatclear-2 throatclear-3", 'minRTime':5, 'maxRTime':10,'checkDefault':true},
    'yawn':{'sounds':"yawn1 yawn2 yawn3", 'minRTime':15, 'maxRTime':25,'checkDefault':true},

    //'beep':{'sounds':['300','400','500','600'],'minRTime':1,'maxRTime':2,'checkDefault':true}
  }
  for(var i in soundGroups){
    soundGroups[i].lastPlay = 0;
    soundGroups[i].timeToNextPlay = random(soundGroups[i].minRTime, soundGroups[i].maxRTime) * 70 //in frames
    soundGroups[i].checkbox = document.getElementById(i) //use .checked to check if checked
    if(soundGroups[i].checkDefault)soundGroups[i].checkbox.checked = true;
    soundGroups[i].sounds = soundGroups[i].sounds.split(' ')
  }
  if(soundGroups['mindfulness'].checkDefault)allSounds['mindfulness'].play();

  checkAllButton = createButton("All")
  checkAllButton.mouseClicked(clickCheckAll)
  checkDefaultButton = createButton("Default only")
  checkDefaultButton.mouseClicked(clickCheckDefault)
  checkNoneButton = createButton("None")
  checkNoneButton.mouseClicked(clickCheckNone)

  finishedLoading = true;
}

function clickCheckAll(){
  for(var i in soundGroups){
    soundGroups[i].checkbox.checked = true;
  }
}
function clickCheckNone(){
  for(var i in soundGroups){
    soundGroups[i].checkbox.checked = false;
  }
  for(var i in allSounds){
    //allSounds[i].stop();
    allSounds[i].pause();
    allSounds[i].currentTime = 0;
  }
}
function clickCheckDefault(){
  for(var i in soundGroups){
    soundGroups[i].checkbox.checked = soundGroups[i].checkDefault;
  }
}
function myCheckedEvent(id){
  if(finishedLoading){
    if(id.id == 'mindfulness' && id.checked){
      allSounds['mindfulness'].play();
    }
    if(id.id == 'mindfulness' && !id.checked){
      //allSounds['mindfulness'].stop();
      allSounds['mindfulness'].pause();
      allSounds['mindfulness'].currentTime = 0;
    }
    if(id.id != 'mindfulness' && !id.checked){
      //if user has unchecked any sound group, stop all sounds from that group.
      var soundsToStop = soundGroups[id.id].sounds
      for(var i = 0; i < soundsToStop.length; i ++){
        //allSounds[soundsToStop[i]].stop();
        allSounds[soundsToStop[i]].pause();
        allSounds[soundsToStop[i]].currentTime = 0;
      }
    }
  }
}

function draw() {
  for(var i in soundGroups){
    var g = soundGroups[i]
    if(g.checkbox.checked && frameCount > g.lastPlay + g.timeToNextPlay && i !== 'mindfulness'){
      //if this sound is enabled and it's time to play this sound...
      //choose a random sound in this sound group to play
      var rsound = floor(random(g.sounds.length))
      allSounds[g.sounds[rsound]].play();
      g.lastPlay = frameCount;
      g.timeToNextPlay = random(g.minRTime, g.maxRTime) * 70
    }
    //don't do anything if the mindfulness box is checked;
    //this is handled by the checkbox click event
  }
  //no p5 canvas. very cool
}





// Set the date we're counting down to
var countDownDate = Date.parse("t + 5 minutes").getTime();

// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById("demo").innerHTML = days + "d " + hours + "h "
  + minutes + "m " + seconds + "s ";

  // If the count down is finished, write some text
  if (distance < 0 && distance > -2000) {
    clearInterval(x);
    document.getElementById("demo").innerHTML = "EXPIRED";
    completeSound.play();
    clickCheckNone();
  }
}, 1000);
