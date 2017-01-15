var setSong = function(songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
     }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioURL, {
        formats: ['mp3'],
        preload: true
    });
    
    setVolume(currentVolume);
 };
 
 var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };
 
var getSongNumberCell = function(number) {
     return $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function(songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     var $row = $(template);
    
     var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));

        if (currentlyPlayingSongNumber !== null) {
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber !== songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            $(this).html(pauseButtonTemplate);
            
            setSong(songNumber);
            currentSoundFile.play();
            
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === songNumber) {
            if (currentSoundFile.isPaused()) {
                console.log("The sound is paused!");
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
            } else {
                console.log("The sound is playing!");
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();
	        }
        }
     };
    
     var onHover = function(event) {
        var songNumberItem = $(this).find('.song-item-number');
        var songNumber = parseInt($(songNumberItem).attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberItem.html(playButtonTemplate);
        }
     };
     var offHover = function(event) { 
        var songNumberItem = $(this).find('.song-item-number');
        var songNumber = parseInt($(songNumberItem).attr('data-song-number')) ;

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberItem.html(songNumber);
        }
         //console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
     };
    
     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;
 };

var setCurrentAlbum = function(album) {
     currentAlbum = album;
     // select all HTML elements to display
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
     $albumSongList.empty();
 
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};


var nextSong = function() {
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
//ADD SONGS
    currentSongIndex++;
    
    
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    };

    //setSong(songNumber);
    //currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updatePlayerBarSong();
    
// fix the player bar
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberItem = $(getSongNumberCell(currentlyPlayingSongNumber));
    var $lastSongNumberItem = $(getSongNumberCell(lastSongNumber));
    $nextSongNumberItem.html(pauseButtonTemplate);
    $lastSongNumberItem.html(lastSongNumber);
    currentSoundFile.play();
};

var previousSong = function() {  
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
//SUBTRACT SONGS
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    //setSong(songNumber);
    //currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updatePlayerBarSong();

// Fix the player bar
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberItem = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberItem = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
    $previousSongNumberItem.html(pauseButtonTemplate);
    $lastSongNumberItem.html(lastSongNumber); 
};

//PLAYING/PAUSING SONGS FROM PLAYER BAR
var togglePlayFromPlayerBar = function(){
    if ($playFromPlayerBar.click){
        var $songNumberCell =getSongNumberCell(currentlyPlayingSongNumber);

        if (currentSoundFile.isPaused()){
            $songNumberCell.html(pauseButtonTemplate);
            $playFromPlayerBar.html(playerBarPauseButton);
        } else {
            $songNumberCell.html(playButtonTemplate);
            $playFromPlayerBar.html(playerBarPlayButton);
        }
        currentSoundFile.togglePlay();
    }
};

var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

//Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

//store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playFromPlayerBar = $('.main-controls .play-pause');

 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
     $playFromPlayerBar.click(togglePlayFromPlayerBar);
//  $togglePlayFromPlayerBar.click(playFromPlayerBar)
 });

