/* <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js"></script> */ // скрипт фрхиватора нужно добавить на страницу где будет экспорт
var KML;
var GPX;
function exportToGPX() {
    GPX = '<?xml version="1.0" encoding="UTF-8"?>\n';
    GPX += '<gpx version="1.1" creator="Yandex Maps">\n';
    GPX += '<metadata>\n';
    GPX += '<name>Example Route</name>\n';                   // название маршрута  // название --------
    GPX += '<desc>Route created with Yandex Maps</desc>\n';  // описание маршрута  // описание ---------
    GPX += '</metadata>\n';
    GPX += '<trk>\n';                                        // начало трека
    GPX += '<name>Route</name>\n';                           // название трека     // название-----------
    GPX += '<trkseg>\n';                                     // начало  сегмента трека

    addreses.forEach(address => {
        if (Array.isArray(address)) {
            GPX += `<trkpt lat="${address[0]}" lon="${address[1]}">\n`;  //добавление точки
            GPX += '</trkpt>\n';
        }
    });
    GPX += '</trkseg>\n';// конец  сегмента трека
    GPX += '</trk>\n';   // конец трека
    GPX += '</gpx>';

    var blob = new Blob([GPX], { type: 'application/gpx+xml' });
    var url = URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.href = url;
    a.download = 'tourou.gpx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function createKML(){
    KML = '<?xml version="1.0" encoding="UTF-8"?>\n';
    KML += '<kml xmlns="http://www.opengis.net/kml/2.2">\n';
    KML += '<Document>\n';
    KML += '<name>Route KML</name>\n';                                      // название 
    KML += '<description>A simple description example.</description>\n';
    KML += '<Placemark>\n';
    KML += '<name>test_route</name>\n';                                     // название
    KML += '<description>This is a route example.</description>\n';         // описание
    KML += '<LineString>\n';
    KML += '<coordinates>\n';

    addreses.forEach(address => {
        if (Array.isArray(address)) {
            KML += `${address[1]},${address[0]} `; // Долгота,Широта, разделенные пробелом
        }
    });

    KML += '</coordinates>\n';
    KML += '</LineString>\n';
    KML += '</Placemark>\n';
    KML += '</Document>\n';
    KML += '</kml>\n';
}
function exportToKML() {  
    createKML();      
    var blob = new Blob([KML], { type: 'application/vnd.google-earth.kml+xml' });
    var url = URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.href = url;
    a.download = 'tourou.kml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
function exportToKMZ(){
    createKML();
    var zip = new JSZip();
    zip.file("route.kml", KML);

    zip.generateAsync({ type: "blob" }).then(function (blob) {
        var url = URL.createObjectURL(blob);

        var a = document.createElement('a');
        a.href = url;
        a.download = 'route.kmz';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
}
