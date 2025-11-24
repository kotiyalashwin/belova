#!/bin/bash
rm -rf react-app
npm create vite@latest react-app -- --template react-ts
cd react-app
npm install
npm install tailwindcss @tailwindcss/vite
cp /home/woksh/super_30/react-template/setup/vite.config.ts ./vite.config.ts
cp /home/woksh/super_30/react-template/setup/index.css ./src/index.css
cp /home/woksh/super_30/react-template/setup/tsconfig.json ./tsconfig.json
cp /home/woksh/super_30/react-template/setup/tsconfig.app.json ./tsconfig.app.json
npx --yes shadcn@2.6.3 init --yes -b neutral --force


