FILE="browserquest.tar.gz"
rm ${FILE}
rm ${SERVER}
tar -cvzf ${FILE} ./server-build ./client-build app.js
