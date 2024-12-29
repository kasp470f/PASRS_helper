mkdir -p build/firefox/dist;
cp dist/main.js build/firefox/dist/main.js;
cp dist/psd_replay.js build/firefox/dist/psd_replay.js;
cp dist/room.js build/firefox/dist/room.js;

cp -r 128.png build/firefox/128.png;
cp firefox_manifest.json build/firefox/manifest.json;
pushd build/firefox;
rm ../pasrs-helper.firefox.zip;
zip -r ../pasrs-helper.firefox.zip .;
