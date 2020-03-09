textores = ""; //usado para la estructura html
listaPelis = new Array(); //guardo las pelis con detalle
arrayPelisConsultadas = new Array(); //aqui guardo las pelis obtenidas por el json consultadas una por una (odbmID)
arrayHistorialPeli = new Array(); //historial de pelis en detalle consultadas



peliDetalle = ""; //pelicula consultada en detalle

$(document).ready(function() {

    //efectos con css y js para los filtros
    
    //$("div.expandible-content").hide();
    if ($(window).width() >= 1200){
        console.log("mayor a 1200px");
        $("div.expandible-content").show();
    }else{
        console.log("menor a 1200px");
        $("div.expandible-content").hide();
    }

    $("#filtro").change(function (e) { 
        if($("#filtro").is(":checked")){
            console.log("Esta checked");
            $("div.expandible-content").slideToggle("slow");
        }else{
            console.log("No esta checked");
            $("div.expandible-content").slideToggle("slow");
        }
    });
    

    //geolocalizacion();
    if (localStorage.getItem("historialPeli") != null) {
        console.log("historial es distinto de null")
        arrayHistorialPeli = JSON.parse(localStorage.getItem("historialPeli"))
    }
    historial();

    

    $("#btnHistorial").click(function(e) {
        textores = "";
        historial();

    });

    $("#btnLimpiar").click(function(e) {
        console.log("click en boton limpiar");
        $("input[name='filtrops']").prop('checked', false);
        $("#lanzamiento").val("");

    });

    $("#btnBuscar").click(function(e) {
        textores = "Cargando..."
        $("#resultados").html(textores);
        verChecked();
        arrayPelisConsultadas.length = 0; //reseteamos el array de la busqueda anterior
        listaPelis.length = 0;


        peticionListaPeliculas($("#textoBusqueda").val(), $("#lanzamiento").val(), $("input[name=filtrops]:checked").val());
    });



    
});



/*
    esta funcion retorna varios resultados SIN NINGUNA DESCRIPCION
    por lo tanto si se quiere ver una descripcion se debe llamar a 
    peticionDescCorta() para una descripcion pequeña o
    peticionDescLarga() para una descripcion mas detallada
    */
function peticionListaPeliculas(texto, lanzamiento, filtro) {
    /**El json obtenido es el siguiente:
     * retorna varios objetos con los atributos:
     * Title, Year, imdbID(formato ttXXXXXXX), Type(al ser solo de peliculas es movie), Poster(imagen de la pelicula) 
     * 
     */

    $.ajax({
        type: "GET",
        url: "http://www.omdbapi.com/?apikey=",
        data: {
            s: texto,
            y: lanzamiento,
            type: filtro,
            r: "json",
        },
        dataType: "json",
        success: function(response) {
            textores = "";
            //console.log(response);
            $.each(response.Search, function(i, item) {
                //encontre comentado
                //textores += item.Title + " idbmID: " + item.imdbID + "<br>";
                arrayPelisConsultadas.push(item.imdbID);
            });
            console.log(arrayPelisConsultadas);

            //encontre comentado
            $("#resultados").html(textores);

        }


    }).then((response) => {
        //console.log(response);
        console.log("funcion then y ejecutamos el segundo ajax");
        //console.log(arrayPelisConsultadas);
        $.each(arrayPelisConsultadas, function(i, item) {
            peticionDescCorta(item, i);
        });
        console.log(listaPelis);

    }).catch((err) => {
        textores = "Hubo un problema con la solicitud, por favor actualize la pagina"
        peticionListaPeliculas($("#textoBusqueda").val());
    });;

}

