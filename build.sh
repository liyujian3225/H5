sudo rm -rf dist/*
gulp setDist
npm run dist
gulp setDev
gulp version
find ./ -name ".DS_Store" -depth -exec rm {} \;
scp -i ~/.ssh/rsa-dev-privatekey -r dist/* uxuanjia@120.77.248.110:/data/web/webapps/h5
