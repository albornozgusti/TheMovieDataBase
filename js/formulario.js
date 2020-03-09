textores = "";
var pelicula;
var patronLetras = "[A-Za-z]";
var patronMail = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$";
var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
var patternForm="[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}"

$(document).ready(function () {
    

    if ($(window).width()>1200 && !$("#contenido").length){
        $("#resultados").css("margin-top", "35px");
    }else{
        //$("#resultados").css("margin-top", "0px");
    }

    if (localStorage.getItem("itemCompartir") != null) {
        console.log("historial es distinto de null")
        pelicula = JSON.parse(localStorage.getItem("itemCompartir"));
        console.log(pelicula);
    }

    
    armarHtml(pelicula);

    $("#pelicula-min").html(textores);

    $("#reestablecer").click(function (e) { 
        $("#mailEmisor").val("");
        $("#mailReceptor").val("");
        $("#nombre").val("");
        $("#apellido").val("");
    });

    $("#cancelar").click(function (e) { 
        gotoCompartir();
        
    });

    $("form#compartir").submit(function(){
        flag = true;
        $("div.error").hide();
        if (!$("#mailEmisor").val().match(patternForm)){
            
            console.log("el formato de  mail no es valido!");
            mostrarError("#emisor","Formato no valido");
            flag = false;
        }

        if (!$("#mailReceptor").val().match(patternForm)){
            
            console.log("el formato de  mail no es valido!");
            mostrarError("#receptor","Formato no valido");
            flag = false;
        }

        if ($("#mailReceptor").val()==""){
            mostrarError("#receptor","El campo no puede estar vacio");
            flag = false;
        }

        if ($("#mailEmisor").val()==""){
            mostrarError("#emisor","El campo no puede estar vacio");
            flag = false;
        }
        
        if (!$("#nombre").val().match(patronLetras) && !$("#nombre").val()==""){
            console.log("el formato del campo nombre no es valido!");
            mostrarError("#nom","Formato no valido");
            flag = false;
        }
        
        if (!$("#apellido").val().match(patronLetras) && !$("#apellido").val()==""){
            console.log("el formato del campo apellido no es valido!");
            mostrarError("#ape","Formato no valido");
            flag = false;
        }

        if (flag){
            console.log("enviar al mail");
            window.location.href = "mailto:ejemplo@gmail.com";
        }else{
            return false;
        }
        console.log("pulsaste Enviar!");
    });


});

function mostrarError(etiqueta, msgError){
    //$(etiqueta+" div.error").hide();
    $(etiqueta+" div.error").addClass("error-active");
    $(etiqueta+" div.error").html(msgError);
    $(etiqueta+" div.error").slideDown();
    
}



function armarHtml(lista) {
    textores += '<div class="peliculaMin">' +
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

function gotoCompartir(){
    window.location = "index.html";
}