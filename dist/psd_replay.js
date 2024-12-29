(()=>{"use strict";var e={219:function(e,t,l){l.d(t,{F:function(){return i},l:function(){return app}});let i=function(e,t){let l,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};if("function"!=typeof(null==app?void 0:app._addRoom))return null;let{side:o,icon:a,focus:n,minWidth:r=320,maxWidth:c=1024}=i;if(e in app.rooms)l=app.rooms[e];else if((l=app._addRoom(e,"html",!0,t)).$el.html(""),o){l.isSideRoom=!0;let e=app.roomList.pop();e&&app.sideRoomList.push(e)}if(!(null==l?void 0:l.el))return null;if(l.minWidth=r,l.maxWidth=c,a){let t=app.topbar.renderRoomTab.bind(app.topbar);app.topbar.renderRoomTab=function(l,i){let o=(null==l?void 0:l.id)||i,n=t(l,i);return o===e?n.replace("fa-file-text-o",`fa-${a}`):n}}return n&&app[o?"focusRoomRight":"focusRoom"](l.id),app.topbar.updateTabbar(),l}}},t={};function l(i){var o=t[i];if(void 0!==o)return o.exports;var a=t[i]={exports:{}};return e[i](a,a.exports,l),a.exports}l.d=function(e,t){for(var i in t)l.o(t,i)&&!l.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},l.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},l.rv=function(){return"1.0.8"},l.ruid="bundler=rspack@1.0.8";var i=l(219);let o={},a=i.l.receive.bind(i.l),n=i.l.send.bind(i.l),r="true"===localStorage.getItem("auto_replay_active");null===r&&(r=!1,localStorage.setItem("auto_replay_active",r.toString()));let c="true"===localStorage.getItem("auto_replay_notifications");null===c&&(c=!0,localStorage.setItem("auto_replay_notifications",c.toString()));let p="true"===localStorage.getItem("auto_replay_vgc_only");function u(){let e=(0,i.F)("view-pasrs-helper","PASRS",{side:!0,icon:"clipboard",focus:!0});if(null===e)return;e.$el.html(`
    <div style="padding: 2vh 5vw">
        <h1>PASRS Helper v0.2</h1>
        This is the settings tab for the PASRS Helper.
        Automatically uploads the replay of your last battle in PSD then it will be copied to your clipboard.
        <br /><br />
        <fieldset>
            <legend>Settings:</legend>

            <div>
                <input type="checkbox" id="activation" name="activation" ${r?"checked":""}/>
                <label for="activation">Enable</label>
            </div>

            <div>
                <input type="checkbox" id="notification" name="notification"  ${c?"checked":""}/>
                <label for="notification">Send notifications</label>
            </div>

            <div>
                <input type="checkbox" id="vgc_only" name="vgc_only" ${p?"checked":""}/>
                <label for="vgc_only">Save replays for VGC Only</label>
            </div>
        </fieldset>

        <br /><br />
        <a href="https://github.com/alchemistake/PASRS_helper" target="_blank">Source Code</a>
        <a href="https://twitter.com/alchemistake" target="_blank">Tweet me the issues</a>

        <h1>Games</h1>
        <ul id="pasrs_games"></ul>
    </div>
  `);let t=$("#activation"),l=$("#notification"),o=$("#vgc_only");t.on("change",null,null,e=>{r=e.target.checked,localStorage.setItem("auto_replay_active",r.toString())}),l.on("change",null,null,e=>{c=e.target.checked,localStorage.setItem("auto_replay_notifications",c.toString())}),o.on("change",null,null,e=>{p=e.target.checked,localStorage.setItem("auto_replay_vgc_only",p.toString())})}null===p&&(p=!0,localStorage.setItem("auto_replay_vgc_only",p.toString())),i.l.receive=e=>{if(!r){a(e);return}if(e.includes("|popup||html|<p>Your replay has been uploaded!")){let t=e.slice(e.indexOf("https://"),e.indexOf('" target=')),l=t.split("/"),i=`battle-${l[l.length-1]}`;"finished"===o[i]?(setTimeout(function e(){navigator.clipboard.writeText(t).then(()=>{c&&new Notification("Your replay has been uploaded!")}).catch(()=>{setTimeout(e,250)})},0),$("#pasrs_games").append(`<li><a href="${t}" target="_blank">${t}</a></li>`),delete o[i]):a(e)}else{a(e);let t=e.startsWith(">"),l=e.split("-");if(p&&l&&l.length>1&&!l[1].includes("vgc")&&(t=!1),t){let t=e.slice(1,e.indexOf("\n"));e.includes("|init|battle")&&e.split("\n")[2].includes(i.l.user.attributes.name)&&(o[t]="ongoing"),e.includes("|win|")&&"ongoing"===o[t]&&(i.l.send("/savereplay",t),o[t]="finished")}}},i.l.send=(e,t)=>{n(e,t),r&&"/forfeit"===e&&t&&"ongoing"===o[t]&&(n("/savereplay",t),o[t]="finished"),e.includes("/noreply /leave view-pasrs-helper")&&u()};let s=setTimeout(function e(){window.app?(clearTimeout(s),u()):s=setTimeout(e,250)},0)})();