# alpine es la version mas ligera.
FROM httpd:2.4-alpine

# Para quitar las extensiones .html en la url
RUN sed -i \
    -e 's/^#\(LoadModule rewrite_module modules\/mod_rewrite.so\)/\1/' \
    -e 's/AllowOverride None/AllowOverride All/g' \
    /usr/local/apache2/conf/httpd.conf

# Copia todos los archivos, al directorio de Apache.
COPY ./ /usr/local/apache2/htdocs/
