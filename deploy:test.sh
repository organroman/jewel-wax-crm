#!/bin/bash

# === CONFIG ========================
SERVER=root@134.209.232.78
APP_DIR=jewel-wax-crm
TARBALL=deploy-test.tar.gz
TEMP_DIR=.deploy-build-test
TEMP_DIR_WRAPPED=.deploy-build-test-wrapped
DRY_RUN=false
# ==================================

if [ "$1" == "--dry-run" ]; then
  DRY_RUN=true
  echo "🧪 DRY RUN ENABLED"
fi

echo "🧹 Cleaning old build..."
rm -rf $TEMP_DIR $TEMP_DIR_WRAPPED $TARBALL
mkdir -p $TEMP_DIR/backend
mkdir -p $TEMP_DIR/frontend

# === BACKEND ======================
echo "🔧 Building backend locally..."
pushd backend
rm -rf dist
NODE_ENV=production npx tsc
popd

# === FRONTEND =====================
# echo "🌐 Building frontend locally..."
# pushd frontend
# rm -rf .next node_modules/.cache .turbo
# NODE_ENV=production npm run build
# popd

# === COPY FILES ===================
echo "📁 Copying files to temp dir..."
cp -r backend/dist $TEMP_DIR/backend/
# cp -r backend/node_modules $TEMP_DIR/backend/
cp backend/package*.json $TEMP_DIR/backend/
cp backend/.env.prod $TEMP_DIR/backend/.env.prod

cp -r frontend/.next $TEMP_DIR/frontend/
cp -r frontend/public $TEMP_DIR/frontend/
cp -r frontend/src $TEMP_DIR/frontend/
# cp -r frontend/node_modules $TEMP_DIR/frontend/
cp frontend/package*.json $TEMP_DIR/frontend/
cp frontend/.env.production $TEMP_DIR/frontend/.env.production
cp frontend/*.config.* $TEMP_DIR/frontend/ || true
cp frontend/tsconfig*.json $TEMP_DIR/frontend/ || true

# === PACKAGE ======================
echo "📦 Packaging build..."
mkdir -p $TEMP_DIR_WRAPPED
cp -r $TEMP_DIR $TEMP_DIR_WRAPPED/$APP_DIR
tar -czf $TARBALL -C $TEMP_DIR_WRAPPED .

# === UPLOAD =======================
echo "🚀 Uploading to $SERVER..."
scp -i ~/.ssh/id_rsa $TARBALL $SERVER:~/

# === REMOTE DEPLOY ================
echo "🔧 Deploying on server..."
ssh $SERVER << EOF
  set -e

  echo "🧹 Cleaning previous app dir..."
  if [[ -d $APP_DIR ]]; then
    if [[ "$APP_DIR" == jewel-wax-crm ]]; then
      echo "✅ Removing old app dir: $APP_DIR"
      rm -rf $APP_DIR
    else
      echo "❌ Refusing to delete suspicious APP_DIR=$APP_DIR"
      exit 1
    fi
  fi

  echo "📦 Extracting build..."
#   if [[ -d "$APP_DIR/.ssh" ]]; then
#     echo "❌ .ssh folder found inside app directory. Aborting to prevent lockout."
#     exit 1
#   fi

  tar -xzf $TARBALL
  rm $TARBALL

  echo "🛠 Running DB migrations..."
  cd $APP_DIR/backend
  npm install
  NODE_ENV=production npx knex --knexfile $APP_DIR/backend/dist/knexfile.js migrate:latest

  echo "🧑‍💼 Inserting super admin..."
  npm run seed:admin

  echo "🚀 Restarting backend service..."
  pm2 restart backend || pm2 start dist/index.js --name backend

  echo "🚀 Starting frontend..."
  cd ../frontend
  npm install --legacy-peer-deps
  NODE_ENV=production npm run build 
  pm2 delete frontend || true
  pm2 start npm --name frontend -- run start

  echo "💾 Saving PM2 state..."
  pm2 save
EOF

# === CLEANUP ======================
echo "🧹 Cleaning local temp files..."
rm -rf $TEMP_DIR $TEMP_DIR_WRAPPED $TARBALL

curl -s http://localhost:3000/health || echo "⚠️ App might not have started correctly"

echo "✅ Deployment to TEST complete!"
