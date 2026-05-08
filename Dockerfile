# alpine es la version mas ligera.
FROM httpd:2.4-alpine

# Copia todos los archivos, al directorio de Apache.
COPY ./ /usr/local/apache2/htdocs/
