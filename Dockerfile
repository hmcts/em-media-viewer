FROM hmctspublic.azurecr.io/base/node:12-alpine as base

USER hmcts

ENV WORKDIR /opt/app
WORKDIR ${WORKDIR}

COPY --chown=hmcts:hmcts ./ /opt/app/

RUN yarn install --production \
  && yarn setup \
  && yarn cache clean

EXPOSE 3000
CMD [ "yarn", "start" ]
