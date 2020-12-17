# FROM node:14.8.0-alpine as install

# WORKDIR /app

# COPY package.json package.json
# # COPY yarn.lock yarn.lock

# RUN yarn install

FROM nodered/node-red as build

WORKDIR /usr/src/node-red
RUN mkdir -p tgbotnode
RUN mkdir .node-red
# RUN rm /app/src/Config/*

# RUN echo "Asia/Shanghai" > /etc/timezone
# RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# COPY --from=install /app/node_modules node_modules
COPY package.json tgbotnode/package.json
# COPY yarn.lock yarn.lock
COPY ./ tgbotnode
# RUN ls /usr/src/node-red/tgbotnode
# RUN cd .node-red
RUN npm install ./tgbotnode

# ENV PATH=$PATH:/home/node/.npm-global/bin

EXPOSE 1880/tcp

CMD ["npm","start"]
# USER node
