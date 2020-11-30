#-------------------------------------------------------------------------------#
# Frontend for UFPS Training Center                                             #
# Based on Alpine linux                                                         #
#-------------------------------------------------------------------------------#

# Pull base image
FROM nginx:alpine

# Container Basic Info 
MAINTAINER GERSON LAZARO
MAINTAINER MELISSA DELGADO

# Copy files to container
# COPY . /usr/share/nginx/html

# setting up nginx

# agregando config de nginx
RUN rm /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx

RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d

WORKDIR /usr/share/nginx/html

# Copiando los archivos necesarios, lo que no haya sido copiado mediante este archivo se ha declarado como volumen de este container
COPY src/assets/img /src/assets/img
COPY bootstrap/fonts /bootstrap/fonts
COPY browserconfig.xml .
COPY manifest.json .
