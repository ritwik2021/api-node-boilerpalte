FROM public.ecr.aws/h7k8y9w0/node
WORKDIR /usr/src/app
ENV NODE_ENV=dev
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install --quiet
COPY . .
RUN npm run build
CMD node dist/main.js