function peticionDescCorta(imdbID, id) {
    /**El Json obtenido es el siguiente:
     * retorna un unico objeto que corresponde a una pelicula,
     * este tiene los datos mas detallados, la diferencia esta en el atributo plot que
     * segun sea short o full devuelve una descripcion corta o completa respectivamente
     * por lo demas es igual, los atributos del objeto son los siguientes:
     * 
     * Title, Year, Rated, Released, Runtime, Genre, Director, Writer, Actors,
     * Plot, Language, Country, Awards, Poster, Ratings {Source, Value}(devuelve un array de 3 objetos)
     * Metascore, imdbRating, imdbVotes, imdbID, Type, DVD, BoxOffice, Production, Website, Response
     * 
     * Usar de referencia para armar el objeto y poder ubicar su contenido en la web
     */
    $.ajax({
        type: "GET",
        url: "http://www.omdbapi.com/?apikey=",
        data: {
            i: imdbID,
            type: "movie",
            plot: "short",
            r: "json",


        },
        dataType: "json",
        success: function(response) {
            console.log(response);
            listaPelis.push(response);
        }
    }).then((response) => {
        //proceso listapelis armando la estructura html
        console.log("comienzo a armar el html")
        armarHtml(response, id);

        //console.log(textores);
        console.log("termine de armar el html")
        $("#resultados").html(textores);
    }).catch((err) => {
        textores = "Hubo un problema con la solicitud, por favor actualize la pagina"
        peticionListaPeliculas($("#textoBusqueda").val());
    });

    ;
}

function peticiondesclarga(imdbID) {
    /**El Json obtenido es el siguiente:
     * retorna un unico objeto que corresponde a una pelicula,
     * este tiene los datos mas detallados, la diferencia esta en el atributo plot que
     * segun sea short o full devuelve una descripcion corta o completa respectivamente
     * por lo demas es igual, los atributos del objeto son los siguientes:
     * 
     * Title, Year, Rated, Released, Runtime, Genre, Director, Writer, Actors,
     * Plot, Language, Country, Awards, Poster, Ratings {Source, Value}(devuelve un array de 3 objetos)
     * Metascore, imdbRating, imdbVotes, imdbID, Type, DVD, BoxOffice, Production, Website, Response
     * 
     * Usar de referencia para armar el objeto y poder ubicar su contenido en la web
     */
    

    $.ajax({
        type: "GET",
        url: "http://www.omdbapi.com/?apikey=",
        data: {
            i: imdbID,
            type: "movie",
            plot: "full",
            r: "json",


        },
        dataType: "json",
        success: function(response) {
            console.log(response);
        }
    }).then((response) => {
        armarHtmlCompleto(response);

        $("#resultados").html(peliDetalle);

        //como se consulto el detalle, guardo en un array los datos de la peli consultada
        if (arrayHistorialPeli == null) {
            arrayHistorialPeli.push(response);
        }
        if (arrayHistorialPeli.length < 10) {
            console.log("entro al if menor de 10")
                //if (arrayHistorialPeli.indexOf(response) == -1) {
            arrayHistorialPeli.unshift(response);
            //}
        } else {
            console.log("entro al if mayor de 10")
                // if (arrayHistorialPeli.indexOf(response) == -1) {
            arrayHistorialPeli.pop();
            arrayHistorialPeli.unshift(response);
            //}
        }
        console.log(arrayHistorialPeli);
        localStorage.setItem("historialPeli", JSON.stringify(arrayHistorialPeli));
    }).catch((err) => {
        textores = "Hubo un problema con la solicitud, por favor actualize la pagina"
        peticionListaPeliculas($("#textoBusqueda").val());
    });;
}



function armarHtml(lista, identificador) {
    textores += '<div class="peliculaMin" id="' + identificador + '" onclick="peticiondesclarga(' + "'" + lista.imdbID + "'" + ')">' +
        '<div class="cartel">' +
        '<img src="' + lista.Poster + '" class="cartelimagen">' +
        '</div>' +
        '<div class="detalleMin">' +
        '<h3 class="titulo">Titulo: ' + lista.Title + '</h3><br>' +
        '<span>Año de estreno: ' + lista.Year + '</span><br>' +
        '<span>Genero: ' + lista.Genre + '</span><br>' +
        '</div>' +
        '</div>'
}


