FROM prograils/ruby-node-chrome-pack 

WORKDIR /Automation
MAINTAINER William Ralitera

ADD . /Automation

# This enables apt to run from the new sources 
RUN printf "deb http://archive.debian.org/debian/ jessie main\ndeb-src http://archive.debian.org/debian/ jessie main\ndeb http://security.debian.org jessie/updates main\ndeb-src http://security.debian.org jessie/updates main" > /etc/apt/sources.list

# # Install Chrome
# RUN apt-get update && apt-get install -y wget
# RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub |  apt-key add -
# RUN echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' |  tee /etc/apt/sources.list.d/google-chrome.list
# RUN apt-get update && apt-get install -y google-chrome-stable

RUN apt-get update 
RUN rm -rf /var/lib/apt/lists/*
RUN echo 'PACKAGES INSTALL'
RUN apt-get -y update && apt-get -y install libxml2 libxml2-dev libxslt-dev gcc
RUN gem install hiptest-publisher
RUN apt-get -y remove gcc
RUN apt-get -y autoremove
RUN apt-get -y clean
RUN npm install cypress
RUN echo 'PACKAGES INSTALLED'
RUN google-chrome --version
RUN npm cypress --version
RUN nodejs --version