FROM hmctspublic.azurecr.io/base/node:12-alpine as base

# Update & Install theses apps.
USER root
RUN apk update && apk upgrade && apk add --no-cache rsync

USER hmcts

ENV WORKDIR /opt/app
WORKDIR ${WORKDIR}

COPY --chown=hmcts:hmcts ./ /opt/app/

RUN yarn install --production \
  && yarn build:lib \
  && yarn copy:files \
  && yarn cache clean

EXPOSE 3000
CMD [ "yarn", "start:ng" ]
