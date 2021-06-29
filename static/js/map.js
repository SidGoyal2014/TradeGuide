console.log("Hello Map");

function show_map(){
    var mymap=L.map('mapid').setView([51.505,-0.09],13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWRpdHlhYmFuc2FsIiwiYSI6ImNra2prNHlqajB2c3Uydms3bmlwbWVwYzUifQ.uM_5J0pJIVVzQW7ObwMGMw',{
        attribution:'Map data &copy;<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom:18,
        id:'mapbox/streets-v11',
        tileSize:512,
        zoomOffset:-1,
        accessToken:'your.mapbox.access.token'
    }).addTo(mymap);
}

function print_console(){
    console.log("Print something here!");
}