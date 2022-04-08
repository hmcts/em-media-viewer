FROM hmctspublic.azurecr.io/base/node:14-alpine as base

# Update & Install theses apps.
USER root
RUN apk update && apk upgrade && apk add --no-cache rsync && apk add python2 make g++

USER hmcts

ENV WORKDIR /opt/app
WORKDIR ${WORKDIR}

COPY --chown=hmcts:hmcts ./ /opt/app/

RUN yarn rebuild-node-sass \
  && yarn \
  && yarn setup \
  && yarn cache clean

EXPOSE 1337
CMD [ "yarn", "start:api" ]