function armarHtmlCompleto(elemento) {

    localStorage.setItem("itemCompartir",JSON.stringify(elemento));

    peliDetalle = "";
    peliDetalle += '<div class="peliculaMin">' +
                    '<div class = "btns">'+
                        '<input type="button" class = "btnGenerico" id="btnVolver" value="Volver" onclick="volverLista()">'+
                        '<input type="button" class = "btnGenerico" id="btnCompartir" value="Compartir" onclick="gotoCompartir()">'+
                    '</div>'+
                    //'<div class="btnVolver" onclick="volverLista()">Volver</div>' +
                    '<div class = "detalleMain">' +
                        '<div class="cartel">' +
                            '<img src="' + elemento.Poster + '" class="cartelimagen">' +
                        '</div>' +
                        '<div class="detalle">' +
                            '<h3 class="titulo"><span class = "item">Titulo:</span> ' + elemento.Title + '</h3>' +
                            '<div><span class = "item">fecha de estreno:</span> ' + elemento.Released + '</div>' +
                            '<div><span class = "item">Genero:</span> ' + elemento.Genre + '</span>' + '</div>'+
                        '</div>'+//div de cierre de los principales detalles junto a la imagen
                        '<div class = "detalleDos">'+
                            '<div class = "elemento"><span class = "item">director:</span> ' + elemento.Director + '</div>' +
                            '<div class = "elemento"><span class = "item">descripcion:</span> ' + elemento.Plot + '</div>' +
                            '<div class = "elemento"><span class = "item">Actores principales:</span> ' + elemento.Actors + '</div>' +
                            '<div class = "elemento"><span class = "item">Metascore:</span> ' + elemento.Metascore + '</div>' +
                            '<div class = "elemento"><span class = "item">Produccion:</span> ' + elemento.Production + '</div>' +
                            '<div class = "elemento"><span class = "item">sitio web:</span> <a href=' + "'" + elemento.Website + "'" + '>' + elemento.Website + '</a></div>' +
                            '<div class = "elemento"><span class = "item">escritor:</span> ' + elemento.Writer + '</div>' +
                            '<div class = "elemento"><span class = "item">Lenguaje principal:</span> ' + elemento.Language + '</div>' +
                        '</div>' +
                    //implementacion compartir UBICAR AL LADO DEL BOTON VOLVER
                    //'<div class="btnCompartir" onclick="enviarAmigo()">Compartir con un amigo</div><br>' +
                    '</div>';
    //implementacion de funcion de botones
    

}

function volverLista() {
    $("#resultados").html(textores);
    console.log(JSON.parse(localStorage.getItem("historialPeli")));
}

function gotoCompartir(){
    window.location = "formulario.html";
}



function verChecked() {
    console.log(
        $("input[name=filtrops]:checked").val()
    );
}

function geolocalizacion() {
    if (navigator.geolocation) {
        //el navegador soporta geolocalizacion
        navigator.geolocation.getCurrentPosition(
            exito

        );
    } else {
        console.log("la geolocalizacion no es soportado por el navegador")
    }
}

function exito(position) {
    console.log('Latitud: ' + position.coords.latitude + "\n Longitud: " + position.coords.longitude);

}

function initMap() {
    console.log("se inicio initMap")
        // The location of Uluru
    var uluru = { lat: -25.344, lng: 131.036 };
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementById('map'), { zoom: 4, center: uluru });
    // The marker, positioned at Uluru
    var marker = new google.maps.Marker({ position: uluru, map: map });
}

function historial() {
    textores += "<h3>Consultados recientemente: </h3>";

    console.log(arrayHistorialPeli);
    $.each(arrayHistorialPeli, function(i, item) {
        console.log("entre al each del historial")
        armarHtml(item, i);
    });
    $("#resultados").html(textores);

    $("#btnLimpiar").click(function(e) {
        console.log("click en boton limpiar");
        $("input[name='filtrops']").prop('checked', false);
        $("#lanzamiento").val("");

    });
}

$(window).resize(function () { 

    if ($(window).width() >= 1200){
        console.log("mayor a 1200px");
        $("div.expandible-content").show();
    }else{
        console.log("menor a 1200px");
        $("div.expandible-content").hide();
    }
    
});