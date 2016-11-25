
//variable map to set the google map
        var map;
    //To store all the markers of location and settings of markers to an array
      var markers = [];
    //variable for information
    var info = [
          {title: 'new delhi', location: {lat: 28.613939, lng: 77.209021} ,wiki: ' '},
          {title: 'agra', location: {lat: 27.176670, lng: 78.008075},wiki: ' '},
          {title: 'noida', location: {lat: 28.535516, lng: 77.391026},wiki: ' '},
          {title: 'gurgaon', location: {lat: 28.459497, lng: 77.026638},wiki: ' '},
          {title: 'ghaziabad', location: {lat: 28.669156, lng: 77.453758},wiki: ' '},
          {title: 'faridabad', location: {lat: 28.408912, lng: 77.317789},wiki: ' '}
        ];



   //function to initalize google maps
     function initMap(){
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 28.613939, lng: 77.209021},
          zoom: 11,
          mapTypeControl: false
        });
         //Object provide information to the markers on click
        var largeInfo = new google.maps.InfoWindow();

        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < info.length; i++) {
          // Get the position from the location array.
          var position = info[i].location;
          var title = info[i].title;
          // Create a marker per location, and put into markers array.
           var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
          });
          // Push the marker to our array of markers.
          markers.push(marker);
          // Create an onclick event to open an infowindow at each marker.
          marker.addListener('click', function() {
            var sel = this;
           populateInfoWindow(this, largeInfo);
           toggleBounce(this);
           setTimeout(function(){
             sel.setAnimation(null);
           },2000);

          });
        }
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
          bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
      };

//toggle function to give bounce animation when ever list or marker is clicked
      function toggleBounce(marker) {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      }
//function to alert the user that map is not available or key is wrong
      function googleError(){
        alert("Map is unable to load ");
    };


// This function populates the infowindow when the marker is clicked. We'll only allow
      // one infowindow which will open at the marker that is clicked, and populate based
      // on that markers position.
      function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div style="color:red;border:2px dashed red;padding:2px;">' + marker.title + '</div>');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
        }
      };


var viewmodel = {
    //Saving the reference of 'this' to another variable self


    //observable array to save title from normal array
    obserTitle : ko.observableArray(['new delhi','agra','noida','gurgaon','ghaziabad','faridabad']),

    obserTitle1 : ['new delhi','agra','noida','gurgaon','ghaziabad','faridabad'],

    wikiInfo : ko.observable(''),
  //Fetch info from wiki pages using jsonp
   getWikiInfo : function(data){
      // load wikipedia data
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + data + '&format=json&callback=wikiCallback';

     //Print message in dialogue box that wikipedia is failed to load resources
    var wikiRequestTimeout = setTimeout(function(){
        alert("failed to get wikipedia resources");
   }, 8000);
      $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        jsonp: "callback",
        success: function( response ) {
            var articleList = response[2];
            viewmodel.wikiInfo(articleList[0]);
            clearTimeout(wikiRequestTimeout);
        }
    });
},

//shows the details by fetching the info from wiki api and by invoking the click event
  showDetails : function(data){
    var click = 0;
  var largeInfo = new google.maps.InfoWindow();
     for(var j = 0 ; j < markers.length ; j++){
      markers[j].setAnimation(null);
      if(markers[j].title === data){
        click = j;
        populateInfoWindow(markers[j],largeInfo);
        viewmodel.getWikiInfo(markers[j].title);
        markers[j].setAnimation(google.maps.Animation.BOUNCE);
        }
      }
      setTimeout(function(){
             markers[click].setAnimation(null);
      },2000);
},

//num variable to store response from input
 query : ko.observable(''),

//Filter function to filter the list and markers on map
 search : function(value) {

// preparing regular expression by concatinating with experssions
    var num = "^"+value+".*$";

//Converting num variable into regular expression
    var re = new RegExp(num,'i');
    viewmodel.obserTitle.removeAll();
//Refining results
    for(var i = 0 ; i < viewmodel.obserTitle1.length ; i++){
      if(viewmodel.obserTitle1[i].match(re)) {
        viewmodel.obserTitle.push(viewmodel.obserTitle1[i]);
        markers[i].setVisible(true);
      }
      else{
        markers[i].setVisible(false);
      }
    }
  }
};


viewmodel.query.subscribe(viewmodel.search);
//Binding values for knockout library
ko.applyBindings(viewmodel);
