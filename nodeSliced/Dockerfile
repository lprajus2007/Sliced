FROM gcr.io/google_appengine/nodejs
EXPOSE 3000
EXPOSE 3001
EXPOSE 3002
EXPOSE 3003

WORKDIR /src

# Install and cache node_modules
ADD package.json /src/package.json
RUN npm install -g npm
RUN npm install

# We need to add `.babelrc` as same level as `node_modules`
ADD .babelrc /src/.babelrc

# Add `node_modules/.bin` to $PATH
ENV PATH /src/node_modules/.bin:$PATH
