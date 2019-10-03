FROM node:lts-alpine AS builder

# Create a working directory.
WORKDIR /build_app

# Copy the package and package-lock.json
COPY package*.json ./

# FontAwesome licencing. 
RUN npm config set "@fortawesome:registry" https://npm.fontawesome.com/
RUN npm config set "//npm.fontawesome.com/:_authToken" D55D2FB2-209A-4AF8-95AE-D36C20C3625C

# Install all the dependencies.
# RUN npm install # Too slow.
RUN yarn install

# Copy all content from repo here. 
COPY . .

# Build the dist folder.
# RUN npm run build # Too slow.
RUN yarn build



FROM nginx:latest

# Create a working directory
WORKDIR /app

# Setting the correct nginx config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

# Run the things. 
# COPY --from=builder /build_app/dist/* . Needs to be copied directly in the nginx path.
COPY --from=builder /build_app/dist /usr/share/nginx/html

# Make sure the docker keeps running.
CMD ["nginx", "-g", "daemon off;"]