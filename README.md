# Diario de Desarrollo - Web del Bot Blåhaj

## 1. Cosas por Hacer
- [ ] mix with: 800px 
- [ ] Adjuntar los enlaces de soporte.

## 2. Fallos
- [ ] ajustar la version movil.

## 3. Diario de Desarrollo
#### [0.1]:
    - Creado el html basico para las 3 paginas principales dela web (index.html, info.html y commands.html).
    - Añadido un menu de navegacion basico compartido para todas las paginas.
    - creado los xml, dos versiones español e ingles para que sirva como traduccion de la web
    - añadido todo el texto del html al español.xml. 
    - creado el ingles.xml (traduccido automaticamente por pereza)
#### [0.2]:
    - en comandos.html intentado hacer un desplegable con toda la informacion de los comando utilizando
    lo mismo que en el navbar, pero se sopala uno encima del otro. (solucionado ya).
    - añadido un css interno muy basico para ajustar los marjenes y otras cosas.
#### [0.3]:
    - creado el css de index.html con animaciones y un botom insirados en otras webs.
#### [0.4]:
    - creado el css para el navbar.
    - modificado index.html y comandos.html para adaptarlo al nuevo css.
    - ajustado la descripcion del bot en info.html.
#### [0.5]:
    - Termiando el ccs de info.html.
    - Creado roadmap.html y roadmap.css
#### [0.6]:
    - Terminado de añadir los comandos restantes en comandos.html 
    - Mejorar el diseño de las listas de comandos en comandos.html
#### 0.7]:
    - Añadido la fechita al navbar.
    - Ajustado el tema del navbar, info.
    - Mejorado el fondo, añadido dos bolas efecto aurora
    - creado carpetas para los 2 idiomas
    - traducido info.html, comands.html al 50%
    - creado datos.xml el anterio se va a la mierda.
#### [0.8]:
    - Migrada toda la web a docker
    - creado el dockerfile y docker-compose.yml.
    - La web ahora funciona con apache2 alpine.
    - Por ahora cerrada en localhost.
    - creado un index.html en / que redirecciona a /es/index.html.
#### [1.0]:
    - Compre un dominio propio botblahaj.com en cloudflare.
    - docker-compose actualizado para salida a internet.
    - DNS de cloudflare hace un proxi a mi NOIP y de ahi redirije a servidor apache.
    - la web ya es publicamente accesible en botblahaj.com
    - Configurado https en cloudflare.
    - corregido un fallo con los idiomas, el icono de la vanderita no se veia igual en todos los navegadores.
    - Optimizado el archivo comandos.css.
#### [1.1]:
    - Añadido en index.html "themecolor" "descripcion" "keywords" y mas cosas cosas.
    - Añadido mantenimiento.html  para los enlaces que aun no estan terminados.
    - Corregido en datos.xml no encontraba la etiqueta errores.
    - creado robots.txt y sitemap.xml. 
    - editado .htaccess para bloquear que se muestren algunos archivos.
#### 1.2]:
    - creado estado.html y estado.css (sin terminar).
    - creado estado.js (sin terminar).
    - restructurado el order de archivos, ahora index.html esta en la raiz e enlaza a la carpeta /es.
