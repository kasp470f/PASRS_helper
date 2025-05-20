function build() {
    build_type=$1
    mkdir -p build/$build_type/dist
    cp dist/main.js build/$build_type/dist/main.js
    cp dist/psd_replay.js build/$build_type/dist/psd_replay.js
    cp dist/room.js build/$build_type/dist/room.js

    cp -r 128.png build/$build_type/128.png
    if [ "$build_type" = "firefox" ]; then
        cp firefox_manifest.json build/$build_type/manifest.json
    else
        cp manifest.json build/$build_type/manifest.json
    fi
    pushd build/$build_type
    rm ../pasrs-helper.$build_type.zip
    zip -r ../pasrs-helper.$build_type.zip .
}

build chrome
build firefox
