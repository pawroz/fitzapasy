# Lokalne środowisko testowe odwzorowujące hosting Hostinger:
# Apache z obsługą .htaccess (Hostinger używa LiteSpeed, który czyta te same reguły).
# Treść strony nie jest kopiowana do obrazu – compose.yaml podmontowuje repozytorium
# dokładnie tak, jak Hostinger → Git wdraża je do public_html.
FROM httpd:2.4.65-alpine

COPY httpd-fitzapasy.conf /usr/local/apache2/conf/extra/fitzapasy.conf
RUN echo 'Include conf/extra/fitzapasy.conf' >> /usr/local/apache2/conf/httpd.conf
