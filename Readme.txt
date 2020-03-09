Trabajo Practico Modulo Web

Alumno: Albornoz Gustavo

API utilizada:

OMDb API
The open movie Database

Descripcion
OMDb API es un servicio web RESTful para obtener informacion acerca de
las peliculas, todo el contenido (texto e imagenes) son contribuidos
y mantenidos por nuestros usuarios.

El uso de la API esta limitado a 1000 consultas por dia

Todas las requests deben ser enviadas al siguiente link:
http://www.omdbapi.com/?apikey=[yourkey]&

PARÁMETROS:
POR id O titulo (retorna un solo titulo)
Parametro     Requerido   Opciones Validas     Default     Descripcion
i              opcional                         <vacio>     imdbID valido (por ejemplo "tt1285016")
t              opcional                         <vacio>     titulo de la pelicula que buscas
type           no          movie, series, episode            tipo del resultado que retorna
y              no                               <vacio>      año de salida 
plot           no            short,full         short        retorna la descripcion de la pelicula
r              no              json,xml          json        el tipo de dato a retornar
callback        no                              <vacio>       JSONP callback nombre
v              no                                 1           API version

Aclaracion: los parametros "i" y "t" son opcionales, sin embargo, 1 de los 2 es requerido


POR BUSQUEDA (retorna una lista de peliculas)
Parameter	Required	Valid options	Default Value	Description
s                  Yes                            <empty>        Movie title to search for.
type               No            movie, series, episode<empty>	 Type of result to return.
y                  No                             <empty>         Year of release.
r                  No             json, xml        json          The data type to return.
page               No                1-100            1          Page number to return.
callback           No                             <empty>        JSONP callback name.
v                  No                                 1          API version (reserved for future use).

Aclaracion del alumno:
se hacen muchas consultas, 1 para la peticion de la lista,
y n cantidad de busquedas por elemento retornado
hice eso dado que en la lista a mostrar al usuario podria mostrar
al usuario una descripcion breve, la descripcion cuando accede al detalle
es otra y es mas larga