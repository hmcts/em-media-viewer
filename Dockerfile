FROM hmctspublic.azurecr.io/base/node:12-alpine as base

# Update & Install theses apps.
USER root
RUN apk update && apk upgrade && apk add --no-cache rsync

USER hmcts

ENV WORKDIR /opt/app
WORKDIR ${WORKDIR}

COPY --chown=hmcts:hmcts ./ /opt/app/

RUN yarn rebuild-node-sass \
  && yarn \
  && yarn setup \
  && yarn cache clean

EXPOSE 3000
CMD [ "yarn", "start:api" ]
