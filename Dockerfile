FROM hmctspublic.azurecr.io/base/node:20-alpine as base

# Update & Install theses apps.
USER root
RUN apk update && apk upgrade && apk add --no-cache rsync && apk add python3 make g++

USER hmcts

ENV WORKDIR /opt/app
WORKDIR ${WORKDIR}

COPY --chown=hmcts:hmcts ./ /opt/app/

RUN yarn \
  && yarn setup \
  && yarn cache clean

EXPOSE 1337
CMD [ "yarn", "start:api" ]
