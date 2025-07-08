#!/bin/bash

# === CONFIG ========================
SERVER=root@test-crm.jewel-wax.com.ua
APP_DIR=/root/jewel-wax-crm
TARBALL=deploy-test.tar.gz
TEMP_DIR=.deploy-build-test
# ==================================

echo "🧹 Cleaning old build..."
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR/backend
mkdir -p $TEMP_DIR/frontend

# === BACKEND ======================
echo "🔧 Building backend..."
cd backend
npm install
NODE_OPTIONS="--max-old-space-size=1024" npx tsc
cp -r dist package.json package-lock.json ../$TEMP_DIR/backend
cd ..

# === FRONTEND =====================
echo "🌐 Building frontend..."
cd frontend
npm install
npm run build
cp -r .next public next.config.js package.json package-lock.json ../$TEMP_DIR/frontend
cd ..

# === PACKAGE ======================
echo "📦 Packaging build..."
tar -czf $TARBALL -C $TEMP_DIR .

# === UPLOAD =======================
echo "🚀 Uploading to $SERVER..."
scp $TARBALL $SERVER:~/

# === REMOTE DEPLOY ================
echo "🔧 Deploying on server..."
ssh $SERVER << EOF
  set -e

  echo "🧹 Cleaning previous app dir..."
  rm -rf $APP_DIR
  mkdir -p $APP_DIR

  echo "📦 Extracting build..."
  tar -xzf $TARBALL -C $APP_DIR
  rm $TARBALL

  echo "🧩 Installing backend deps..."
  cd $APP_DIR/backend
  npm install
  pm2 restart crm-backend || pm2 start dist/index.js --name crm-backend

  echo "🧩 Installing frontend deps..."
  cd $APP_DIR/frontend
  npm install
  pm2 restart crm-frontend || pm2 start "npm run start" --name crm-frontend

  echo "💾 Saving PM2 state..."
  pm2 save
EOF

# === CLEANUP ======================
echo "🧹 Cleaning local temp files..."
rm -rf $TEMP_DIR $TARBALL

echo "✅ Deployment to TEST complete!"
