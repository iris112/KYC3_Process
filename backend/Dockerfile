FROM java:8

RUN mkdir -p /usr/src/app

EXPOSE 8080
EXPOSE 7171
EXPOSE 8849

WORKDIR /usr/src/app

RUN wget https://download-keycdn.ej-technologies.com/jprofiler/jprofiler_linux_10_0_4.tar.gz && \
    tar -xzf jprofiler_linux_10_0_4.tar.gz

COPY target/ICO-KYC-0.1.0.jar /usr/src/app/

CMD java -agentpath:/usr/src/app/jprofiler10.0.4/bin/linux-x64/libjprofilerti.so=port=8849,nowait -Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=7171,suspend=n -Xmx4096m -Xms1024m -jar /usr/src/app/ICO-KYC-0.1.0.jar

