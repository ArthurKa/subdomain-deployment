# region help-files
FROM node:22.15.0-alpine AS help-files_webhook-handler
WORKDIR /app

COPY helpers/purify-package-lock.js helpers/
COPY package.json package-lock.json ./
COPY packages/common/package.json packages/common/
COPY projects/webhook-handler/package.json projects/webhook-handler/

RUN node helpers/purify-package-lock.js
RUN npm i --package-lock-only --ignore-scripts


FROM node:22.15.0-alpine AS help-files_package-jsons
WORKDIR /app

COPY helpers/make-docker-package-jsons.js helpers/
COPY package.json ./
COPY packages/common/package.json packages/common/
COPY projects/webhook-handler/package.json projects/webhook-handler/

RUN node helpers/make-docker-package-jsons.js


FROM scratch AS help-files
WORKDIR /app

COPY --from=help-files_webhook-handler /app/package-lock.json package-lock-webhook-handler.json

COPY --from=help-files_package-jsons /app/docker-*package.json ./
COPY --from=help-files_package-jsons /app/packages/common/docker-*package.json packages/common/
COPY --from=help-files_package-jsons /app/projects/webhook-handler/docker-*package.json projects/webhook-handler/
# endregion


FROM node:22.15.0-alpine AS webhook-handler
WORKDIR /app

COPY --from=help-files /app/package-lock-webhook-handler.json package-lock.json
COPY --from=help-files /app/docker-package.json package.json
COPY --from=help-files /app/packages/common/docker-package.json packages/common/package.json
COPY --from=help-files /app/projects/webhook-handler/docker-package.json projects/webhook-handler/package.json

COPY helpers/start-checks.js helpers/check-package-versions.js helpers/
COPY helpers/modify-node-modules helpers/modify-node-modules
COPY .nvmrc .

RUN npm ci

COPY tsconfig.json ./
COPY packages/common/src packages/common/src
COPY projects/webhook-handler projects/webhook-handler
COPY --from=help-files /app/docker-build-package.json package.json
COPY --from=help-files /app/projects/webhook-handler/docker-build-package.json projects/webhook-handler/package.json

RUN npm run webhook-handler:ts:noWatch

ENTRYPOINT npm run webhook-handler:start
