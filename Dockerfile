FROM node as builder
WORKDIR /

RUN  npm install -g parcel
COPY package.json package-lock.json /plugin/

WORKDIR /plugin
RUN  npm install 


COPY . /plugin/

COPY --from=pontusvisiongdpr/pontus-i18n:latest /*.json  /plugin/src/
RUN   npm run build


#FROM grafana/grafana:latest
#EXPOSE 3000

#COPY --from=builder /plugin/dist /var/lib/grafana/plugins/grafana/clock-panel/
#COPY --from=builder /plugin/provisioning/datasources /etc/grafana/provisioning/datasources
ENV TERM=linux
